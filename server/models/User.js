const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['admin', 'employee'],
        default: 'employee',
        required: true,
    },
    jobRole: {
        type: String,
        default: 'Not Assigned'
    },
    department: {
        type: String,
        default: 'General'
    },
    image: {
        type: String,
        required: false
    },
    birthDate: {
        type: Date,
        required: false
    },
    joiningDate: {
        type: Date,
        required: false
    },
    credits: {
        type: Number,
        default: 0
    },
    company: {
        type: String,
        required: true
    },
    stripeCustomerId: {
        type: String,
        required: false
    },
    subscriptionId: {
        type: String,
        required: false
    },
    subscriptionStatus: {
        type: String,
        enum: ['active', 'inactive', 'canceled', 'past_due', 'trialing'],
        default: 'inactive'
    },
    plan: {
        type: String,
        enum: ['free', 'pro', 'premium'],
        default: 'free'
    }
}, {
    timestamps: true,
});

// Method to match password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Middleware to hash password pre-save
// Middleware to hash password pre-save
userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);
module.exports = User;
