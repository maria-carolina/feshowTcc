const express = require('express');
const eventRoutes = express.Router();
const multer = require('multer');
const multerEvent = require('../config/multer/multerEvent');
const EventController = require('../controllers/EventController');

eventRoutes.post('/event/store', EventController.store);
eventRoutes.post('/event/storeImage/:id', multer(multerEvent).single('file'), EventController.storeImage);
eventRoutes.get('/event/removeImage/:id', EventController.removeImage);

module.exports = eventRoutes;