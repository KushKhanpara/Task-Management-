const Notification = require('../models/Notification');

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
const getNotifications = async (req, res) => {
    const notifications = await Notification.find({ recipient: req.user._id })
        .sort({ createdAt: -1 })
        .limit(20);
    res.json(notifications);
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markAsRead = async (req, res) => {
    const notification = await Notification.findById(req.params.id);

    if (notification && notification.recipient.toString() === req.user._id.toString()) {
        notification.read = true;
        await notification.save();
        res.json(notification);
    } else {
        res.status(404).json({ message: 'Notification not found' });
    }
};

// @desc    Mark all as read
// @route   PUT /api/notifications/read-all
// @access  Private
const markAllAsRead = async (req, res) => {
    await Notification.updateMany({ recipient: req.user._id, read: false }, { read: true });
    res.json({ message: 'All marked as read' });
};

module.exports = {
    getNotifications,
    markAsRead,
    markAllAsRead
};
