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
            .exec()
            .then((result) => {
                return result.map(post => {  // Gets formatted date
                    
                    var postDate;

                    // Get the time the post was made
                    const postTimeCreated = moment(post.createdAt);

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
                    
                    return { post, postDate };
                });
            });
        
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