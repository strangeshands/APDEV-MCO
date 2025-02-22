const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    title: {
        type: String,
        required: false
    },
    author: {
        type: String,   // user id
        required: true
    },
    parentPost: {
        type: String,   // parent post id
        required: false
    },
    content: {
        type: String,
        required: true
    },
    images: {
        type: img,  // change
        required: false
    },
    likeCount: {
        type: Number,
        required: true
    },
    dislikeCount: {
        type: Number,
        required: true
    },

}, { timestamps: true });   // includes both createdAt and updatedAt timestamps

const Post = mongoose.model('Post', postSchema); // title name is singular because collection name is plural
module.exports = Post;  // export it
