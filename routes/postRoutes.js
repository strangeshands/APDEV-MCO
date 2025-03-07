// post routes

const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

// POST
router.get('/create', postController.post_create_get);
router.post('/', postController.post_create_post);

// Getting an entry by id
router.get('/:id', postController.post_details); 

// DELETE 
router.delete('/:id', postController.post_delete);

// draft
router.use("/delete/:postId", postController.deletePost);

router.get("/edit/:postId", postController.editPostLoad);

router.post("/edit-save/:postId", postController.editPostSave);

// Reply routes
router.get("/reply/:id", postController.reply_create_get);
router.post("/reply/:id", postController.reply_create_post);

module.exports = router;