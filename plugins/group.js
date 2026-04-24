module.exports = {
  name: 'group',
  category: 'group',
  desc: 'Open or close the group',
  async execute(m, { conn, args, isGroup, isAdmin, isBotAdmin }) {
    if (!isGroup) return m.reply('Group only!');
    if (!isAdmin) return m.reply('Admin only!');
    if (!isBotAdmin) return m.reply('Bot not admin!');
    if (args[0] === 'open') {
      await conn.groupSettingUpdate(m.chat, 'not_announcement');
      m.reply('Group opened!');
    } else if (args[0] === 'close') {
      await conn.groupSettingUpdate(m.chat, 'announcement');
      m.reply('Group closed!');
    } else {
      m.reply('Use open or close!');
    }
  }
}
