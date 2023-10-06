// Import necessary modules and models
const User = require('../models/userModel');
const Group = require('../models/groupModel');
const jwt = require('jsonwebtoken');
require('dotenv').config(); // Load environment variables from a .env file

// Middleware function for authentication
const authenticate = async (req, res, next) => {
    try {
        // Get the token from the 'Authorization' header in the HTTP request
        const token = req.header('Authorization');
        console.log(token); // Log the token to the console for debugging

        // Verify the token using the secret from the environment variables
        const user = jwt.verify(token, process.env.TOKEN_SECRET);
        const group = jwt.verify(token, process.env.TOKEN_SECRET);

        // Log user information to the console for debugging
        console.log('userID >>>>', user.userId, user.name);

        // Find the user and group in the database based on the decoded token
        const users = await User.findByPk(user.userId);
        const groups = await Group.findByPk(group.GroupId);

        // Log the retrieved user and group information for debugging
        console.log('User:', JSON.stringify(users));
        console.log('Group:', JSON.stringify(groups));

        // Attach the user and group information to the request object for future middleware or route handlers
        req.user = users;
        req.group = groups;

        // Call the next middleware or route handler
        next();
    } catch (err) {
        // Handle any errors that occur during authentication
        console.error(err); // Log the error to the console
        return res.status(401).json({ success: false }); // Return a 401 Unauthorized status response
    }
}

// Export the authenticate middleware for use in other parts of the application
module.exports = {
    authenticate
}
