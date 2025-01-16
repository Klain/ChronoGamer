//src\routes\auth.js
const express = require('express');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database');
const router = express.Router();
const authenticateToken = require('../middleware/auth');



// Registro de usuarios
router.post('/register', [
  body('username').isString().isLength({ min: 3 }),
  body('password').isString().isLength({ min: 6 }),
],
(req, res) => {
  const { username, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  db.run(
    'INSERT INTO users (username, password) VALUES (?, ?)',
    [username, hashedPassword],
    function (err) {
      if (err) {
        if (err.code === 'SQLITE_CONSTRAINT') {
          res.status(400).json({ error: 'El nombre de usuario ya existe' });
        } else {
          res.status(500).json({ error: err.message });
        }
      } else {
        res.status(201).json({ id: this.lastID, username });
      }
    }
  );
});

// Inicio de sesión
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (!user || !bcrypt.compareSync(password, user.password)) {
      res.status(401).json({ error: 'Credenciales inválidas' });
    } else {
      const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });
      res.json({ token });
    }
  });
});

// Voto Usuario
router.post('/:id/vote', authenticateToken, async (req, res) => {
  const gameId = parseInt(req.params.id, 10);
  const userId = req.user.id;
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

        const game = dailyGamesCache.find(g => g.id === gameId);
        if (game) {
          game.votes = (game.votes || 0) + 1;
        }

        res.status(200).json({ message: 'Voto registrado correctamente' });
      });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
