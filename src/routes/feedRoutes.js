const express = require('express');
const feedRoutes = express.Router();
const FeedController = require('../controllers/FeedController');

feedRoutes.get('/feedArtist', FeedController.feedArtist);

module.exports = feedRoutes;