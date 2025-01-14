import React, { useEffect, useState } from 'react';
import { fetchGamesByDate } from '../services/api';
import {
  Container,
  Typography,
  Grid,
  Button,
  Box,
  Card,
  CardContent,
  CardMedia,
  Pagination,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface Game {
  id: number;
  name: string;
  release_dates: { date: number }[];
  platforms: { id: number; name: string }[];
  genres?: { id: number; name: string }[];
  cover?: { url: string };
  summary?: string;
}

const HomePage: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const gamesPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    const loadGames = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const response = await fetchGamesByDate(today);
        const sortedGames = response.data.sort((a: Game, b: Game) => {
          const dateA = a.release_dates[0]?.date || 0;
          const dateB = b.release_dates[0]?.date || 0;
          return dateA - dateB;
        });
        setGames(sortedGames);
      } catch (err: any) {
        setError('Error al cargar los juegos.');
      }
    };

    loadGames();
  }, []);

  const indexOfLastGame = currentPage * gamesPerPage;
  const indexOfFirstGame = indexOfLastGame - gamesPerPage;
  const currentGames = games.slice(indexOfFirstGame, indexOfLastGame);

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  const sortAscending = () => {
    const sortedGames = [...games].sort((a, b) => {
      const dateA = a.release_dates[0]?.date || 0;
      const dateB = b.release_dates[0]?.date || 0;
      return dateA - dateB;
    });
    setGames(sortedGames);
  };

  const sortDescending = () => {
    const sortedGames = [...games].sort((a, b) => {
      const dateA = a.release_dates[0]?.date || 0;
      const dateB = b.release_dates[0]?.date || 0;
      return dateB - dateA;
    });
    setGames(sortedGames);
  };

  const handleGameDetails = (id: number) => {
    navigate(`/game/${id}`);
  };

  return (
    <Container sx={{ marginTop: '2rem' }}>
      <Typography variant="h4" gutterBottom>
        Tal día como hoy se estrenaron los siguientes juegos históricos
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '1rem' }}>
        <Button variant="contained" color="primary" onClick={sortAscending}>
          Ordenar por Año (Ascendente)
        </Button>
        <Button variant="outlined" color="primary" onClick={sortDescending}>
          Ordenar por Año (Descendente)
        </Button>
      </Box>
      {error && <Typography color="error">{error}</Typography>}
      {!error && games.length > 0 ? (
        <>
          <Grid container spacing={3}>
            {currentGames.map((game) => (
              <Grid item xs={12} sm={6} md={4} key={game.id}>
                <Card>
                  <CardMedia
                    component="img"
                    height="200"
                    image={
                      game.cover
                        ? `https://images.igdb.com/igdb/image/upload/t_cover_big/${game.cover.url.split('/').pop()}`
                        : 'https://via.placeholder.com/200x280?text=No+Image'
                    }
                    alt={game.name}
                  />
                  <CardContent>
                    <Typography variant="h6">{game.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(game.release_dates[0]?.date * 1000).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Plataformas: {game.platforms.map((platform) => platform.name).join(', ')}
                    </Typography>
                    {game.genres && (
                      <Typography variant="body2" color="text.secondary">
                        Géneros: {game.genres.map((genre) => genre.name).join(', ')}
                      </Typography>
                    )}
                    {game.summary && (
                      <Typography variant="body2" sx={{ marginTop: '0.5rem' }}>
                        {game.summary.slice(0, 100)}...
                      </Typography>
                    )}
                    <Button
                      variant="contained"
                      size="small"
                      color="primary"
                      onClick={() => handleGameDetails(game.id)}
                      sx={{ marginTop: '0.5rem' }}
                    >
                      Ver Detalles
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
            <Pagination
              count={Math.ceil(games.length / gamesPerPage)}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        </>
      ) : (
        <Typography>No se encontraron juegos para esta fecha.</Typography>
      )}
    </Container>
  );
};

export default HomePage;
