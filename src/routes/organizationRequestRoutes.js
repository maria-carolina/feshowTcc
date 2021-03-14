const express = require('express');
const orgRequestRoutes = express.Router();
const OrgRequestController = require('../controllers/OrganizationRequestController');

orgRequestRoutes.post('/sendOrganizationRequest', OrgRequestController.sendOrganizationRequest);
orgRequestRoutes.get('/indexRequests', OrgRequestController.index);
orgRequestRoutes.delete('/refuseSolicitation/:idSolicitation', OrgRequestController.refuseSolicitation);
orgRequestRoutes.post('/acceptSolicitation/:idSolicitation', OrgRequestController.acceptSolicitation);

module.exports = orgRequestRoutes;