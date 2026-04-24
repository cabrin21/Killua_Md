module.exports = {
  name: 'ytmp3',
  category: 'downloader',
  desc: 'Download YouTube MP3',
  async execute(m, { conn, text }) {
    if (!text) return m.reply('Provide YouTube link!');
    m.reply('Downloading MP3... (Service integration required)');
  }
}
