const express = require('express');
const postRoutes = express.Router();
const PostController = require('../controllers/PostController');

postRoutes.post('/createPost', PostController.store);
postRoutes.delete('/deletePost/:id', PostController.delete);
postRoutes.put('/updatePost', PostController.update);

module.exports = postRoutes;