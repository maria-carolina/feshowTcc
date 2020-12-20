const express = require('express');
const routes = express.Router();
const authMiddleware = require('../middlewares/auth');

//Routes
const artistRoutes = require('./artistRoutes');
const chatRoutes = require('./chatRoutes');
const eventRoutes = require('./eventRoutes');
const feedRoutes = require('./feedRoutes');
const orgRequestRoutes = require('./organizationRequestRoutes');
const organizerRoutes = require('./organizerRoutes');
const postRoutes = require('./postRoutes');
const userRoutes = require('./userRoutes');
const venueRoutes = require('./venueRoutes');

routes.use(userRoutes);

routes.use(authMiddleware);

routes.use(artistRoutes);
routes.use(chatRoutes);
routes.use(eventRoutes);
routes.use(feedRoutes);
routes.use(orgRequestRoutes);
routes.use(organizerRoutes);
routes.use(postRoutes);

routes.use(venueRoutes);

module.exports = routes;