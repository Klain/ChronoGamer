//src\routes\auth.js
const express = require('express');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authenticateToken = require('../middleware/auth');
const db = require('../database');
const router = express.Router();

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

// Obtener el id del juego votado hoy por un usuario
router.get('/voted-game', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const today = new Date().toISOString().split('T')[0];

  try {
    // Consultar la información del usuario
    const userRow = await new Promise((resolve, reject) => {
      db.get(
        'SELECT id_voted_game, last_vote_date FROM users WHERE id = ?',
        [userId],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });

    if (!userRow) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Verificar si el último voto fue hecho hoy
    if (userRow.last_vote_date === today) {
      return res.status(200).json({
        id_voted_game: userRow.id_voted_game,
        message: 'Juego votado hoy encontrado',
      });
    } else {
      return res.status(404).json({
        message: 'No se ha registrado un voto hoy para este usuario',
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
