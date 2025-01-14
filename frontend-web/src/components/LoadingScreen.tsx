//src\components\LoadingScreen.tsx

import React, { useEffect, useState } from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';

const LoadingScreen: React.FC<{ message?: string; adImage?: string }> = ({ message, adImage }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          clearInterval(timer);
          return 100;
        }
        const diff = Math.random() * 10;
        return Math.min(oldProgress + diff, 100);
      });
    }, 500);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
        color: '#fff',
        textAlign: 'center',
        position: 'relative',
      }}
    >
      <Typography variant="h4" gutterBottom>
        {message || 'Cargando...'}
      </Typography>

      <Box sx={{ width: '80%', marginTop: '1rem' }}>
        <LinearProgress variant="determinate" value={progress} color="primary" />
      </Box>

      {adImage && (
        <Box
          sx={{
            position: 'absolute',
            bottom: '10%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography variant="body2" gutterBottom>
            Publicidad
          </Typography>
          <img
            src={adImage}
            alt="Publicidad"
            style={{
              maxWidth: '300px',
              borderRadius: '8px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default LoadingScreen;
