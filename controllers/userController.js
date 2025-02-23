const users = require('../models/users');
const posts = require('../models/posts');

/**
 *  > for testing only, will find for a specific hard coded user
 * 
 *  > TO DO: 
 *      > find active user based on
 *          > (1) the profile clicked
 *          > (2) default is the user logged in
 *      > likes count
 */
const user = "@AkoSiDarna"
const loadUserProfile = async (req,res) => {
    // query profile
    const profileSelected = await users.findOne({ username: user });
    console.log(profileSelected);

    if (!profileSelected) {
        return res.status(404).render("errorPage");
    } else {
        // query post count and likes count
        const postCount = await posts.countDocuments({ author: user });
        console.log(`Post Count: ${postCount}`);
        const likesCount = 0;
        console.log(`Likes Count: ${likesCount}`);

        // query profile posts
        const profilePosts = await posts.find({ author: user });
        console.log(profilePosts);

        // render profile page
        res.render('profilePage', {
            profileDetails: profileSelected,
            postCount: postCount,
            likesCount: likesCount,

            profilePosts: profilePosts
        })
    }
};

module.exports = { 
    loadUserProfile 
};