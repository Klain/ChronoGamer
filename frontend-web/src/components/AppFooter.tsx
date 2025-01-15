import React from 'react';
import { Toolbar, Typography, Link, Box } from '@mui/material';

const AppFooter: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#333',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
        color: '#fff',
        textAlign: 'center',
        padding:'0.5rem'
      }}
    >
      <Toolbar
        sx={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Typography variant="body2" sx={{ padding: '0.5rem' }}>
          © 2025 ChronoGamer. Todos los derechos reservados.
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <Link href="/terms" underline="hover" color="inherit">
            Términos de Servicio
          </Link>
          <Link href="/privacy" underline="hover" color="inherit">
            Política de Privacidad
          </Link>
          <Link href="/support" underline="hover" color="inherit">
            Atención al Cliente
          </Link>
        </Box>
      </Toolbar>

    </Box>
  );
};

export default AppFooter;
