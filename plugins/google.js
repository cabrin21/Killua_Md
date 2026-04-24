module.exports = {
  name: 'google',
  category: 'tools',
  desc: 'Search on Google',
  async execute(m, { conn, text }) {
    if (!text) return m.reply('What do you want to search?');
    m.reply(`Searching Google for: ${text}\n\nhttps://www.google.com/search?q=${encodeURIComponent(text)}`);
  }
}
