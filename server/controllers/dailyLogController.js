const DailyLog = require('../models/DailyLog');
const Notification = require('../models/Notification');
const User = require('../models/User');

// @desc    Create a daily log
// @route   POST /api/logs
// @access  Private
const createDailyLog = async (req, res) => {
    try {
        if (req.user.role === 'admin') {
            res.status(403).json({ message: 'Admins cannot submit daily logs' });
            return;
        }

        const { description, hoursWorked, date } = req.body;

        if (!description) {
            res.status(400).json({ message: 'Description is required' });
            return;
        }

        // Removed check for existing log to allow multiple submissions per day
        
        const log = new DailyLog({
            user: req.user._id,
            description,
            hoursWorked,
            date: date || new Date(),
            company: req.user.company
        });

        const createdLog = await log.save();

        // Notify Admins
        const io = req.app.get('io');
        const admins = await User.find({ role: 'admin', company: req.user.company });

        // Use Promise.all for better performance and correctness
        await Promise.all(admins.map(admin => 
            Notification.create({
                recipient: admin._id,
                message: `New daily report from ${req.user.fullName}`,
                type: 'daily_log'
            })
        ));

        if (io) {
            io.to('admin_room').emit('notification', {
                message: `New daily report from ${req.user.fullName}`,
                type: 'daily_log',
                read: false,
                createdAt: new Date()
            });
        }

        res.status(201).json(createdLog);
    } catch (error) {
        console.error('Create Daily Log Error:', error);
        res.status(500).json({ message: error.message || 'Error saving report' });
    }
};

// @desc    Get all daily logs (Admin) or my daily logs (Employee)
// @route   GET /api/logs
// @access  Private
const getDailyLogs = async (req, res) => {
    try {
        let query = {};

        if (req.user.role === 'admin') {
            // Filter by company for admin
            query = req.user.company ? { company: req.user.company } : {};
        } else {
            // Filter by user for employee
            query = { user: req.user._id };
        }

        const logs = await DailyLog.find(query)
            .populate('user', 'fullName jobRole image')
            .sort({ date: -1, createdAt: -1 });
        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get my daily logs
// @route   GET /api/logs/my
// @access  Private
const getMyLogs = async (req, res) => {
    try {
        const logs = await DailyLog.find({ user: req.user._id }).sort({ date: -1, createdAt: -1 });
        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = {
    createDailyLog,
    getDailyLogs,
    getMyLogs
};
