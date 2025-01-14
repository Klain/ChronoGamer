//src\app.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./src/swagger.yaml');
require('dotenv').config();

const authRouter = require('./routes/auth');
const gamesRouter = require('./routes/games'); // Nueva ruta para videojuegos

const app = express();
const PORT = process.env.PORT || 3000;

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Rutas
app.use('/api/auth', authRouter);
app.use('/api/games', gamesRouter); // Nueva ruta

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
