import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const newSocket = io('https://real-time-chat-app-mxah.onrender.com', { // Your deployed backend URL here
            autoConnect: true,
            transports: ['websocket'],
        });

        newSocket.on('connect', () => {
            setIsConnected(true);
            console.log('Connected to socket server');
        });

        newSocket.on('disconnect', () => {
            setIsConnected(false);
            console.log('Disconnected from socket server');
        });

        setSocket(newSocket);

        return () => {
            newSocket.close();
        };
    }, []);

    const joinChat = (userId) => {
        if (socket) {
            console.log('Joining chat with userId:', userId);
            socket.emit('join', userId);
        }
    };

    const sendMessage = (message) => {
        if (socket) {
            console.log('Sending message:', message);
            socket.emit('sendMessage', message);
        }
    };

    const sendTypingStatus = (data) => {
        if (socket) {
            socket.emit('typing', data);
        }
    };

    const value = {
        socket,
        isConnected,
        joinChat,
        sendMessage,
        sendTypingStatus,
    };

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    );
};
