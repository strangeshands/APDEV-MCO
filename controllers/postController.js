const Post = require('../models/posts');
const User = require('../models/users');
const Like = require('../models/likes');

const moment = require('moment');   // For time display
const path = require('path');       // For file upload
const fs = require('fs');           // For file deletion

// TEMPORARY; sub for session
const active = require('../activeUser');
const tempUserId = "67b9fd7ab7db71f6ae3b21d4";

/**
 *  Getting specific post and its comments
 */
const post_details = async (req, res) => {
    // Details of active user, if there is
    var activeUserDetails = null;
    var activeBookmarks = null;
    var activeLikes = null;
    var activeDislikes = null;
    
    try {
        const id = req.params.id;
        // FOR MCO P3: replace with req.session.id;
        var activeUser = active.getActiveUser();

        // if null, meaning there is no active user
        if (activeUser) {
            activeUserDetails = await User.findById(activeUser);

            // if null, profile is not found
            if (!activeUserDetails) {
                return res.render('errorPageTemplate', {
                header: "Profile not found.",
                emotion: null,
                description: "This account may be deleted."
                });
            }
            
            // query active user bookmarks
            const activeBookmarksTemp = await User
                .findOne({ username: activeUserDetails.username })
                .select('bookmarks');
            activeBookmarks =   activeBookmarksTemp.bookmarks
                                .map(bookmark => bookmark)
                                .filter(bookmark => bookmark !== null);
            // clean up null posts
            

            // query active user likes
            const activeLikesTemp = await Like
                .find({ likedBy: activeUserDetails })
                .populate('likedPost')
                .select('likedPost');
            activeLikes =   activeLikesTemp
                            .map(like => like.likedPost)
                            .filter(likedPost => likedPost !== null);

            // query active user dislikes
            const activeDislikesTemp = await User
                .findOne({ username: activeUserDetails.username })
                .select('dislikes');
            activeDislikes =    activeDislikesTemp.dislikes
                                .map(dislike => dislike)
                                .filter(dislike => dislike !== null);
        }
        
        // find the post
        var post = await Post.findById(id)
            .populate('author')
            .populate({
                path: 'parentPost',
                populate: { path: 'author' }
            });
        post = formatPostDates([post])[0];

        // if the post is not found, render the error page
        if (!post) {
            return res.render('errorPageTemplate', {
                header: "Post not found.",
                emotion: null,
                description: "The post may be deleted or the author cannot be found."
            });
        }

        // Find all comments under the post
        var comments = await Post.find({ parentPost: id })
                .populate('author')
                .populate({
                    path: 'parentPost',
                    populate: { path: 'author' }
                })
                .sort({ createdAt: -1 });
        comments = formatPostDates(comments);

        // Render the page with post and comments data
        let origin = req.query.from;

        res.render('postPage', {
            title: "Post",
            post,
            comments,
            origin,

            activeUserDetails,
            activeLikes,
            activeBookmarks,
            activeDislikes
        });

    } catch (error) {
        console.error(error);
        res.status(500).render('errorPageTemplate', {
            header: "Server Error",
            emotion: "sad",
            description: "An error occurred while fetching the post. Please try again later."
        });
    }
};

/**
 *  Renders the page for creating a new post
 */
const post_create_get = (req, res) => {
    var activeUser = active.getActiveUser();
    User.findById(activeUser)
        .exec()
        .then((result) => {
            activeUserDetails = result;
            res.render('newPostPage', { post: null, activeUserDetails, title: 'New Post' });
        })
        .catch((err) => {
            res.status(404).render('errorPage');
        });
};

/** 
 *  Sends data from the new post to the db
 */
const post_create_post = async (req, res) => {
    console.log("iwenthere");
    const formData = req.body;
    const postAuthor = await User.findById(active.getActiveUser());

    if (!postAuthor) {
        return res.status(404).send("User not found");
    }

    let tags = req.body.tags;
    if (tags) {
        tags = tags
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => tag && tag !== '#'); 
    }

    let imagePaths = [];
    const images = Array.isArray(req.files?.images) 
                    ? req.files.images 
                    : req.files?.images 
                    ? [req.files.images] 
                    : [];


    if (images) {
        const imageUploadPromises = images.map((image) => {
            return new Promise((resolve, reject) => { 
                const fileName = `${Date.now()}-${image.name}`;
                const uploadPath = path.join(__dirname, '..', 'public', 'uploads', fileName);
                const filePathForDB = `/uploads/${fileName}`;
            
                image.mv(uploadPath, (err) => {
                    if (err) {
                        console.error("File upload error:", err);
                        reject("Failed to upload image.");
                        return res.status(500).send("Failed to upload image.");
                    } else {
                        imagePaths.push(`/uploads/${fileName}`);
                        console.log(`message: "Images uploaded successfully!", filePath: /uploads/${fileName}`);
                        resolve();
                    }
            
                });
            });
        });
    
        try {
            await Promise.all(imageUploadPromises);
        } catch (err) {
            console.log("Error uploading images: " + err.message);
        }
    } 

    const postData = { 
        ...formData, 
        author: postAuthor._id,
        images: imagePaths,
        tags: tags
    };

    console.log(postData);
    
    try {
        const post = new Post(postData);
        await post.save()
                    .then((result) => {
                        res.redirect(`/`); // to be changed
                    })
                    .catch((err) => {
                        console.log(err);
                    });

        // update the tags of user
        const userPosts = await Post.find({ author: postAuthor });
        let allUserTags = userPosts.flatMap(post => post.tags);
        allUserTags = Array.from(
            new Set(allUserTags.map(tag => tag.toLowerCase()))
        );
        await User.updateOne(
            { _id: postAuthor },
            { $set: { tags: allUserTags } }
        );
    } catch (err) {
        console.log(err);
    }
};

const editPostLoad = async(req,res) => {
    const postId = req.params.postId;
    // FOR MCO P3: replace with req.session.id;
    var activeUser = active.getActiveUser();

    // there should be an active user to delete a post
    if (!activeUser) 
        return res.render('errorPageTemplate', {
        header: "You are not logged in.",
        emotion: "Oops. Cannot perform action.",
        description: "Please log in to edit a post."
        });

    if (activeUser) {
        activeUserDetails = await User.findById(activeUser);

        // if null, profile is not found
        if (!activeUserDetails) {
            return res.render('errorPageTemplate', {
            header: "Profile not found.",
            emotion: null,
            description: "This account may be deleted."
            });
        }
    }

    var post = await Post.findById(postId);
    res.render('newPostPage', {post, activeUserDetails});
};

const editPostSave = async (req, res) => {
    const postId = req.params.postId;
    const formData = req.body;
    var images = Array.isArray(req.files?.images) 
                ? req.files.images 
                : req.files?.images 
                ? [req.files.images] 
                : [];

    const existingPost = await Post.findById(postId);
    const existingImages = existingPost.images || [];

    var remainingImages = [];
    var finalImages = [];
    var forDelete = [];

    let tags = req.body.tags;
    if (tags) {
        tags = tags
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => tag && tag !== '#'); 
    }
    
    images.forEach(img => {
        var res = existingImages.some(exist => {
            exist = exist.substring(exist.lastIndexOf('/') + 1);
            console.log(exist);

            // get the uploaded images
            if (exist === img.name) 
                finalImages.push(exist);

            return exist === img.name;
        });
        if (!res)
            remainingImages.push(img);
    });
    
    existingImages.forEach(exist => {
        exist = exist.substring(exist.lastIndexOf('/') + 1);
        var res = images.some(img => {
            return exist === img.name;
        });

        if (!res) {
            forDelete.push(exist);
            finalImages = finalImages.filter(image => !image.endsWith(exist));
        }
    });

    // Function to handle image upload
    const uploadImage = (image) => {
        return new Promise((resolve, reject) => {
            const fileName = `${Date.now()}-${image.name}`;
            const uploadPath = path.join(__dirname, '..', 'public', 'uploads', fileName);
            const filePathForDB = `/uploads/${fileName}`;

            image.mv(uploadPath, (err) => {
                if (err) {
                    console.error("File upload error:", err);
                    reject(new Error("Failed to upload image."));
                } else {
                    console.log(`Image uploaded: ${filePathForDB}`);
                    resolve(filePathForDB);
                }
            });
        });
    };

    // Handle image uploads and await all promises
    let newimagePaths = [];
    if (remainingImages)
        newimagePaths = await Promise.all(
            remainingImages.map((img) => uploadImage(img))
        );
    if (forDelete) {
        forDelete.forEach((fileName) => {
            const filePath = path.join(__dirname, '..', 'public', 'uploads', fileName);
    
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error(`Failed to delete file: ${filePath}`, err);
                } else {
                    console.log(`Successfully deleted file: ${filePath}`);
                }
            });
        });
    }
    
    // Combine remaining and newly uploaded images
    const updatedImages = [...finalImages, ...newimagePaths].map(image => 
        image.startsWith('/uploads') ? image : `/uploads/${image}`
    );
    //console.log("Updated images:", updatedImages);

    const updatedPostData = { 
        ...formData, 
        images: updatedImages,
        tags 
    };
    //console.log("Updated Post Data:", updatedPostData);

    try {
        await Post.updateOne({ _id: postId }, { $set: updatedPostData });

        // update the tags of user
        const userPosts = await Post.find({ author: existingPost.author });
        let allUserTags = userPosts.flatMap(post => post.tags);
        allUserTags = Array.from(
            new Set(allUserTags.map(tag => tag.toLowerCase()))
        );
        await User.updateOne(
            { _id: existingPost.author },
            { $set: { tags: allUserTags } }
        );

        res.redirect(`/posts/${postId}`);
    } catch (err) {
        console.error("Post update error:", err);
        res.status(500).send("Failed to update the post.");
    }
};

/**
 *  FOR MCO P2:
 *      > link is /delete-post/:postId?userId=<active user id>
 *      > additionally, if from profile page, additional query is added
 *          > /delete-post/:postId?userId=<active user id>&from=profile
 *  FOR MCO P3:
 *      > the link will be simplified to /delete-post/:postId
 *      > this is because you can now retrieve the active user through
 *          req.session.id
 *      > ?from query is still applied
 * 
 *  restrictions:
 *      > a user can only delete a post of their own
 */
const deletePost = async(req,res) => {
    try {
        const postId = req.params.postId;
        // FOR MCO P3: change this to req.session.id
        const activeUser = active.getActiveUser();

        // there should be an active user to delete a post
        if (!activeUser) 
            return res.render('errorPageTemplate', {
                            header: "You are not logged in.",
                            emotion: "Oops. Cannot perform action.",
                            description: "Please log in to delete a post."
                            });

        var activeUserDetails = await User.findById(activeUser);
        if (!activeUserDetails)
            return res.render('errorPageTemplate', {
                            header: "Profile not found.",
                            emotion: null,
                            description: "This account may be deleted."
                            });

        var post = await Post.findOne({
            _id: postId,
            author: activeUser
        })

        if (!post)
            return res.render('errorPageTemplate', {
                            header: "Post not found.",
                            emotion: null,
                            description: "The post may be deleted or the author cannot be found."
                            });

        /* ----- IMAGE DELETION IN UPLOADS FOLDER ----- */

        function deleteFile(filePath) {
            const fullPath = path.join(__dirname, '..', 'public', filePath);

            if (fs.existsSync(fullPath)) {          // Checks if the file exists
                fs.unlink(fullPath, (err) => {      // Deletes the file
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('file deleted');
                    }
                });
            } else {
                console.log(`File ${filePath} does not exist.`);
            }
        }

        await Post.findOne({ _id: postId })
                    .then((result) => {
                        const images = result.images;

                        images.forEach((image) => {
                            deleteFile(image);
                        });
                    });

        // delete the post on the post record
        await Post.deleteOne({ _id: postId });
        // delete the posts on the likes table
        await Like.deleteMany({ likedPost: postId });
        // delete the posts on the users' bookmarks or dislikes
        await User.updateMany({},
            {
                $pull: {
                    bookmarks: postId,
                    dislikes: postId
                }
            }
        );
        // update the tags of user
        const userPosts = await Post.find({ author: activeUser });
        let allUserTags = userPosts.flatMap(post => post.tags);
        allUserTags = Array.from(
            new Set(allUserTags.map(tag => tag.toLowerCase()))
        );
        await User.updateOne(
            { _id: activeUser },
            { $set: { tags: allUserTags } }
        );

        var origin = req.query.from;
        if (origin == "profile")
            res.redirect(`/profile/${activeUserDetails.username}`);
        else
            res.redirect(`/`);
    } catch(err) {
        res.status(500).send("Internal Server Error");
    }
}

/**
 *  Function to format dates
 */
const formatPostDates = (posts) => {
    return posts.map(post => {
        let postDate;

        const postTimeCreated = moment(post.updatedAt || post.createdAt);
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

/**
 * Renders the reply page for creating a reply to a post
 */
const reply_create_get = async (req, res) => {
    const postId = req.params.id;
    
    // TEMPORARY; sub for session
    const activeUser = active.getActiveUser();
    const tempUserId = "67b9fd7ab7db71f6ae3b21d4";
    
    try {
        // Find the post being replied to
        var post = await Post.findById(postId)
            .populate('author')
            .populate({
                path: 'parentPost',
                populate: { path: 'author' }
            });
        
        // Format the post date
        post = formatPostDates([post])[0];
        
        // Get active user details
        var activeUserDetails = await User.findById(activeUser || tempUserId);
        
        if (!post) {
            return res.render('errorPageTemplate', {
                header: "Post not found.",
                emotion: null,
                description: "The post may be deleted or the author cannot be found."
            });
        }
        
        res.render('replyPage', {
            title: 'Reply',
            post,
            activeUserDetails
        });
    } catch (error) {
        console.error(error);
        res.status(500).render('errorPageTemplate', {
            header: "Server Error",
            emotion: "sad",
            description: "An error occurred while loading the reply page. Please try again later."
        });
    }
};

/**
 * Handles the submission of a reply post
 */
const reply_create_post = async (req, res) => {
    const postId = req.params.id;
    const formData = req.body;
    
    // TEMPORARY; sub for session
    const activeUser = active.getActiveUser();
    const tempUserId = "67b9fd7ab7db71f6ae3b21d4";
    
    try {
        // Get the post being replied to
        const originalPost = await Post.findById(postId);
        
        if (!originalPost) {
            return res.status(404).render('errorPageTemplate', {
                header: "Post not found.",
                emotion: null,
                description: "The post you're replying to may have been deleted."
            });
        }
        
        // Get the active user
        const postAuthor = await User.findById(activeUser || tempUserId);
        
        if (!postAuthor) {
            return res.status(404).render('errorPageTemplate', {
                header: "User not found.",
                emotion: null,
                description: "You need to be logged in to reply to a post."
            });
        }
        
        // Handle image uploads if any
        let imagePaths = [];
        const images = Array.isArray(req.files?.images) 
                        ? req.files.images 
                        : req.files?.images 
                        ? [req.files.images] 
                        : [];

        if (images && images.length > 0) {
            const imageUploadPromises = images.map((image) => {
                return new Promise((resolve, reject) => { 
                    const fileName = `${Date.now()}-${image.name}`;
                    const uploadPath = path.join(__dirname, '..', 'public', 'uploads', fileName);
                    const filePathForDB = `/uploads/${fileName}`;
                
                    image.mv(uploadPath, (err) => {
                        if (err) {
                            console.error("File upload error:", err);
                            reject("Failed to upload image.");
                        } else {
                            imagePaths.push(filePathForDB);
                            console.log(`message: "Images uploaded successfully!", filePath: ${filePathForDB}`);
                            resolve();
                        }
                    });
                });
            });
        
            try {
                await Promise.all(imageUploadPromises);
            } catch (err) {
                console.log("Error uploading images: " + err.message);
            }
        }
        
        // Create the reply post data
        const replyPostData = {
            title: "",
            content: formData.content,
            author: postAuthor._id,
            parentPost: originalPost._id,
            images: imagePaths
        };
        
        // Save the reply post
        const replyPost = new Post(replyPostData);
        await replyPost.save();
        
        // Redirect to the original post page to see the reply
        res.redirect(`/posts/${postId}`);
        
    } catch (error) {
        console.error(error);
        res.status(500).render('errorPageTemplate', {
            header: "Server Error",
            emotion: "sad",
            description: "An error occurred while posting your reply. Please try again later."
        });
    }
};

module.exports = {
    post_details,
    post_create_get,
    post_create_post,
    editPostLoad,
    editPostSave,
    deletePost,
    reply_create_get,
    reply_create_post
};