const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const likesSchema = new Schema ({
    likedBy: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',

        required: true
    },
    likedPost: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Post',

        required: true,
    }
}, { timestamps: true });

const Like = mongoose.model('Like', likesSchema); // title name is singular because collection name is plural
module.exports = Like;