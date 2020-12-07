const express = require('express');
const routes = express.Router();

//controllers
const UserController = require('./controllers/UserController');
const FeedController = require('./controllers/FeedController');
const EventController = require('./controllers/EventController');
const ChatController = require('./controllers/ChatController');
const OrganizerController = require('./controllers/OrganizerController');
const PostController = require('./controllers/PostController');
const ArtistController = require('./controllers/ArtistController');
const VenueController = require('./controllers/VenueController');
const OrganizationRequestController  = require('./controllers/OrganizationRequestController');

routes.get('/', (req, res) => {
    return res.json({hello:"world"})
});

routes.post('/store', UserController.store);

module.exports = routes;