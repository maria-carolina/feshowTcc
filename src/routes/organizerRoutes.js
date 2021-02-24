const express = require('express');
const organizerRoutes = express.Router();
const OrganizerController = require('../controllers/OrganizerController');

organizerRoutes.post('/searchArtist/:id', OrganizerController.search);
organizerRoutes.get('/getSuggestions/:id', OrganizerController.getSuggestions);
organizerRoutes.post('/storeInvitation', OrganizerController.store);
organizerRoutes.post('/removeAssociation', OrganizerController.removeAssociation);
organizerRoutes.post('/acceptParticipation', OrganizerController.acceptParticipation);
organizerRoutes.post('/updateLineup/:id', OrganizerController.updateLineup);
organizerRoutes.get('/changeStatus/:id', OrganizerController.changeStatus);
organizerRoutes.get('/eventsOrganizer/:artistId', OrganizerController.getEventsOrganizer)

module.exports = organizerRoutes;