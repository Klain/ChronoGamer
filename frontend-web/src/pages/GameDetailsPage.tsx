import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchGameDetails } from '../services/api';
import {
  Container,
  Typography,
  Box,
  Button,
  CircularProgress,
} from '@mui/material';

const GameDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [game, setGame] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGameDetails = async () => {
      try {
        const gameData = await fetchGameDetails(Number(id));
        setGame(gameData.data);
        const rootElement = document.getElementById('root');
        if (rootElement) {
          rootElement.classList.add('details-page');

          if (gameData.data.cover) {
            rootElement.style.setProperty(
              '--game-cover',
              `url(https:${gameData.data.cover.url.replace('t_thumb', 't_cover_big')})`
            );
          }
        }
      } catch (err) {
        setError('Error al cargar los detalles del juego.');
      } finally {
        setLoading(false);
      }
    };

    loadGameDetails();
  }, [id]);

  if (loading) {
    return (
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography color="error" variant="h6">
          {error}
        </Typography>
        <Button onClick={() => navigate('/')} variant="contained" sx={{ marginTop: '1rem' }}>
          Volver a la Página Principal
        </Button>
      </Container>
    );
  }

  return (
    <Box
      sx={{
        position: 'relative',
        overflow:'visible'
      }}
    >
      <Box
        sx={{
          background: 'var(--game-cover) no-repeat center center / cover',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -1,
          filter: 'blur(15px)',
          opacity: 0.5,
        }}
      />
      <Container sx={{ marginTop: '2rem', position: 'relative', zIndex: 1 }}>
        <Typography color="error" variant="h6">
          {error}
        </Typography>
        <Button
          onClick={() => navigate('/')}
          variant="contained"
          sx={{ marginTop: '1rem' }}
        >
          Volver a la Página Principal
        </Button>
      </Container>
    </Box>
  );
};

export default GameDetailsPage;
