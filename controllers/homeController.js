const Post = require('../models/posts');
const moment = require('moment');   // For time display

// Render the Home Page
/*
router.get('/', (req, res) => {
    res.render('homePage', { title: "Connectify - Home" });
});
*/

// Renders the Home Page
const homePage = (req, res) => {
    Post.find().sort({ createdAt: -1 }) // sorts to show latest entry
        .populate('author') // This will populate the 'author' field with user data
        .exec()
        .then((result) => {
            res.render('homeTemp', { title: 'Home', post: result});  // sends db data to html file
        })
        .catch((err) => {
            console.log(err)
        });
};

module.exports = { homePage };