// Enhanced HTTP Server & API for OrderFlow & Inventory Hub
const http = require('http');
const fs = require('fs');
const path = require('path');
const TelegramBotEngine = require('./telegram-bot');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = __dirname;
const DB_PATH = path.join(__dirname, 'data', 'database.json');

// MIME types
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

// Database Manager
class DatabaseManager {
  constructor(filepath) {
    this.filepath = filepath;
    this.data = this.load();
  }

  load() {
    try {
      if (fs.existsSync(this.filepath)) {
        const raw = fs.readFileSync(this.filepath, 'utf8');
        return JSON.parse(raw);
      }
    } catch (e) {
      console.error('Error loading database file:', e.message);
    }
    return {
      settings: { botToken: '', botUsername: '', defaultRate: 15.00 },
      workers: [],
      orders: []
    };
  }

  saveDb() {
    try {
      fs.writeFileSync(this.filepath, JSON.stringify(this.data, null, 2), 'utf8');
    } catch (e) {
      console.error('Error saving database file:', e.message);
    }
  }

  getDb() {
    return this.data;
  }
}

const dbManager = new DatabaseManager(DB_PATH);
const botEngine = new TelegramBotEngine(dbManager);

// Auto-start bot if token exists in DB
if (dbManager.getDb().settings && dbManager.getDb().settings.botToken) {
  botEngine.setToken(dbManager.getDb().settings.botToken);
  botEngine.start().catch(err => {
    console.error('Bot auto-start notice:', err.message);
  });
}

// Parse request body helper
function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', reject);
  });
}

// Send JSON helper
function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(JSON.stringify(data));
}

// Server handler
const server = http.createServer(async (req, res) => {
  // Handle CORS Preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end();
    return;
  }

  const parsedUrl = req.url.split('?')[0];

  // API Routes
  if (parsedUrl.startsWith('/api/')) {
    try {
      const db = dbManager.getDb();

      // GET /api/state
      if (req.method === 'GET' && parsedUrl === '/api/state') {
        return sendJson(res, 200, {
          success: true,
          orders: db.orders,
          workers: db.workers,
          settings: db.settings,
          botStatus: botEngine.getStatus()
        });
      }

      // POST /api/orders (Create Order)
      if (req.method === 'POST' && parsedUrl === '/api/orders') {
        const body = await parseJsonBody(req);
        const newOrder = {
          id: body.id || `ord-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          workerKey: body.workerKey || '',
          workerName: body.workerName || 'Unknown Worker',
          telegramUsername: body.telegramUsername || '',
          orderId: body.orderId || '',
          orderNumber: body.orderNumber || '',
          uniqueId: body.uniqueId || '',
          payoutAmount: Number(body.payoutAmount) || 15.00,
          inventoryStatus: body.inventoryStatus || 'unsold',
          fulfillmentStatus: body.fulfillmentStatus || 'unfulfilled',
          workerPaymentStatus: body.workerPaymentStatus || 'unpaid',
          notes: body.notes || '',
          createdAt: body.createdAt || new Date().toISOString(),
          soldAt: body.inventoryStatus === 'sold' ? new Date().toISOString() : null,
          fulfilledAt: body.fulfillmentStatus === 'fulfilled' ? new Date().toISOString() : null,
          paidAt: body.workerPaymentStatus === 'paid' ? new Date().toISOString() : null
        };
        db.orders.unshift(newOrder);
        dbManager.saveDb();
        return sendJson(res, 201, { success: true, order: newOrder });
      }

      // PUT /api/orders/:id (Update Order)
      if (req.method === 'PUT' && parsedUrl.startsWith('/api/orders/')) {
        const id = parsedUrl.replace('/api/orders/', '');
        const body = await parseJsonBody(req);
        const order = db.orders.find(o => o.id === id);
        if (!order) return sendJson(res, 404, { success: false, error: 'Order not found' });

        Object.assign(order, body);
        dbManager.saveDb();
        return sendJson(res, 200, { success: true, order });
      }

      // DELETE /api/orders/:id
      if (req.method === 'DELETE' && parsedUrl.startsWith('/api/orders/')) {
        const id = parsedUrl.replace('/api/orders/', '');
        db.orders = db.orders.filter(o => o.id !== id);
        dbManager.saveDb();
        return sendJson(res, 200, { success: true });
      }

      // POST /api/orders/batch
      if (req.method === 'POST' && parsedUrl === '/api/orders/batch') {
        const body = await parseJsonBody(req);
        const { ids, action } = body;
        const now = new Date().toISOString();

        if (action === 'delete') {
          db.orders = db.orders.filter(o => !ids.includes(o.id));
        } else {
          db.orders.forEach(o => {
            if (ids.includes(o.id)) {
              if (action === 'markSold') {
                o.inventoryStatus = 'sold';
                if (!o.soldAt) o.soldAt = now;
              } else if (action === 'markUnsold') {
                o.inventoryStatus = 'unsold';
                o.soldAt = null;
                o.fulfillmentStatus = 'unfulfilled';
              } else if (action === 'markFulfilled') {
                o.fulfillmentStatus = 'fulfilled';
                o.fulfilledAt = now;
              } else if (action === 'markPaid') {
                o.workerPaymentStatus = 'paid';
                o.paidAt = now;
              }
            }
          });
        }

        dbManager.saveDb();
        return sendJson(res, 200, { success: true, count: ids.length });
      }

      // POST /api/workers (Create Worker Key)
      if (req.method === 'POST' && parsedUrl === '/api/workers') {
        const body = await parseJsonBody(req);
        const workerKey = (body.key || `KEY-${(body.name || 'WORKER').slice(0, 4).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`).trim();

        const newWorker = {
          id: body.id || `w-${Date.now()}`,
          name: body.name || 'New Worker',
          key: workerKey,
          telegramId: body.telegramId || null,
          telegramUsername: body.telegramUsername || null,
          rate: Number(body.rate) || 15.00,
          linkedAt: body.telegramId ? new Date().toISOString() : null,
          status: 'active'
        };

        db.workers.push(newWorker);
        dbManager.saveDb();
        return sendJson(res, 201, { success: true, worker: newWorker });
      }

      // PUT /api/workers/:id
      if (req.method === 'PUT' && parsedUrl.startsWith('/api/workers/')) {
        const id = parsedUrl.replace('/api/workers/', '');
        const body = await parseJsonBody(req);
        const worker = db.workers.find(w => w.id === id);
        if (!worker) return sendJson(res, 404, { success: false, error: 'Worker not found' });

        Object.assign(worker, body);
        dbManager.saveDb();
        return sendJson(res, 200, { success: true, worker });
      }

      // DELETE /api/workers/:id
      if (req.method === 'DELETE' && parsedUrl.startsWith('/api/workers/')) {
        const id = parsedUrl.replace('/api/workers/', '');
        db.workers = db.workers.filter(w => w.id !== id);
        dbManager.saveDb();
        return sendJson(res, 200, { success: true });
      }

      // POST /api/workers/:id/mark-paid (Batch pay & optional Telegram Alert)
      if (req.method === 'POST' && parsedUrl.includes('/mark-paid')) {
        const id = parsedUrl.split('/')[3];
        const worker = db.workers.find(w => w.id === id);
        if (!worker) return sendJson(res, 404, { success: false, error: 'Worker not found' });

        const now = new Date().toISOString();
        let totalPaidAmount = 0;
        let paidCount = 0;

        db.orders.forEach(o => {
          if ((o.workerKey === worker.key || o.workerName === worker.name) && o.workerPaymentStatus !== 'paid') {
            o.workerPaymentStatus = 'paid';
            o.paidAt = now;
            totalPaidAmount += (Number(o.payoutAmount) || worker.rate);
            paidCount++;
          }
        });

        dbManager.saveDb();

        // Send Telegram payout alert if linked
        let telegramSent = false;
        if (worker.telegramId && totalPaidAmount > 0) {
          telegramSent = await botEngine.sendPayoutNotification(worker.key, totalPaidAmount, paidCount);
        }

        return sendJson(res, 200, {
          success: true,
          paidCount,
          totalPaidAmount,
          telegramSent
        });
      }

      // POST /api/bot/config
      if (req.method === 'POST' && parsedUrl === '/api/bot/config') {
        const body = await parseJsonBody(req);
        db.settings.botToken = (body.botToken || '').trim();
        dbManager.saveDb();

        botEngine.setToken(db.settings.botToken);
        if (db.settings.botToken) {
          const started = await botEngine.start();
          return sendJson(res, 200, {
            success: started,
            botStatus: botEngine.getStatus(),
            message: started ? `Bot connected as @${botEngine.botUsername}` : (botEngine.lastError || 'Failed to connect')
          });
        } else {
          botEngine.stop();
          return sendJson(res, 200, { success: true, botStatus: botEngine.getStatus(), message: 'Bot stopped' });
        }
      }

      // POST /api/bot/notify-worker
      if (req.method === 'POST' && parsedUrl === '/api/bot/notify-worker') {
        const body = await parseJsonBody(req);
        const { telegramId, message } = body;
        if (!telegramId || !message) {
          return sendJson(res, 400, { success: false, error: 'telegramId and message required' });
        }

        const sent = await botEngine.sendMessage(telegramId, message);
        return sendJson(res, 200, { success: Boolean(sent) });
      }

      return sendJson(res, 404, { success: false, error: 'Endpoint not found' });
    } catch (err) {
      console.error('API Error:', err);
      return sendJson(res, 500, { success: false, error: err.message });
    }
  }

  // Static File Serving
  let reqUrl = parsedUrl;
  if (reqUrl === '/') reqUrl = '/index.html';
  const filePath = path.join(PUBLIC_DIR, reqUrl);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 OrderFlow Dashboard & API running at: http://localhost:${PORT}`);
  console.log(`🤖 Telegram Bot Engine initialized`);
  console.log(`======================================================\n`);
});
