const express = require('express');
const feedRoutes = express.Router();
const FeedController = require('../controllers/FeedController');

feedRoutes.get('/feedArtist', FeedController.feedArtist);
feedRoutes.get('/feedEvent', FeedController.feedEvent);
feedRoutes.get('/feedVenue', FeedController.feedVenue);

feedRoutes.post('/searchFeed', FeedController.search);

feedRoutes.get('/filterArtistGenre', FeedController.filterArtistGenre);
feedRoutes.get('/filterArtistCity', FeedController.filterArtistCity);
feedRoutes.get('/filterVenueGenre', FeedController.filterVenueGenre);
feedRoutes.get('/filterVenueCity', FeedController.filterVenueCity);
feedRoutes.get('/filterEventGenre', FeedController.filterEventGenre);
feedRoutes.get('/filterEventCity', FeedController.filterEventCity);
feedRoutes.get('/filterVenueEquipment', FeedController.filterEquipments);

module.exports = feedRoutes; 