const express = require('express');
const userRoutes = express.Router();
const multer = require('multer');
const multerImage = require('../config/multer/multerImage');
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

userRoutes.get('/showUser/:id', UserController.show);
userRoutes.get('/getUserImage/:id', UserController.getImage);
userRoutes.get('/invitations', UserController.getInvitations);
userRoutes.get('/notifications', UserController.getNotifications);

userRoutes.put('/updateUser', UserController.update);

userRoutes.post('/verifyEmailUpdate', UserController.verifyEmailUpdate);
userRoutes.post('/verifyUsernameUpdate', UserController.verifyUsernameUpdate);
userRoutes.post('/verifyPassword', UserController.verifyPassword);

userRoutes.delete('/deleteUser', UserController.delete);
userRoutes.delete('/deleteUserImage', UserController.deleteImage);

module.exports = userRoutes;