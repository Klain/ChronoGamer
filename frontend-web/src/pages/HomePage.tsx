import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import LoadingScreen from '../components/LoadingScreen';
import GameCard from '../components/GameCard';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FilterListIcon from '@mui/icons-material/FilterList';
import { fetchGamesByDate } from '../services/api';
import {
  Container,
  Typography,
  Box,
  AccordionDetails,
  Accordion,
  AccordionSummary,
  Chip,
  Rating,
  Button,
} from '@mui/material';
import Masonry from '@mui/lab/Masonry';
import { ApiGame } from '../models/ApiGame';

type FilterData = {
  genres: string[];
  platforms: string[];
  decades: number[];
};

const HomePage: React.FC = () => {
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [filterVisible, setFilterVisible] = useState<boolean>(false);
  const [filterData, setFilterData] = useState<FilterData>({
    genres: [],
    platforms: [],
    decades: [],
  });
  
  const navigate = useNavigate();

  const { data: games, isLoading, error } = useQuery<ApiGame[], Error>({
    queryKey: ['games'],
    queryFn: () => fetchGamesByDate(new Date().toISOString().split('T')[0]),
  });

  useEffect(() => {
    if (games) {
      const genres = Array.from(
        new Set(games.flatMap((game) => game.genres?.map((g) => g.name) || []))
      ).sort();
      const platforms = Array.from(
        new Set(games.flatMap((game) => game.platforms?.map((p) => p.name) || []))
      ).sort();
      const decades = Array.from(
        new Set(
          games.flatMap((game) =>
            game.release_dates?.map((d) => Math.floor(new Date(d.date * 1000).getFullYear() / 10) * 10) || []
          )
        )
      ).sort((a, b) => a - b);
  
      setFilterData({ genres, platforms, decades });
    }
  }, [games]);

  const filteredGames = React.useMemo(() => {
    if (!games) return [];
    return games.filter((game) => {
      const matchesGenre = selectedGenre
        ? game.genres?.some((genre) => genre.name === selectedGenre)
        : true;
      const matchesPlatform = selectedPlatform
        ? game.platforms?.some((platform) => platform.name === selectedPlatform)
        : true;
      const matchesYear = selectedYear
        ? game.release_dates?.some((date) => {
            const year = new Date(date.date * 1000).getFullYear();
            return Math.floor(year / 10) * 10 === Number(selectedYear);
          })
        : true;
      const matchesRating = selectedRating ? game.rating && game.rating / 20 >= selectedRating : true;
      return matchesGenre && matchesPlatform && matchesYear && matchesRating;
    });
  }, [games, selectedGenre, selectedPlatform, selectedYear, selectedRating]);

  const toggleFilterVisibility = () => setFilterVisible((prev) => !prev);

  const handleGameDetails = (id: number) => {
    navigate(`/game/${id}`);
  };

  if (isLoading) {
    return (
      <Box 
      sx={{ 
        flex:1,
        display: 'flex',        
        flexDirection:'column',
        justifyContent:'flex-end'
      }}
      >
        <LoadingScreen message="Loading" />
      </Box>
      
    );
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

  if(!(games??false)){
    navigate('/error');
  }

  return (
    <Box 
      sx={{ 
        flex:1,
        padding: '2rem', 
        display: 'flex', 
        flexDirection: 'column',
      }}
    >
      <Typography variant="h4" gutterBottom>
        Tal día como hoy se estrenaron los siguientes juegos históricos
      </Typography>
      {/* Icono de Filtro */}
      <Button
        startIcon={<FilterListIcon />}
        variant="contained"
        onClick={toggleFilterVisibility}
        sx={{ alignSelf: 'flex-start', marginBottom: '1rem' }}
      >
        Filtros
      </Button>

      {/* Contenedor de Filtros (Acordeón) */}
      {filterVisible && (
        <Box sx={{ marginBottom: '2rem' }}>
          {/* Filtro por género */}
          <Accordion TransitionProps={{ unmountOnExit: true }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Género</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {filterData.genres.map((genre) => (
                  <Chip
                    key={genre}
                    label={genre}
                    onClick={() => setSelectedGenre(genre === selectedGenre ? null : genre)}
                    color={selectedGenre === genre ? 'primary' : 'default'}
                    clickable
                  />
                ))}
              </Box>
            </AccordionDetails>
          </Accordion>

          {/* Filtro por plataforma */}
          <Accordion TransitionProps={{ unmountOnExit: true }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Plataforma</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {filterData.platforms.map((platform) => (
                  <Chip
                    key={platform}
                    label={platform}
                    onClick={() => setSelectedPlatform(platform === selectedPlatform ? null : platform)}
                    color={selectedPlatform === platform ? 'primary' : 'default'}
                    clickable
                  />
                ))}
              </Box>
            </AccordionDetails>
          </Accordion>

          {/* Filtro por décadas */}
          <Accordion TransitionProps={{ unmountOnExit: true }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Década</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {filterData.decades.map((decade) => (
                  <Chip
                    key={decade}
                    label={`${decade}s`}
                    onClick={() => setSelectedYear(decade === selectedYear ? null : decade)}
                    color={decade === selectedYear ? 'primary' : 'default'}
                    clickable
                  />
                ))}
              </Box>
            </AccordionDetails>
          </Accordion>

          {/* Filtro por Rating */}
          <Accordion TransitionProps={{ unmountOnExit: true }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Rating</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Rating
                value={selectedRating || 0}
                onChange={(_, value) => setSelectedRating(value)}
                precision={0.5}
              />
            </AccordionDetails>
          </Accordion>
        </Box>
      )}

      {/* Contenedor Scrolleable */}
      <Box
        sx={{
          flex: 1,
          position: 'relative',
          maxHeight: '70vh',
          paddingRight: '1rem', 
          display:'flex',
          flexWrap: 'wrap',
        }}
      >
        <Masonry
            columns={{ xs: 1, sm: 2, md: 3, lg: 4 }}
            spacing={2}
          >
            {filteredGames.map((game:ApiGame) => (
              <GameCard
                game={game}
                onViewDetails={handleGameDetails}
                key={game.id}
              />
            ))}
          </Masonry>
      </Box>
    </Box>
  );
};

export default HomePage;
