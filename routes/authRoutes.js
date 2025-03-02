const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

// Route to render login page
router.get('/login', authController.renderLoginPage);

// Route to handle login authentication
router.post('/login', authController.loginUser);

// Route to handle logout
router.get('/logout', authController.logoutUser);

module.exports = router;
