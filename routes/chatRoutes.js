const express = require("express");
const router = express.Router();
const chatController = require("../controller/chatController");
const userAuthentication = require("../authentication/auth");

router.post("/sendMessage", userAuthentication, chatController.sendMessage);

module.exports = router;