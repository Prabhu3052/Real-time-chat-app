import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    TextField,
    Typography,
    Container,
    Paper,
    Fade,
    Alert,
    Divider
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import './login.css'; // Import the CSS file

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        
        try {
            await login({ email, password });
            navigate('/chat');
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container component="main" maxWidth="xs" className="login-container">
            <Fade in={true} timeout={500}>
                <Paper elevation={6} sx={{ p: 4, mt: 8, borderRadius: 3 }} className="login-paper">
                    <Box textAlign="center" mb={3}>
                        <Typography component="h1" variant="h4" className="login-title">
                            Welcome Back
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Sign in to continue your conversation
                        </Typography>
                    </Box>
                    
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            variant="outlined"
                            className="login-input"
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            variant="outlined"
                            className="login-input"
                        />
                        
                        {error && (
                            <Alert severity="error" sx={{ mt: 2 }} className="login-alert">
                                {error}
                            </Alert>
                        )}
                        
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2, py: 1.5 }}
                            disabled={isLoading}
                            className="login-button"
                        >
                            {isLoading ? 'Signing In...' : 'Sign In'}
                        </Button>
                        
                        <Divider sx={{ my: 2 }}>OR</Divider>
                        
                        <Box textAlign="center" mt={2}>
                            <Typography variant="body2">
                                Don't have an account?{' '}
                                <Button 
                                    variant="text" 
                                    onClick={() => navigate('/register')}
                                    className="login-link"
                                >
                                    Sign Up
                                </Button>
                            </Typography>
                        </Box>
                    </Box>
                </Paper>
            </Fade>
        </Container>
    );
};

export default Login;