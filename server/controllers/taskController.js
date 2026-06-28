const Task = require('../models/Task');
const Notification = require('../models/Notification');
const User = require('../models/User');

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private/Admin
const createTask = async (req, res) => {
    try {
        let { title, description, assignedTo, dueDate, project, company, priority } = req.body;

        // Sanitize project ID - if it's an empty string, set it to undefined so Mongoose ignores it
        if (project === '') {
            project = undefined;
        }

        // Handle "Assign to All"
        if (assignedTo === 'all') {
            const employees = await User.find({ company: company || req.user.company, role: 'employee' }).select('_id');
            assignedTo = employees.map(emp => emp._id);
        } else if (assignedTo && !Array.isArray(assignedTo)) {
            assignedTo = [assignedTo];
        }

        if (!assignedTo || assignedTo.length === 0) {
            return res.status(400).json({ message: 'At least one employee must be assigned' });
        }

        const tasksToCreate = assignedTo.map(userId => ({
            title,
            description,
            assignedTo: [userId], // Each task gets one user
            dueDate,
            project,
            status: 'pending',
            priority: priority || 'medium',
            company: company || req.user.company
        }));

        const createdTasks = await Task.insertMany(tasksToCreate);

        // Create notifications for each created task
        const io = req.app.get('io');
        createdTasks.forEach(async (task) => {
            const userId = task.assignedTo[0].toString();
            await Notification.create({
                recipient: userId,
                message: `New task assigned: ${title}`,
                type: 'task_assigned'
            });
            // Emit socket event
            if (io) io.to(userId).emit('notification', {
                message: `New task assigned: ${title}`,
                type: 'task_assigned',
                read: false,
                createdAt: new Date()
            });
        });

        res.status(201).json(createdTasks.length === 1 ? createdTasks[0] : { message: `${createdTasks.length} tasks created successfully`, tasks: createdTasks });
    } catch (error) {
        console.error('Create Task Error:', error);
        res.status(500).json({ message: error.message || 'Error saving task' });
    }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private/Admin
const updateTask = async (req, res) => {
    try {
        let { title, description, assignedTo, dueDate, project, status, priority } = req.body;

        const task = await Task.findById(req.params.id);

        if (task) {
            // Sanitize project ID
            if (project === '') {
                project = undefined;
            }

            // Handle "Assign to All"
            if (assignedTo === 'all') {
                const employees = await User.find({ company: task.company, role: 'employee' }).select('_id');
                assignedTo = employees.map(emp => emp._id);
            } else if (assignedTo && !Array.isArray(assignedTo)) {
                assignedTo = [assignedTo];
            }

            task.title = title || task.title;
            task.description = description || task.description;
            task.assignedTo = assignedTo || task.assignedTo;
            task.dueDate = dueDate || task.dueDate;
            task.project = project !== undefined ? project : task.project;
            task.status = status || task.status;
            task.priority = priority || task.priority;

            const updatedTask = await task.save();
            res.json(updatedTask);
        } else {
            res.status(404).json({ message: 'Task not found' });
        }
    } catch (error) {
        console.error('Update Task Error:', error);
        res.status(500).json({ message: error.message || 'Error updating task' });
    }
};

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private/Admin
const getTasks = async (req, res) => {
    try {
        const projectId = req.query.projectId;
        let query = {};

        // Filter by company
        if (req.user.company) {
            query.company = req.user.company;
        }

        if (projectId) {
            query.project = projectId;
        }
        const tasks = await Task.find(query)
            .populate('assignedTo', 'fullName username')
            .populate('project', 'title');
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get logged in user tasks
// @route   GET /api/tasks/my
// @access  Private
const getMyTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ assignedTo: req.user._id });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update task status
// @route   PUT /api/tasks/:id/status
// @access  Private (Employee/Admin)
const updateTaskStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const task = await Task.findById(req.params.id);

        if (task) {
            // Check if user is assigned or admin
            const isAssigned = task.assignedTo.some(id => id.toString() === req.user._id.toString());
            if (isAssigned || req.user.role === 'admin') {
                const oldStatus = task.status;
                task.status = status;
                const updatedTask = await task.save();

                // Increment credits if task completed
                if (status === 'completed' && oldStatus !== 'completed') {
                    await User.updateMany(
                        { _id: { $in: task.assignedTo } },
                        { $inc: { credits: 1 } }
                    );
                }

                // Notify Admins
                const admins = await User.find({ role: 'admin' });
                const io = req.app.get('io');

                await Promise.all(admins.map(async (admin) => {
                    await Notification.create({
                        recipient: admin._id,
                        message: `Task '${task.title}' status updated to ${status} by ${req.user.fullName}`,
                        type: 'task_update',
                        relatedId: task._id,
                        onModel: 'Task'
                    });

                    if (io) {
                        io.to(admin._id.toString()).emit('notification', {
                            message: `Task '${task.title}' status updated to ${status} by ${req.user.fullName}`,
                            type: 'task_update',
                            read: false,
                            createdAt: new Date()
                        });
                    }
                }));

                res.json(updatedTask);
            } else {
                res.status(401).json({ message: 'Not authorized to update this task' });
            }
        } else {
            res.status(404).json({ message: 'Task not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private/Admin
const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (task) {
            await task.deleteOne();
            res.json({ message: 'Task removed' });
        } else {
            res.status(404).json({ message: 'Task not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// @desc    Get task statistics
// @route   GET /api/tasks/stats
// @access  Private/Admin
const getTaskStats = async (req, res) => {
    try {
        const query = req.user.company ? { company: req.user.company } : {};

        const total = await Task.countDocuments(query);
        const pending = await Task.countDocuments({ ...query, status: 'pending' });
        const inProgress = await Task.countDocuments({ ...query, status: 'in_progress' });
        const completed = await Task.countDocuments({ ...query, status: 'completed' });

        res.json({
            total,
            pending,
            in_progress: inProgress,
            completed
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createTask,
    getTasks,
    getMyTasks,
    updateTaskStatus,
    updateTask,
    deleteTask,
    getTaskStats
};

