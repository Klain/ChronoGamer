import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import LoadingScreen from '../components/LoadingScreen';
import GameCard from '../components/GameCard';
import { fetchGamesByDate } from '../services/api';
import {
  Container,
  Typography,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from '@mui/material';
import Masonry from '@mui/lab/Masonry';
interface Game {
  id: number;
  name: string;
  release_dates: ApiDate[];
  platforms:ApiValue[];
  genres: ApiValue[];
  cover?: { url: string };
  summary?: string;
}
interface ApiValue {
  id:number;
  name:string;
}
interface ApiDate {
  id:number;
  date:number;
}

const HomePage: React.FC = () => {
  const [sortOption, setSortOption] = useState<string>('year');
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  const navigate = useNavigate();

  const { data: games, isLoading, error } = useQuery<Game[], Error>({
    queryKey: ['games'],
    queryFn: () => fetchGamesByDate(new Date().toISOString().split('T')[0]),
  });

  const uniqueGenres: string[] = React.useMemo(() => {
    if (!games) return [];
    const allGenres: ApiValue[] = games.flatMap(
      (game: Game) => game.genres || []
    );
    const uniqueGenreNames = Array.from(
      new Set(allGenres.map((genre:ApiValue) => genre.name))
    );
    return uniqueGenreNames.sort();
  }, [games]);
  
  const uniquePlatforms: string[] = React.useMemo(() => {
    if (!games) return [];
    const allPlatforms: { id: string; name: string }[] = games.flatMap(
      (game: Game) => game.platforms || []
    );
    const uniquePlatformNames = Array.from(
      new Set(allPlatforms.map((platform) => platform.name))
    );
    return uniquePlatformNames.sort();
  }, [games]);
  
  const uniqueYears: number[] = React.useMemo(() => {
    if (!games) return [];
    const allYears: number[] = games.flatMap((game: Game) =>
      game.release_dates.map((releaseDate:ApiDate) =>
        new Date(releaseDate.date * 1000).getFullYear()
      )
    );
    const uniqueYearValues = Array.from(new Set(allYears));
    return uniqueYearValues.sort((a, b) => a - b);
  }, [games]);
  
  const filteredGames = React.useMemo(() => {
    if (!games) return [];
    return games.filter((game: { genres: any[]; platforms: any[]; release_dates: any[]; }) => {
      const matchesGenre = selectedGenre
        ? game.genres?.some((genre: { name: string; }) => genre.name === selectedGenre)
        : true;
      const matchesPlatform = selectedPlatform
        ? game.platforms.some((platform: { name: string; }) => platform.name === selectedPlatform)
        : true;
      const matchesYear = selectedYear
        ? game.release_dates.some((date: { date: number; }) => {
            const year = new Date(date.date * 1000).getFullYear();
            return year === selectedYear;
          })
        : true;
      return matchesGenre && matchesPlatform && matchesYear;
    });
  }, [games, selectedGenre, selectedPlatform, selectedYear]);

  const handleSortChange = (event: SelectChangeEvent<string>) => {
    setSortOption(event.target.value);
  };

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
        flexDirection: 'column' 
      }}
    >
      <Typography variant="h4" gutterBottom>
        Tal día como hoy se estrenaron los siguientes juegos históricos
      </Typography>
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'row-reverse',
          gap: 2, mb: 2 
        }}
      >
        {/* Filtro por género */}
        <FormControl variant="outlined" sx={{ minWidth: 200 }}>
          <InputLabel>Género</InputLabel>
          <Select
            value={selectedGenre || ''}
            onChange={(e) => setSelectedGenre(e.target.value || null)}
            label="Género"
          >
            <MenuItem value="">Todos</MenuItem>
            {uniqueGenres.map((genre) => (
              <MenuItem key={genre} value={genre}>
                {genre}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Filtro por plataforma */}
        <FormControl variant="outlined" sx={{ minWidth: 200 }}>
          <InputLabel>Plataforma</InputLabel>
          <Select
            value={selectedPlatform || ''}
            onChange={(e) => setSelectedPlatform(e.target.value || null)}
            label="Plataforma"
          >
            <MenuItem value="">Todas</MenuItem>
            {uniquePlatforms.map((platform) => (
              <MenuItem key={platform} value={platform}>
                {platform}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Filtro por año */}
        <FormControl variant="outlined" sx={{ minWidth: 200 }}>
          <InputLabel>Año</InputLabel>
          <Select
            value={selectedYear || ''}
            onChange={(e) => setSelectedYear(Number(e.target.value) || null)}
            label="Año"
          >
            <MenuItem value="">Todos</MenuItem>
            {uniqueYears.map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      {/* Contenedor Scrolleable */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          paddingRight: '1rem',
          maxHeight: '70vh',
        }}
      >
        <Masonry columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} spacing={2}>
          {filteredGames.map((game:Game) => (
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
