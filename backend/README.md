# Real-Time Chat Application

A real-time chat application built with Node.js, Express, Socket.io, MongoDB, and JWT authentication.

## Features

- Real-time messaging using Socket.io
- User authentication with JWT
- MongoDB for data persistence
- Online/Offline user status
- Typing indicators
- Message history

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login user

### Messages
- `GET /api/messages` - Get all messages
- `POST /api/messages` - Send a new message

## Socket Events

### Client to Server
- `join` - Join chat room
- `sendMessage` - Send a new message
- `typing` - User is typing

### Server to Client
- `newMessage` - New message received
- `userTyping` - User is typing
- `userStatus` - User online/offline status

## Frontend

The frontend implementation is not included in this repository. You can create a React application and use the `socket.io-client` package to connect to this backend.

## License

ISC 