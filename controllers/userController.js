const users = require('../models/users');
const posts = require('../models/posts');
const likes = require('../models/likes');
const path = require("path");

/**
 *  activeUser: user logged in
 *  profileSelected: selected profile, can be not the same as the active user
 *  
 *  restrictions:
 *      (1) activeUser can only access edit profile page
 *      (2) if activeUser is null, "log in" button will show on the header
 */
var activeUser;
var profileSelected;

/**
 *  activeUserDetails is dependent on activeUser
 *  profileDetails is dependent on profileSelected
 */
var activeUserDetails = null;
var profileDetails = null;

/**
 *  postCount is the post count of the profile selected
 *  likesCount is the like count of the profile selected
 *  ownPage determines if the profile selected is the same as active user
 */
var postCount;
var likesCount;
var ownPage = false;

/**
 *  active user's bookmarks, likes, and dislikes
 */
var activeBookmarks = null;
var activeLikes = null;
var activeDislikes = null;

// TODO: do also for comments, bookmarks, likes, dislikes tabs
const loadUserProfile = async(req,res) => {
    // request profileSelected
    profileSelected = req.params.username;
    profileDetails = await users.findOne({ username: profileSelected });

    // request active user
    activeUser = req.query.userId;

    // if null, meaning there is no active user
    if (activeUser) {
        activeUserDetails = await users.findById(activeUser);

        // if null, profile is not found
        if (!activeUserDetails)
            return res.render('profileNotFound');

        ownPage = profileDetails.username === activeUserDetails.username;
        
        // query profile bookmarks
        const activeBookmarksTemp = await users
            .findOne({ username: activeUserDetails.username })
            .select('bookmarks');
        activeBookmarks =   activeBookmarksTemp.bookmarks
                            .map(bookmark => bookmark)
                            .filter(bookmark => bookmark !== null);

        // query profile likes
        const activeLikesTemp = await likes
            .find({ likedBy: activeUserDetails })
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
        activeLikes =   activeLikesTemp
                        .map(like => like.likedPost)
                        .filter(likedPost => likedPost !== null);

        // query profile dislikes
        const activeDislikesTemp = await users
            .findOne({ username: activeUserDetails.username })
            .select('dislikes');
        activeDislikes =    activeDislikesTemp.dislikes
                            .map(dislike => dislike)
                            .filter(dislike => dislike !== null);
    }

    // set active tabId
    let tabId = req.params.tabId;
    if (!tabId)
        tabId = "posts";

    if (!profileDetails) {
        return res.render('profileNotFound');
    } else {
        console.log("ACTIVE LIKES");
        console.log(activeLikes);
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
            .findOne({ username: profileDetails.username })
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
        const profileBookmarks =    bookmarksTemp.bookmarks
                                    .map(bookmark => bookmark)
                                    .filter(bookmark => bookmark !== null);
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
                ],
                options: { strictPopulate: false }
            })
            .sort({ createdAt: -1, updatedAt: -1 })
            .select('likedPost');
        const profileLikes =    likesTemp
                                .map(like => like.likedPost)
                                .filter(likedPost => likedPost !== null);
        console.log(profileLikes);

        // query profile dislikes
        const dislikesTemp = await users
            .findOne({ username: profileDetails.username })
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
        const profileDislikes =     dislikesTemp.dislikes
                                    .map(dislike => dislike)
                                    .filter(dislike => dislike !== null);
        console.log(profileDislikes);

        res.render("profilePage", {
            activeTab: tabId,
            ownPage,

            activeUserDetails,
            activeBookmarks,
            activeLikes,
            activeDislikes,

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
    var { postId, activeUserDetails, action } = req.body;
    // just to ensure it exists in the db
    activeUserDetails = await users.findById(activeUserDetails._id);

    if (!activeUserDetails) {
        return res.render("profileNotFound");
    }

    if (action === 'add') {
        if (!activeUserDetails.bookmarks.includes(postId)) {
            activeUserDetails.bookmarks.splice(0, 0, postId);
        }
    } else if (action === 'remove') {
        await users.updateOne(
            { _id: activeUserDetails._id },
            { $pull: { bookmarks: postId } }
        );
    }
    await activeUserDetails.save();
    res.status(200).json({ success: true, message: 'Bookmark updated successfully' });
}; 

const updateLike = async(req, res) => {
    var { postId, activeUserDetails, action } = req.body;
    const selectedPost = await posts.findById(postId);

    // just to ensure it exists in the db
    activeUserDetails = await users.findById(activeUserDetails._id);

    if (!selectedPost || !activeUserDetails) {
        return res.render("errorPage");
    }

    if (selectedPost) {
        switch (action) {
            case 'unlike':
                await   likes.deleteOne({ 
                            likedPost: selectedPost._id, 
                            likedBy: activeUserDetails._id 
                        });
                await   posts.updateOne(
                            { _id: selectedPost._id },
                            { $inc: { likeCount: -1 } }
                        );
            break;

            case 'undislike':
                await   users.updateOne(
                            { _id: activeUserDetails._id },
                            { $pull: { dislikes: selectedPost._id } }
                        );
                await   posts.updateOne(
                            { _id: selectedPost._id },
                            { $inc: { dislikeCount: -1 } }
                        );
            break;

            case 'like':
                await   likes.insertOne({
                            likedPost: selectedPost._id, 
                            likedBy: activeUserDetails._id ,
                            createdAt: new Date()
                        });
                await   posts.updateOne(
                            { _id: selectedPost._id },
                            { $inc: { likeCount: +1 } }
                        );
            break;

            case 'dislike':
                activeUserDetails.dislikes.splice(0, 0, postId);
                await   posts.updateOne(
                            { _id: selectedPost._id },
                            { $inc: { dislikeCount: +1 } }
                        );
            break;

            case 'like+': 
                await   likes.insertOne({
                            likedPost: selectedPost._id, 
                            likedBy: activeUserDetails._id 
                        });
                await   posts.updateOne(
                            { _id: selectedPost._id },
                            { $inc: { likeCount: +1 } }
                        );

                await   users.updateOne(
                            { _id: activeUserDetails._id },
                            { $pull: { dislikes: selectedPost._id } }
                        );
                await    posts.updateOne(
                            { _id: selectedPost._id },
                            { $inc: { dislikeCount: -1 } }
                        );
            break;

            case 'dislike+':
                activeUserDetails.dislikes.splice(0, 0, postId);
                await   posts.updateOne(
                            { _id: selectedPost._id },
                            { $inc: { dislikeCount: +1 } }
                        );

                await   likes.deleteOne({ 
                            likedPost: selectedPost._id, 
                            likedBy: activeUserDetails._id,
                        });
                await   posts.updateOne(
                            { _id: selectedPost._id },
                            { $inc: { likeCount: -1 } }
                        );
            break;
        }
        await activeUserDetails.save();
        res.status(200).json({ success: true, message: 'Like/Dislike updated successfully' });
    }
};

// TODO: please check this
const editProfileLoad = async(req,res) => {
    var find = req.params.username;
    activeUser = await users.findOne({ username: find });

    res.render('editProfilePage', { 
        profileDetails: activeUser 
    });
};

const updateProfile = async(req,res) => {
    const loggedInUserId = req.query.userId; 
    const profileDetails = await users.findById(loggedInUserId);  

    if (!profileDetails) {
        return res.status(404).send("User not found");
    }

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

// TODO; please check this
const updateUserDetails = async(req,res) => {
    // find the details of the profile
    /**
     *  TO DO:
     *      > find must be equal to the activeUser
     */
    var find = req.params.username;
    profileDetails = await users.findOne({ username: find });

    var { newUser, newDisplayName, newBio } = req.body;

    // checkpoint for changes
    var cpUser, cpDN, cpBio = false;

    // error messages to return
    var errorMessageUser = '';
    var errorMessageDN = '';
    var errorMessageBio = '';

    // checker for button feedback
    var overallstatus = true;
    var errorMessageButton = '';

    /**
     *  username should be unique
     */
    if (newUser) {
        if (!newUser.startsWith('@')) {
            newUser = '@' + newUser;
        }
        
        const existingUser = await users.findOne({ username: newUser });
        if (existingUser) {
            errorMessageUser = newUser + ' already exists!'

            cpUser = false;
            overallstatus = false;
        }
        else
            cpUser = true;
    }

    /**
     *  display name have a character limit of 20
     */
    if (newDisplayName) {
        if (newDisplayName.length > 20) {
            errorMessageDN = "Your display name exceeded character limit."

            cpDN = false;
            overallstatus = false;
        }
        else 
            cpDN = true;
    }

    /**
     *  bio has a character limit
     */
    if (newBio) {
        if (newBio.length > 100) {
            errorMessageBio = "Your bio exceeded character limit."

            cpBio = false;
            overallstatus = false;
        }
        else
            cpBio = true;
    }

    if (overallstatus) {
        if (cpUser) {
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
        if (cpDN) {
            await users.updateOne(
                { _id: profileDetails._id }, 
                { $set: { displayname: newDisplayName } }
            );
    
            errorMessageDN = newDisplayName + " is your new display name."
            profileDetails.displayname = newDisplayName;
        }
    
        if (cpBio) {
            await users.updateOne(
                { _id: profileDetails._id }, 
                { $set: { bio: newBio } }
            );
    
            errorMessageBio = "You have updated your bio."
            profileDetails.bio = newBio;
        }

        errorMessageButton = "You have saved your changes."
    }
    else
        errorMessageButton = "Cannot procceed. Please check your input."

    return res.json({ 
        errorMessageUser,
        errorMessageDN,
        errorMessageBio,
        errorMessageButton
    });
};

const changePhoto = async(req,res) => {
    const loggedInUserId = req.query.userId;  
    const profileDetails = await users.findById(loggedInUserId);  

    if (!profileDetails) {
        return res.status(404).send("User not found");
    }

    if (!req.files || !req.files.profilePic) {
        return res.status(400).send("No file uploaded.");
    }

    const image = req.files.profilePic;
    const fileName = `${Date.now()}-${image.name}`;
    const uploadPath = path.join(__dirname, '..', 'public', 'uploads', fileName);
    const filePathForDB = `/uploads/${fileName}`;

    image.mv(uploadPath, (err) => {
        if (err) {
            console.error("File upload error:", err);
            return res.status(500).send("Failed to upload image.");
        }

        res.json({ message: "Image uploaded successfully!", filePath: `/uploads/${fileName}` });
    });

    await users.updateOne(
        { _id: profileDetails._id },
        { $set: { profilepic: filePathForDB } }
    );
};

const changeHeader = async(req,res) => {
    const loggedInUserId = req.query.userId; 
    const profileDetails = await users.findById(loggedInUserId);  

    if (!profileDetails) {
        return res.status(404).send("User not found");
    }

    if (!req.files || !req.files.headerPic) {
        return res.status(400).send("No file uploaded.");
    }

    const image = req.files.headerPic;
    const fileName = `${Date.now()}-${image.name}`;
    const uploadPath = path.join(__dirname, '..', 'public', 'uploads', fileName);
    const filePathForDB = `/uploads/${fileName}`;

    image.mv(uploadPath, (err) => {
        if (err) {
            console.error("File upload error:", err);
            return res.status(500).send("Failed to upload image.");
        }

        res.json({ message: "Image uploaded successfully!", filePath: `/uploads/${fileName}` });
    });

    await users.updateOne(
        { _id: profileDetails._id },
        { $set: { headerpic: filePathForDB } }
    );
};

module.exports = { 
    loadUserProfile, 
    updateBookmark,
    updateLike,
    editProfileLoad,
    updateProfile,
    updateUserDetails,
    changePhoto,
    changeHeader
};