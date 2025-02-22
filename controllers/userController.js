/**
 *  feel free to make major changes; made this file as a tester only
 */

/* ------------------- */

const users = require('../models/users');

/**
 *  > for testing only, will find for a specific hard coded user
 *  > TO UPDATE: find active user based on who logged in
 */
const loadUserProfile = (req,res) => {
    const activeUser = users.findOne({ name: "@AkoSiDarna" });
    console.log(activeUser);

    res.render('profilePage', {
        user: activeUser,
    })
};