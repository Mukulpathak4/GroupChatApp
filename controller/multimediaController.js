// Import necessary modules and models
const Chats = require('../models/chatModel');
const S3service = require('../sevice/s3Bucket'); // Import a service for handling S3 file uploads

// Post a media file URL to the Chats table
const postMediaFile = async (req, res) => {
    try {
        const { groupId } = req.params; // Get the groupId from the request parameters
        const userId = req.user.id; // Get the userId from the user object (presumably set by a previous middleware)
        const name = req.user.name; // Get the user's name from the user object
        const file = req.file.buffer; // Get the file data from the request's file buffer
        const fileName = `${userId} ${req.file.originalname}`; // Generate a unique file name

        // Upload the file to an S3 bucket using the S3 service
        const fileUrl = await S3service.uploadToS3(file, fileName);

        // Create a new chat message in the Chats model with the file URL as the message content
        const postFile = await Chats.create({ message: fileUrl, sender: name, groupId: Number(groupId), userId });

        // Respond with a success message and the created chat message
        res.status(202).json({ files: postFile, message: `File sent successfully` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: `Internal Server Error` });
    }
}

// Export the postMediaFile function for use in other parts of the application
module.exports = {
    postMediaFile
}
