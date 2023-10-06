const express = require('express');

const userController = require('../controller/signupController');

const router = express.Router();

router.get("/", userController.getSignUpPage);

router.post('/signup', userController.signup);

router.post('/login', userController.login);

router.get('/users', userController.getUsers);

module.exports = router;