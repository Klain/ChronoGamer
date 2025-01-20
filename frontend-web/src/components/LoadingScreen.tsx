//src\components\LoadingScreen.tsx

import React, { useEffect, useState } from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';

const LoadingScreen: React.FC<{ message?: string; adImage?: string }> = ({ message, adImage }) => {
  const [progress, setProgress] = useState(0);
  const [dotCount, setDotCount] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setDotCount((prev) => (prev + 1) % 4); 
    }, 500);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          clearInterval(timer);
          return 100;
        }
        const diff = Math.random() * 100;
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
        flex:1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: '#000',
        color: '#fff',
        textAlign: 'center',
        position: 'relative',
        padding: '2rem',

      }}
    >
      <Box
        sx={{
          display:'flex',
          flexDirection: 'row-reverse',
          width: '80%',
        }}
      >
        <Typography
          variant="h4"
        >
          {message || 'Loading'}
          <Box
            component="span"
            sx={{
              display: 'inline-block',
              width: '1em',
              textAlign: 'left',
            }}
          >
            {'.'.repeat(dotCount)}
          </Box>
        </Typography>
      </Box>


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
