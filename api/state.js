const db = require('../data/database.json');

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

  res.statusCode = 200;
  res.end(JSON.stringify({
    success: true,
    workers: db.workers || [],
    settings: db.settings || {},
    botStatus: {
      isConfigured: Boolean(db.settings && db.settings.botToken),
      isPolling: false,
      botUsername: (db.settings && db.settings.botUsername) || ''
    }
  }));
};
