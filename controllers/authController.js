const User = require('../models/users');
const bcrypt = require('bcrypt'); 

// Render login page
const renderLoginPage = (req, res) => {
    res.render('loginPage', { title: "Log In" });
};

// Handle login authentication
const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const rememberMe = req.body.rememberMe;

        // Add @ to username if not present
        const formattedUsername = username.startsWith('@') ? username : `@${username}`;

        // Find user by username
        const user = await User.findOne({ username: formattedUsername.trim() });

        // Check if user exists
        if (!user) {
            return res.render('loginPage', { error: "Invalid username or password" });
        }

        // Verify password with bcrypt
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            /*
                > fail safe :: this is for existing accounts -- password is not hashed yet
            */
            if (password === user.password)
                req.session.user = user;
            else
                return res.render('loginPage', { error: "Invalid username or password" });
        }

        /**
         *  [FOR P3]
         *  > set this one to req.session.id = user.id;
         */
        req.session.user = user;

        if (rememberMe)
            req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; 
        
        /* 
            > [VERIFY] should be higher if rememberMe is checked
            > by default, this is 86399899 (1 day)
            > if rememberMe is checked, this is 2592000000 (30 days)
        */
        console.log(req.session.cookie.maxAge);
        res.redirect(`/`);
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).send("Server Error");
    }
};

// Handle logout (simply redirect to login for now)
const logoutUser = (req, res) => {
    req.session.destroy();
    res.clearCookie('connect.sid');
    res.redirect('/login');
};

// Render signup page
const renderSignupPage = (req, res) => {
    req.session.destroy();
    res.clearCookie('connect.sid');
    res.render('signupPage', { title: "Sign Up" });
};

// Handler user signup
const signupUser = async (req, res) => {
    try {
        const { email, phone, username, displayname, password, confirmpass } = req.body;

        // Valid email
        const allowedDomains = /^[^\s@]+@(gmail\.com|yahoo\.com)$/i;
        if (!allowedDomains.test(email)) {
            return res.render('signupPage', { error: "Please enter a valid email." });
        }

        // Strong password and reach character requirement
        const passwordPattern = /^(?=.*\d)(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).+$/;
        if (!passwordPattern.test(password)) {
            return res.render('signupPage', { error: "Please choose a stronger password. At least 8 characters, must include a symbol, number, and uppercase letter." });
        }
        if (password.length < 8) {
            return res.render('signupPage', { error: "Please choose a longer password. At least 8 characters." });
        }

        // Verify if password and passwordConf are the same
        if (password !== confirmpass) {
            return res.render('signupPage', { error: "Passwords don't match." });
        }

        // Ensure username has a consistent format
        const formattedUsername = username.startsWith('@') ? username.trim() : `@${username.trim()}`;

        // Verify if username is in use
        const existingUser = await User.findOne({ username: formattedUsername });
        if (existingUser) {
            return res.render('signupPage', { error: "Username is already in use." });
        }


        // Verify if email is in use
        const existingEmail = await User.findOne({ email: email });
        if (existingEmail) {
            return res.render('signupPage', { error: "Email is already in use" });
        }

        // Valid phone number
        let phoneClean = phone.replace(/\s+/g, '');
        if (phoneClean.length != 11) {
            return res.render('signupPage', { error: "Phone number is invalid." });
        }

        // Verify if phone number is in use
        let formattedPhone = phone.replace(/(\d{4})(\d{3})(\d{3})/, "$1 $2 $3");
        const existingPhone = await User.findOne({ phone: formattedPhone });
        if (existingPhone) {
            return res.render('signupPage', { error: "Phone number is already in use." });
        }

        // Create a new user
        const newUser = new User({ email, phone: formattedPhone, username: formattedUsername, displayname, password });
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