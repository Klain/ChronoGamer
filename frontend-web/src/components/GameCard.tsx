import React, { useState } from 'react';
import { Card, CardContent, CardMedia, Typography, Box, Chip, Button } from '@mui/material';

interface ApiValue {
  id: number;
  name: string;
}

interface Game {
  id: number;
  name: string;
  genres: ApiValue[];
  platforms: ApiValue[];
  cover?: { url: string };
  summary?: string;
}

interface GameCardProps {
  game: Game;
  onViewDetails: (id: number) => void;
}

const GameCard: React.FC<GameCardProps> = ({ game, onViewDetails }) => {
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

  return (
    <Card>
      <CardMedia
        component="img"
        height="200"
        image={
          game.cover
            ? `https://images.igdb.com/igdb/image/upload/t_cover_big/${game.cover.url.split('/').pop()}`
            : 'https://via.placeholder.com/200x280?text=No+Image'
        }
        alt={game.name || 'Sin título'}
      />
      <CardContent>
        <Typography variant="h6" noWrap>
          {game.name}
        </Typography>
        {game.summary && (
          <Typography
            variant="body2"
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
        <Box sx={{ marginTop: '1rem', textAlign: 'center' }}>
          <Chip
            label="Ver Detalles"
            color="primary"
            onClick={handleViewDetails}
            clickable
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default GameCard;
