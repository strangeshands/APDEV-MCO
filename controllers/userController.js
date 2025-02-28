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

        // query profile likes
        const likesTemp = await likes
            .find({ likedBy: profileDetails })
            .populate({
                path: 'likedPost',
                populate: [
                    { path: 'author' },
                    { 
                        path: 'parentPost', 
                        populate: { path: 'author' }  
                    }
                ]
            })
            .sort({ createdAt: -1, updatedAt: -1 })
            .select('likedPost');
        const profileLikes = likesTemp.map(like => like.likedPost);
        console.log(profileLikes);

        // query profile dislikes
        const dislikesTemp = await users
            .findOne({ username: user })
            .populate({
                path: 'dislikes',
                populate: [
                    { path: 'author' },  
                    { 
                        path: 'parentPost', 
                        populate: { path: 'author' } 
                    }
                ]
            })
            .select('dislikes');
        const profileDislikes = dislikesTemp.dislikes.map(dislike => dislike);
        console.log(profileDislikes);

        res.render("profilePage", {
            activeTab: tabId,
            
            profileDetails,
            likesCount,
            postCount,

            profilePosts,
            profileComments,
            profileBookmarks,
            profileLikes,
            profileDislikes
        });
    }
};

const updateBookmark = async(req,res) => {
    const { postId, action } = req.body;
    profileDetails = await users.findOne({ username: user });

    if (!profileDetails) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (action === 'add') {
        if (!profileDetails.bookmarks.includes(postId)) {
            profileDetails.bookmarks.splice(0, 0, postId);
        }
    } else if (action === 'remove') {
        await users.updateOne(
            { _id: profileDetails._id },
            { $pull: { bookmarks: postId } }
        );
    }
    await profileDetails.save();
}; 

const updateLike = async(req,res) => {
    let { postId, action } = req.body;
    let selectedPost = await posts.findById(postId);
    profileDetails = await users.findOne({ username: user });

    if (selectedPost) {
        switch (action) {
            case 'unlike':
                await   likes.deleteOne({ 
                            likedPost: selectedPost._id, 
                            likedBy: profileDetails._id 
                        });
            break;

            case 'undislike':
                await   users.updateOne(
                            { _id: profileDetails._id },
                            { $pull: { dislikes: selectedPost._id } }
                        );
            break;

            case 'like':
                await   likes.insertOne({
                            likedPost: selectedPost._id, 
                            likedBy: profileDetails._id ,
                            createdAt: new Date()
                        });
            break;

            case 'dislike':
                profileDetails.dislikes.splice(0, 0, postId);
            break;

            case 'like+': 
                await   likes.insertOne({
                    likedPost: selectedPost._id, 
                    likedBy: profileDetails._id 
                });

                await   users.updateOne(
                    { _id: profileDetails._id },
                    { $pull: { dislikes: selectedPost._id } }
                );
            break;

            case 'dislike+':
                profileDetails.dislikes.splice(0, 0, postId);

                await   likes.deleteOne({ 
                    likedPost: selectedPost._id, 
                    likedBy: profileDetails._id,
                });
            break;
        }
        await profileDetails.save();
    }
};

module.exports = { 
    loadUserProfile, 
    updateBookmark
};