// Import necessary modules and models
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const sequelize = require('../util/config');
const path = require("path");

// Helper function to check if a string is invalid (undefined or empty)
const isStringInvalid = (string) => {
    return string == undefined || string.length === 0;
}

// Get the sign-up page
const getSignUpPage = (req, res, next) => {
    // Send the sign-up page HTML file to the client.
    res.sendFile(path.join(__dirname, "../", "public", "html", "signup.html"));
};

// Create a new user in the User table
const signup = async (req, res) => {
    console.log("In controller");
    const t = await sequelize.transaction();
    try {
        const { name, email, phoneNumber, password } = req.body;

        // Check if any of the parameters are missing
        if (isStringInvalid(name) || isStringInvalid(email) || isStringInvalid(phoneNumber) || isStringInvalid(password)) {
            return res.status(400).json({ error: "Bad parameters. Something is missing" });
        }

        // Check if a user with the same email already exists
        const user = await User.findOne({ where: { email } }, { transaction: t });

        if (user) {
            return res.status(400).json({ error: 'User already exists. Please login' });
        }

        // Hash the user's password
        const hash = await bcrypt.hash(password, 10);

        // Create a new user in the User model
        const newUser = await User.create({ name, email, phoneNumber, password: hash }, { transaction: t })

        await t.commit();
        res.status(201).json({ message: 'Successfully created a new user account' });
        console.log('New user id >>>>', newUser.dataValues.id);
    } catch (err) {
        await t.rollback();
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// Generate an access token with user details
const generateAccessToken = (id, name) => {
    return jwt.sign({ userId: id, name: name }, process.env.TOKEN_SECRET);
}

// Authenticate a user and generate a token
const login = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { email, password } = req.body;

        // Check if email and password are missing
        if (isStringInvalid(email) || isStringInvalid(password)) {
            return res.status(400).json({ error: 'Email and password are missing' });
        }

        // Find the user by email
        const user = await User.findAll({ where: { email } }, { transaction: t });

        if (user.length > 0) {
            // Compare the hashed password with the provided password
            bcrypt.compare(password, user[0].password, async (err, result) => {
                if (err) {
                    throw new Error('Something went wrong');
                }
                if (result === true) {
                    await t.commit();
                    res.status(200).json({
                        message: 'User logged in successfully',
                        token: generateAccessToken(user[0].id, user[0].name)
                    });
                } else {
                    return res.status(401).json({ error: 'User not authorized' });
                }
            })
        } else {
            return res.status(404).json({ error: `User not found` });
        }
    } catch (err) {
        await t.rollback();
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// Get a list of users
const getUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(202).json({ listOfUsers: users })
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: `Internal Server Error` })
    }
}

module.exports = {
    signup,
    login,
    getUsers,
    getSignUpPage,
}
