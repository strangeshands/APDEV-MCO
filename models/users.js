const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        maxlength: [30, "Username must be at most 30 characters long."]
    },
    displayname: {
        type: String,
        required: true,
        maxlength: [30, "Display name must be at most 30 characters long."]
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/.+\@.+\..+/, "Please enter a valid email address"] // Optional email validation
    },
    phone: {
        type: String, // stored as string to retain leading zeroes
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        validate: {
            validator: function (value) {
                return /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(value);
            },
            message: "Password must be at least 8 characters long and include at least 1 uppercase letter, 1 number, and 1 symbol."
        }
    },
    bio: {
        type: String,
        required: true,
        default: "Let's connect!",
        maxlength: [100, "Bio must be at most 100 characters long."]
    },
    profilepic: {
        type: String,      // image url is stored here
        required: true,
        default: "../resources/default-pfp.png"
    },
    headerpic: {
        type: String,      // image url is stored here
        required: true,
        default: "../resources/default-headerpic.png"
    },
    tags: {
        type: [String],
        required: true,
        default: []
    },

});

const User = mongoose.model('User', userSchema); // title name is singular because collection name is plural
module.exports = User;  // export it
