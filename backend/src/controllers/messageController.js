const Message = require('../models/Message');
const User = require('../models/User');

const getMessages = async (req, res) => {
    try {
        const messages = await Message.find()
            .populate('sender', 'username')
            .sort({ createdAt: 1 });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const sendMessage = async (req, res) => {
    try {
        const { content, room } = req.body;
        const message = new Message({
            sender: req.user._id,
            content,
            room: room || 'general'
        });

        await message.save();
        const populatedMessage = await Message.populate(message, { path: 'sender', select: 'username' });
        
        res.status(201).json(populatedMessage);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    getMessages,
    sendMessage
}; 