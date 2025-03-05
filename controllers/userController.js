const users = require('../models/users');
const posts = require('../models/posts');
const likes = require('../models/likes');

const moment = require('moment');   // For time display
const path = require("path");

// Temporary substitute to session
const active = require('../activeUser');

const loadUserProfile = async(req,res) => {
    /**
     *  activeUser: user logged in
     *  profileSelected: selected profile, can be not the same as the active user
     *  
     *  restrictions:
     *      (1) activeUser can only access edit profile page
     *      (2) if activeUser is null, "log in" button will show on the header
     */
    var activeUser, profileSelected;

    // Details of active user and profile selected
    var activeUserDetails = null;
    var profileDetails = null;

    // Posts retrieved from active user
    var activeBookmarks = null;
    var activeLikes = null;
    var activeDislikes = null;
    
    // Posts retrived from profile selected
    var profilePosts = null;
    var profileComments = null;
    var profileBookmarks = null;
    var profileLikes, profileDislikes = null;
    var postCount, likesCount;

    // Own page determines if the active user is the same as profile selected
    var ownPage = false;

    // request profileSelected
    profileSelected = req.params.username;
    profileDetails = await users.findOne({ username: profileSelected });

    /**
     *  [MCO P3]
     *  For P3, change this to req.session.id
     */
    activeUser = req.query.userId;

    // if null, meaning there is no active user
    if (activeUser) {
        activeUserDetails = await users.findById(activeUser);

        // if null, profile is not found
        if (!activeUserDetails)
            return res.render('profileNotFound');

        // own page meaning the active user is also the profile selected
        ownPage = profileDetails.username === activeUserDetails.username;
        
        // query active user bookmarks
        const activeBookmarksTemp = await users
            .findOne({ username: activeUserDetails.username })
            .select('bookmarks');
        activeBookmarks =   activeBookmarksTemp.bookmarks
                            .map(bookmark => bookmark)
                            .filter(bookmark => bookmark !== null);

        // query active user likes
        const activeLikesTemp = await likes
            .find({ likedBy: activeUserDetails })
            .populate('likedPost')
            .sort({ createdAt: -1, updatedAt: -1 })
            .select('likedPost');
        activeLikes =   activeLikesTemp
                        .map(like => like.likedPost)
                        .filter(likedPost => likedPost !== null);

        // query active user dislikes
        const activeDislikesTemp = await users
            .findOne({ username: activeUserDetails.username })
            .select('dislikes');
        activeDislikes =    activeDislikesTemp.dislikes
                            .map(dislike => dislike)
                            .filter(dislike => dislike !== null);
    }

    /**
     *  set active tabId, default is posts
     */
    let tabId = req.params.tabId || "posts";

    if (!profileDetails) {
        return res.render('profileNotFound');
    } else {
        // query profile posts
        profilePosts = await posts
            .find({ author: profileDetails })
            .populate('author')
            .populate({
                path: 'parentPost',
                populate: { path: 'author' }
            })
            .sort({ createdAt: -1 });
        profilePosts = formatPostDates(profilePosts);

        // query post count
        postCount = profilePosts.length;
        //console.log(`Post Count: ${postCount}`);

        if (tabId == "comments") {
            // query profile comments
            profileComments = await posts
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
            profileComments = formatPostDates(profileComments);
            //console.log(profileComments);
        }

        profileBookmarks = null;
        if (tabId == "bookmarks") {
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
            profileBookmarks =    bookmarksTemp.bookmarks
                                        .map(bookmark => bookmark)
                                        .filter(bookmark => bookmark !== null);
            profileBookmarks = formatPostDates(profileBookmarks);
            //console.log(profileBookmarks);
        }

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
        profileLikes =    likesTemp
                                .map(like => like.likedPost)
                                .filter(likedPost => likedPost !== null);
        profileLikes = formatPostDates(profileLikes);
        //console.log(profileLikes);

        // query likes count
        likesCount = profileLikes.length;
        //console.log(`Likes Count: ${likesCount}`);

        if (tabId == "dislikes") {
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
            profileDislikes =   dislikesTemp.dislikes
                                .map(dislike => dislike)
                                .filter(dislike => dislike !== null);
            profileDislikes = formatPostDates(profileDislikes);
            //console.log(profileDislikes);
        }

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
    var { postId, action } = req.body;

    /**
     *  [MCO P3]
     *  For P3, change this to req.session.id
     */
    var { activeUserDetails } = req.body;
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
    //res.status(200).json({ success: true, message: 'Bookmark updated successfully' });
}; 

const updateLike = async(req, res) => {
    var { postId, action } = req.body;
    const selectedPost = await posts.findById(postId);

    /**
     *  [MCO P3]
     *  For P3, change this to req.session.id
     */
    var { activeUserDetails } = req.body;
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
        //res.status(200).json({ success: true, message: 'Like/Dislike updated successfully' });
    }
};

/**
 *  [FOR MCO P2]
 *  assume params.username is the user logged in since the option
 *      will only appear if logged in
 */
const editProfileLoad = async(req,res) => {
    /**
     *  [MCO P3]
     *  For P3, change this to req.session.id
     */
    var find = req.params.username;
    var activeUserDetails = await users.findOne({ username: find });

    res.render('editProfilePage', { 
        activeUserDetails 
    });
};

const updateUserDetails = async(req,res) => {
    var { newUser, newDisplayName, newBio } = req.body;

    /**
     *  [MCO P3]
     *  For P3, change this to req.session.id
     */
    var { activeUserDetails } = req.body;
    // just to ensure it exists in the db
    activeUserDetails = await users.findById(activeUserDetails._id);

    if (!activeUserDetails) {
        return res.render("errorPage");
    }

    // checkpoint for changes
    var cpUser, cpDN, cpBio = true;

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
    }

    if (overallstatus) {
        if (cpUser) {
            await users.updateOne(
                { _id: activeUserDetails._id }, 
                { $set: { username: newUser } }
            );
    
            /**
             *  TO DO:
             *      > update 'user' depending on the user logged in
             */
            user = newUser;
    
            errorMessageUser = newUser + ' is your new username!';
            activeUserDetails.username = newUser;
        }
        if (cpDN) {
            await users.updateOne(
                { _id: activeUserDetails._id }, 
                { $set: { displayname: newDisplayName } }
            );
    
            errorMessageDN = newDisplayName + " is your new display name."
            activeUserDetails.displayname = newDisplayName;
        }
    
        if (cpBio) {
            await users.updateOne(
                { _id: activeUserDetails._id }, 
                { $set: { bio: newBio } }
            );
    
            errorMessageBio = "You have updated your bio."
            activeUserDetails.bio = newBio;
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

const updateAccountInfo = async(req,res) => {
    var { newEmail, newNum } = req.body;

    /**
     *  [MCO P3]
     *  For P3, change this to req.session.id
     */
    var { activeUserDetails } = req.body;
    // just to ensure it exists in the db
    activeUserDetails = await users.findById(activeUserDetails._id);

    if (!activeUserDetails) {
        return res.render("profileNotFound");
    }

    var errorMessageEmail = '';
    var errorMessageNum = '';
    var errorMessagePass = '';

    // checkpoint for changes
    var cpEmail, cpNum, cpPass = true;

    var overallstatus = true;
    var errorMessageAccInfoButton = '';
    var errorMessagePasswordButton = '';

    if (newEmail) {
        const existingUser = await users.findOne({ email: newEmail });

        if (existingUser) {
            errorMessageEmail = newEmail + ' is already registered to another account.'
            
            cpEmail = false;
            overallstatus = false;
        }
    }

    if (newNum) {
        const existingUser = await users.findOne({ phone: newNum });

        if (existingUser) {
            errorMessageNum = newNum + ' is already registered to another account.'

            cpNum = false;
            overallstatus = false;
        }
    }

    if (newPass) {
        // Regular expression to check if the password contains:
        // - At least one number (\d)
        // - At least one uppercase letter ([A-Z])
        // - At least one symbol ([!@#$%^&*(),.?":{}|<>])
        const passwordPattern = /^(?=.*\d)(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).+$/;

        if (!passwordPattern.test(newPass)) {
            errorMessagePass = "Include number, uppercase letter, and a sumbol.";

            cpPass = false;
            overallstatus = false;
        }
        if (newPass.length < 8) {
            errorMessagePass = "Please choose a longer password.";

            cpPass = false;
            overallstatus = false;
        }

        errorMessageAccInfoButton = "You have saved your changes."
    }

    if (overallstatus) {
        if (cpEmail) {
            await users.updateOne(
                { _id: activeUserDetails._id }, 
                { $set: { email: newEmail } }
            );
    
            errorMessageEmail = newEmail + ' is your new email!';
            activeUserDetails.email = newEmail;
        }
        if (cpNum) {
            await users.updateOne(
                { _id: activeUserDetails._id }, 
                { $set: { phone: newNum } }
            );
    
            errorMessageNum = newNum + ' is your new phone number!';
            activeUserDetails.phone = newNum;
        }
    }

    if (cpPass) {
        await users.updateOne(
            { _id: activeUserDetails._id }, 
            { $set: { password: newPass } }
        );

        activeUserDetails.password = newPass;
        errorMessagePasswordButton = "Successfully updated your password."
    }

    // Return messages
    return res.json({ 
        errorMessageEmail,
        errorMessageNum,
        errorMessagePass,
        errorMessageAccInfoButton,
        errorMessagePasswordButton
    });
}

const changePhoto = async(req,res) => {
    const activeUser = req.params.username;
    // just to ensure it exists in the db
    var activeUserDetails = await users.findOne({username:activeUser});

    if (!activeUserDetails) {
        return res.status(404).send("User not found");
    }
    if (!req.files || !req.files.headerPic) {
        return res.status(400).send("No file uploaded.");
    }

    const image = req.files.profilePic;
    const fileName = `${Date.now()}-${image.name}`;
    const uploadPath = path.join(__dirname, '..', 'public', 'uploads', fileName);
    const filePathForDB = `/uploads/${fileName}`;

    console.log(uploadPath);
    console.log(filePathForDB);

    image.mv(uploadPath, (err) => {
        if (err) {
            console.error("File upload error:", err);
            return res.status(500).send("Failed to upload image.");
        }

        res.json({ message: "Image uploaded successfully!", filePath: `/uploads/${fileName}` });
    });

    await users.updateOne(
        { _id: activeUserDetails._id },
        { $set: { profilepic: filePathForDB } }
    );
};

const changeHeader = async(req,res) => {
    const activeUser = req.params.username;
    // just to ensure it exists in the db
    var activeUserDetails = await users.findOne({username:activeUser});

    if (!activeUserDetails) {
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
        { _id: activeUserDetails._id },
        { $set: { headerpic: filePathForDB } }
    );
};

/**
 *  Function to format dates
 */
const formatPostDates = (posts) => {
    return posts.map(post => {
        let postDate;

        const postTimeCreated = moment(post.createdAt);
        const now = moment();
        const duration = moment.duration(now.diff(postTimeCreated));

        const formatDuration = (unit, value) => {
            return value > 1 ? `${value} ${unit}s ago` : `${value} ${unit} ago`;
        };

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

        return { ...post.toObject(), postDate };
    });
};

module.exports = { 
    loadUserProfile, 

    updateBookmark,
    updateLike,

    editProfileLoad,
    updateUserDetails,
    updateAccountInfo,

    changePhoto,
    changeHeader
};