const Post = require('../models/posts');
const User = require('../models/users');
const moment = require('moment');   // For time display

// ---- [START] TEST for Home with NavBar ---- //

// Default user ID (will replace with actual logged-in user after login implementation)
const tempUserId = "67b9fd7ab7db71f6ae3b21d4";

const homePage = async (req, res) => {
    try {
        // Query the default user
        const userPromise = User.findById(tempUserId).exec();

        // All posts for the timeline
        const allPostsPromise = Post.find()
            .sort({ createdAt: -1 })
            .populate('author')
            .exec();
        
        // Default (logged-in) user's posts for navbar
        const userPostsPromise = Post.find({ parentPost: null, author: tempUserId })
            .sort({ createdAt: -1 })
            .populate('author')
            .exec()

        // Default (logged-in) user's comments for navbar
        const userCommentsPromise = Post.find({ parentPost: { $ne: null }, author: tempUserId})
            .sort({ createdAt: -1 })
            .populate('author')
            .exec()

        // Run all queries
        const [user, allPosts, userPosts, userComments] = await Promise.all([
            userPromise,
            allPostsPromise,
            userPostsPromise,
            userCommentsPromise
        ]);

        // Check if user exists
        if (!user) {
            return res.status(404).send("User not found");
        }

        // Render homepage
        res.render('homeTemp', {
            title: 'Home',
            post: allPosts,
            user,
            userPosts,
            userComments
        });
    } catch(err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
};

// ---- [END] TEST for Home with NavBar ---- //

/*
// Renders the Home Page
const homePage = (req, res) => {
    Post.find().sort({ createdAt: -1 }) // sorts to show latest entry
        .populate('author') // This will populate the 'author' field with user data
        .exec()
        .then((result) => {
            res.render('homeTemp', { title: 'Home', post: result});  // sends db data to html file
        })
        .catch((err) => {
            console.log(err)
        });
};
*/

module.exports = { homePage };