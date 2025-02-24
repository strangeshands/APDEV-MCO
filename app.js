/**
 *  Install dependencies: (npm install)
 *      > express
 *      > morgan
 *      > mongoose
 *      > hbs
 */
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const hbs = require('hbs');

/* --------------------- */

const app = express();

// ----- Middleware & Static Files ----- //
app.use(express.static('public'));  // everything in the given dir is accessible (great for css and images)
app.use(express.urlencoded({ extended: true }));    // parses the url to an object to be used in te req obj // needed or else obj is undefined
app.use(morgan('dev'));     // used for automatic logging of http request details (method, url, status, ...)
app.use(express.json());  // allows JSON parsing

// to make data from DB usable in javascript files
app.set('view engine','hbs'); // register view engine
hbs.registerHelper("json", function (context) { // register Handlebars Helper
    return JSON.stringify(context);
});

// ----- Connect Controllers ----- //
const userController = require("./controllers/userController");
const homeController = require("./controllers/homeController");

// ----- Use Controllers----- //
app.use("/", homeController);
app.get("/profile", userController.loadUserProfile);

// ----- 404 Page (Catch-All Route) ----- //
app.use((req, res) => {     
    res.status(404).render('errorPage');  
});

/*
// ----- Routes ----- //
app.get('/', (req, res) => {
    // to be filled
});
*/
/**
 *  [PROFILE PAGE]
 *  TO DO:
 *      > update to "/profile/<username>" so <username> dynamically changes depending on the selected profile
 */
app.get("/profile", userController.loadUserProfile);

// ----- MongoDB Connection ----- //
const dbURI = 'mongodb+srv://ConnectifyHanielle:apdevgorlz@connectify.2pt1b.mongodb.net/connectify-db';
mongoose.connect(dbURI)
    .then(() => {
        console.log("MongoDB Connected");
        app.listen(3000, () => console.log("Server running on http://localhost:3000"));
    })
    .catch((err) => {
        console.log("MongoDB Connection Failed", err);
        process.exit(1); // Exit the app if MongoDB fails
    });
