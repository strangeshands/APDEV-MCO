const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        
        required: true,
        unique: true
    },
    displayname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        
        required: true,
        unique: true
    },
    phone: {
        type: String,       // stored as string to retain leading zeroes
        
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    bio: {
        type: String,
        
        required: true,
        default: "Let's connect!"
    },
    profilepic: {
        type: String,      // image url is stored here
        
        required: true,
        default: "/resources/default-pfp.png"
    },
    headerpic: {
        type: String,      // image url is stored here
        
        required: true,
        default: "/resources/default-headerpic.png"
    },
    tags: {
        type: [String],

        required: true,
        default: []
    },
    bookmarks: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Post',

        required: true,
        default: []
    },
    dislikes: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Post',

        required: true,
        default: []
    }
});

const User = mongoose.model('User', userSchema); // title name is singular because collection name is plural
module.exports = User;  // export it
