const express = require('express');
const router = express.Router();
const { createCheckoutSession, stripeWebhook, createRegistrationSession, getSessionDetail } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/create-checkout-session', protect, createCheckoutSession);
router.post('/create-registration-session', createRegistrationSession);
router.get('/session/:id', getSessionDetail);
router.post('/webhook', express.raw({ type: 'application/json' }), stripeWebhook);

module.exports = router;
