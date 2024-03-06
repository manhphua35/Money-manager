const express = require('express');
const UserController = require('../controllers/UserController');
const router = express.Router();

router.post('/register', UserController.createUser);
router.post('/login', UserController.loginUser); 
router.post('/logout', UserController.logout);

module.exports = router;
