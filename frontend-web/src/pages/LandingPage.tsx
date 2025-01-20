//src\pages\LandingPage.tsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Button, Box } from '@mui/material';
import LoginComponent from '../components/Login';
import RegisterComponent from '../components/Register';
import GameCardPro from '../components/GameCardPro';

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
        flexDirection: {xs:'column', md:'row'},
        justifyContent:'space-between',
        textAlign: 'center', 
        marginTop: {xs:'1rem', md:'3rem'},
      }}
    >
      <Box 
        sx={{
          width:{xs:'auto', md:'40%'},
          padding: '1rem'
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
      <Box 
        sx={{
          width:{xs:'auto', md:'60%'},
          padding: '1rem'
        }}
      >
        <GameCardPro />
      </Box>
    </Box>
  );
};

export default LandingPage;
