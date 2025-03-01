const Post = require('../models/posts');
const moment = require('moment');   // For time display

// TEMP, to be replaced with homepage code
const post_index = (req, res) => {
    Post.find().sort({ createdAt: -1 }) // sorts to show latest entry
    .then((result) => {
        res.render('homeTemp', { title: 'Home', posts: result});  // sends db data to html file
        
    })
    .catch((err) => {
        console.log(err)
    });
};

// Getting a specific post
const post_details = (req, res) => {    // :id to search for actual id
    const id = req.params.id            // .id to match with url above
    
    Post.findById(id)
        .populate('author') // This will populate the 'author' field with user data
        .exec()
        .then((result) => {
            //result.hasTags = result.tags.length > 0; // Add a flag to check if tags exist
            const postDate = moment(result.createdAt).format('MMM DD, YYYY');
            res.render('postPage', { post: result, title: 'Post', postDate: postDate });
        })
        .catch((err) => {
            res.status(404).render('404', { title: 'Post not found' });
        });
};

const post_create_get = (req, res) => {
    res.render('create', { title: 'Create a new blog' });
};

const post_create_post = (req, res) => {
    const blog = new Blog(req.body);

    blog.save()
    .then((result) => {
        res.redirect('/blogs');
    })
    .catch((err) => {
        console.log(err);
    });
};

const post_delete = (req, res) => {
    const id = req.params.id;

    Blog.findByIdAndDelete(id)
        .then((result) => {
            res.json({ redirect: '/blogs' });
        })
        .catch((err) => {
            console.log(err);
        });
}

module.exports = {
    post_index,
    post_details,
    post_create_get,
    post_create_post,
    post_delete
};