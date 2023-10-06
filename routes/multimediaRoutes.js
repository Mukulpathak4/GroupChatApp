const express = require('express');

const fileController = require('../controller/multimediaController');

const authenticateMiddleware = require('../authentication/auth');

const router = express.Router();

router.post('/file/:groupId',authenticateMiddleware.authenticate, fileController.postMediaFile)

module.exports = router;