// Vercel Serverless Function: /api/state
let cachedDb = null;

try {
  cachedDb = require('../data/database.json');
} catch (e) {
  try {
    cachedDb = require('../public/data/database.json');
  } catch (err) {
    cachedDb = { settings: {}, workers: [], orders: [] };
  }
}

module.exports = (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    return res.end();
  }

  const db = cachedDb || { settings: {}, workers: [], orders: [] };

  res.statusCode = 200;
  return res.end(JSON.stringify({
    success: true,
    workers: db.workers || [],
    orders: db.orders || [],
    settings: db.settings || {},
    botStatus: {
      isConfigured: Boolean(db.settings && db.settings.botToken),
      isPolling: false,
      botUsername: (db.settings && db.settings.botUsername) || ''
    }
  }));
};
