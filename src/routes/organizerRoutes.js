const express = require('express');
const organizerRoutes = express.Router();
const OrganizerController = require('../controllers/OrganizerController');

organizerRoutes.post('/searchArtist/:id', OrganizerController.search);
organizerRoutes.get('/getSuggestions/:id', OrganizerController.getSuggestions);
organizerRoutes.post('/storeInvitation', OrganizerController.store);
organizerRoutes.post('/cancelInvitation', OrganizerController.cancelInvitation);
organizerRoutes.post('/refuseInvitation', OrganizerController.refuseInvitation);
organizerRoutes.post('/acceptParticipation', OrganizerController.acceptParticipation);
organizerRoutes.post('/updateLineup/:id', OrganizerController.updateLineup);
organizerRoutes.post('/removeArtist', OrganizerController.removeArtist);

module.exports = organizerRoutes;