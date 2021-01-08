const express = require('express');
const orgRequestRoutes = express.Router();
const OrgRequestController = require('../controllers/OrganizationRequestController');

orgRequestRoutes.post('/sendOrganizationRequest', OrgRequestController.sendOrganizationRequest);

module.exports = orgRequestRoutes;