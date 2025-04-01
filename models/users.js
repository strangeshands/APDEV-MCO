const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt'); 

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

// Pre-save hook to add @ to username before saving
userSchema.pre('save', function (next) {
    if (!this.username.startsWith('@')) {
        this.username = '@' + this.username;
    }
    next();
});

// Hash password before saving (only if modified)
userSchema.pre('save', async function (next) {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10); // Generate a salt with 10 rounds
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to check password validity
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema); // title name is singular because collection name is plural
module.exports = User;  // export it
