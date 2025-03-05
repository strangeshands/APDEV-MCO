const Post = require('../models/posts');
const User = require('../models/users');
const Like = require('../models/likes');

const moment = require('moment');   // For time display
const path = require('path');       // For file upload

// Default user ID (will replace with actual logged-in user after login implementation)
const tempUserId = "67b9fd7ab7db71f6ae3b21d4";

// Getting a specific post
const post_details = (req, res) => {    // :id to search for actual id
    const id = req.params.id            // .id to match with url above
    
    Post.findById(id)
        .populate('author') // This will populate the 'author' field with user data
        .exec()
        .then((result) => {
            var postDate;
            
            // Get the time the post was made
            const postTimeCreated = moment(result.createdAt);

            // Get the current time
            const now = moment();

            // Calculate the duration between the two dates
            const duration = moment.duration(now.diff(postTimeCreated));

            // Time Format
            function formatDuration(unit, value) {
                return value > 1 ? `${value} ${unit}s ago` : `${value} ${unit} ago`;
            }
            
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

            res.render('postPage', { post: result, title: 'Post', postDate: postDate });
        })
        .catch((err) => {
            res.status(404).render('errorPage');
        });
};

// NOT DONE
const post_create_get = (req, res) => {

    User.findById(tempUserId)
        .exec()
        .then((result) => {
            user = result;

            res.render('newPostPage', { user: user, title: 'New Post' });
        })
        .catch((err) => {
            res.status(404).render('errorPage');
        });

};

// NOT DONE
const post_create_post = async (req, res) => {
    const formData = req.body;

    const postAuthor = await User.findById(tempUserId);

    if (!postAuthor) {
        return res.status(404).send("User not found");
    }

    if (!req.files || !req.files.images) {
        return res.status(400).send("No file uploaded.");
    }

    let imagePaths = [];

    const images = req.files.images;

    if (Array.isArray(images)) {
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
    } else {
        let image = images;

        const imageUploadPromise = new Promise((resolve, reject) => {
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
                    console.log(`message: "Image uploaded successfully!", filePath: /uploads/${fileName}`);
                    resolve();
                }
        
            });
        });

        try {
            await imageUploadPromise; // Wait for the upload to finish
        } catch (err) {
            console.log("Error uploading image: " + err.message);
        }
    };

    const postData = { 
        ...formData, 
        author: postAuthor._id,
        images: imagePaths 
    };
    
    try {
        const post = new Post(postData);
        await post.save()
                    .then((result) => {
                        res.redirect(`/?userId=${tempUserId}`); // to be changed
                    })
                    .catch((err) => {
                        console.log(err);
                    });

    } catch (err) {
        console.log(err);
    }

};

// NOT DONE
const post_delete = (req, res) => {
    const id = req.params.id;

    Blog.findByIdAndDelete(id)
        .then((result) => {
            res.json({ redirect: '/blogs' });
        })
        .catch((err) => {
            console.log(err);
        });
}

/**
 *  > Draft of delete post
 * 
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
    const postId = req.params.postId;
    const activeUser = req.query.userId;

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

    // delete the post on the post record
    await Post.deleteOne({ _id: postId });
    // delete the posts on the likes table
    await Like.deleteMany({ _id: postId });
    // delete the posts on the users' bookmarks or dislikes
    await User.updateMany({},
        {
            $pull: {
                bookmarks: postId,
                dislikes: postId
            }
        }
    );

    var origin = req.query.from;
    if (origin == "profile")
        res.redirect(`/profile/${activeUserDetails.username}?userId=${activeUser}`);
    else
        res.redirect(`/?userId=${activeUser}`);
}

module.exports = {
    post_details,
    post_create_get,
    post_create_post,
    post_delete, 
    deletePost
};