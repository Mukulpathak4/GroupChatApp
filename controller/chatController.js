// Import necessary modules and models
const Chat = require('../models/chatModel');
const ArchivedChat = require('../models/archivedChatModel');

// Post a text message to the Chats table
const postMessage = async (req, res) => {
    try {
        // Extract data from the request body
        const { textMessage, groupId } = req.body;

        // Get the user's name from the request object
        const name = req.user.name;

        // Create a new chat message in the Chat model
        const chats = await Chat.create({
            message: textMessage,
            sender: name,
            groupId: groupId,
            userId: req.user.id
        });

        // Respond with a success message and the created chat message
        res.status(201).json({ textMessage: chats, message: 'Successfully sent message' });

    } catch (err) {
        // Handle errors and respond with a 500 Internal Server Error
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// Get old messages from the Chats table based on groupId
const getMessages = async (req, res) => {
    try {
        // Extract the groupId from the request parameters
        const { groupId } = req.params;

        // Find all chat messages with the specified groupId
        const textMessages = await Chat.findAll({ where: { groupId } });

        // Check if there are any messages
        if (textMessages.length > 0) {
            return res.status(202).json({ textMessages });
        } else {
            // If there are no messages, return a message indicating that
            return res.status(201).json({ message: 'There are no previous messages' });
        }
    } catch (err) {
        // Handle errors and respond with a 500 Internal Server Error
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// Export the postMessage and getMessages functions for use in other parts of the application
module.exports = {
    postMessage,
    getMessages,
}
