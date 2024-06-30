const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/get', authMiddleware, userController.getUserDetails);
router.post('/update', authMiddleware, userController.updateUserDetails);

module.exports = router;
