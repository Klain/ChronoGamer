import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Typography, Box, Chip, Rating, CircularProgress } from '@mui/material';
import { ApiGame } from '../models/ApiGame';
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
        padding: '2rem',
      }}
    >
      <Card
        sx={{
          borderRadius: 2,
          boxShadow: 3,
          filter:'drop-shadow(0rem 0rem 0.75rem rgba(256, 256, 256, 0.76));',
          padding: '3rem',
          textAlign: 'center',
          fontSize:'0.5rem',
          display:'flex',
          flexDirection:'row',
          justifyContent:'space-between'
        }}
      >
        <Box
          sx={{
            display:'flex',
            flexDirection:'column',
            alignItems:'center',
            width:'40%',    
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
                filter: 'drop-shadow(0.5rem 0.5rem 0.5rem rgba(255, 255, 255, 0.76));',
                width: '15rem',
                height: '15rem',
                borderRadius: '50%',
                border: '0.5rem solid rgb(180, 178, 178)',
                boxShadow: 3,
                zIndex: 2,
                marginBottom:'3rem'
                }}
            />
          )}
          {/* Tarjeta */}
          <Box>
            {gotd.rating &&
              <Rating name="half-rating" defaultValue={gotd.rating/20} precision={0.1} readOnly />
            }
          </Box>
          <Box>
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
          </Box>
        </Box>

        <Box
          sx={{
            display:'flex',
            width:'50%',
            flexDirection:'column-reverse',
            justifyContent:'flex-start'
          }}
        >
          <Typography variant="h6" noWrap>
            {gotd.name} 
            {/*formatDate(gotd.release_dates[0].date)*/}
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{ marginTop: '0.5rem', whiteSpace: 'normal' }}
          >
            
          </Typography>
          {gotd.summary && (
            <Typography
              variant="caption"
              sx={{ marginTop: '0.5rem', whiteSpace: 'normal' }}
            >
              {gotd.summary.slice(0, 800)}...
            </Typography>
          )}
        </Box>
      </Card>
    </Box>


  );
};

export default GameCardPro;
