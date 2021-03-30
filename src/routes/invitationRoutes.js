const express = require('express');
const invitationRoutes = express.Router();
const InvitationController = require('../controllers/InvitationController');

invitationRoutes.post('/searchArtist/:id', InvitationController.search);
invitationRoutes.get('/getSuggestions/:id', InvitationController.getSuggestions);
invitationRoutes.post('/storeInvitation', InvitationController.store);
invitationRoutes.post('/removeAssociation', InvitationController.removeAssociation);
invitationRoutes.post('/acceptParticipation', InvitationController.acceptParticipation);
invitationRoutes.post('/sendSolicitation', InvitationController.sendSolicitation);

module.exports = invitationRoutes;