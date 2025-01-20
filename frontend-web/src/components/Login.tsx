//src\pages\LoginPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/api';
import { TextField, Button, Typography, Box } from '@mui/material';

const LoginComponent: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await loginUser(username, password);
      const token = response.data.token;
      localStorage.setItem('token', token);
      setMessage(null);
      navigate('/home');
    } catch (error: any) {
      setMessage('Credenciales inválidas. Inténtalo de nuevo.');
    }
  };

  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        paddingBottom: {xs:'1rem', md:'3rem'},
      }}
    >
      <Box
        sx={{ 
          marginTop: {xs:'1rem', md:'3rem'},
        }}
      >
        <Typography variant="h4" gutterBottom>
          Iniciar Sesión
        </Typography>
        {message && (
          <Typography color="error" paragraph>
            {message}
          </Typography>
        )}
        <Box component="form" onSubmit={handleLogin} 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '1rem' }}
        >
          <TextField
            label="Usuario"
            variant="outlined"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <TextField
            label="Contraseña"
            type="password"
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" variant="contained" color="primary">
            Iniciar Sesión
          </Button>
        </Box>
      </Box>
    </Box>
    
  );
};

export default LoginComponent;
