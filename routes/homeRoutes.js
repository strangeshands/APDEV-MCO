const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');

const Post = require('../models/posts');
const User = require('../models/users');

// GET
router.get('/', homeController.homePage);
router.get('/search/suggestions', homeController.search);

module.exports = router;