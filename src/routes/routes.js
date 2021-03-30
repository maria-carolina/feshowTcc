const express = require('express');
const routes = express.Router();
const authMiddleware = require('../middlewares/auth');

//Routes
const eventRoutes = require('./eventRoutes');
const feedRoutes = require('./feedRoutes');
const invitationRoutes = require('./invitationRoutes');
const orgRequestRoutes = require('./organizationRequestRoutes');
const organizerRoutes = require('./organizerRoutes');
const postRoutes = require('./postRoutes');
const userRoutes = require('./userRoutes');

routes.use(userRoutes);

routes.use(authMiddleware);

routes.use(eventRoutes);
routes.use(invitationRoutes);
routes.use(feedRoutes);
routes.use(orgRequestRoutes);
routes.use(organizerRoutes);
routes.use(postRoutes);

module.exports = routes;