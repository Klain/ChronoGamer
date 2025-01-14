import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Container,
  Typography,
  Grid,
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Pagination,
  Button,
} from '@mui/material';
import LoadingScreen from '../components/LoadingScreen';
import { fetchGamesByDate } from '../services/api';
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
  const [sortOption, setSortOption] = useState<string>('year');
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedCards, setExpandedCards] = useState<Record<number, boolean>>({});
  const gamesPerPage = 9;
  const navigate = useNavigate();

  const { data: games, isLoading, error } = useQuery<Game[], Error>({
    queryKey: ['games'],
    queryFn: () => fetchGamesByDate(new Date().toISOString().split('T')[0]),
  });

  const handleSortChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    setSortOption(value);
  };

  const handleToggleExpand = (gameId: number) => {
    setExpandedCards((prevState) => ({
      ...prevState,
      [gameId]: !prevState[gameId],
    }));
  };

  const sortedGames = React.useMemo(() => {
    if (!games) return [];
    let sorted = [...games];
    if (sortOption === 'year') {
      sorted.sort((a, b) => {
        const dateA = a.release_dates[0]?.date || 0;
        const dateB = b.release_dates[0]?.date || 0;
        return dateA - dateB;
      });
    } else if (sortOption === 'genre') {
      sorted.sort((a, b) => {
        const genreA = a.genres?.[0]?.name || '';
        const genreB = b.genres?.[0]?.name || '';
        return genreA.localeCompare(genreB);
      });
    } else if (sortOption === 'platform') {
      sorted.sort((a, b) => {
        const platformA = a.platforms?.[0]?.name || '';
        const platformB = b.platforms?.[0]?.name || '';
        return platformA.localeCompare(platformB);
      });
    }
    return sorted;
  }, [games, sortOption]);

  const paginatedGames = React.useMemo(() => {
    if (!sortedGames) return [];
    const indexOfLastGame = currentPage * gamesPerPage;
    const indexOfFirstGame = indexOfLastGame - gamesPerPage;
    return sortedGames.slice(indexOfFirstGame, indexOfLastGame);
  }, [sortedGames, currentPage]);

  const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  const handleGameDetails = (id: number) => {
    navigate(`/game/${id}`);
  };

  if (isLoading) {
    return <LoadingScreen message="Cargando los mejores juegos de la historia..." />;
  }

  if (error) {
    return (
      <Container>
        <Typography color="error" variant="h6">
          Error al cargar los juegos. Intenta más tarde.
        </Typography>
      </Container>
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
      <Grid container spacing={3}>
        {paginatedGames.map((game) => {
          const isExpanded = expandedCards[game.id] || false;

          const displayedPlatforms = isExpanded
            ? game.platforms
            : game.platforms.slice(0, 2);

          const displayedGenres = isExpanded
            ? game.genres || []
            : (game.genres || []).slice(0, 2);

          return (
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
                  <Typography variant="h6" noWrap>
                    {game.name}
                  </Typography>
                  {game.summary && (
                    <Typography variant="body2" sx={{ marginTop: '0.5rem', whiteSpace: 'normal' }}>
                    {game.summary.slice(0, 400)}...
                    </Typography>
                  )}
                  <Box sx={{ marginTop: '0.5rem' }}>
                    {displayedGenres.map((genre) => (
                      <Chip
                        key={genre.id}
                        label={genre.name}
                        size="small"
                        sx={{ marginRight: '0.5rem', marginBottom: '0.5rem' }}
                      />
                    ))}
                  </Box>
                  <Box sx={{ marginTop: '0.5rem' }}>
                    {displayedPlatforms.map((platform) => (
                      <Chip
                        key={platform.id}
                        label={platform.name}
                        size="small"
                        sx={{ marginRight: '0.5rem', marginBottom: '0.5rem' }}
                      />
                    ))}
                  </Box>
                  {(game.platforms.length > 2 || (game.genres || []).length > 2) && (
                    <Button
                      size="small"
                      onClick={() => handleToggleExpand(game.id)}
                      sx={{ textTransform: 'none', marginBottom: '0.5rem' }}
                    >
                      {isExpanded ? 'Ver Menos' : 'Ver Más'}
                    </Button>
                  )}
                  <Box sx={{ marginTop: '1rem', textAlign: 'center' }}>
                    <Chip
                      label="Ver Detalles"
                      color="primary"
                      onClick={() => handleGameDetails(game.id)}
                      clickable
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
        <Pagination
          count={Math.ceil((games?.length || 0) / gamesPerPage)}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
    </Container>
  );
};

export default HomePage;
