const users = require('../models/users');
const posts = require('../models/posts');

/**
 *  > for testing only, will find for a specific hard coded user
 * 
 *  > TO DO: 
 *      > find active user based on
 *          > (1) the profile clicked
 *          > (2) default is the user logged in
 */
//const user = "@jabeedabee";
const user = "@AkoSiDarna";

const loadUserProfile = async (req,res) => {
    // query profile
    const profileSelected = await users.findOne({ username: user });
    console.log(profileSelected);

    if (!profileSelected) {
        return res.status(404).render("errorPage");
    } else {
        // query post count and likes count
        const postCount = await posts.countDocuments({ author: profileSelected });
        console.log(`Post Count: ${postCount}`);

        /**
         *  TO DO: query likes count properly
         */
        const likesCount = 0;
        console.log(`Likes Count: ${likesCount}`);

        // query profile posts
        const profilePosts = await posts
            .find({ author: profileSelected })
            .populate('author')
            .populate({
                path: 'parentPost',
                populate: { path: 'author' }
            })
            .sort({ createdAt: -1 });
        console.log(profilePosts);

        // query profile comments
        const profileComments = await posts
            .find({ 
                author: profileSelected, 
                parentPost: { $ne: null }
            })
            .populate('author')
            .populate({
                path: 'parentPost',
                populate: { path: 'author' }
            })
            .sort({ createdAt: -1 });
        

        /**
         *  TO DO: query likes, replace null
         */
        // query profile likes
        const profileLikes = null;
        console.log(profileLikes);

        /**
         *  TO DO: query bookmars, replce null
         */
        // query profile bookmarks
        const profileBookmarks = await users
            .findOne({ username: user })
            .populate({
                path: 'bookmarks',
                populate: [
                    { path: 'author' },  
                    { 
                        path: 'parentPost', 
                        populate: { path: 'author' } 
                    }
                ]
            })
            .select('bookmarks');
        console.log(profileBookmarks);

        // render profile page
        res.render('profilePage', {
            profileDetails: profileSelected,
            postCount: postCount,
            likesCount: likesCount,

            profilePosts: profilePosts,
            profileComments: profileComments,
            profileLikes: profileLikes,
            profileBookmarks: profileBookmarks
        })
    }
};

module.exports = { 
    loadUserProfile 
};