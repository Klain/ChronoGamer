import React, { useState,useEffect } from 'react';
import { Card, Typography, Box, Chip, Button, Rating, Badge } from '@mui/material';
import { ApiGame } from '../models/ApiGame';
import { formatDate } from '../utils/utils';
import { voteForGame } from '../services/api';


interface GameCardProps {
  game: ApiGame;
  onViewDetails: (id: number) => void;
  isVoted : Boolean;
  canVote : Boolean;
}

const GameCard: React.FC<GameCardProps> = ({ game, onViewDetails, isVoted , canVote }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const displayedPlatforms = game.platforms ? 
    (Array.isArray(game.platforms) ? (isExpanded ? game.platforms : game.platforms.slice(0, 2)) : [game.platforms] )
    : [];

  const displayedGenres = game.genres ? 
    (Array.isArray(game.genres) ? (isExpanded ? game.genres : game.genres.slice(0, 2)) : [game.genres] )
    : [];

  const handleExpandToggle = () => {
    setIsExpanded((prev) => !prev);
  };

  const handleViewDetails = () => {
    onViewDetails?.(game.id);
  };

  const handleVote = ()=>{
    voteForGame(game.id);
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
          game.rating &&
          <Rating name="half-rating" defaultValue={game.rating/20} precision={0.1} readOnly />
        }
        <Typography variant="h6" noWrap>
          {game.name}
        </Typography>
        <Typography
            variant="subtitle1"
            sx={{ marginTop: '0.5rem', whiteSpace: 'normal' }}
          >
            {formatDate(game.release_dates[0].date)}
          </Typography>
        {game.summary && (
          <Typography
            variant="caption"
            sx={{ marginTop: '0.5rem', whiteSpace: 'normal' }}
          >
            {game.summary.slice(0, 200)}...
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
        {(game.platforms?.length > 2 || game.genres?.length > 2) && (
          <Button
            size="small"
            onClick={handleExpandToggle}
            sx={{ textTransform: 'none', marginBottom: '0.5rem' }}
          >
            {isExpanded ? 'Ver Menos' : 'Ver Más'}
          </Button>
        )}
        <Box sx={{ marginTop: '1rem' }}>
          <Chip
            label="Ver Detalles"
            color="primary"
            onClick={handleViewDetails}
            clickable
          />
          <Badge
            badgeContent={game.votes || 0}
            color="secondary"
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={canVote ? handleVote : undefined}
              disabled={isVoted}
            >
              {!canVote ? 'Votaste' : 'Votar'}
            </Button>
          </Badge>
        </Box>
      </Card>
    </Box>
  );
};

export default GameCard;
