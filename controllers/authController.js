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

        // Add @ to username if not present
        const formattedUsername = username.startsWith('@') ? username : `@${username}`;

        // Find user by username
        const user = await User.findOne({ username: formattedUsername.trim() });

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
        const { email, phone, username, displayname, password, confirmpass } = req.body;

        // Verify if password and passwordConf are the same
        if (password !== confirmpass) {
            return res.render('signupPage', { error: "Password and confirm password input should be the same" });
        }

        // Verify if username is in use
        const existingUser = await User.findOne({ username: username });
        if (existingUser) {
            return res.render('signupPage', { error: "Username is already in use" });
        }

        // Verify if email is in use
        const existingEmail = await User.findOne({ email: email });
        if (existingEmail) {
            return res.render('signupPage', { error: "Email is already in use" });
        }

        // Verify if phone number is in use
        const existingPhone = await User.findOne({ phone: phone });
        if (existingPhone) {
            return res.render('signupPage', { error: "Phone Number is already in use" });
        }

        // Create a new user
        const newUser = new User({ email, phone, username, displayname, password });
        await newUser.save();

        res.redirect('/login');
    } catch (error) {
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