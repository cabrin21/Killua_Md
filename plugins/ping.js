module.exports = {
  name: 'ping',
  category: 'main',
  desc: 'Check bot response time',
  async execute(m, { conn }) {
    const start = Date.now();
    await conn.sendMessage(m.chat, { text: 'Pinging...' }, { quoted: m });
    const end = Date.now();
    await conn.sendMessage(m.chat, { text: `Pong! ${end - start}ms` }, { quoted: m });
  }
}
