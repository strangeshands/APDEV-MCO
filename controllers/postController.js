const Post = require('../models/post');

// TO DO: replace with homepage code
/*
const post_index = (req, res) => {
    Post.find().sort({ createdAt: -1 }) // sorts to show latest entry
    .then((result) => {
        res.render('postPage', { title: 'All Posts', posts: result});  // sends db data to html file
        
    })
    .catch((err) => {
        console.log(err)
    });
};
*/

// Getting a specific post
const post_details = (req, res) => {    // :id to search for actual id
    const id = req.params.id            // .id to match with url above
    
    Post.find(id)
        .populate('author') // This will populate the 'author' field with user data
        .exec()
        .then((result) => {
            res.render('postPage', { post: result, title: 'Post' });
        })
        .catch((err) => {
            res.status(404).render('404', { title: 'Post not found' });
        });
    
    /*
    Post.findById(id)
        .then((result) => {
            res.render('postPage', { post: result, title: 'Post' });
        })
        .catch((err) => {
            res.status(404).render('404', { title: 'Post not found' });
        });
    */
};

const blog_create_get = (req, res) => {
    res.render('create', { title: 'Create a new blog' });
};

const blog_create_post = (req, res) => {
    const blog = new Blog(req.body);

    blog.save()
    .then((result) => {
        res.redirect('/blogs');
    })
    .catch((err) => {
        console.log(err);
    });
};

const blog_delete = (req, res) => {
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
    blog_index,
    blog_details,
    blog_create_get,
    blog_create_post,
    blog_delete
};