const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema({
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['task_assigned', 'daily_log', 'system', 'task_update'],
        default: 'system'
    },
    read: {
        type: Boolean,
        default: false,
    },
    link: {
        type: String, // Optional URL to redirect to
    },
    relatedId: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'onModel'
    },
    onModel: {
        type: String,
        required: false,
        enum: ['Task', 'Project', 'User']
    }
}, {
    timestamps: true,
});

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;
