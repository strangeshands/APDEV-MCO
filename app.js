/**
 *  Install dependencies: (npm install)
 *      > express
 *      > morgan
 *      > mongoose
 *      > hbs
 *      > moment
 *      > body-parser
 *      > bcrypt
 *      > express-fileupload
 */
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
/* --------------------- */

const app = express();

// ----- Middleware & Static Files ----- //
app.use(express.static('public'));                  // everything in the given dir is accessible (great for css and images)
app.use(express.urlencoded({ extended: true }));    // parses the url to an object to be used in te req obj // needed or else obj is undefined
app.use(morgan('dev'));                             // used for automatic logging of http request details (method, url, status, ...)
app.use(express.json());                            // allows JSON parsing

// set up file upload
app.use(fileUpload());
app.use('/uploads', express.static('uploads'));

// to make data from DB usable in javascript files
app.set('view engine','hbs'); // register view engine
hbs.registerPartials(__dirname + "/views/partials");

// custom function for hbs helper
hbs.registerHelper("isEqual", (a, b) => a === b);
hbs.registerHelper("json", function (context) {
    return JSON.stringify(context);
});

// ----- Connect Controllers ----- //
const userController = require("./controllers/userController");
const homeController = require("./controllers/homeController");

/* ---------- Routes ----------- */
const postRoutes = require('./routes/postRoutes');
const homeRoutes = require('./routes/homeRoutes');
const authRoutes = require('./routes/authRoutes')

// ----- Use Controllers----- //
app.use("/", homeRoutes);
app.use('/posts', postRoutes);
app.use("/", authRoutes); 

/**
 *  [PROFILE PAGES]
 *  TO DO:
 *      > update to "/profile/<username>" so <username> dynamically changes depending on the selected profile
 */
app.get("/profile", userController.loadUserProfile);
app.get("/profile/:tabId", userController.loadUserProfile);

/**
 *  [EDIT PROFILE PAGE]
 *  TO DO:
 *      > update to "/edit-profile/<username>" so <username> dynamically changes depending on the selected profile
 */
app.get("/edit-profile", userController.editProfileLoad);
app.post("/edit-profile", userController.updateProfile);

/**
 *  GHOST LINK - no dedicated page
 *  > allows updating of bookmarks
 */
app.post("/update-bookmark", userController.updateBookmark);
app.post("/update-like", userController.updateLike);
app.post("/upload-profilepic", userController.changePhoto);
app.post("/upload-headerpic", userController.changeHeader);

// ----- 404 Page (Catch-All Route) ----- //
app.use((req, res) => {     
    res.status(404).render('errorPage');  
});

// ----- MongoDB Connection ----- //
const dbURI = 'mongodb+srv://ConnectifyAdmin:apdevgorlz@connectify.2pt1b.mongodb.net/connectify-db';
mongoose.connect(dbURI)
    .then(() => {
        console.log("MongoDB Connected");
        app.listen(3000, () => console.log("Server running on http://localhost:3000"));
    })
    .catch((err) => {
        console.log("MongoDB Connection Failed", err);
        process.exit(1); // Exit the app if MongoDB fails
    });
