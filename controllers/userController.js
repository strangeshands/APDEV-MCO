const users = require('../models/users');
const posts = require('../models/posts');
const likes = require('../models/likes');

const moment = require('moment');   // For time display
const path = require("path");

/**
 *  Loads the profile of the user
 */
const loadUserProfile = async(req,res) => {
    try {
        /**
         *  activeUser: user logged in
         *  profileSelected: selected profile, can be not the same as the active user
         *  
         *  restrictions:
         *      (1) activeUser can only access edit profile page
         *      (2) if activeUser is null, "log in" button will show on the header
         */
        var activeUser;

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
        activeUser = req.session.user;

        // if null, meaning there is no active user
        if (activeUser) {
            activeUserDetails = await users.findById(activeUser);

            // if null, profile is not found
            if (!activeUserDetails) {
                return res.render('errorPageTemplate', {
                    header: "Profile not found.",
                    emotion: null,
                    description: "This account does not exist or may be deleted."
                });
            }

            // own page meaning the active user is also the profile selected
            if (profileDetails._id === activeUserDetails._id ||
                profileDetails._id.toString() === activeUserDetails._id.toString())
                ownPage = true;
            
            // query active user bookmarks
            const activeBookmarksTemp = await users
                .findOne({ _id: activeUserDetails._id })
                .select('bookmarks');
            activeBookmarks =   activeBookmarksTemp.bookmarks
                                .map(bookmark => bookmark)
                                .filter(bookmark => bookmark !== null);
            

            // query active user likes
            const activeLikesTemp = await likes
                .find({ likedBy: activeUserDetails })
                .populate('likedPost')
                .select('likedPost');
            activeLikes =   activeLikesTemp
                            .map(like => like.likedPost)
                            .filter(likedPost => likedPost !== null);

            // query active user dislikes
            const activeDislikesTemp = await users
                .findOne({ _id: activeUserDetails._id })
                .select('dislikes');
            activeDislikes =    activeDislikesTemp.dislikes
                                .map(dislike => dislike)
                                .filter(dislike => dislike !== null);
        }

        /**
         *  set active tabId, default is posts
         */
        let tabId = req.params.tabId || "posts";

        if ((tabId !== "posts" && tabId !== "comments")) {
            if (!ownPage)
                return res.render('errorPageTemplate', {
                    header: "No permission to view.",
                    emotion: "You are trying to view a profile that is not yours.",
                    description: "You can only view your other's posts and comments"
                });
        }

        if (!profileDetails) {
            return res.render('errorPageTemplate', {
                    header: "Profile not found.",
                    emotion: null,
                    description: "This account does not exist or may be deleted."
                });
        } else {
            // query profile posts
            profilePosts = await posts
                .find({ 
                    author: profileDetails,
                    parentPost: null 
                })
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
                    .findOne({ _id: profileDetails._id })
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
                    .findOne({ _id: profileDetails._id })
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
    } catch(err) {
        return res.render('errorPageTemplate', {
            header: "An error occured.",
            emotion: null,
            description: "Please try to refresh the browser."
        });
    }
};

/**
 *  Updates the bookmarks of the user
 */
const updateBookmark = async(req,res) => {
    try {
        var { postId, action } = req.body;

        // FOR MCO P3: change to req.session.id
        var activeUserDetails = req.session.user;
        // just to ensure it exists in the db
        activeUserDetails = await users.findById(activeUserDetails);

        if (!activeUserDetails) {
            return res.render('errorPageTemplate', {
                header: "You are not logged in.",
                emotion: "Oops. Cannot perform action.",
                description: "Please log in to bookmark a post."
                });
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
    } catch(err) {
        return res.render('errorPageTemplate', {
            header: "An error occured.",
            emotion: null,
            description: "Please try to refresh the browser."
        });
    }
}; 

/**
 *  Updates the likes of the user
 */
const updateLike = async(req, res) => {
    try {
        var { postId, action } = req.body;
        const selectedPost = await posts.findById(postId);

        // FOR MCO P3: change to req.session.id
        var activeUserDetails = req.session.user;
        // just to ensure it exists in the db
        activeUserDetails = await users.findById(activeUserDetails);

        if (!selectedPost) {
            return res.render('errorPageTemplate', {
                header: "Post not found.",
                emotion: null,
                description: "The post may be deleted or the author cannot be found."
            });
        }

        if (!activeUserDetails) {
            return res.render('errorPageTemplate', {
                header: "You are not logged in.",
                emotion: "Oops. Cannot perform action.",
                description: "Please log in to like a post."
                });
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
                                { $inc: { likeCount: -1 } },
                                { timestamps: false }
                            );
                break;

                case 'undislike':
                    await   users.updateOne(
                                { _id: activeUserDetails._id },
                                { $pull: { dislikes: selectedPost._id } },
                                { timestamps: false }
                            );
                    await   posts.updateOne(
                                { _id: selectedPost._id },
                                { $inc: { dislikeCount: -1 } },
                                { timestamps: false }
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
                                { $inc: { likeCount: +1 } },
                                { timestamps: false }
                            );
                break;

                case 'dislike':
                    activeUserDetails.dislikes.splice(0, 0, postId);
                    await   posts.updateOne(
                                { _id: selectedPost._id },
                                { $inc: { dislikeCount: +1 } },
                                { timestamps: false }
                            );
                break;

                case 'like+': 
                    await   likes.insertOne({
                                likedPost: selectedPost._id, 
                                likedBy: activeUserDetails._id 
                            });
                    await   posts.updateOne(
                                { _id: selectedPost._id },
                                { $inc: { likeCount: +1 } },
                                { timestamps: false }
                            );

                    await   users.updateOne(
                                { _id: activeUserDetails._id },
                                { $pull: { dislikes: selectedPost._id } }
                            );
                    await    posts.updateOne(
                                { _id: selectedPost._id },
                                { $inc: { dislikeCount: -1 } },
                                { timestamps: false }
                            );
                break;

                case 'dislike+':
                    activeUserDetails.dislikes.splice(0, 0, postId);
                    await   posts.updateOne(
                                { _id: selectedPost._id },
                                { $inc: { dislikeCount: +1 } },
                                { timestamps: false }
                            );

                    await   likes.deleteOne({ 
                                likedPost: selectedPost._id, 
                                likedBy: activeUserDetails._id,
                            });
                    await   posts.updateOne(
                                { _id: selectedPost._id },
                                { $inc: { likeCount: -1 } },
                                { timestamps: false }
                            );
                break;
            }
            await activeUserDetails.save({ timestamps: false });
        }
    } catch(err) {
        return res.render('errorPageTemplate', {
            header: "An error occured.",
            emotion: null,
            description: "Please try to refresh the browser."
        });
    }
};

/**
 *  Loads the edit profile page
 */
const editProfileLoad = async(req,res) => {
    // FOR MCO P3: change to req.session.id
    var activeUserDetails = req.session.user;
    // just to ensure it exists in the db
    activeUserDetails = await users.findById(activeUserDetails);

    if (!activeUserDetails) {
        return res.render('errorPageTemplate', {
                header: "You are not logged in.",
                emotion: "Oops. Cannot perform action.",
                description: "Please log in to perform this action."
            });
    }
    
    res.render('editProfilePage', { 
        activeUserDetails 
    });
};

/**
 *  Allows updating of user details (username, display name, bio)
 */
const updateUserDetails = async(req,res) => {
    try {
        var { newUser, newDisplayName, newBio } = req.body;

        // FOR MCO P3: change to req.session.id
        var activeUserDetails = req.session.user;
        // just to ensure it exists in the db
        activeUserDetails = await users.findById(activeUserDetails);

        if (!activeUserDetails) {
            return res.render('errorPageTemplate', {
                header: "Profile not found.",
                emotion: null,
                description: "This account does not exist or may be deleted."
            });
        }

        // checkpoint for changes
        var cpUser = true, 
            cpDN = true, 
            cpBio = true;
        var newUserChanged = false;

        // error messages to return
        var errorMessageUser = '';
        var errorMessageDN = '';
        var errorMessageBio = '';

        // checker for button feedback
        var overallstatus = true;
        var errorMessageUserButton = '';

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

                if (existingUser.username === activeUserDetails.username) {
                    errorMessageUser = newUser + ' is already your username.'

                    cpUser = false;
                    overallstatus = false;
                }
            }
        }

        /**
         *  display name have a character limit of 20
         */
        if (newDisplayName) {
            if (newDisplayName.length > 20) {
                errorMessageDN = "Your display name exceeded character limit.";

                cpDN = false;
                overallstatus = false;
            }

            if (newDisplayName === activeUserDetails.displayname) {
                errorMessageDN = newDisplayName + ' already your display name.';

                cpDN = false;
                overallstatus = false;
            }
        }

        /**
         *  bio has a character limit
         */
        if (newBio) {
            if (newBio.length > 100) {
                errorMessageBio = "Your bio exceeded character limit.";

                cpBio = false;
                overallstatus = false;
            }

            if (newBio === activeUserDetails.bio) {
                errorMessageBio = 'This is already your bio.';

                cpBio = false;
                overallstatus = false;
            }
        }

        if (overallstatus) {
            if (cpUser && newUser) {
                await users.updateOne(
                    { _id: activeUserDetails._id }, 
                    { $set: { username: newUser } }
                );

                newUserChanged = true;
                errorMessageUser = newUser + ' is your new username!';
                activeUserDetails.username = newUser;
            }
            if (cpDN && newDisplayName) {
                await users.updateOne(
                    { _id: activeUserDetails._id }, 
                    { $set: { displayname: newDisplayName } }
                );
        
                errorMessageDN = newDisplayName + " is your new display name."
                activeUserDetails.displayname = newDisplayName;
            }
        
            if (cpBio && newBio) {
                await users.updateOne(
                    { _id: activeUserDetails._id }, 
                    { $set: { bio: newBio } }
                );
        
                errorMessageBio = "You have updated your bio."
                activeUserDetails.bio = newBio;
            }

            errorMessageUserButton = "You have saved your changes. Please refresh your page."
        }
        else
            errorMessageUserButton = "Cannot procceed. Please check your input."

        return res.json({ 
            newUserChanged,
            newUser,

            updatedUser: activeUserDetails,

            errorMessageUser,
            errorMessageDN,
            errorMessageBio,
            errorMessageUserButton
        });
    } catch(err) {
        return res.render('errorPageTemplate', {
            header: "An error occured.",
            emotion: null,
            description: "Please try to refresh the browser."
        });
    }
};

/**
 *  Allows updating of account information (email, number, password)
 */
const updateAccountInfo = async(req,res) => {
    try {
        var { newEmail, newNum, newPass, currentPass } = req.body;

        // FOR MCO P3: change to req.session.id
        var activeUserDetails = req.session.user;
        // just to ensure it exists in the db
        activeUserDetails = await users.findById(activeUserDetails);

        if (!activeUserDetails) {
            return res.render('errorPageTemplate', {
                header: "Profile not found.",
                emotion: null,
                description: "This account does not exist or may be deleted."
            });
        }

        var errorMessageEmail = '';
        var errorMessageNum = '';
        var errorMessagePass = '';

        // checkpoint for changes
        var cpEmail = true, 
            cpNum = true, 
            cpPass = true;

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

            const allowedDomains = /^[^\s@]+@(gmail\.com|yahoo\.com)$/i;
            if (!allowedDomains.test(newEmail)) {
                errorMessageEmail = 'Only emails from @gmail.com or @yahoo.com are allowed.';

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

            const cleanedNum = newNum.replace(/\s+/g, ''); // Remove all spaces
            if (cleanedNum.length !== 11 || !/^[\d\s]+$/.test(newNum)) {
                errorMessageNum = 'Please enter a valid phone number.';

                cpNum = false;
                overallstatus = false;
            }
        }

        if (newPass && currentPass) {
            // Regular expression to check if the password contains:
            // - At least one number (\d)
            // - At least one uppercase letter ([A-Z])
            // - At least one symbol ([!@#$%^&*(),.?":{}|<>])
            const passwordPattern = /^(?=.*\d)(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).+$/;

            if (!passwordPattern.test(newPass)) {
                errorMessagePasswordButton = "Include number, uppercase letter, and a symbol.";

                cpPass = false;
                overallstatus = false;
            }
            if (newPass.length < 8) {
                errorMessagePasswordButton = "Please choose a longer password.";

                cpPass = false;
                overallstatus = false;
            }

            // Validations with bcrypt

            const isPasswordCorrect = await activeUserDetails.comparePassword(currentPass);

            if (!isPasswordCorrect) {
                errorMessagePasswordButton = "Your entry does not match your current password.";

                cpPass = false;
                overallstatus = false;
            } else {
                const isPasswordSame = await activeUserDetails.comparePassword(newPass);

                if (isPasswordSame) {
                    errorMessagePasswordButton = "Please choose a different password.";

                    cpPass = false;
                    overallstatus = false;
                }
            }
        }

        if (overallstatus) {
            if (cpEmail && newEmail) {
                await users.updateOne(
                    { _id: activeUserDetails._id }, 
                    { $set: { email: newEmail } }
                );
        
                errorMessageEmail = newEmail + ' is your new email!';
                activeUserDetails.email = newEmail;
            }
            if (cpNum && newNum) {
                await users.updateOne(
                    { _id: activeUserDetails._id }, 
                    { $set: { phone: newNum } }
                );
        
                errorMessageNum = newNum + ' is your new phone number!';
                activeUserDetails.phone = newNum;
            }

            errorMessageAccInfoButton = "You have saved your changes. Please refresh the page."
        }
        else {
            errorMessageAccInfoButton = "Please check your input."
        }

        if (cpPass && newPass) {
            // Get user model and update password (this triggers pre-save hook)
            const userToUpdate = await users.findById(activeUserDetails._id);
            userToUpdate.password = newPass;
            await userToUpdate.save();

            // Update session user
            activeUserDetails = userToUpdate;
            errorMessagePasswordButton = "Successfully updated your password. Please refresh the page."
        }

        // Return messages
        return res.json({ 
            updatedUser: activeUserDetails,
            
            errorMessageEmail,
            errorMessageNum,
            errorMessagePass,
            errorMessageAccInfoButton,
            errorMessagePasswordButton
        });
    } catch(err) {
        return res.render('errorPageTemplate', {
            header: "An error occured.",
            emotion: null,
            description: "Please try to refresh the browser."
        });
    }
};

/**
 *  Allows updating of profile photo
 */
const changePhoto = async(req,res) => {
    try {
        // FOR MCO P3: change to req.session.id
        const activeUser = req.session.user;
        // just to ensure it exists in the db
        var activeUserDetails = await users.findOne({ _id:activeUser });

        if (!activeUserDetails) {
            return res.render('errorPageTemplate', {
                header: "Profile not found.",
                emotion: null,
                description: "This account does not exist or may be deleted."
            });
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
            { _id: activeUserDetails._id },
            { $set: { profilepic: filePathForDB } }
        );
    } catch(err) {
        return res.render('errorPageTemplate', {
            header: "An error occured.",
            emotion: null,
            description: "Please try to refresh the browser."
        });
    }
};

/**
 *  [DONE/DEBUGGED] Allows updating of header
 */
const changeHeader = async(req,res) => {
    try {
        // FOR MCO P3: change to req.session.id
        const activeUser = req.session.user;
        // just to ensure it exists in the db
        var activeUserDetails = await users.findOne({ _id:activeUser });

        if (!activeUserDetails) {
            return res.render('errorPageTemplate', {
                header: "Profile not found.",
                emotion: null,
                description: "This account does not exist or may be deleted."
            });
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
    } catch(err) {
        return res.render('errorPageTemplate', {
            header: "An error occured.",
            emotion: null,
            description: "Please try to refresh the browser."
        });
    }
};

const deleteUser = async(req,res) => {
    try {
        // FOR MCO P3: change to req.session.id
        const activeUser = req.session.user;
        // just to ensure it exists in the db
        var activeUserDetails = await users.findOne({ _id:activeUser });

        if (!activeUserDetails) {
            return res.render('errorPageTemplate', {
                header: "You are not logged in.",
                emotion: "Oops. Cannot perform action.",
                description: "Please log in to perform this action."
                });
        }

        // delete all posts 
        await posts.deleteMany({ author: activeUser });
        
        // delete/update all likes
        const userLikes = await likes.find({ likedBy: activeUser });
        const likedPostIds = userLikes.map(like => like.likedPost);
        if (likedPostIds.length > 0) {
            await posts.updateMany(
                { _id: { $in: likedPostIds }, likeCount: {$gt: 0} },
                { $inc: { likeCount: -1 } },
                { timestamps: false }
            );
        }
        await likes.deleteMany({ likedBy: activeUser });

        // delete all dislikes
        const dislikedPostIds = activeUserDetails.dislikes || [];
        if (dislikedPostIds.length > 0) {
            await posts.updateMany(
                { _id: { $in: dislikedPostIds }, dislikeCount: { $gt: 0 } },
                { $inc: { dislikeCount: -1 } },
                { timestamps: false }
            );
        }

        // delete account
        await users.deleteOne({ _id: activeUser });

        // change to destroy
        req.session.destroy();
        res.redirect("/");
    } catch(err) {
        return res.render('errorPageTemplate', {
            header: "An error occured.",
            emotion: null,
            description: "Please try to refresh the browser."
        });
    }
};

/**
 *  Function to format dates
 */
const formatPostDates = (posts) => {
    return posts.map(post => {
        let postDate;

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

        const formatDuration = (unit, value) => {
            return value > 1 ? `${value} ${unit}s ago` : `${value} ${unit} ago`;
        };

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
    changeHeader,

    deleteUser
};