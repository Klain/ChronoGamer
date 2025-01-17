import React, { useState } from 'react';
import { Box, Grid, Typography } from '@mui/material';

const VideoGrid: React.FC<{ videos: { id: number; video_id: string }[] }> = ({ videos }) => {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  return (
    <Grid container spacing={2}>
      {videos.map((video) => (
        <Grid item xs={12} md={6} key={video.id}>
          {activeVideo === video.video_id ? (
            // Mostrar el iframe del video cuando está activo
            <Box
              sx={{
                position: 'relative',
                paddingBottom: '56.25%', // Relación de aspecto 16:9
                height: 0,
                overflow: 'hidden',
                borderRadius: '8px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
              }}
            >
              <iframe
                src={`https://www.youtube.com/embed/${video.video_id}?enablejsapi=1`}
                title={`Video ${video.id}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  borderRadius: '8px',
                }}
              ></iframe>
            </Box>
          ) : (
            // Mostrar el thumbnail con botón de reproducción
            <Box
              sx={{
                position: 'relative',
                height: '200px',
                width: '100%',
                borderRadius: '8px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                overflow: 'hidden',
                cursor: 'pointer',
              }}
              onClick={() => setActiveVideo(video.video_id)}
            >
              <img
                src={`https://i.ytimg.com/vi/${video.video_id}/hqdefault.jpg`}
                alt={`Thumbnail for video ${video.id}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  backgroundColor: 'rgba(0, 0, 0, 0.6)',
                  borderRadius: '50%',
                  width: '60px',
                  height: '60px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/b/b8/YouTube_play_button_icon_%282013%E2%80%932017%29.svg"
                  alt="Play Video"
                  style={{ width: '30px', height: '30px' }}
                />
              </Box>
            </Box>
          )}
          <Typography variant="body1" align="center" sx={{ marginTop: '0.5rem' }}>
            {video.id === videos[0].id ? 'Trailer' : 'Gameplay video'}
          </Typography>
        </Grid>
      ))}
    </Grid>
  );
};

export default VideoGrid;
