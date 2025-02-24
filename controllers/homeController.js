const express = require('express');
const router = express.Router();

// Render the Home Page
router.get('/', (req, res) => {
    res.render('homePage', { title: "Connectify - Home" });
});

module.exports = router;

// TODO: Add relevant js here
