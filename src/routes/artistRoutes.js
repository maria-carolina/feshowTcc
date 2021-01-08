const express = require('express');
const artistRoutes = express.Router();
const ArtistController = require('../controllers/ArtistController');

artistRoutes.post('/sendSolicitation', ArtistController.sendSolicitation);

module.exports = artistRoutes;