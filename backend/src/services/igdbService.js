const axios = require('axios');
require('dotenv').config();

let accessToken = null;
const cache = {};
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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

async function fetchGamesByDate(date) {
  if (cache[date]) {
    console.log(`Sirviendo datos desde caché para la fecha: ${date}`);
    return cache[date];
  }

  const token = await getAccessToken();
  const selectedDate = new Date(date);
  const month = String(selectedDate.getMonth() + 1).padStart(2, '0'); 
  const day = String(selectedDate.getDate()).padStart(2, '0');
  const currentYear = selectedDate.getFullYear();
  const startYear = 1980;
  const results = [];

  for (let year = startYear; year <= currentYear; year++) {
    const dateForYear = `${year}-${month}-${day}`;
    const timestampStart = new Date(dateForYear).getTime() / 1000;
    const timestampEnd = timestampStart + 86400; // 24 horas después

    try {
      console.log(`Consultando juegos para la fecha: ${dateForYear}`);
      const response = await fetchWithRetry(
        'https://api.igdb.com/v4/games',
        `fields id, name, genres.name, platforms.name, cover.url, release_dates.date, summary, rating; 
         where release_dates.date >= ${timestampStart} & release_dates.date < ${timestampEnd};`,
        {
          'Client-ID': process.env.TWITCH_CLIENT_ID,
          Authorization: `Bearer ${token}`,
        }
      );

      if (response.data.length > 0) {
        console.log(`Juegos encontrados para ${year}:`, response.data.length);
        results.push(...response.data);
      } else {
        console.log(`No se encontraron juegos para ${dateForYear}`);
      }
    } catch (error) {
      console.error(`Error consultando juegos para ${year}:`, error.message);
    }

    await sleep(500);
  }

  // Filtrar los juegos con fecha de lanzamiento mínima que coincida con el día y mes
  const filteredResults = results.filter(game => {
    const minDate = game.release_dates.reduce((min, release) => {
      return release.date < min.date ? release : min;
    }, game.release_dates[0]);

    const releaseDate = new Date(minDate.date * 1000);
    return (
      releaseDate.getMonth() + 1 === parseInt(month, 10) &&
      releaseDate.getDate() === parseInt(day, 10)
    );
  });

  // Conservar solo la fecha mínima de cada juego
  const processedResults = filteredResults.map(game => {
    const minDate = game.release_dates.reduce((min, release) => {
      return release.date < min.date ? release : min;
    });

    return {
      ...game,
      release_dates: [minDate], // Solo conservar la más baja
    };
  });

  cache[date] = processedResults;
  console.log(`Resultados procesados: ${processedResults.length} juegos`);
  return processedResults;
}

async function fetchGameDetails(id) {
  const token = await getAccessToken();

  try {
    const response = await fetchWithRetry(
      'https://api.igdb.com/v4/games',
      `fields name, genres.name, platforms.name, cover.url, release_dates.date, summary, rating; where id = ${id};`,
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
