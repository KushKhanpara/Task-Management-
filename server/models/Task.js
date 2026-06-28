const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: false,
    },
    assignedTo: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }],
    dueDate: {
        type: Date,
        required: true,
        validate: {
            validator: function (v) {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return v >= today;
            },
            message: 'Due date cannot be in the past'
        }
    },
    status: {
        type: String,
        enum: ['pending', 'in_progress', 'completed'],
        default: 'pending',
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium',
    },
    company: {
        type: String,
        required: true,
    }
}, {
    timestamps: true,
});

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;
