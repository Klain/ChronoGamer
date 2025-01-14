import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchGameDetails } from '../services/api';

interface GameDetails {
  id: number;
  name: string;
  description: string;
  release_date: string;
  genres: string[];
  platforms: string[];
  screenshots: string[];
}

const GameDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [game, setGame] = useState<GameDetails | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadGameDetails = async () => {
      try {
        const response = await fetchGameDetails(Number(id));
        setGame(response.data);
      } catch (err: any) {
        setError('Error al cargar los detalles del juego');
      }
    };

    loadGameDetails();
  }, [id]);

  if (error) {
    return <p>{error}</p>;
  }

  if (!game) {
    return <p>Cargando...</p>;
  }

  return (
    <div>
      <h1>{game.name}</h1>
      <p>{game.description}</p>
      <p>Fecha de lanzamiento: {game.release_date}</p>
      <p>Géneros: {game.genres.join(', ')}</p>
      <p>Plataformas: {game.platforms.join(', ')}</p>
      <div>
        <h2>Imágenes</h2>
        {game.screenshots.map((url, index) => (
          <img key={index} src={url} alt={`${game.name} screenshot ${index}`} />
        ))}
      </div>
    </div>
  );
};

export default GameDetailsPage;
