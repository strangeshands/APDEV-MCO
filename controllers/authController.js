const bcrypt = require('bcrypt');
const User = require('../models/users');

// NOTE: bcrypt not used yet and no sessions implemented (user in url)

// Render login page
const renderLoginPage = (req, res) => {
    res.render('loginPage', { title: "Log In" });
};

// Handle login authentication
const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

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

// Render signup page
const renderSignupPage = (req, res) => {
    res.render('signupPage', { title: "Sign Up" });
};

// Handler user signup
const signupUser = async (req, res) => {
    try {
        const { email, username, displayName, password, passwordConf } = req.body;

        // Verify if password and passwordConf are the same
        if (password !== passwordConf) {
            return res.render('signupPage', { error: "Password and confirm password input should be the same" });
        }

        // Verify if username is in use
        const existingUser = await User.findOne({ username: username });
        if (existingUser) {
            return res.render('signupPage', { error: "Username is already in use" });
        }

        // Create a new user
        const newUser = new User({ email, username, displayName, password });
        await newUser.save();

        res.status(201).json({ message: "User added successfully", user: newUser });
    } catch (err) {
        console.error("Signup error:", error);
        res.status(500).send("Server Error");
    }
}

module.exports = {
    renderLoginPage,
    loginUser,
    logoutUser,
    renderSignupPage,
    signupUser
};