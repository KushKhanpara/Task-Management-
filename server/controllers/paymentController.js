const User = require('../models/User');

const getSessionDetail = async (req, res) => {
    res.status(200).json({ status: 'completed' });
};

const createCheckoutSession = async (req, res) => {
    res.status(200).json({ message: 'Direct registration is used' });
};

const createRegistrationSession = async (req, res) => {
    res.status(200).json({ message: 'Direct registration is used' });
};

const stripeWebhook = async (req, res) => {
    res.json({ received: true });
};

module.exports = {
    createCheckoutSession,
    createRegistrationSession,
    stripeWebhook,
    getSessionDetail
};
