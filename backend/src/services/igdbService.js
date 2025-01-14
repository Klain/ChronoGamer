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

  // Extraemos el mes y el día
  const selectedDate = new Date(date);
  const month = selectedDate.getMonth() + 1; 
  const day = selectedDate.getDate(); 

  const response = await axios.post(
    'https://api.igdb.com/v4/games',
    `fields name, release_dates.date, platforms.name, genres.name, cover.url; 
     where release_dates.date != null & 
           release_dates.human ~ "*-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}";`,
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

