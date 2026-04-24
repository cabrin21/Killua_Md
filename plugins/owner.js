module.exports = {
  name: 'restart',
  category: 'owner',
  desc: 'Restart the bot',
  async execute(m, { conn, isOwner }) {
    if (!isOwner) return m.reply('Owner only!');
    await m.reply('Restarting...');
    process.exit();
  }
}
