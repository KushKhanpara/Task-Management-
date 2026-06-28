const express = require('express');
const router = express.Router();
const { createTask, getTasks, getMyTasks, updateTaskStatus, deleteTask, getTaskStats, updateTask } = require('../controllers/taskController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, admin, createTask)
    .get(protect, admin, getTasks);

router.get('/stats', protect, admin, getTaskStats);
router.get('/my', protect, getMyTasks);

router.route('/:id')
    .put(protect, admin, updateTask)
    .delete(protect, admin, deleteTask);

router.route('/:id/status')
    .put(protect, updateTaskStatus);

module.exports = router;
