const axios = require('axios');
require('dotenv').config();

let accessToken = null;

// Caché en memoria para almacenar resultados diarios
const cache = {};

// Pausa para respetar límites de tasa
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Obtener token de acceso de Twitch
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

// Obtener juegos por fecha
async function fetchGamesByDate(date) {
  // Verificar si los datos ya están en caché
  if (cache[date]) {
    console.log(`Sirviendo datos desde caché para la fecha: ${date}`);
    return cache[date];
  }

  const token = await getAccessToken();
  const selectedDate = new Date(date);
  const month = selectedDate.getMonth() + 1;
  const day = selectedDate.getDate();
  const currentYear = selectedDate.getFullYear();
  const startYear = 1980;
  const results = [];

  // Consultar lanzamientos para cada año
  for (let year = startYear; year <= currentYear; year++) {
    try {
      console.log(`Consultando juegos para: ${year}-${month}-${day}`);
      const response = await fetchWithRetry(
        'https://api.igdb.com/v4/release_dates',
        `fields game, date, human, platform, region; 
         where human = "${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}";`,
        {
          'Client-ID': process.env.TWITCH_CLIENT_ID,
          Authorization: `Bearer ${token}`,
        }
      );

      if (response.data.length > 0) {
        console.log(`Juegos encontrados para ${year}: ${response.data.length}`);
        results.push(...response.data);
      } else {
        console.log(`No se encontraron juegos para ${year}-${month}-${day}`);
      }
    } catch (error) {
      console.error(`Error consultando juegos para ${year}:`, error.message);
    }

    // Respetar el límite de 2 solicitudes por segundo
    await sleep(500);
  }

  // Obtener IDs únicos de juegos
  const gameIds = [...new Set(results.map((release) => release.game))];
  if (gameIds.length === 0) {
    console.log('No se encontraron juegos para la fecha proporcionada.');
    cache[date] = []; // Cachear resultado vacío
    return [];
  }

  // Obtener detalles de los juegos
  try {
    const gamesResponse = await fetchWithRetry(
      'https://api.igdb.com/v4/games',
      `fields id, name, genres.name, platforms.name, cover.url, summary; 
       where id = (${gameIds.join(',')});`,
      {
        'Client-ID': process.env.TWITCH_CLIENT_ID,
        Authorization: `Bearer ${token}`,
      }
    );
    console.log(`Detalles obtenidos para la fecha ${date}: ${gamesResponse.data.length} juegos`);
    cache[date] = gamesResponse.data; // Cachear resultados finales
    return gamesResponse.data;
  } catch (error) {
    console.error('Error al obtener detalles de los juegos:', error.message);
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
