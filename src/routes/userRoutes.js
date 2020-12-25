const express = require('express');
const userRoutes = express.Router();
const multer = require('multer');
const multerImage = require('../config/multer/multerImage');
const multerRider = require('../config/multer/multerRider');
const authMiddleware = require('../middlewares/auth');


//controllers
const UserController = require('../controllers/UserController');
const FeedController = require('../controllers/FeedController');
const EventController = require('../controllers/EventController');
const ChatController = require('../controllers/ChatController');
const OrganizerController = require('../controllers/OrganizerController');
const PostController = require('../controllers/PostController');
const ArtistController = require('../controllers/ArtistController');
const VenueController = require('../controllers/VenueController');
const OrganizationRequestController  = require('../controllers/OrganizationRequestController');

userRoutes.post('/store', UserController.store);
userRoutes.post('/verifyEmail', UserController.verifyEmail);
userRoutes.post('/verifyUsername', UserController.verifyUsername);

userRoutes.get('/getEquipments', UserController.getEquipments);
userRoutes.get('/getInstruments', UserController.getInstruments);
userRoutes.get('/getGenres', UserController.getGenres); 

userRoutes.post('/login', UserController.login);
userRoutes.post('/recoverPassword', UserController.recoverPassword) 
userRoutes.put('/updatePassword', UserController.updatePassword)

userRoutes.use(authMiddleware);

userRoutes.post('/storeImage', multer(multerImage).single('file'), UserController.storeImage);
userRoutes.post('/storeRider', multer(multerRider).single('file'), UserController.storeRider);

module.exports = userRoutes;