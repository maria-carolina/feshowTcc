const express = require('express');
const eventRoutes = express.Router();
const multer = require('multer');
const multerEvent = require('../config/multer/multerEvent');
const EventController = require('../controllers/EventController');

eventRoutes.post('/event/store', EventController.store);
eventRoutes.post('/event/storeImage/:id', multer(multerEvent).single('file'), EventController.storeImage);
eventRoutes.put('/event/update/:id', EventController.update);
eventRoutes.get('/event/delete/:id', EventController.delete)
eventRoutes.get('/event/removeImage/:id', EventController.removeImage);
eventRoutes.get('/event/show/:id', EventController.show);
eventRoutes.get('/event/showLineup/:id', EventController.showLineup);
eventRoutes.get('/event/showPosts/:id', EventController.showPosts);
eventRoutes.get('/event/showEquipments/:id', EventController.showEquipments);

module.exports = eventRoutes;