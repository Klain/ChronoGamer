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
router.post('/:id/vote', authenticateToken, async (req, res) => {
  const gameId = parseInt(req.params.id, 10);
  const userId = req.user.id; // `req.user` se llena con el token en authenticateToken
  const today = new Date().toISOString().split('T')[0];

  try {
      db.get('SELECT last_vote_date FROM users WHERE id = ?', [userId], (err, row) => {
          if (err) {
              return res.status(500).json({ error: 'Error al verificar el último voto' });
          }

          if (row && row.last_vote_date === today) {
              return res.status(400).json({ message: 'Ya has votado hoy' });
          }

          db.run('UPDATE users SET last_vote_date = ? WHERE id = ?', [today, userId], function (err) {
              if (err) {
                  return res.status(500).json({ error: 'Error al registrar el voto' });
              }

              igdbService.fetchGamesByDate(today).then((games) => {
                  const game = games.find((g) => g.id === gameId);
                  if (game) {
                      game.votes = (game.votes || 0) + 1; // Incrementa los votos
                  }
                  res.status(200).json({ message: 'Voto registrado correctamente' });
              });
          });
      });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

// Obtener el juego del día (con más votos o rating)
router.get('/gotd', async (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  try {
    const games = await igdbService.fetchGamesByDate(today);

    // Si no hay juegos disponibles
    if (!games || games.length === 0) {
      return res.status(503).json({ message: 'Los juegos aún no están listos. Intenta más tarde.' });
    }

    // Buscar el juego con más votos
    const gameWithMostVotes = games.reduce((max, game) => {
      return (game.votes || 0) > (max.votes || 0) ? game : max;
    }, null); // Valor inicial como `null`

    // Si todos los juegos tienen `votes = 0`, `gameWithMostVotes` será válido pero con votos 0.
    if (!gameWithMostVotes || gameWithMostVotes.votes === 0) {
      // Buscar el juego con el mayor `rating`
      const gameWithHighestRating = games.reduce((max, game) => {
        return (game.rating || 0) > (max.rating || 0) ? game : max;
      }, null);

      // Si no hay un juego con rating válido
      if (!gameWithHighestRating) {
        return res.status(404).json({ message: 'No hay juegos disponibles para hoy.' });
      }

      return res.json({
        ...gameWithHighestRating,
        message: 'Este es el juego del día basado en el rating, ya que no hay votos.',
      });
    }

    // Si hay un juego con votos válidos, devolverlo
    return res.json({
      ...gameWithMostVotes,
      message: 'Este es el juego del día basado en los votos.',
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
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