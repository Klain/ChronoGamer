const axios = require('axios');
require('dotenv').config();

let accessToken = null;

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
        console.log(`Rate limit exceeded. Retrying in ${retryAfter} seconds...`);
        await sleep(retryAfter * 1000);
      } else if (error.response && error.response.status >= 500) {
        console.log(`Server error (${error.response.status}). Retrying...`);
        await sleep(2000);
      } else {
        console.error(`Request failed: ${error.message}`);
        throw error;
      }
      retries++;
    }
  }
  throw new Error('Max retries exceeded');
}

async function fetchGamesByDate(date) {
  const token = await getAccessToken();

  const selectedDate = new Date(date);
  const month = selectedDate.getMonth() + 1;
  const day = selectedDate.getDate();
  const currentYear = selectedDate.getFullYear();
  const startYear = 1980;
  const results = [];

  for (let year = startYear; year <= currentYear; year++) {
    try {
      console.log(`Fetching games for ${year}-${month}-${day}`);
      const response = await fetchWithRetry(
        'https://api.igdb.com/v4/release_dates',
        `fields game, date, human, platform, region; 
         where human = "${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}";`,
        {
          'Client-ID': process.env.TWITCH_CLIENT_ID,
          Authorization: `Bearer ${token}`,
        }
      );
      results.push(...response.data);
      console.log(`Data for year ${year}:`, response.data.length ? response.data : 'No data');
    } catch (error) {
      console.error(`Error fetching data for year ${year}:`, error.message);
    }

    // Ajusta el límite de tasa según sea necesario
    await sleep(500); // Reducir la frecuencia a 2 solicitudes por segundo
  }

  const gameIds = [...new Set(results.map((release) => release.game))];
  if (gameIds.length === 0) return [];

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
    return gamesResponse.data;
  } catch (error) {
    console.error('Error fetching game details:', error.message);
    return [];
  }
}

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
    console.error('Error fetching game details:', error.message);
    return null;
  }
}

module.exports = { fetchGamesByDate, fetchGameDetails };
