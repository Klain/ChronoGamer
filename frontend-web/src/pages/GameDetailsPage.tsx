import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchGameDetails } from '../services/api';
import { Container,  Typography,  Box, Button, CircularProgress, Rating, Grid2 } from '@mui/material';
import { formatDate } from '../utils/utils';
import AppHeader from '../components/AppHeader';
//import { useMediaQuery, useTheme } from '@mui/material';
import VideoGrid from '../components/VideoGrid';
import LoadingScreen from '../components/LoadingScreen';



const GameDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [game, setGame] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  //const theme = useTheme();
  //const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  //const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg')); 

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
        flex:1,
        display: 'flex',        
        flexDirection:'column',
        justifyContent:'flex-end'
      }}
      >
        <AppHeader />
        <LoadingScreen message="Loading" />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <AppHeader />
        <Typography color="error" variant="h6">
          {error}
        </Typography>
        <Button onClick={() => navigate('/home')} variant="contained" sx={{ marginTop: '1rem' }}>
          Volver a la Página Principal
        </Button>
      </Container>
    );
  }

  return (
    <Box
      sx={{ 
        flex:1,
        display: 'flex', 
        flexDirection: 'column',
      }}
    >
      <AppHeader />
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
      
      <Box 
        sx={{ 
          position: 'relative', 
          zIndex: 1 
        }}
      >
        <Box
          sx={{
            display:'flex',
            flexDirection:{ xs:'column', md:'row' }
          }}
        >
          {/*Portada*/}
          <Box
            sx={{
              padding:'2rem 1rem 2rem 1rem',
              width:{ xs:'auto', md:'30%' }
            }}
          >
            {game.cover && (
              <Box
                role="img"
                aria-label={game.name || 'Sin título'}
                sx={{
                  backgroundImage: `url(${
                    game.cover
                      ? `https://images.igdb.com/igdb/image/upload/t_cover_big/${game.cover.url.split('/').pop()}`
                      : 'https://via.placeholder.com/200x280?text=No+Image'
                  })`,
                  height:'20rem',
                  backgroundColor:'black',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: 'contain',
                  backgroundPosition: 'center',
                  filter: 'drop-shadow(0.5rem 0.5rem 0.5rem rgba(34, 34, 37, 0.76));',
                  borderRadius: '5%',
                  border: '0.5rem solid rgb(180, 178, 178)',
                  boxShadow: 3,
                  zIndex: 2,
                }}
              />
            )}
          </Box>

          {/*Detalle*/}
          <Box
            sx={{
              padding:'2rem 1rem 2rem 1rem',
              width:{ xs:'auto', md:'70%' }

            }}
          >
            <Typography variant="h4" sx={{ marginBottom: '1rem' }}>{game.name}</Typography>
        
            <Rating name="half-rating" defaultValue={game.rating/20} precision={0.1} sx={{ marginBottom: '1rem' }} readOnly />
        
            <Typography
              variant="subtitle1"
              sx={{ marginBottom: '1rem' , whiteSpace: 'normal' }}
            >
            {formatDate(game.release_dates[0].date)}
            </Typography>
        
            {game.summary && (
              <Typography
                variant="caption"
                sx={{ marginBottom: '1rem' , whiteSpace: 'normal' }}
              >
                {game.summary}
              </Typography>
            )}

            <Typography variant="body1" sx={{ marginBottom: '1rem' }}>
              <strong>Géneros:</strong> {game.genres.map((genre: any) => genre.name).join(', ') || 'No disponible'}
            </Typography>

            <Typography variant="body1" sx={{ marginBottom: '1rem' }}>
              <strong>Plataformas:</strong> {game.platforms.map((platform: any) => platform.name).join(', ') || 'No disponible'}
            </Typography>

            {/* Youtube */}
            {game.videos && game.videos.length > 0 && (
            <Box sx={{ marginTop: '2rem' }}>
              <Typography variant="h6" gutterBottom>
                Videos del Juego
              </Typography>
              <VideoGrid videos={game.videos}/>
            </Box>
            )}
            {/* Capturas de pantalla */}
            {game.screenshots && game.screenshots.length > 0 && (
              <Box sx={{ marginTop: '2rem' }}>
              <Typography variant="h6" gutterBottom>
                Capturas de pantalla
              </Typography>
              <Grid2 container spacing={2}>
                {game.screenshots.map((screenshot: { id: number; url: string }) => (
                  <Grid2
                    size={{ xs:6, md:4 }}
                    key={id}
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <img 
                      src={`https:${screenshot.url.replace('t_thumb', 't_720p')}`}
                      alt={`${game.name} screenshot ${screenshot.id}`}
                      style={{
                        width: '100%',
                        borderRadius: '8px',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                        objectFit: 'cover',
                      }}
                    />
                  </Grid2>

                ))}
              </Grid2>
            </Box>
          )}
            {/* Botón de retorno */}
            <Box 
              sx={{
                display: 'flex' ,
                justifyContent:'flex-end',
                textAlign: 'center' 
              }}
            >
              <Button
                onClick={() => navigate('/home')}
                variant="contained"
                sx={{ marginTop: '1rem' }}
                >
                  Volver
                </Button>
            </Box>
          </Box>
          
        </Box>   
      </Box>
    </Box>
  );
};

export default GameDetailsPage;
