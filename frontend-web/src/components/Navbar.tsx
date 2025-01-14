import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Button, Typography } from '@mui/material';

const Navbar: React.FC = () => {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <AppBar position="static" sx={{ background: '#333' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6" component={Link} to="/" sx={{ color: 'white', textDecoration: 'none' }}>
          ChronoGamer
        </Typography>
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
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
