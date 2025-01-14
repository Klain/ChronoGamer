import React, { useEffect, useState } from 'react';
import LoadingScreen from '../components/LoadingScreen';
import { fetchGamesByDate } from '../services/api';
import {
  Container,
  Typography,
  Grid,
  Box,
  Card,
  CardContent,
  CardMedia,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Pagination,
  Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { SelectChangeEvent } from '@mui/material';

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
  const [filteredGames, setFilteredGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState<string>('year');
  const gamesPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    const loadGames = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const games = await fetchGamesByDate(today);
        setGames(games);
        setFilteredGames(games);
      } catch (err: any) {
        setError('Error al cargar los juegos.');
      } finally {
        setIsLoading(false);
      }
    };

    loadGames();
  }, []);

  const handleGameDetails = (id: number) => {
    navigate(`/game/${id}`);
  };

  const sortGames = (option: string) => {
    let sortedGames = [...games];
    if (option === 'year') {
      sortedGames.sort((a, b) => {
        const dateA = a.release_dates[0]?.date || 0;
        const dateB = b.release_dates[0]?.date || 0;
        return dateA - dateB;
      });
    } else if (option === 'genre') {
      sortedGames.sort((a, b) => {
        const genreA = a.genres?.[0]?.name || '';
        const genreB = b.genres?.[0]?.name || '';
        return genreA.localeCompare(genreB);
      });
    } else if (option === 'platform') {
      sortedGames.sort((a, b) => {
        const platformA = a.platforms?.[0]?.name || '';
        const platformB = b.platforms?.[0]?.name || '';
        return platformA.localeCompare(platformB);
      });
    }
    setFilteredGames(sortedGames);
  };

  const handleSortChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    setSortOption(value);
    sortGames(value);
  };

  const indexOfLastGame = currentPage * gamesPerPage;
  const indexOfFirstGame = indexOfLastGame - gamesPerPage;
  const currentGames = filteredGames.slice(indexOfFirstGame, indexOfLastGame);

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return (
      <LoadingScreen
        message="Cargando los mejores juegos de la historia..."
        adImage="https://via.placeholder.com/300x200.png?text=Publicidad"
      />
    );
  }

  return (
    <Container sx={{ marginTop: '2rem' }}>
      <Typography variant="h4" gutterBottom>
        Tal día como hoy se estrenaron los siguientes juegos históricos
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <FormControl variant="outlined" sx={{ minWidth: 200 }}>
          <InputLabel>Ordenar Por</InputLabel>
          <Select value={sortOption} onChange={handleSortChange} label="Ordenar Por">
            <MenuItem value="year">Año</MenuItem>
            <MenuItem value="genre">Género</MenuItem>
            <MenuItem value="platform">Plataforma</MenuItem>
          </Select>
        </FormControl>
      </Box>
      {error && <Typography color="error">{error}</Typography>}
      {!error && filteredGames.length > 0 ? (
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
              count={Math.ceil(filteredGames.length / gamesPerPage)}
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
