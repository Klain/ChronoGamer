import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Box } from '@mui/material';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/home');
    }
  }, [navigate]);

  return (
    <Container maxWidth="md" sx={{ textAlign: 'center', marginTop: '4rem' }}>
      <Typography variant="h3" gutterBottom>
        Bienvenido a ChronoGamer
      </Typography>
      <Typography variant="h6" paragraph>
        Explora videojuegos históricos, descubre títulos épicos y accede a los detalles
        más completos. Únete a nosotros y revive la historia de los videojuegos.
      </Typography>
      <Box sx={{ marginTop: '2rem' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/register')}
          sx={{ marginRight: '1rem' }}
        >
          Registrarse
        </Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => navigate('/login')}
        >
          Iniciar Sesión
        </Button>
      </Box>
    </Container>
  );
};

export default LandingPage;
