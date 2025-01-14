const axios = require('axios');
require('dotenv').config();

let accessToken = null;
const cache = {};
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Obtener token de acceso
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

// Reintentar peticiones en caso de error
async function fetchWithRetry(url, data, headers, maxRetries = 5) {
  let retries = 0;
  while (retries < maxRetries) {
    try {
      const response = await axios.post(url, data, { headers });
      return response;
    } catch (error) {
      if (error.response && error.response.status === 429) {
        const retryAfter = parseInt(error.response.headers['retry-after'] || '1', 10);
        console.log(`Rate limit excedido. Reintentando en ${retryAfter} segundos...`);
        await sleep(retryAfter * 1000);
      } else if (error.response && error.response.status >= 500) {
        console.log(`Error del servidor (${error.response.status}). Reintentando...`);
        await sleep(2000);
      } else {
        console.error(`Error en la petición: ${error.message}`);
        throw error;
      }
      retries++;
    }
  }
  throw new Error('Número máximo de reintentos excedido');
}

// Obtener juegos por fecha con el endpoint "games"
async function fetchGamesByDate(date) {
  if (cache[date]) {
    console.log(`Sirviendo datos desde caché para la fecha: ${date}`);
    return cache[date];
  }

  const token = await getAccessToken();
  const selectedDate = new Date(date);
  const month = String(selectedDate.getMonth() + 1).padStart(2, '0'); // Mes actual
  const day = String(selectedDate.getDate()).padStart(2, '0'); // Día actual

  try {
    console.log(`Consultando juegos para la fecha: ${day}-${month}`);

    // Consulta al endpoint "games"
    const response = await fetchWithRetry(
      'https://api.igdb.com/v4/games',
      `fields id, name, genres.name, platforms.name, cover.url, release_dates.human, release_dates.date, summary; 
       where release_dates.human ~ *"${month}-${day}"*;`,
      {
        'Client-ID': process.env.TWITCH_CLIENT_ID,
        Authorization: `Bearer ${token}`,
      }
    );

    const games = response.data;

    if (games.length === 0) {
      console.log('No se encontraron juegos para la fecha proporcionada.');
      cache[date] = [];
      return [];
    }

    console.log(`Juegos encontrados: ${games.length}`);
    cache[date] = games; // Cachear resultados
    return games;
  } catch (error) {
    console.error('Error al consultar el endpoint "games":', error.message);
    return [];
  }
}

// Obtener detalles de un juego específico
async function fetchGameDetails(id) {
  const token = await getAccessToken();

  try {
    const response = await fetchWithRetry(
      'https://api.igdb.com/v4/games',
      `fields name, summary, genres.name, platforms.name, screenshots.url, cover.url; where id = ${id};`,
      {
        'Client-ID': process.env.TWITCH_CLIENT_ID,
        Authorization: `Bearer ${token}`,
      }
    );
    return response.data[0];
  } catch (error) {
    console.error('Error al obtener detalles del juego:', error.message);
    return null;
  }
}

module.exports = { fetchGamesByDate, fetchGameDetails };