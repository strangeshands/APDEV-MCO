const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

// -- LOGIN -- //

// Route to render login page
router.get('/login', authController.renderLoginPage);

// Route to handle login authentication
router.post('/login', authController.loginUser);

// Route to handle logout
router.get('/logout', authController.logoutUser);

// -- SIGNUP -- //

// Route to render signup page
router.get('/signup', authController.renderSignupPage);

// Route to handle signup
router.post('/signup', authController.signupUser);

module.exports = router;
