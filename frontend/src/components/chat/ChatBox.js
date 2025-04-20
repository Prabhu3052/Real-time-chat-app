import React, { useEffect, useRef, useState } from 'react';
import {
    Box,
    Paper,
    Typography,
    List,
    ListItem,
    ListItemText,
    Divider,
    Fade,
    Slide,
} from '@mui/material';
import { useSocket } from '../../context/SocketContext';
import { useAuth } from '../../context/AuthContext';
import { messageService } from '../../services/api';
import { keyframes } from '@mui/system';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const typingAnimation = keyframes`
  0% { opacity: 0.3; }
  50% { opacity: 1; }
  100% { opacity: 0.3; }
`;

const ChatBox = () => {
    const [messages, setMessages] = useState([]);
    const [typingUsers, setTypingUsers] = useState([]);
    const messagesEndRef = useRef(null);
    const { socket, isConnected } = useSocket();
    const { user } = useAuth();

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await messageService.getMessages();
                console.log('Fetched messages:', response.data);
                setMessages(response.data);
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };

        fetchMessages();
    }, []);

    useEffect(() => {
        if (socket && isConnected) {
            console.log('Setting up socket listeners');
            
            socket.on('newMessage', (message) => {
                console.log('Received new message:', message);
                setMessages((prevMessages) => [...prevMessages, message]);
            });

            socket.on('userTyping', (data) => {
                if (data.userId !== user._id) {
                    setTypingUsers((prev) => {
                        if (!prev.includes(data.username)) {
                            return [...prev, data.username];
                        }
                        return prev;
                    });
                    setTimeout(() => {
                        setTypingUsers((prev) =>
                            prev.filter((username) => username !== data.username)
                        );
                    }, 3000);
                }
            });

            return () => {
                console.log('Cleaning up socket listeners');
                socket.off('newMessage');
                socket.off('userTyping');
            };
        }
    }, [socket, isConnected, user._id]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <Box 
            sx={{ 
                height: '70vh', 
                overflow: 'auto', 
                p: 2,
                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                borderRadius: 2,
                '&::-webkit-scrollbar': {
                    width: '8px',
                },
                '&::-webkit-scrollbar-track': {
                    background: '#f1f1f1',
                    borderRadius: '4px',
                },
                '&::-webkit-scrollbar-thumb': {
                    background: '#888',
                    borderRadius: '4px',
                    '&:hover': {
                        background: '#555',
                    },
                },
            }}
        >
            <Paper 
                elevation={3} 
                sx={{ 
                    p: 2, 
                    height: '100%',
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 2,
                }}
            >
                <List>
                    {messages.map((message, index) => (
                        <Fade in timeout={500} key={message._id || index}>
                            <div>
                                <Slide direction={message.sender._id === user._id ? "left" : "right"} in timeout={500}>
                                    <ListItem
                                        alignItems="flex-start"
                                        sx={{
                                            justifyContent:
                                                message.sender._id === user._id
                                                    ? 'flex-end'
                                                    : 'flex-start',
                                            animation: `${fadeIn} 0.5s ease-out`,
                                        }}
                                    >
                                        <ListItemText
                                            primary={
                                                <Typography
                                                    variant="subtitle2"
                                                    color="text.secondary"
                                                    sx={{ mb: 0.5 }}
                                                >
                                                    {message.sender.username}
                                                </Typography>
                                            }
                                            secondary={
                                                <Box
                                                    sx={{
                                                        display: 'inline-block',
                                                        p: 1.5,
                                                        borderRadius: 2,
                                                        maxWidth: '80%',
                                                        wordBreak: 'break-word',
                                                        bgcolor: message.sender._id === user._id
                                                            ? 'primary.main'
                                                            : 'grey.100',
                                                        color: message.sender._id === user._id
                                                            ? 'white'
                                                            : 'text.primary',
                                                        boxShadow: 1,
                                                        position: 'relative',
                                                        '&::before': message.sender._id === user._id ? {
                                                            content: '""',
                                                            position: 'absolute',
                                                            right: -10,
                                                            top: '50%',
                                                            transform: 'translateY(-50%)',
                                                            border: '10px solid transparent',
                                                            borderLeft: '10px solid',
                                                            borderLeftColor: 'primary.main',
                                                        } : {
                                                            content: '""',
                                                            position: 'absolute',
                                                            left: -10,
                                                            top: '50%',
                                                            transform: 'translateY(-50%)',
                                                            border: '10px solid transparent',
                                                            borderRight: '10px solid',
                                                            borderRightColor: 'grey.100',
                                                        },
                                                    }}
                                                >
                                                    <Typography variant="body1">
                                                        {message.content}
                                                    </Typography>
                                                </Box>
                                            }
                                        />
                                    </ListItem>
                                </Slide>
                                {index < messages.length - 1 && (
                                    <Divider sx={{ my: 1, opacity: 0.3 }} />
                                )}
                            </div>
                        </Fade>
                    ))}
                </List>
                {typingUsers.length > 0 && (
                    <Typography 
                        variant="caption" 
                        color="text.secondary"
                        sx={{
                            display: 'block',
                            p: 1,
                            animation: `${typingAnimation} 1.5s ease-in-out infinite`,
                        }}
                    >
                        {typingUsers.join(', ')} is typing...
                    </Typography>
                )}
                <div ref={messagesEndRef} />
            </Paper>
        </Box>
    );
};

export default ChatBox;
