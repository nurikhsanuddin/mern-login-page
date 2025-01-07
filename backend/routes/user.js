const express = require('express');
const router = express.Router();
const { getAllUsers, getUser, updateUser } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware); // Apply middleware to all routes

router.get('/', getAllUsers);
router.get('/profile', getUser);
router.put('/profile', updateUser);

module.exports = router;

