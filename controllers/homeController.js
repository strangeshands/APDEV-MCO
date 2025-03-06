const Post = require('../models/posts');
const User = require('../models/users');
const Like = require('../models/likes');
const moment = require('moment');   // For time display
const activeUserModule = require('../activeUser');

// ---- [START] TEST for Home with NavBar ---- //

const homePage = async (req, res) => {
    try {
        var activeUser = activeUserModule.getActiveUser();
        if (!activeUser) {
            return res.redirect('/login');
        }
        const loggedInUserId = activeUser._id;
        activeUser = await User.findById(loggedInUserId);

        let searchQuery = req.query.q;
        let postConditions = {};

        if (!loggedInUserId) {
            return res.redirect('/login'); // Redirect to login if no userId
        };

        // if null, meaning there is no active user
        if (activeUser) {
            var activeUserDetails = activeUser;
            
            // query active user bookmarks
            const activeBookmarksTemp = await User
                .findOne({ username: activeUserDetails.username })
                .select('bookmarks');
            var activeBookmarks =   activeBookmarksTemp.bookmarks
                                    .map(bookmark => bookmark)
                                    .filter(bookmark => bookmark !== null);

            // query active user likes
            const activeLikesTemp = await Like
                .find({ likedBy: activeUserDetails })
                .populate('likedPost')
                .sort({ createdAt: -1, updatedAt: -1 })
                .select('likedPost');
            var activeLikes =   activeLikesTemp
                                .map(like => like.likedPost)
                                .filter(likedPost => likedPost !== null);

            // query active user dislikes
            const activeDislikesTemp = await User
                .findOne({ username: activeUserDetails.username })
                .select('dislikes');
            var activeDislikes =    activeDislikesTemp.dislikes
                                    .map(dislike => dislike)
                                    .filter(dislike => dislike !== null);
        }

        if (searchQuery && searchQuery.trim()) {
            const processedQuery = searchQuery.trim();
            
            if (processedQuery.startsWith('#')) {
                const tag = processedQuery.trim(); 
                if (tag) {
                    // Exact tag math (case-insensitive)
                    postConditions.tags = {
                        $elemMatch: {
                            $regex: new RegExp(`^${tag}$`, 'i')
                        }
                    };
                }
            } else if (processedQuery.startsWith('@')) {
                // Exact username match (case-insensitive)
                const username = processedQuery.slice(1).trim();
                if (username) {
                    const user = await User.findOne({ 
                        username: { 
                            $regex: new RegExp(`^@${username}$`, 'i') 
                        } 
                    });
                    postConditions.author = user ? user._id : null;
                }
            } else {
                // Substring match for content/title
                const searchText = processedQuery;
                const searchRegex = new RegExp(searchText, 'i');
                postConditions.$or = [
                    { content: { $regex: searchRegex } },
                    { title: { $regex: searchRegex } }
                ];
            }
        }

        // All posts for the timeline
        const allPostsPromise = Post.find(postConditions)
            .sort({ createdAt: -1 })
            .populate('author')
            .populate({
                path: 'parentPost',
                populate: { path: 'author' }
            })
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

        // Query logged-in user
        const userPromise = User.findById(loggedInUserId).exec();
        
        // Default (logged-in) user's posts for navbar
        const userPostsPromise = Post.find({ parentPost: null, author: loggedInUserId })
            .sort({ createdAt: -1 })
            .populate('author')
            .exec()

        // Default (logged-in) user's comments for navbar
        const userCommentsPromise = Post.find({ parentPost: { $ne: null }, author: loggedInUserId})
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

        res.render('homeTemp', {
            title: 'Home',
            post: allPosts,
            user,
            userPosts,
            userComments,
            
            loggedInUserId,
            activeUserDetails, 
            activeBookmarks,
            activeLikes,
            activeDislikes
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