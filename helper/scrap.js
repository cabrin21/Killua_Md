const axios = require('axios');
const cheerio = require('cheerio');

async function scrapData(url) {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    return $;
  } catch (e) {
    console.error(e);
    return null;
  }
}

module.exports = { scrapData };
