import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Typography, Box, Chip, Rating, CircularProgress } from '@mui/material';
import { ApiGame } from '../models/ApiGame';
import { formatDate } from '../utils/utils';
import { fetchGameOfTheDay } from '../services/api';

const GameCardPro: React.FC = () => {
  const [gotd, setGotd] = useState<ApiGame | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();


  useEffect(() => {
    const loadGameOfTheDay = async () => {
      try {
        const game = await fetchGameOfTheDay();
        setGotd(game);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Error al cargar el juego del día');
      } finally {
        setLoading(false);
      }
    };

    loadGameOfTheDay();
  }, []);

  const handleViewDetails = () => {
    if(gotd && gotd.id){
      navigate(`/game/${gotd.id}`);
    }
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', marginTop: '2rem' }}>
        <CircularProgress />
        <Typography>Cargando juego del día...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', marginTop: '2rem' }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!gotd) {
    return (
      <Box sx={{ textAlign: 'center', marginTop: '2rem' }}>
        <Typography>No hay juego del día disponible.</Typography>
      </Box>
    );
  }

  return (
    <Box 
      sx={{ 
        position: 'relative', 
        marginBottom: '4rem',
        transition: 'transform 0.3s ease-in-out',
      '&:hover': 
        { 
          zIndex: 3,
          transform: 'translateY(20%) scale(1.3)',
        },
      }}
    >
      {/* Imagen montada */}
      {gotd.cover && (
  <Box
    role="img"
    aria-label={gotd.name || 'Sin título'}
    sx={{
      backgroundImage: `url(${
        gotd.cover
          ? `https://images.igdb.com/igdb/image/upload/t_cover_big/${gotd.cover.url.split('/').pop()}`
          : 'https://via.placeholder.com/200x280?text=No+Image'
      })`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      filter: 'drop-shadow(0.5rem 0.5rem 0.5rem rgba(34, 34, 37, 0.76));',
      position: 'absolute',
      top: '0',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '120px',
      height: '120px',
      borderRadius: '50%',
      border: '0.5rem solid rgb(180, 178, 178)',
      boxShadow: 3,
      zIndex: 2,
      }}
    />
  )}


      {/* Tarjeta */}
      <Card
        sx={{
          borderRadius: 2,
          boxShadow: 3,
          filter:'box-shadow(1rem 0.75rem 0.25rem rgba(148, 149, 151, 0.76));',
          padding: '1rem',
          paddingTop: '6rem',
          textAlign: 'center',
          marginTop: '3rem',
          fontSize:'0.5rem'
        }}
      >
        {
          gotd.rating &&
          <Rating name="half-rating" defaultValue={gotd.rating/20} precision={0.1} readOnly />
        }
        <Typography variant="h6" noWrap>
          {gotd.name}
        </Typography>
        <Typography
            variant="subtitle1"
            sx={{ marginTop: '0.5rem', whiteSpace: 'normal' }}
          >
            {formatDate(gotd.release_dates[0].date)}
          </Typography>
        {gotd.summary && (
          <Typography
            variant="caption"
            sx={{ marginTop: '0.5rem', whiteSpace: 'normal' }}
          >
            {gotd.summary}
          </Typography>
        )}
        <Box sx={{ marginTop: '0.5rem' }}>
          {gotd.genres.map((genre) => (
            <Chip
              key={genre.id}
              label={genre.name}
              size="small"
              sx={{ marginRight: '0.5rem', marginBottom: '0.5rem' }}
            />
          ))}
        </Box>
        <Box sx={{ marginTop: '0.5rem' }}>
          {gotd.platforms.map((platform) => (
            <Chip
              key={platform.id}
              label={platform.name}
              size="small"
              sx={{ marginRight: '0.5rem', marginBottom: '0.5rem' }}
            />
          ))}
        </Box>
        <Box sx={{ marginTop: '1rem' }}>
        <Chip
            label="Ver Detalles"
            color="primary"
            onClick={handleViewDetails}
            clickable
          />
        </Box>
      </Card>
    </Box>
  );
};

export default GameCardPro;
