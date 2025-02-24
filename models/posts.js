const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    title: {
        type: String,
        required: false
    },
    author: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',

        required: true
    },
    parentPost: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Post',

        required: false,
        default: null
    },
    content: {
        type: String,
        required: true
    },
    images: {
        type: String,  // change

        required: false,
        default: []
    },
    likeCount: {
        type: Number,

        required: true,
        default: 0,
    },
    dislikeCount: {
        type: Number,
        
        required: true,
        default: 0,
    },
}, { timestamps: true });   // includes both createdAt and updatedAt timestamps

const Post = mongoose.model('Post', postSchema); // title name is singular because collection name is plural
module.exports = Post;  // export it
