const bcrypt = require('bcrypt');
const User = require('../models/users');

// NOTE: bcrypt not used yet

// Render login page
const renderLoginPage = (req, res) => {
    res.render('loginPage', { title: "Log In" });
};

// Handle login authentication
const loginUser = async (req, res) => {
    const { username, password, rememberMe } = req.body;

    try {
        const user = await User.findOne({ username: username.trim() });

        // If user not found or password doesn't match
        if (!user || user.password !== password) {
            return res.render('loginPage', { error: "Invalid username or password" });
        }

        // Store user info temporarily (for now, since there's no session storage)
        req.user = {
            id: user._id.toString(),  
            username: user.username,
            displayname: user.displayname,
            profilepic: user.profilepic
        };

        // Redirect to home page after successful login
        res.redirect('/');
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).send("Server Error");
    }
};

// Handle logout (Placeholder for now)
const logoutUser = (req, res) => {
    req.user = null; // Clearing user data (until sessions or JWT are implemented)
    res.redirect('/login');
};

module.exports = {
    renderLoginPage,
    loginUser,
    logoutUser
};
