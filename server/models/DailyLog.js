const mongoose = require('mongoose');

const dailyLogSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    description: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    hoursWorked: {
        type: Number,
        default: 0,
        min: 0,
    },
    company: {
        type: String,
        required: true
    }
}, {
    timestamps: true,
});

const DailyLog = mongoose.model('DailyLog', dailyLogSchema);
module.exports = DailyLog;
