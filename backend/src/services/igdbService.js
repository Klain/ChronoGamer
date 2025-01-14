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

  const selectedDate = new Date(date);
  const month = selectedDate.getMonth() + 1; 
  const day = selectedDate.getDate(); 

  const currentYear = selectedDate.getFullYear();
  const startYear = 1980; 
  const results = []; 

  for (let year = startYear; year <= currentYear; year++) {
    try {
      // Hacemos la consulta para cada año
      const response = await axios.post(
        'https://api.igdb.com/v4/release_dates',
        `fields game, date, human, platform, region; 
         where human = "${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}";`,
        {
          headers: {
            'Client-ID': process.env.TWITCH_CLIENT_ID,
            Authorization: `Bearer ${token}`,
          },
        }
      );

      results.push(...response.data);
    } catch (error) {
      console.error(`Error fetching data for year ${year}:`, error.message);
    }
  }

  const gameIds = [...new Set(results.map((release) => release.game))];

  if (gameIds.length === 0) {
    return []; 
  }

  const gamesResponse = await axios.post(
    'https://api.igdb.com/v4/games',
    `fields id, name, genres.name, platforms.name, cover.url, summary; 
     where id = (${gameIds.join(',')});`,
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
