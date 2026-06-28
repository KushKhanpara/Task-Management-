const express = require('express');
const router = express.Router();
const {
    createDailyLog,
    getDailyLogs,
    getMyLogs
} = require('../controllers/dailyLogController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, createDailyLog)
    .get(protect, getDailyLogs);


router.route('/my')
    .get(protect, getMyLogs);

module.exports = router;
