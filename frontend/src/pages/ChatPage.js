import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Container,
    Badge,
    Avatar,
    Slide,
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import ChatIcon from '@mui/icons-material/Chat';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import ChatBox from '../components/chat/ChatBox';
import MessageForm from '../components/chat/MessageForm';

const ChatPage = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { socket, isConnected, joinChat } = useSocket();

    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else if (socket && isConnected) {
            joinChat(user._id);
        }
    }, [user, socket, isConnected, navigate, joinChat]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) return null;

    return (
        <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            height: '100vh',
            background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
        }}>
            <AppBar 
                position="static" 
                sx={{ 
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                }}
            >
                <Toolbar>
                    <ChatIcon sx={{ mr: 2, color: '#fff' }} />
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: '#fff' }}>
                        Real-Time Chat
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Badge
                            overlap="circular"
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            variant="dot"
                            sx={{
                                '& .MuiBadge-badge': {
                                    backgroundColor: '#44b700',
                                    color: '#44b700',
                                    boxShadow: '0 0 0 2px #fff',
                                    '&::after': {
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '100%',
                                        borderRadius: '50%',
                                        animation: 'ripple 1.2s infinite ease-in-out',
                                        border: '1px solid currentColor',
                                        content: '""',
                                    },
                                },
                                '@keyframes ripple': {
                                    '0%': {
                                        transform: 'scale(.8)',
                                        opacity: 1,
                                    },
                                    '100%': {
                                        transform: 'scale(2.4)',
                                        opacity: 0,
                                    },
                                },
                            }}
                        >
                            <Avatar sx={{ bgcolor: 'primary.main' }}>
                                {user.username.charAt(0).toUpperCase()}
                            </Avatar>
                        </Badge>
                        <Typography variant="subtitle1" sx={{ color: '#fff' }}>
                            {user.username}
                        </Typography>
                        <IconButton 
                            color="inherit" 
                            onClick={handleLogout}
                            sx={{
                                color: '#fff',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'rotate(360deg)',
                                    color: '#ff4444',
                                },
                            }}
                        >
                            <LogoutIcon />
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>
            <Container 
                maxWidth="lg" 
                sx={{ 
                    flexGrow: 1, 
                    display: 'flex', 
                    flexDirection: 'column', 
                    py: 2,
                    gap: 2,
                }}
            >
                <Slide direction="down" in={true} timeout={800}>
                    <Box sx={{ flexGrow: 1 }}>
                        <ChatBox />
                    </Box>
                </Slide>
                <Slide direction="up" in={true} timeout={800}>
                    <Box>
                        <MessageForm />
                    </Box>
                </Slide>
            </Container>
        </Box>
    );
};

export default ChatPage; 