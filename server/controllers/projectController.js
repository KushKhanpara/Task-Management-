const Project = require('../models/Project');

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private/Admin
const createProject = async (req, res) => {
    const { title, description, startDate, endDate, members, company } = req.body;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (new Date(startDate) < today) {
        res.status(400).json({ message: 'Start date cannot be in the past' });
        return;
    }

    if (new Date(endDate) < new Date(startDate)) {
        res.status(400).json({ message: 'End date must be after start date' });
        return;
    }

    const project = new Project({
        title,
        description,
        startDate,
        endDate,
        members,
        company
    });

    const createdProject = await project.save();
    res.status(201).json(createdProject);
};

// @desc    Get all projects
// @route   GET /api/projects
// @access  Private
const getProjects = async (req, res) => {
    // Filter by company if user has one
    const query = req.user.company ? { company: req.user.company } : {};
    const projects = await Project.find(query).populate('members', 'fullName jobRole');
    res.json(projects);
};

// @desc    Get logged in user projects
// @route   GET /api/projects/my
// @access  Private
const getMyProjects = async (req, res) => {
    const projects = await Project.find({ members: req.user._id }).populate('members', 'fullName jobRole');
    res.json(projects);
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Private
const getProjectById = async (req, res) => {
    const project = await Project.findById(req.params.id).populate('members', 'fullName jobRole');
    if (project) {
        res.json(project);
    } else {
        res.status(404).json({ message: 'Project not found' });
    }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private/Admin
const updateProject = async (req, res) => {
    const { title, description, startDate, endDate, members, active } = req.body;
    const project = await Project.findById(req.params.id);

    if (project) {
        project.title = title || project.title;
        project.description = description || project.description;
        project.startDate = startDate || project.startDate;
        project.endDate = endDate || project.endDate;
        project.members = members || project.members;
        project.active = active !== undefined ? active : project.active;

        const updatedProject = await project.save();
        res.json(updatedProject);
    } else {
        res.status(404).json({ message: 'Project not found' });
    }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private/Admin
const deleteProject = async (req, res) => {
    const project = await Project.findById(req.params.id);

    if (project) {
        await project.deleteOne();
        res.json({ message: 'Project removed' });
    } else {
        res.status(404).json({ message: 'Project not found' });
    }
};

module.exports = {
    createProject,
    getProjects,
    getMyProjects,
    getProjectById,
    updateProject,
    deleteProject
};
