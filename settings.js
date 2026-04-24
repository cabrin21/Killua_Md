const fs = require('fs');
const chalk = require('chalk');

// Settings for killua MD
global.owner = ['243906905464'];
global.ownerName = 'Killua';
global.botName = 'KILLUA MD';
global.prefix = ['.', '/', '!']; // Multiprefix
global.newsletterJid = '120363402440396622@newsletter';
global.groupInvite = 'HeMpaJhQvBD1qm9LD56gnP';
global.mode = 'public'; // 'public' or 'self'
global.iphoneMode = false; // 'true' or 'false'

// Auto features
global.autoStatus = true;
global.autoLikeStatus = true;
global.autoViewStatus = true;
global.autoRead = true;
global.autoType = true;
global.autoRecord = false;
global.autoOnline = true;
global.freezeLastSeen = false;
global.offlineMod = false;

// Anti-features options: 'del', 'warn', 'kick', 'block', 'on', 'off'
global.antiLink = 'del';
global.antiGcMention = 'del';
global.antiTag = 'del';
global.antiBot = 'del';
global.antiMedia = 'off';
global.antiBadword = 'del';
global.antiSticker = 'off';
global.antiScam = 'del';
global.antiVirus = 'del';
global.antiBug = 'del';
global.antiCall = 'on'; // Anticall on
global.antiSimp = 'off';
global.antiDelete = 'on'; // Antidelete on
global.welcome = 'on'; // Welcome on
global.left = 'on'; // Left on
global.autoJoin = true; // Auto join on

// Session ID prefix
global.sessionPrefix = 'killua~';

// Thumbnails & Media (Indonesian Girl theme)
global.thumb = 'https://i.ibb.co/9J4KLpT/upload-1776902883224-98be8de8-jpg.jpg'; // Indonesian girl placeholder
global.menuImage = 'https://i.ibb.co/mF6KZ8zg/upload-1776902742357-e1b72b59-jpg.jpg';
global.carouselImages = [
  'https://i.ibb.co/zTSrXJbX/upload-1776902733545-5f67ba7a-jpg.jpg',
  'https://i.ibb.co/jcqtTg5/upload-1776902716049-c9c4372f-jpg.jpg',
  'https://i.ibb.co/zWKPh9Sk/upload-1776902690897-c5c9effa-jpg.jpg'
];

// Verification
global.verifiedBusiness = true;

let file = require.resolve(__filename);
fs.watchFile(file, () => {
  fs.unwatchFile(file);
  console.log(chalk.redBright(`Update 'settings.js'`));
  delete require.cache[file];
  require(file);
});
