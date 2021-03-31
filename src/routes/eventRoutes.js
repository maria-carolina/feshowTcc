const express = require('express');
const eventRoutes = express.Router();
const EventController = require('../controllers/EventController');

eventRoutes.get('/event/show/:id', EventController.show);
eventRoutes.get('/event/showLineup/:id', EventController.showLineup);
eventRoutes.get('/event/showPosts/:id', EventController.showPosts);
eventRoutes.get('/event/showEquipments/:id', EventController.showEquipment);
eventRoutes.get('/event/getDateTime/:id', EventController.getDateTime);
eventRoutes.get('/futureEventsOrganizer/:page', EventController.getFutureEventsOrganizer);
eventRoutes.get('/futureEventsParticipation/:page', EventController.getFutureEventsParticipation);
eventRoutes.get('/pastEvents/:id/:page', EventController.getPastEvents)
eventRoutes.get('/previewPastEvents/:id/', EventController.previewPastEvents)
eventRoutes.get('/schedule/:id', EventController.getSchedule);

module.exports = eventRoutes;