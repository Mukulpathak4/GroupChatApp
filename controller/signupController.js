const path = require("path");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const sequelize = require("../util/config");
const { Sequelize } = require("sequelize");
const userServices = require("../TokenGen/jwt")



const getSignUpPage = (req, res, next) => {
  // Send the login page HTML file to the client.
  res.sendFile(path.join(__dirname, "../", "public", "html", "signup.html"));
};

const postUserSignUp = async (req, res, next) => {
  try {
    // Extract user data from the request body.
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const phone = req.body.phone;

    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { phone }],
      },
    });

    if (existingUser) {
      res
        .status(409)
        .send(
          `<script>alert('This email or number is already taken. Please choose another one.'); window.location.href='/'</script>`
        );
    } else {
      bcrypt.hash(password, 10, async (err, hash) => {
        await User.create({
          name: name,
          email: email,
          phone: phone,
          password: hash,
        });
      });
      res
        .status(200)
        .send(
          `<script>alert('User Created Successfully!'); window.location.href='/'</script>`
        );
    }
   } catch (err) {
    console.error(err);
    res.status(500).send("Oops Error Occurred Try Again!");
  }
};

const postUserLogin = async (req, res, next) => {
  // Extract login email and password from the request body.
  const email = req.body.loginEmail;
  const password = req.body.loginPassword;

     try {
        if (!email || !password) {
            return res.status(400).json({ message: "Bad parameters" });
        }
        const emailorphoneSaved = await User.findOne({ where: Sequelize.or({ email: email }, { phone: email }) })
        if (!emailorphoneSaved) {
            return res.status(404).json({ message: "User Not Found. SignUp?" });
        }
        console.log(emailorphoneSaved.password);
        bcrypt.compare(password, emailorphoneSaved.password, (error, response) => {
            if (error) {
                return res.status(500).json({ message: "Something Went Wrong" });
            }
            if (response) {
                return res.status(200).json({ message: "Welcome To GossipGrid!", token: userServices.generateWebToken(emailorphoneSaved.id, emailorphoneSaved.name) });
            }
            else if (!response) {
                return res.status(401).json({ message: "You Are Not an Existing User" });
            }
        })
        // console.log(emailorphoneSaved);

    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: err });
    }

}



module.exports = {
  getSignUpPage,
  postUserSignUp,
  postUserLogin
};