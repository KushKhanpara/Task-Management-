const User = require('../models/User');
const fs = require('fs');
const path = require('path');

// @desc    Register a new user (Admin only)
// @route   POST /api/users
// @access  Private/Admin
// @desc    Register a new user (Admin only)
// @route   POST /api/users
// @access  Private/Admin
const registerUser = async (req, res) => {
    const { fullName, username, password, role, jobRole, department, image, birthDate, joiningDate, company } = req.body;

    const userExists = await User.findOne({ username });

    if (userExists) {
        res.status(400).json({ message: 'User already exists' });
        return;
    }

    const user = await User.create({
        fullName,
        username,
        password,
        role: role || 'employee',
        jobRole,
        department,
        image,
        birthDate,
        joiningDate,
        company
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            fullName: user.fullName,
            username: user.username,
            role: user.role,
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        user.fullName = req.body.fullName || user.fullName;
        user.username = req.body.username || user.username;
        if (req.body.password) {
            user.password = req.body.password;
        }
        user.role = req.body.role || user.role;
        user.jobRole = req.body.jobRole || user.jobRole;
        user.department = req.body.department || user.department;
        user.image = req.body.image || user.image;
        user.birthDate = req.body.birthDate || user.birthDate;
        user.joiningDate = req.body.joiningDate || user.joiningDate;

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            fullName: updatedUser.fullName,
            username: updatedUser.username,
            role: updatedUser.role,
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res) => {
    // Filter by company
    const query = req.user.company ? { company: req.user.company } : {};
    const users = await User.find(query).select('-password');
    res.json(users);
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            // Delete user image if it exists
            if (user.image) {
                const imagePath = path.join(__dirname, '..', user.image);
                if (fs.existsSync(imagePath)) {
                    fs.unlink(imagePath, (err) => {
                        if (err) console.error('Error deleting image:', err);
                    });
                }
            }

            await user.deleteOne();
            res.json({ message: 'User removed' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during user deletion' });
    }
};

// @desc    Get leaderboard
// @route   GET /api/users/leaderboard
// @access  Private
const getLeaderboard = async (req, res) => {
    // Filter by company
    const query = req.user.company ? { company: req.user.company } : {};
    const users = await User.find(query).select('fullName image credits jobRole').sort({ credits: -1 }).limit(10);
    res.json(users);
};

module.exports = {
    getLeaderboard,
    registerUser,
    updateUser,
    getUsers,
    deleteUser,
};
