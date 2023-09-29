const express = require("express");
const router = express.Router();
const chatController = require("../controller/chatController");
const userAuthentication = require("../authentication/auth");

router.post("/send-msg", userAuthentication, chatController.send_msg);
router.get("/getAllChats", userAuthentication, chatController.getAllChats);
router.get("/getUpdate/:lastMsgId", userAuthentication, chatController.getUpdate);
router.post("/createGroup", userAuthentication, chatController.createGroup);
router.get("/getAllGroups", userAuthentication, chatController.getAllGroups);
router.post("/addmember", userAuthentication, chatController.addmember);



module.exports = router;