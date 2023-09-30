const express = require("express");
const router = express.Router();
const chatControl = require("../controller/chatController");
const userAuthentication = require("../authentication/auth");

router.get("/getPublicToken", userAuthentication, chatControl.getGroupToken);
router.get("/getGroupToken/:groupId", userAuthentication, chatControl.getGroupToken);

module.exports = router;