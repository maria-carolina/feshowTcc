const express = require('express');
const userRoutes = express.Router();
const multer = require('multer');
const multerImage = require('../config/multer/multerImage');
const multerRider = require('../config/multer/multerRider');
const authMiddleware = require('../middlewares/auth');
const UserController = require('../controllers/UserController');

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

userRoutes.get('/showUser/:id', UserController.show);
userRoutes.get('/getUserImage/:id', UserController.getImage);
userRoutes.get('/invitations', UserController.getInvitations);
userRoutes.get('/notifications', UserController.getNotifications);

userRoutes.put('/updateGenres', UserController.updateGenres);
userRoutes.put('/updateInstruments', UserController.updateInstruments);
userRoutes.put('/updateEquipments', UserController.updateEquipments);

userRoutes.put('/updateUser', UserController.update);

userRoutes.post('/verifyEmailUpdate', UserController.verifyEmailUpdate);
userRoutes.post('/verifyUsernameUpdate', UserController.verifyUsernameUpdate);

userRoutes.delete('/deleteUser', UserController.delete)

module.exports = userRoutes;