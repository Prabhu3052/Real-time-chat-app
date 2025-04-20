import React, { useState, useEffect, useRef } from 'react';
import { Box, TextField, IconButton, Zoom } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useSocket } from '../../context/SocketContext';
import { useAuth } from '../../context/AuthContext';
import { keyframes } from '@mui/system';

const pulseAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
`;

const MessageForm = ({ setMessages }) => {
    const [message, setMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const typingTimeout = useRef(null);
    const { socket, sendMessage, sendTypingStatus } = useSocket();
    const { user } = useAuth();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (message.trim()) {
            sendMessage({
                content: message,
                sender: user._id,
            });
            setMessage('');
        }
    };

    const handleTyping = () => {
        if (!isTyping) {
            setIsTyping(true);
            sendTypingStatus({
                userId: user._id,
                username: user.username,
            });
        }

        if (typingTimeout.current) {
            clearTimeout(typingTimeout.current);
        }

        typingTimeout.current = setTimeout(() => {
            setIsTyping(false);
        }, 3000);
    };

    useEffect(() => {
        // Listen for new messages from backend
        socket?.on('newMessage', (newMessage) => {
            console.log('Received new message:', newMessage);
            setMessages((prevMessages) => [...prevMessages, newMessage]); // Update messages
        });

        return () => {
            socket?.off('newMessage'); // Cleanup when component unmounts
        };
    }, [socket]);

    useEffect(() => {
        return () => {
            if (typingTimeout.current) {
                clearTimeout(typingTimeout.current);
            }
        };
    }, []);

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
                display: 'flex',
                alignItems: 'center',
                p: 2,
                bgcolor: 'background.paper',
                borderRadius: 2,
                boxShadow: 3,
                position: 'relative',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '2px',
                    background: 'linear-gradient(90deg, #00d2ff 0%, #3a7bd5 100%)',
                },
            }}
        >
            <TextField
                fullWidth
                variant="outlined"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => {
                    setMessage(e.target.value);
                    handleTyping();
                }}
                sx={{
                    mr: 1,
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            transform: 'translateY(-1px)',
                            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                        },
                        '&.Mui-focused': {
                            transform: 'translateY(-1px)',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        },
                    },
                }}
            />
            <Zoom in={Boolean(message.trim())}>
                <IconButton
                    type="submit"
                    color="primary"
                    disabled={!message.trim()}
                    sx={{
                        bgcolor: 'primary.main',
                        color: 'white',
                        transition: 'all 0.3s ease',
                        animation: message.trim() ? `${pulseAnimation} 2s infinite` : 'none',
                        '&:hover': {
                            bgcolor: 'primary.dark',
                            transform: 'scale(1.1)',
                        },
                        '&:disabled': {
                            bgcolor: 'grey.300',
                        },
                    }}
                >
                    <SendIcon />
                </IconButton>
            </Zoom>
        </Box>
    );
};

export default MessageForm;
