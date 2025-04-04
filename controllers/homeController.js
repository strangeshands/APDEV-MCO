const Post = require('../models/posts');
const User = require('../models/users');
const Like = require('../models/likes');
const moment = require('moment');   // For time display

const homePage = async (req, res) => {
    try {
        var activeUser = req.session.user;
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
            .find({ parentPost: null })
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

                    const postTimeCreated = moment(post.createdAt);
                    const editedTime = moment(post.updatedAt);
                    const now = moment();

                    let duration;
                    if (!postTimeCreated.isSame(editedTime) && editedTime) {
                        duration = moment.duration(now.diff(editedTime));
                        postDate = 'Updated ';
                    }
                    else {
                        duration = moment.duration(now.diff(postTimeCreated));
                        postDate = '';
                    }

                    // Time Format
                    function formatDuration(unit, value) {
                        return value > 1 ? `${value} ${unit}s ago` : `${value} ${unit} ago`;
                    }
                    
                    if (duration.months() > 0) {
                        if (!postTimeCreated.isSame(editedTime))
                            postDate += moment(post.updatedAt).format('MMM DD, YYYY');
                        else
                            postDate += moment(post.createdAt).format('MMM DD, YYYY');
                    } else if (duration.weeks() > 0) {
                        postDate += formatDuration('week', duration.weeks());
                    } else if (duration.days() > 0) {
                        postDate += formatDuration('day', duration.days());
                    } else if (duration.hours() > 0) {
                        postDate += formatDuration('hour', duration.hours());
                    } else if (duration.minutes() > 0) {
                        postDate += formatDuration('minute', duration.minutes());
                    } else {
                        postDate += formatDuration('second', duration.seconds());
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

        res.render('homePage', {
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

const search = async (req, res) => {
    try {
        const query = req.query.q.trim();
        const results = { tags: [], authors: [] };

        if (!query) return res.json(results);

        if (query.startsWith('#')) {
            const tagSearch = query.slice(1);
            results.tags = await Post.aggregate([
                { $unwind: "$tags" },
                { $match: { tags: { $regex: `^#${tagSearch}`, $options: 'i' } } },
                { $group: { _id: "$tags" } },
                { $limit: 5 }
            ]).then(tags => tags.map(t => t._id));
        } 
        else if (query.startsWith('@')) {
            const usernameSearch = query.slice(1);
            results.authors = await User.find({
                username: { $regex: `@${usernameSearch}`, $options: 'i' }
            }).limit(5);
        }
        else {
            // Search both tags and users for general text
            results.tags = await Post.aggregate([
                { $unwind: "$tags" },
                { $match: { tags: { $regex: query, $options: 'i' } } },
                { $group: { _id: "$tags" } },
                { $limit: 3 }
            ]).then(tags => tags.map(t => t._id));

            results.authors = await User.find({
                username: { $regex: query, $options: 'i' }
            }).limit(2);
        }

        res.json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
}

module.exports = { homePage, search };