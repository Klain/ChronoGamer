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
  const timestamp = new Date(date).getTime() / 1000; // Convertir a timestamp Unix
  const response = await axios.post(
    'https://api.igdb.com/v4/games',
    `fields name, release_dates.date, platforms.name; where release_dates.date = ${timestamp};`,
    {
      headers: {
        'Client-ID': process.env.TWITCH_CLIENT_ID,
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
}

async function fetchGameDetails(id) {
  const token = await getAccessToken();
  const response = await axios.post(
    'https://api.igdb.com/v4/games',
    `fields name, summary, genres.name, platforms.name, screenshots.url; where id = ${id};`,
    {
      headers: {
        'Client-ID': process.env.TWITCH_CLIENT_ID,
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data[0]; // Devuelve solo el primer resultado
}

module.exports = { fetchGamesByDate, fetchGameDetails };
