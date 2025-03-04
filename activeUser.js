/**
 *   This is a temporary file as a substitue for sessions.
 *   Get, set, clear active user.
 */
let activeUser = null;

module.exports = {
    getActiveUser: () => activeUser,
    setActiveUser: (user) => { activeUser = user; },
    clearActiveUser: () => { activeUser = null; }
};