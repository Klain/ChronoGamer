const express = require('express');
const authenticateToken = require('../middleware/auth');
const igdbService = require('../services/igdbService');

const router = express.Router();

let dailyGamesCache = []; // Caché para juegos diarios

// Función para inicializar o actualizar el caché
async function updateDailyGamesCache() {
    const today = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD
    console.log(`Actualizando caché de juegos diarios para la fecha ${today}...`);
    try {
        const games = await igdbService.fetchGamesByDate(today);
        dailyGamesCache = games; // Actualizar el caché
        console.log(`Se han almacenado ${games.length} juegos en el caché.`);
    } catch (error) {
        console.error('Error al actualizar el caché de juegos diarios:', error.message);
    }
}

// Endpoint para juegos diarios desde el caché
router.get('/daily', authenticateToken, async (req, res) => {
    if (dailyGamesCache.length === 0) {
        return res.status(503).json({ message: 'Los juegos aún no están listos. Intenta más tarde.' });
    }
    res.json(dailyGamesCache);
});

// Obtener juegos por fecha específica (sin usar el caché)
router.get('/', authenticateToken, async (req, res) => {
    const date = req.query.date || new Date().toISOString().split('T')[0];
    try {
        const games = await igdbService.fetchGamesByDate(date);
        res.json(games);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Obtener detalles completos de un juego por ID
router.get('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
        const gameDetails = await igdbService.fetchGameDetails(id);
        res.json(gameDetails);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Endpoint para obtener el juego del día (con más votos)
router.get('/gotd', authenticateToken, (req, res) => {
  if (dailyGamesCache.length === 0) {
      return res.status(503).json({ message: 'Los juegos aún no están listos. Intenta más tarde.' });
  }
  const gameWithMostVotes = dailyGamesCache.reduce((max, game) => {
      return (game.votes || 0) > (max.votes || 0) ? game : max;
  }, {});
  if (!gameWithMostVotes.votes || gameWithMostVotes.votes === 0) {
      const gameWithHighestRating = dailyGamesCache.reduce((max, game) => {
          return (game.rating || 0) > (max.rating || 0) ? game : max;
      }, {});
      if (!gameWithHighestRating.id) {
          return res.status(404).json({ message: 'No hay juegos disponibles para hoy.' });
      }
      return res.json({
          ...gameWithHighestRating,
          message: 'Este es el juego del día basado en el rating, ya que no hay votos.',
      });
  }
  res.json({
      ...gameWithMostVotes,
      message: 'Este es el juego del día basado en los votos.',
  });
});


// Inicializar el caché al cargar las rutas
(async () => {
    await updateDailyGamesCache();
})();

// Exportar el router
module.exports = router;
