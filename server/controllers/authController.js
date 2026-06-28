const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (res, userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });

    res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development', // Use secure cookies in production
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
};

// @desc    Register a new company/admin
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    try {
        const { fullName, username, password, company, email } = req.body;

        const userExists = await User.findOne({ username });

        if (userExists) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }

        const user = await User.create({
            fullName,
            username,
            password,
            email,
            company,
            role: 'admin', // Default to admin for new registrations
            jobRole: 'Administrator',
            department: 'Management',
            plan: req.body.plan || 'free'
        });

        if (user) {
            generateToken(res, user._id);
            res.status(201).json({
                _id: user._id,
                fullName: user.fullName,
                username: user.username,
                role: user.role,
                company: user.company,
                plan: user.plan,
                subscriptionStatus: user.subscriptionStatus
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log('Login attempt for username:', username);

        // Find user case-insensitively
        const user = await User.findOne({
            username: { $regex: new RegExp(`^${username}$`, 'i') }
        });

        if (!user) {
            console.log('User not found in database');
            res.status(401).json({ message: 'Invalid username or password' });
            return;
        }

        const isMatch = await user.matchPassword(password);
        console.log('Password match result:', isMatch);

        if (isMatch) {
            generateToken(res, user._id);
            res.json({
                _id: user._id,
                fullName: user.fullName,
                username: user.username,
                role: user.role,
                jobRole: user.jobRole,
                department: user.department,
                image: user.image,
                birthDate: user.birthDate,
                joiningDate: user.joiningDate,
                company: user.company,
                plan: user.plan,
                subscriptionStatus: user.subscriptionStatus
            });
        } else {
            res.status(401).json({ message: 'Invalid username or password' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: error.message || 'Server error during login' });
    }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Public
const logoutUser = (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({ message: 'Logged out successfully' });
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
    const user = {
        _id: req.user._id,
        fullName: req.user.fullName,
        username: req.user.username,
        role: req.user.role,
        jobRole: req.user.jobRole,
        department: req.user.department,
        image: req.user.image,
        birthDate: req.user.birthDate,
        joiningDate: req.user.joiningDate,
        company: req.user.company,
        plan: req.user.plan,
        subscriptionStatus: req.user.subscriptionStatus
    }
    res.status(200).json(user);
}

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.fullName = req.body.fullName || user.fullName;
        user.email = req.body.email || user.email;
        user.image = req.body.image || user.image;

        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            fullName: updatedUser.fullName,
            username: updatedUser.username,
            email: updatedUser.email,
            role: updatedUser.role,
            jobRole: updatedUser.jobRole,
            department: updatedUser.department,
            image: updatedUser.image,
            company: updatedUser.company
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
}

module.exports = {
    loginUser,
    logoutUser,
    getUserProfile,
    registerUser,
    updateUserProfile
};
