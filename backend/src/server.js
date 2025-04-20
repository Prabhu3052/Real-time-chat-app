const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes');
const Message = require('./models/Message');
const User = require('./models/User');

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: 'https://real-time-chat-app-eight-dusky.vercel.app/',
        methods: ['GET', 'POST']
    }
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);

// Store connected users
const connectedUsers = new Map();

// Socket.io connection
io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('join', async (userId) => {
        try {
            console.log('User joining:', userId);
            connectedUsers.set(socket.id, userId);
            await User.findByIdAndUpdate(userId, { isOnline: true });
            io.emit('userStatus', { userId, isOnline: true });
        } catch (error) {
            console.error('Error updating user status:', error);
        }
    });

    socket.on('sendMessage', async (message) => {
        try {
            console.log('Received message:', message);
            const newMessage = new Message(message);
            await newMessage.save();
            const populatedMessage = await Message.findById(newMessage._id).populate('sender', 'username');
            console.log('Broadcasting message:', populatedMessage);
            io.emit('newMessage', populatedMessage);
        } catch (error) {
            console.error('Error saving/sending message:', error);
        }
    });

    socket.on('typing', (data) => {
        socket.broadcast.emit('userTyping', data);
    });

    socket.on('disconnect', async () => {
        console.log('Client disconnected:', socket.id);
        try {
            const userId = connectedUsers.get(socket.id);
            if (userId) {
                await User.findByIdAndUpdate(userId, { isOnline: false });
                io.emit('userStatus', { userId, isOnline: false });
                connectedUsers.delete(socket.id);
            }
        } catch (error) {
            console.error('Error updating user status:', error);
        }
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 