//src\services\igdbService.js
const axios = require('axios');
require('dotenv').config();

let accessToken = null;

async function getAccessToken() {
  if (!accessToken) {
    const response = await axios.post('https://id.twitch.tv/oauth2/token', null, {
      params: {
        client_id: process.env.TWITCH_CLIENT_ID,
        client_secret: process.env.TWITCH_CLIENT_SECRET,
        grant_type: 'client_credentials',
      },
    });
    accessToken = response.data.access_token;
  }
  return accessToken;
}

async function fetchGamesByDate(date) {
  const token = await getAccessToken();

  // Extraemos el mes y el día del parámetro `date`
  const selectedDate = new Date(date);
  const month = selectedDate.getMonth() + 1; // Mes (1-indexado)
  const day = selectedDate.getDate(); // Día del mes

  const years = Array.from({ length: 43 }, (_, i) => i + 1980); // Rango de años 1980-2023

  // Hacemos múltiples peticiones para cada año
  const requests = years.map((year) =>
    axios.post(
      'https://api.igdb.com/v4/release_dates',
      `fields game, date, human, platform, region; 
       where human = "${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}";`,
      {
        headers: {
          'Client-ID': process.env.TWITCH_CLIENT_ID,
          Authorization: `Bearer ${token}`,
        },
      }
    )
  );

  // Ejecutamos todas las peticiones en paralelo
  const results = await Promise.allSettled(requests);

  // Filtramos y mapeamos los resultados exitosos
  const gamesByYear = results
    .filter((result) => result.status === 'fulfilled')
    .map((result) => result.value.data)
    .flat();

  // Extraemos los IDs únicos de los juegos
  const gameIds = [...new Set(gamesByYear.map((release) => release.game))];

  // Obtenemos información adicional de los juegos
  const gamesResponse = await axios.post(
    'https://api.igdb.com/v4/games',
    `fields name, genres.name, platforms.name, cover.url; where id = (${gameIds.join(',')});`,
    {
      headers: {
        'Client-ID': process.env.TWITCH_CLIENT_ID,
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return gamesResponse.data;
}

async function fetchGameDetails(id) {
  const token = await getAccessToken();

  const response = await axios.post(
    'https://api.igdb.com/v4/games',
    `fields name, summary, genres.name, platforms.name, screenshots.url, cover.url; where id = ${id};`,
    {
      headers: {
        'Client-ID': process.env.TWITCH_CLIENT_ID,
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data[0];
}

module.exports = { fetchGamesByDate, fetchGameDetails };

