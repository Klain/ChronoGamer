//src\pages\LandingPage.tsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Button, Box } from '@mui/material';
import LoginComponent from '../components/Login';
import RegisterComponent from '../components/Register';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = React.useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/home');
    }
  }, [navigate]);

  return (

    <Box
      sx ={{
        flex:1,
        display: 'flex',
        flexDirection:'column',
        justifyContent:'space-between',
        textAlign: 'center', 
        marginTop: '4rem' 
      }}
    >
    <Box>
        <Typography variant="h3" gutterBottom>
          Bienvenido a ChronoGamer
        </Typography>
        <Typography variant="h6" paragraph>
          Explora videojuegos históricos, descubre títulos épicos y accede a los detalles
          más completos. Únete a nosotros y revive la historia de los videojuegos.
        </Typography>
      </Box>
      <Box>
        <Box sx={{ marginTop: '2rem' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setIsLogin(false)}
            sx={{ marginRight: '1rem' }}
          >
            Registrarse
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => setIsLogin(true)}
          >
            Iniciar Sesión
          </Button>
        </Box>
        <Box>
          {isLogin && (
            <LoginComponent />
          )}
          {!isLogin && (
            <RegisterComponent />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default LandingPage;
