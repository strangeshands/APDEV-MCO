const users = require('../models/users');
const posts = require('../models/posts');
const likes = require('../models/likes');
const path = require("path");

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

// Initialize variables
var profileDetails;
var postCount;
var likesCount;

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
                ],
                options: { strictPopulate: false }
            })
            .sort({ createdAt: -1, updatedAt: -1 })
            .select('likedPost');
        const profileLikes =    likesTemp
                                .map(like => like.likedPost)
                                .filter(likedPost => likedPost !== null);;
        console.log("LIKES");
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
                await   posts.updateOne(
                            { _id: selectedPost._id },
                            { $inc: { likeCount: -1 } }
                        );
            break;

            case 'undislike':
                await   users.updateOne(
                            { _id: profileDetails._id },
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
                            likedBy: profileDetails._id ,
                            createdAt: new Date()
                        });
                await   posts.updateOne(
                            { _id: selectedPost._id },
                            { $inc: { likeCount: +1 } }
                        );
            break;

            case 'dislike':
                profileDetails.dislikes.splice(0, 0, postId);
                await   posts.updateOne(
                            { _id: selectedPost._id },
                            { $inc: { dislikeCount: +1 } }
                        );
            break;

            case 'like+': 
                await   likes.insertOne({
                            likedPost: selectedPost._id, 
                            likedBy: profileDetails._id 
                        });
                await   posts.updateOne(
                            { _id: selectedPost._id },
                            { $inc: { likeCount: +1 } }
                        );

                await   users.updateOne(
                            { _id: profileDetails._id },
                            { $pull: { dislikes: selectedPost._id } }
                        );
                await    posts.updateOne(
                            { _id: selectedPost._id },
                            { $inc: { dislikeCount: -1 } }
                        );
            break;

            case 'dislike+':
                profileDetails.dislikes.splice(0, 0, postId);
                await   posts.updateOne(
                            { _id: selectedPost._id },
                            { $inc: { dislikeCount: +1 } }
                        );

                await   likes.deleteOne({ 
                            likedPost: selectedPost._id, 
                            likedBy: profileDetails._id,
                        });
                await   posts.updateOne(
                            { _id: selectedPost._id },
                            { $inc: { likeCount: -1 } }
                        );
            break;
        }
        await profileDetails.save();
    }
};

const editProfileLoad = async(req,res) => {
    var find = req.params.username;
    activeUser = await users.findOne({ username: find });

    res.render('editProfilePage', { 
        profileDetails: activeUser 
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
    profileDetails = await users.findOne({ username: user });

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
    profileDetails = await users.findOne({ username: user });

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