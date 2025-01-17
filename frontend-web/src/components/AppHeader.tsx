import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Typography, Box, Toolbar } from '@mui/material';

const AppHeader: React.FC = () => {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <Box
      sx={{
        background: '#333',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
      }}
    >
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        {/* Logo */}
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            color: '#fff',
            textDecoration: 'none',
          }}
        >
          ChronoGamer
        </Typography>

        {/* Navegación */}
        <Box component="nav" sx={{ display: 'flex', alignItems: 'center' }}>
          {!token ? (
            <>
              <Button component={Link} to="/login" color="inherit">
                Iniciar Sesión
              </Button>
              <Button component={Link} to="/register" color="inherit">
                Registrarse
              </Button>
            </>
          ) : (
            <Button onClick={handleLogout} color="inherit">
              Cerrar Sesión
            </Button>
          )}
        </Box>
        
      </Toolbar>
    </Box>
  );
};

export default AppHeader;
