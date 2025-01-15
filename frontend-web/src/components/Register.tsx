//src\pages\RegisterPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser , loginUser } from '../services/api';
import { Container, TextField, Button, Typography, Box } from '@mui/material';


const RegisterComponent: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const register = await registerUser(username, password);
      if(register){
        const response = await loginUser(username, password);
        const token = response.data.token;
        localStorage.setItem('token', token);
        setMessage(null);
        navigate('/home');
      }
    } catch (error: any) {
      setMessage('Error al registrar el usuario. Intenta con otro nombre de usuario.');
    }
  };

  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: '0 0 2rem 0'
      }}
    >
      {message && <p>{message}</p>}
      <Container maxWidth="sm" 
        sx={{ 
          marginTop: '4rem' 
        }}
      >
        <Typography variant="h4" gutterBottom>
          Registrarse
        </Typography>
        {message && (
          <Typography color="error" paragraph>
            {message}
          </Typography>
        )}
        <Box component="form" onSubmit={handleRegister} sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
            Registrarse
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default RegisterComponent;
