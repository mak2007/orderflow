// Vercel Serverless Function: /api/auth
module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    return res.end();
  }

  // Parse body safely
  let body = {};
  if (req.method === 'POST') {
    if (typeof req.body === 'object' && req.body !== null) {
      body = req.body;
    } else {
      try {
        const raw = await new Promise((resolve) => {
          let str = '';
          req.on('data', chunk => str += chunk);
          req.on('end', () => resolve(str));
        });
        body = raw ? JSON.parse(raw) : {};
      } catch (e) {
        body = {};
      }
    }
  }

  const validCodes = ['7788', '1234', 'admin', 'admin88', 'boss2026', 'WORKER-B030-0827-9A88-4A04'];
  const code = (body.passcode || body.password || '').trim();

  if (req.method === 'POST') {
    if (validCodes.includes(code) || code.toLowerCase() === 'admin' || code.toUpperCase() === 'WORKER-B030-0827-9A88-4A04') {
      res.statusCode = 200;
      return res.end(JSON.stringify({
        success: true,
        user: { role: 'boss', name: 'Boss Admin' },
        token: 'token-boss-' + Date.now()
      }));
    }
    res.statusCode = 401;
    return res.end(JSON.stringify({ success: false, error: 'Invalid Passcode / Key' }));
  }

  // GET /api/auth/status
  res.statusCode = 200;
  return res.end(JSON.stringify({
    success: true,
    authRequired: true,
    defaultPinHint: '7788'
  }));
};
