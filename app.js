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
const bodyParser = require('body-parser'); //TODO: I think we can remove this
const fileUpload = require('express-fileupload');
const MongoStore = require("connect-mongo");

/* --------------------- */

const app = express();

// ----- Session Proper ----- //
const session = require("express-session");
const cookieParser = require("cookie-parser");

const dbURI = 'mongodb+srv://ConnectifyAdmin:apdevgorlz@connectify.2pt1b.mongodb.net/connectify-db';

// ----- Setup Session ----- //
app.use(cookieParser());
app.use(
    session({
        secret: "secret-key", 
        resave: false,        
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: dbURI,
            collectionName: "sessions",
        }),
        cookie: {
            maxAge: 1000 * 60 * 60 * 24, 
            httpOnly: true, 
            secure: false,
        }
    })
);

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

/* ---------- Routes ----------- */
const postRoutes = require('./routes/postRoutes');
const homeRoutes = require('./routes/homeRoutes');
const authRoutes = require('./routes/authRoutes');

// ----- Use Controllers----- //
app.use("/", homeRoutes);
app.use('/posts', postRoutes);
app.use("/", authRoutes); 

/**
 *  [PROFILE PAGES]
 */
app.use("/profile/:username/:tabId", userController.loadUserProfile);
app.use("/profile/:username", userController.loadUserProfile);

/**
 *  [EDIT PROFILE PAGE]
 */
app.get("/edit-profile/:username", userController.editProfileLoad);
app.post("/edit-profile/:username/update-user-details", userController.updateUserDetails);
app.post("/edit-profile/:username/update-acc-info", userController.updateAccountInfo);

/**
 *  [DELETE PROFILE]
 */
app.get("/delete-profile", userController.deleteUser);

/**
 *  [GHOST LINKS] - no dedicated page
 *      (1) allows updating of bookmarks
 *      (2) allows updated of likes and dislikes
 *      (3) allows uploading and updating of profile pic
 *      (4) allows uploading and updating of header picture
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
mongoose.connect(dbURI)
    .then(() => {
        console.log("MongoDB Connected");
        app.listen(3000, () => console.log("Server running on http://localhost:3000"));
    })
    .catch((err) => {
        console.log("MongoDB Connection Failed", err);
        process.exit(1); // Exit the app if MongoDB fails
    });
