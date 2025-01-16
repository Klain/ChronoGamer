//backend\src\app.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const cron = require('node-cron'); 
require('dotenv').config();

const authRouter = require('./routes/auth');
const { router: gamesRouter } = require('./routes/games');
const { updateDailyGamesCache } = require('./routes/games');

const swaggerDocument = YAML.load('./src/swagger.yaml');
const app = express();
const PORT = process.env.PORT || 3000;

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Rutas
app.use('/api/auth', authRouter);
app.use('/api/games', gamesRouter);

//Cron
cron.schedule('0 0 * * *', async () => {
  console.log('Ejecutando tarea programada para actualizar el caché diario...');
  await updateDailyGamesCache();
});

app.listen(PORT, async () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  await updateDailyGamesCache();
});
