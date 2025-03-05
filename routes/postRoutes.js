// post routes

const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

// POST
router.post('/', postController.post_create_post);

router.get('/create', postController.post_create_get);

// Getting an entry by id
router.get('/:id', postController.post_details); 

// DELETE 
router.delete('/:id', postController.post_delete);

// draft
router.use("/delete/:postId", postController.deletePost);

module.exports = router;