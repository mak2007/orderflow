const fs = require('fs');
const path = require('path');

// On Vercel use /tmp (writable). Seed from bundled data on cold start.
// Try public/data first (new layout), fall back to data/
const SEED_PATH = fs.existsSync(path.join(__dirname, '..', 'public', 'data', 'database.json'))
  ? path.join(__dirname, '..', 'public', 'data', 'database.json')
  : path.join(__dirname, '..', 'data', 'database.json');
const DB_PATH = process.env.VERCEL ? '/tmp/database.json' : SEED_PATH;

function getDb() {
  // Seed /tmp on Vercel cold start
  if (process.env.VERCEL && !fs.existsSync(DB_PATH)) {
    try {
      if (fs.existsSync(SEED_PATH)) fs.copyFileSync(SEED_PATH, DB_PATH);
    } catch (e) { /* ignore */ }
  }
  try {
    if (fs.existsSync(DB_PATH)) return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
  } catch (e) { /* fall through */ }
  // Fallback: read seed directly
  try {
    if (fs.existsSync(SEED_PATH)) return JSON.parse(fs.readFileSync(SEED_PATH, 'utf8'));
  } catch (e) { /* ignore */ }
  return { settings: {}, workers: [], orders: [] };
}

module.exports = (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  try {
    const db = getDb();
    res.statusCode = 200;
    res.end(JSON.stringify({
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
  } catch (e) {
    res.statusCode = 500;
    res.end(JSON.stringify({ success: false, error: e.message }));
  }
};
