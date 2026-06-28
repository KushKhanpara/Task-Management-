const express = require('express');
const router = express.Router();
const { registerUser, getUsers, deleteUser, updateUser, getLeaderboard } = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/leaderboard', protect, getLeaderboard);

router.route('/')
    .post(protect, admin, registerUser)
    .get(protect, admin, getUsers);

router.route('/:id')
    .put(protect, admin, updateUser)
    .delete(protect, admin, deleteUser);

module.exports = router;
