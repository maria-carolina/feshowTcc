const express = require('express');
const routes = express.Router();
const multer = require('multer');
const multerImage = require('./config/multerImage');
const multerRider = require('./config/multerRider');
const authMiddleware = require('./middlewares/auth');


//controllers
const UserController = require('./controllers/UserController');
const FeedController = require('./controllers/FeedController');
const EventController = require('./controllers/EventController');
const ChatController = require('./controllers/ChatController');
const OrganizerController = require('./controllers/OrganizerController');
const PostController = require('./controllers/PostController');
const ArtistController = require('./controllers/ArtistController');
const VenueController = require('./controllers/VenueController');
const OrganizationRequestController  = require('./controllers/OrganizationRequestController');

routes.post('/store', UserController.store);
routes.post('/verifyEmail', UserController.verifyEmail);
routes.post('/verifyUsername', UserController.verifyUsername);

routes.get('/getEquipments', UserController.getEquipments);
routes.get('/getInstruments', UserController.getInstruments);
routes.get('/getGenres', UserController.getGenres); 

routes.post('/login', UserController.login);
routes.post('/recoverPassword', UserController.recoverPassword) 
routes.put('/updatePassword', UserController.updatePassword)

//routes.use(authMiddleware);

routes.post('/storeImage', multer(multerImage).single('file'), UserController.storeImage);
routes.post('/storeRider', multer(multerRider).single('file'), UserController.storeRider);

module.exports = routes;