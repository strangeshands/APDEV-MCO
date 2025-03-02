const bcrypt = require('bcrypt');
const User = require('../models/users');

// NOTE: bcrypt not used yet and no sessions implemented (user in url)

// Render login page
const renderLoginPage = (req, res) => {
    res.render('loginPage', { title: "Log In" });
};

// Handle login authentication
const loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Find user by username
        const user = await User.findOne({ username: username.trim() });

        if (!user || user.password !== password) {
            return res.render('loginPage', { error: "Invalid username or password" });
        }

        // Redirect with userId in the URL
        res.redirect(`/?userId=${user._id}`);
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).send("Server Error");
    }
};

// Handle logout (simply redirect to login for now)
const logoutUser = (req, res) => {
    res.redirect('/login');
};

module.exports = {
    renderLoginPage,
    loginUser,
    logoutUser
};