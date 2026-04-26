const pino = require('pino');
const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
  generateForwardMessageContent,
  generateWAMessageFromContent,
  getContentType,
  proto,
  makeInMemoryStore,
  downloadContentFromMessage
} = require('@trashcore/baileys');

const NodeCache = require('node-cache');
const chalk = require('chalk');
const path = require('path');
const fs = require('fs');
const express = require('express');

require('./settings');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

process.on('uncaughtException', err => console.log('UNCAUGHT ERROR:', err));
process.on('unhandledRejection', err => console.log('UNHANDLED REJECTION:', err));

const msgRetryCounterCache = new NodeCache();
const activeSessions = new Set();

async function startBot(sessionId = 'killua~default') {
  if (activeSessions.has(sessionId)) return;
  activeSessions.add(sessionId);

  const sessionPath = path.join(__dirname, 'sessionfile', sessionId);
  const { state, saveCreds } = await useMultiFileAuthState(sessionPath);
  const { version } = await fetchLatestBaileysVersion();

  const store = makeInMemoryStore({ logger: pino().child({ level: 'silent' }) });

  const conn = makeWASocket({
    version,
    logger: pino({ level: 'silent' }),
    printQRInTerminal: false,
    browser: ["Ubuntu", "Chrome", "20.0.04"],
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" })),
    },
    msgRetryCounterCache
  });

  global.conn = conn;
  store.bind(conn.ev);

  conn.ev.on('messages.upsert', async (chatUpdate) => {
    try {
      let m = chatUpdate.messages[0];
      if (!m.message) return;
      require('./case')(conn, m, chatUpdate, store);
    } catch (e) {
      console.log("CASE ERROR:", e);
    }
  });

  conn.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === 'close') {
      activeSessions.delete(sessionId);
      const shouldReconnect =
        lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
      if (shouldReconnect) startBot(sessionId);
    }
    if (connection === 'open') {
      console.log("Connected: " + sessionId);
    }
  });

  conn.ev.on('creds.update', saveCreds);
  return conn;
}

async function init() {
  const sessionDir = path.join(__dirname, 'sessionfile');
  if (!fs.existsSync(sessionDir)) fs.mkdirSync(sessionDir);
  await startBot(global.sessionPrefix + 'default');
}

const tempSessions = new Map();

app.post('/api/session/request', async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.json({ success: false });

    const tempId = 'temp_' + Math.random().toString(36).slice(2);
    const tempPath = path.join(__dirname, 'sessionfile', tempId);
    fs.mkdirSync(tempPath, { recursive: true });

    const { state, saveCreds } = await useMultiFileAuthState(tempPath);
    const { version } = await fetchLatestBaileysVersion();

    const conn = makeWASocket({
      version,
      logger: pino({ level: 'silent' }),
      printQRInTerminal: false,
      auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" })),
      }
    });

    conn.ev.on('creds.update', saveCreds);
    const code = await conn.requestPairingCode(phone);

    res.json({
      success: true,
      sessionId: tempId,
      code: code?.match(/.{1,4}/g)?.join("-") || code
    });

  } catch (e) {
    res.json({ success: false, message: e.message });
  }
});

app.use('/sessiongen', express.static(path.join(__dirname, 'sessiongen')));

app.get('/', (req, res) => {
  res.redirect('/sessiongen');
});

app.listen(port, () => {
  console.log("Server running on port " + port);
  init();
});
