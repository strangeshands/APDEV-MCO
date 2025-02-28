/**
 *  to install (npm install):
 *      > express
 *      > morgan
 *      > mongoose
 *      > hbs
 * 
 *  Alternative:
 *  to install all dependencies at once:
 *      > npm install
 * 
 */
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const hbs = require('hbs')

/* --------------------- */

const app = new express();

// connect to mongoDB
const dbURI = 'mongodb+srv://<username>:<password>@connectify.2pt1b.mongodb.net/connectify-db'
mongoose.connect(dbURI) // allows us to communicate with mongoDB
.then((result) => app.listen(3000))   // if successful, we listen for requests
.catch((err) => console.log(err));    // else

// register view engine
app.set('view engine','hbs');

// to make data from DB usable in javascript files
app.use(express.json());
hbs.registerHelper("json", function (context) {
    return JSON.stringify(context);
});

// to connect controllers
const path = require("path");
const userController = require("./controllers/userController");


// ----- Middleware & Static Files ----- //

app.use(express.static('public'));  // everything in the given dir is accessible (great for css and images)
app.use(express.urlencoded({ extended: true }));    // parses the url to an object to be used in te req obj // needed or else obj is undefined
app.use(morgan('dev'));     // used for automatic logging of http request details (method, url, status, ...)


// ----- Routes ----- //

app.get('/', (req, res) => {
    
    // to be filled
});

/**
 *  [PROFILE PAGE]
 *  TO DO:
 *      > update to "/profile/<username>" so <username> dynamically changes depending on the selected profile
 */
app.get("/profile", userController.loadUserProfile);
app.get("/profile/:tabId", userController.loadUserProfile);

/**
 *  GHOST LINK - no dedicated page
 *  > allows updating of bookmarks
 */
app.post("/update-bookmark", userController.updateBookmark);
app.post("/update-like", userController.updateLike);

// [404 PAGE]
app.use((req, res) => {     
    res.status(404).render('errorPage');  
});