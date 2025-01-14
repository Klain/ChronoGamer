import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchGameDetails } from '../services/api';
import {
  Container,
  Typography,
  Box,
  Card,
  CardMedia,
  CardContent,
} from '@mui/material';

const GameDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [game, setGame] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadGameDetails = async () => {
      try {
        const gameData = await fetchGameDetails(Number(id));
        setGame(gameData);
      } catch (err) {
        setError('Error al cargar los detalles del juego.');
      }
    };

    loadGameDetails();
  }, [id]);

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (!game) {
    return <Typography>Cargando detalles del juego...</Typography>;
  }

  return (
    <Container sx={{ marginTop: '2rem' }}>
      <Card>
        <CardMedia
          component="img"
          height="300"
          image={
            game.cover
              ? `https://images.igdb.com/igdb/image/upload/t_cover_big/${game.cover.url.split('/').pop()}`
              : 'https://via.placeholder.com/300x400?text=No+Image'
          }
          alt={game.name}
        />
        <CardContent>
          <Typography variant="h4">{game.name}</Typography>
          {game.summary && (
            <Typography variant="body1" sx={{ marginTop: '1rem' }}>
              {game.summary}
            </Typography>
          )}
          {game.genres && (
            <Typography variant="body2" sx={{ marginTop: '1rem' }}>
              Géneros: {game.genres.map((genre: any) => genre.name).join(', ')}
            </Typography>
          )}
          {game.platforms && (
            <Typography variant="body2" sx={{ marginTop: '1rem' }}>
              Plataformas: {game.platforms.map((platform: any) => platform.name).join(', ')}
            </Typography>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default GameDetailsPage;
