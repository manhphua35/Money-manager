const express = require('express');
const UserController = require('../controllers/UserController');
const UserService = require('../services/UserService');
const router = express.Router();

router.post('/register', UserController.createUser);
router.post('/login', UserController.loginUser); 
router.post('/logout', UserController.logout);
router.get('/profile', UserController.getProfile)
router.post('/updateUserData', UserController.updateDataUser)
router.post('/changePassword', UserController.changePassword)
module.exports = router;
