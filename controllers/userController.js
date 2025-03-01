const users = require('../models/users');
const posts = require('../models/posts');
const likes = require('../models/likes');

/**
 *  > for testing only, will find for a specific hard coded user
 * 
 *  > TO DO: 
 *      > find active user based on
 *          > (1) the profile clicked
 *          > (2) default is the user logged in
 */
//const user = "@jabeedabee";
var user = "@AkoSiDarna";

// Initialize variables
let profileDetails;
let postCount;
let likesCount;

const loadUserProfile = async(req,res) => {
    let tabId = req.params.tabId;

    // default is posts if tabId is null
    if (!tabId) 
        tabId = "posts"

    // query profile
    profileDetails = await users.findOne({ username: user });
    console.log(profileDetails);

    if (!profileDetails) {
        return res.status(404).render("errorPage");
    } else {
        // query post count
        postCount = await posts.countDocuments({ author: profileDetails });
        console.log(`Post Count: ${postCount}`);

        // query likes count
        likesCount = await likes.countDocuments({ likedBy: profileDetails });
        console.log(`Likes Count: ${likesCount}`);

        // query profile posts
        const profilePosts = await posts
            .find({ author: profileDetails })
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
                author: profileDetails, 
                parentPost: { $ne: null }
            })
            .populate('author')
            .populate({
                path: 'parentPost',
                populate: { path: 'author' }
            })
            .sort({ createdAt: -1 });

        // query profile bookmarks
        const bookmarksTemp = await users
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
        const profileBookmarks = bookmarksTemp.bookmarks.map(bookmark => bookmark);
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

const editProfileLoad = async(req,res) => {
    profileDetails = await users.findOne({ username: user });

    res.render('editProfilePage', { 
        profileDetails 
    });
};

const updateProfile = async(req,res) => {
    profileDetails = await users.findOne({ username: user });

    var { newUser, newDisplayName, newBio } = req.body;
    var { newEmail, newNum } = req.body;
    var { newPass } = req.body;

    var errorMessageUser = '';
    var errorMessageDN = '';
    var errorMessageBio = '';
    var errorMessageEmail = '';
    var errorMessageNum = '';

    if (newUser) {
        if (!newUser.startsWith('@')) {
            newUser = '@' + newUser;
        }
        const existingUser = await users.findOne({ username: newUser });

        if (existingUser)
            errorMessageUser = newUser + ' already exists!'
        else {
            await users.updateOne(
                { _id: profileDetails._id }, 
                { $set: { username: newUser } }
            );

            /**
             *  TO DO:
             *      > update 'user' depending on the user logged in
             */
            user = newUser;

            errorMessageUser = newUser + ' is your new username!';
            profileDetails.username = newUser;
        }
    }

    if (newDisplayName) {
        await users.updateOne(
            { _id: profileDetails._id }, 
            { $set: { displayname: newDisplayName } }
        );

        errorMessageDN = newDisplayName + " is your new display name."
        profileDetails.displayname = newDisplayName;
    }

    if (newBio) {
        await users.updateOne(
            { _id: profileDetails._id }, 
            { $set: { bio: newBio } }
        );

        errorMessageBio = "You have updated your bio."
        profileDetails.bio = newBio;
    }

    if (newEmail) {
        const existingUser = await users.findOne({ email: newEmail });

        if (existingUser)
            errorMessageEmail = newEmail + ' is already registered to another account.'
        else {
            await users.updateOne(
                { _id: profileDetails._id }, 
                { $set: { email: newEmail } }
            );

            errorMessageEmail = newEmail + ' is your new email!';
            profileDetails.email = newEmail;
        }
    }

    if (newNum) {
        const existingUser = await users.findOne({ phone: newNum });

        if (existingUser)
            errorMessageNum = newNum + ' is already registered to another account.'
        else {
            await users.updateOne(
                { _id: profileDetails._id }, 
                { $set: { phone: newNum } }
            );

            errorMessageNum = newNum + ' is your new phone number!';
            profileDetails.phone = newNum;
        }
    }

    if (newPass) {
        await users.updateOne(
            { _id: profileDetails._id }, 
            { $set: { password: newPass } }
        );

        profileDetails.password = newPass;
    }

    return res.json({ 
        errorMessageUser,
        errorMessageDN,
        errorMessageBio,
        errorMessageEmail,
        errorMessageNum
    });
};

module.exports = { 
    loadUserProfile, 
    updateBookmark,
    updateLike,
    editProfileLoad,
    updateProfile
};