const express = require('express');
const feedRoutes = express.Router();
const FeedController = require('../controllers/FeedController');

feedRoutes.get('/feedArtist', FeedController.feedArtist);
feedRoutes.get('/feedEvent', FeedController.feedEvent);
feedRoutes.get('/feedVenue', FeedController.feedVenue);
feedRoutes.get('/feedProducer', FeedController.feedProducer);
feedRoutes.post('/searchFeed', FeedController.search);

module.exports = feedRoutes;