module.exports = {
  name: 'runtime',
  category: 'user',
  desc: 'Check bot runtime',
  async execute(m, { conn }) {
    const uptime = process.uptime();
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);
    m.reply(`*RUNTIME*\n${hours}h ${minutes}m ${seconds}s`);
  }
}
