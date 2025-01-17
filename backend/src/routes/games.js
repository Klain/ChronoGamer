//backend\src\routes\games.js
const express = require('express');
const authenticateToken = require('../middleware/auth');
const igdbService = require('../services/igdbService');

const router = express.Router();

// Función para inicializar o actualizar la caché (ahora centralizada en igdbService)
async function updateDailyGamesCache() {
  const today = new Date().toISOString().split('T')[0];
  console.log(`Actualizando caché de juegos diarios para la fecha ${today}...`);
  try {
      await igdbService.fetchGamesByDate(today); 
      console.log('Caché de juegos diarios actualizada correctamente.');
  } catch (error) {
      console.error('Error al actualizar el caché de juegos diarios:', error.message);
  }
}

// Endpoint para juegos diarios desde el caché centralizado
router.get('/daily', authenticateToken, async (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  try {
      const games = await igdbService.fetchGamesByDate(today);
      if (!games || games.length === 0) {
          return res.status(503).json({ message: 'Los juegos aún no están listos. Intenta más tarde.' });
      }
      res.json(games);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

// Obtener el juego del día (con más votos o rating)
router.get('/gotd', async (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  try {
    const games = await igdbService.fetchGamesByDate(today);

    // Verificar que hay juegos disponibles
    if (!games || games.length === 0) {
      return res.status(503).json({ message: 'No hay juegos disponibles para hoy.' });
    }

    // Asegurarse de que todos los juegos tengan `votes`
    const gamesWithVotes = games.map(game => ({
      ...game,
      votes: game.votes || 0 // Si `votes` no existe, usar `0`
    }));

    // Buscar el juego con más votos
    const gameWithMostVotes = gamesWithVotes.reduce((max, game) => {
      return game.votes > max.votes ? game : max;
    }, gamesWithVotes[0]); // Usar el primer juego como inicializador

    // Si todos los juegos tienen 0 votos, buscar el de mayor rating
    if (gameWithMostVotes.votes === 0) {
      // Filtrar solo juegos con `rating` definido
      const gamesWithRatings = gamesWithVotes.filter(game => game.rating !== undefined);

      if (gamesWithRatings.length === 0) {
        return res.status(404).json({ message: 'No hay juegos con rating disponible para hoy.' });
      }

      // Buscar el juego con el mayor `rating`
      const gameWithHighestRating = gamesWithRatings.reduce((max, game) => {
        return (game.rating || 0) > (max.rating || 0) ? game : max;
      }, gamesWithRatings[0]);

      return res.json({
        ...gameWithHighestRating,
        message: 'Este es el juego del día basado en el rating, ya que no hay votos.',
      });
    }

    // Devolver el juego con más votos
    return res.json({
      ...gameWithMostVotes,
      message: 'Este es el juego del día basado en los votos.',
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener juegos por fecha específica
router.get('/', authenticateToken, async (req, res) => {
  const date = req.query.date || new Date().toISOString().split('T')[0];
  try {
      const games = await igdbService.fetchGamesByDate(date); // Siempre consulta a través de igdbService
      res.json(games);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

// Obtener detalles completos de un juego por ID
router.get('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
      const gameDetails = await igdbService.fetchGameDetails(id); // Consulta a través de igdbService
      res.json(gameDetails);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

// Registrar un voto para un juego
router.post('/:idGame/vote', authenticateToken, async (req, res) => {
  const gameId = parseInt(req.params.idGame, 10);
  const userId = req.user.id;
  const today = new Date().toISOString().split('T')[0];
  try {

    const userRow = await new Promise((resolve, reject) => {
      db.get('SELECT last_vote_date FROM users WHERE id = ?', [userId], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (userRow && userRow.last_vote_date === today) {
      return res.status(400).json({ message: 'Ya has votado hoy' });
    }

    await new Promise((resolve, reject) => {
      db.run(
        'UPDATE users SET last_vote_date = ?, id_voted_game = ? WHERE id = ?',
        [today, gameId, userId],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });

    const games = await igdbService.fetchGamesByDate(today);

    const game = games.find((g) => g.id === gameId);
    if (!game) {
      return res.status(404).json({ message: 'Juego no encontrado' });
    }

    game.votes = (game.votes || 0) + 1;

    res.status(200).json({ message: 'Voto registrado correctamente', game });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Inicializar el caché al cargar las rutas
(async () => {
  await updateDailyGamesCache();
})();

module.exports = {
  updateDailyGamesCache,
  router,
};