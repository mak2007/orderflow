let server;
try {
  server = require('../server.js');
} catch (e) {
  console.error('[api/index.js] Failed to load server.js:', e.message);
}

module.exports = (req, res) => {
  if (!server) {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.statusCode = 500;
    res.end(JSON.stringify({ success: false, error: 'Server module failed to initialize' }));
    return;
  }
  return server(req, res);
};
