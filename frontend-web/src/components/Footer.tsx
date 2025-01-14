import React from 'react';
import { Box, Typography, Link } from '@mui/material';

const Footer: React.FC = () => {
  return (
    <Box
      sx={{
        backgroundColor: '#333',
        color: '#fff',
        padding: '1rem',
        textAlign: 'center',
        marginTop: 'auto',
      }}
    >
      <Typography variant="body2" sx={{ marginBottom: '0.5rem' }}>
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
    </Box>
  );
};

export default Footer;
