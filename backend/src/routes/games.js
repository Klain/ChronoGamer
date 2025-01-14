//src\routes\games.js

const express = require('express');
const authenticateToken = require('../middleware/auth');
const igdbService = require('../services/igdbService');

const router = express.Router();

// Obtener juegos por fecha
router.get('/', authenticateToken, async (req, res) => {
    const date = req.query.date || new Date().toISOString().split('T')[0];
    try {
      const games = await igdbService.fetchGamesByDate(date);
      res.json(games);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  //Devuelve los detalles completos de un juego.
  router.get('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
      const gameDetails = await igdbService.fetchGameDetails(id);
      res.json(gameDetails);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

module.exports = router;
