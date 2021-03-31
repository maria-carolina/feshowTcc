const express = require('express');
const organizerRoutes = express.Router();
const OrganizerController = require('../controllers/OrganizerController');

organizerRoutes.post('/updateLineup/:id', OrganizerController.updateLineup);
organizerRoutes.get('/changeStatus/:id', OrganizerController.changeStatus);
organizerRoutes.get('/eventsOrganizer/:artistId', OrganizerController.getEventsOrganizer)
organizerRoutes.put('/event/update/:id', OrganizerController.update);
organizerRoutes.get('/event/delete/:id', OrganizerController.delete);
organizerRoutes.post('/event/store', OrganizerController.store);

module.exports = organizerRoutes;