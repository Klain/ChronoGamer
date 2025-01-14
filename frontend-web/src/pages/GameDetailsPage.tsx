import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchGameDetails } from '../services/api';
import {
  Container,
  Typography,
  Box,
  Button,
  CircularProgress,
  Grid,
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
      <Container sx={{ marginTop: '2rem' }}>
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
    <Container sx={{ marginTop: '2rem', marginBottom: '2rem' }}>
      {game && (
        <>
          {/* Encabezado con el título */}
          <Box
            sx={{
              backgroundColor: '#333',
              color: '#fff',
              padding: '1rem',
              borderRadius: '8px',
              textAlign: 'center',
              marginBottom: '2rem',
            }}
          >
            <Typography variant="h4">{game.name}</Typography>
          </Box>

          {/* Diseño dividido: portada y detalles */}
          <Grid container spacing={4}>
            {/* Portada */}
            <Grid item xs={12} md={4}>
              {game.cover ? (
                <img
                  src={`https:${game.cover.url.replace('t_thumb', 't_cover_big')}`}
                  alt="Portada del juego"
                  style={{ width: '100%', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }}
                />
              ) : (
                <Box
                  sx={{
                    width: '100%',
                    height: '300px',
                    backgroundColor: '#e0e0e0',
                    borderRadius: '8px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Typography variant="body1">Sin Portada</Typography>
                </Box>
              )}
            </Grid>

            {/* Detalles */}
            <Grid item xs={12} md={8}>
              <Typography variant="body1" sx={{ marginBottom: '1rem' }}>
                <strong>Resumen:</strong> {game.summary || 'No disponible'}
              </Typography>
              <Typography variant="body1" sx={{ marginBottom: '1rem' }}>
                <strong>Géneros:</strong> {game.genres.map((genre: any) => genre.name).join(', ') || 'No disponible'}
              </Typography>
              <Typography variant="body1" sx={{ marginBottom: '1rem' }}>
                <strong>Plataformas:</strong> {game.platforms.map((platform: any) => platform.name).join(', ') || 'No disponible'}
              </Typography>
            </Grid>
          </Grid>

          {/* Capturas de pantalla */}
          {game.screenshots && game.screenshots.length > 0 && (
            <Box sx={{ marginTop: '2rem' }}>
              <Typography variant="h6" gutterBottom>
                Capturas de pantalla
              </Typography>
              <Grid container spacing={2}>
                {game.screenshots.map((screenshot: any) => (
                  <Grid item xs={6} md={4} key={screenshot.id}>
                    <img
                      src={`https:${screenshot.url.replace('t_thumb', 't_screenshot_big')}`}
                      alt={`Screenshot ${screenshot.id}`}
                      style={{ width: '100%', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {/* Botón de retorno */}
          <Box sx={{ marginTop: '2rem', textAlign: 'center' }}>
            <Button onClick={() => navigate('/')} variant="contained" color="primary">
              Volver a la Página Principal
            </Button>
          </Box>
        </>
      )}
    </Container>
  );
};

export default GameDetailsPage;
