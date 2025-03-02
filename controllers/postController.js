const Post = require('../models/posts');
const User = require('../models/users');
const moment = require('moment');   // For time display

// Default user ID (will replace with actual logged-in user after login implementation)
const tempUserId = "67b9fd7ab7db71f6ae3b21d4";

// Getting a specific post
const post_details = (req, res) => {    // :id to search for actual id
    const id = req.params.id            // .id to match with url above
    
    Post.findById(id)
        .populate('author') // This will populate the 'author' field with user data
        .exec()
        .then((result) => {
            var postDate;
            
            // Get the time the post was made
            const postTimeCreated = moment(result.createdAt);

            // Get the current time
            const now = moment();

            // Calculate the duration between the two dates
            const duration = moment.duration(now.diff(postTimeCreated));

            // Time Format
            function formatDuration(unit, value) {
                return value > 1 ? `${value} ${unit}s ago` : `${value} ${unit} ago`;
            }
            
            if (duration.months() > 0) {
                postDate = moment(post.createdAt).format('MMM DD, YYYY');
            } else if (duration.weeks() > 0) {
                postDate = formatDuration('week', duration.weeks());
            } else if (duration.days() > 0) {
                postDate = formatDuration('day', duration.days());
            } else if (duration.hours() > 0) {
                postDate = formatDuration('hour', duration.hours());
            } else if (duration.minutes() > 0) {
                postDate = formatDuration('minute', duration.minutes());
            } else {
                postDate = formatDuration('second', duration.seconds());
            }

            res.render('postPage', { post: result, title: 'Post', postDate: postDate });
        })
        .catch((err) => {
            res.status(404).render('errorPage');
        });
};

// NOT DONE
const post_create_get = (req, res) => {

    User.findById(tempUserId)
        .exec()
        .then((result) => {
            user = result;

            res.render('newPostPage', { user: user, title: 'New Post' });
        })
        .catch((err) => {
            res.status(404).render('errorPage');
        });

};

// NOT DONE
const post_create_post = async (req, res) => {
    const formData = req.body;

    const postAuthor = await User.findById(tempUserId);

    if (!postAuthor) {
        return res.status(404).send("User not found");
    }

    /*
    let formattedImages = formData.images;

    formattedImages = formattedImages.map(img => {
        return "/resources/" + img;
    });
    */

    const postData = { ...formData, author: postAuthor._id };
    
    const post = new Post(postData);

    post.save()
        .then((result) => {
            res.redirect('/');
        })
        .catch((err) => {
            console.log(err);
        });
};

// NOT DONE
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
    post_details,
    post_create_get,
    post_create_post,
    post_delete
};