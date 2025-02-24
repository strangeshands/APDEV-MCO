const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const likesSchema = new Schema ({
    likedBy: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',

        required: true
    },
    post: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Post',

        required: true,
    }
});

const LikedPost = mongoose.model('LikedPost', postSchema); // title name is singular because collection name is plural
module.exports = LikedPost;