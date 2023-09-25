const express = require("express");

const router = express.Router();

const signupController = require("../controller/signupController");


router.use(express.static("public"));

router.get("/", signupController.getSignUpPage);

router.get("/signUp", signupController.getSignUpPage);

router.post("/signUp", signupController.postUserSignUp);

router.post("/login", signupController.postUserLogin);

module.exports = router;