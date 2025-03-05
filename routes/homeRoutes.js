const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');
const Post = require('../models/posts');
const User = require('../models/users');


// GET
router.get('/', homeController.homePage);

router.get('/search/suggestions', async (req, res) => {
    try {
        const query = req.query.q.trim();
        const results = { tags: [], authors: [] };

        if (!query) return res.json(results);

        if (query.startsWith('#')) {
            const tagSearch = query.slice(1);
            results.tags = await Post.aggregate([
                { $unwind: "$tags" },
                { $match: { tags: { $regex: `^#${tagSearch}`, $options: 'i' } } },
                { $group: { _id: "$tags" } },
                { $limit: 5 }
            ]).then(tags => tags.map(t => t._id));
        } 
        else if (query.startsWith('@')) {
            const usernameSearch = query.slice(1);
            results.authors = await User.find({
                username: { $regex: `@${usernameSearch}`, $options: 'i' }
            }).limit(5);
        }
        else {
            // Search both tags and users for general text
            results.tags = await Post.aggregate([
                { $unwind: "$tags" },
                { $match: { tags: { $regex: query, $options: 'i' } } },
                { $group: { _id: "$tags" } },
                { $limit: 3 }
            ]).then(tags => tags.map(t => t._id));

            results.authors = await User.find({
                username: { $regex: query, $options: 'i' }
            }).limit(2);
        }

        res.json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;

