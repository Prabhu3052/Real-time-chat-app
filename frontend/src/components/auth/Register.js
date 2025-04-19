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
import './register.css'; // Import the CSS file

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { register } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        
        try {
            await register({ username, email, password });
            navigate('/chat');
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container component="main" maxWidth="xs" className="register-container">
            <Fade in={true} timeout={500}>
                <Paper elevation={6} sx={{ p: 4, mt: 8, borderRadius: 3 }} className="register-paper">
                    <Box textAlign="center" mb={3}>
                        <Typography component="h1" variant="h4" className="register-title">
                            Create Account
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Join our community today
                        </Typography>
                    </Box>
                    
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Username"
                            name="username"
                            autoComplete="username"
                            autoFocus
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            variant="outlined"
                            className="register-input"
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            variant="outlined"
                            className="register-input"
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="new-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            variant="outlined"
                            className="register-input"
                        />
                        
                        {error && (
                            <Alert severity="error" sx={{ mt: 2 }} className="register-alert">
                                {error}
                            </Alert>
                        )}
                        
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2, py: 1.5 }}
                            disabled={isLoading}
                            className="register-button"
                        >
                            {isLoading ? 'Creating Account...' : 'Sign Up'}
                        </Button>
                        
                        <Divider sx={{ my: 2 }}>OR</Divider>
                        
                        <Box textAlign="center" mt={2}>
                            <Typography variant="body2">
                                Already have an account?{' '}
                                <Button 
                                    variant="text" 
                                    onClick={() => navigate('/login')}
                                    className="register-link"
                                >
                                    Sign In
                                </Button>
                            </Typography>
                        </Box>
                    </Box>
                </Paper>
            </Fade>
        </Container>
    );
};

export default Register;