// Enhanced HTTP Server & API for OrderFlow & Inventory Hub
const http = require('http');
const fs = require('fs');
const path = require('path');
const TelegramBotEngine = require('./telegram-bot');
const { extractMasiData } = require('./sync-masi');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = __dirname;

// On Vercel: use /tmp (the only writable dir in serverless). Seed from bundled database.json on cold start.
const _publicSeed = path.join(__dirname, 'public', 'data', 'database.json');
const _dataSeed = path.join(__dirname, 'data', 'database.json');
const SEED_DB_PATH = fs.existsSync(_publicSeed) ? _publicSeed : _dataSeed;
const DB_PATH = process.env.VERCEL
  ? '/tmp/database.json'
  : SEED_DB_PATH;

// Seed /tmp/database.json from bundled data if not yet present (Vercel cold start)
if (process.env.VERCEL && !fs.existsSync(DB_PATH)) {
  try {
    if (fs.existsSync(SEED_DB_PATH)) {
      fs.copyFileSync(SEED_DB_PATH, DB_PATH);
      console.log('[Vercel] Seeded /tmp/database.json from bundled data');
    }
  } catch (e) {
    console.warn('[Vercel] Could not seed database to /tmp:', e.message);
  }
}

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
      // Silently ignore read-only filesystem errors (e.g. Vercel serverless)
      if (e.code !== 'EROFS' && e.code !== 'ENOENT') {
        console.error('Error saving database file:', e.message);
      }
    }
  }

  getDb() {
    return this.data;
  }
}

const dbManager = new DatabaseManager(DB_PATH);
const botEngine = new TelegramBotEngine(dbManager);

// Auto-start bot if token exists in DB — but NOT on Vercel (serverless can't run long-poll loops)
if (!process.env.VERCEL && dbManager.getDb().settings && dbManager.getDb().settings.botToken) {
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
const requestHandler = async (req, res) => {
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
          customSuccessRate: (body.customSuccessRate !== undefined && body.customSuccessRate !== '') ? Number(body.customSuccessRate) : null,
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

      // POST /api/workers/batch-assign-telegram (Bulk assign Telegram usernames & Guy names to keys)
      if (req.method === 'POST' && parsedUrl === '/api/workers/batch-assign-telegram') {
        const body = await parseJsonBody(req);
        const { mappings } = body;
        if (!Array.isArray(mappings)) {
          return sendJson(res, 400, { success: false, error: 'mappings array required' });
        }

        let updated = 0;
        mappings.forEach(m => {
          const key = (m.key || '').trim().toUpperCase();
          let tg = (m.telegramUsername || '').trim();
          if (tg && !tg.startsWith('@')) tg = '@' + tg;
          const personName = (m.personName || '').trim();

          const worker = db.workers.find(w => w.key && w.key.toUpperCase() === key);
          if (worker) {
            worker.telegramUsername = tg || null;
            if (personName) worker.personName = personName;
            worker.updatedAt = new Date().toISOString();
            updated++;
          }
        });

        dbManager.saveDb();
        return sendJson(res, 200, { success: true, updated, workers: db.workers });
      }

      // POST /api/workers/assign-telegram (Single assign key to guy/telegram)
      if (req.method === 'POST' && parsedUrl === '/api/workers/assign-telegram') {
        const body = await parseJsonBody(req);
        const { key, telegramUsername, personName } = body;
        let tg = (telegramUsername || '').trim();
        if (tg && !tg.startsWith('@')) tg = '@' + tg;

        const worker = db.workers.find(w => w.key && w.key.toUpperCase() === (key || '').trim().toUpperCase());
        if (!worker) return sendJson(res, 404, { success: false, error: 'Worker key not found' });

        worker.telegramUsername = tg || null;
        if (personName) worker.personName = personName.trim();
        worker.updatedAt = new Date().toISOString();
        dbManager.saveDb();

        return sendJson(res, 200, { success: true, worker });
      }

      // POST /api/workers/:id/mark-paid (Batch pay & optional Telegram Alert)
      if (req.method === 'POST' && parsedUrl.includes('/mark-paid')) {
        const id = parsedUrl.split('/')[3];
        const worker = db.workers.find(w => w.id === id);
        if (!worker) return sendJson(res, 404, { success: false, error: 'Worker not found' });

        const now = new Date().toISOString();
        const rate = Number(worker.rate) || Number(db.settings.defaultRate) || 15.00;
        const completed = Number(worker.completedOrders) || 0;
        const previousPaid = Number(worker.paidAmount) || 0;
        const totalEarned = completed * rate;
        const unpaidAmount = Math.max(0, totalEarned - previousPaid);
        const unpaidCount = Math.max(0, completed - (Number(worker.paidCount) || 0));

        worker.paidAmount = totalEarned;
        worker.paidCount = completed;
        worker.lastPaidAt = now;

        // Also update any orders if exist
        if (db.orders && Array.isArray(db.orders)) {
          db.orders.forEach(o => {
            if (o.workerKey === worker.key || o.workerName === worker.name) {
              o.workerPaymentStatus = 'paid';
              o.paidAt = now;
            }
          });
        }

        dbManager.saveDb();

        // Send Telegram payout alert if linked
        let telegramSent = false;
        if (worker.telegramId && unpaidAmount > 0) {
          telegramSent = await botEngine.sendPayoutNotification(worker.key, unpaidAmount, unpaidCount);
        }

        return sendJson(res, 200, {
          success: true,
          paidCount: unpaidCount,
          totalPaidAmount: unpaidAmount,
          telegramSent,
          worker
        });
      }

      // POST /api/workers/:id/mark-unpaid (Reset worker payment status to unpaid)
      if (req.method === 'POST' && parsedUrl.includes('/mark-unpaid')) {
        const id = parsedUrl.split('/')[3];
        const worker = db.workers.find(w => w.id === id || w.key === id);
        if (!worker) return sendJson(res, 404, { success: false, error: 'Worker not found' });

        worker.paidAmount = 0;
        worker.paidCount = 0;
        worker.lastPaidAt = null;

        if (db.orders && Array.isArray(db.orders)) {
          db.orders.forEach(o => {
            if (o.workerKey === worker.key || o.workerName === worker.name) {
              o.workerPaymentStatus = 'unpaid';
              o.paidAt = null;
            }
          });
        }

        dbManager.saveDb();
        return sendJson(res, 200, { success: true, worker });
      }

      // POST /api/workers/:id/message (Send direct Telegram message to worker)
      if (req.method === 'POST' && parsedUrl.includes('/message')) {
        const id = parsedUrl.split('/')[3];
        const body = await parseJsonBody(req);
        const { text } = body;
        if (!text || !text.trim()) {
          return sendJson(res, 400, { success: false, error: 'Message text required' });
        }

        const worker = db.workers.find(w => w.id === id || w.key === id);
        if (!worker) return sendJson(res, 404, { success: false, error: 'Worker not found' });

        // Find telegram chat ID
        let tgChatId = worker.telegramId;
        if (!tgChatId && worker.telegramUsername) {
          const match = db.workers.find(w => 
            w.telegramUsername && 
            w.telegramUsername.toLowerCase() === worker.telegramUsername.toLowerCase() && 
            w.telegramId
          );
          if (match) tgChatId = match.telegramId;
        }

        if (!tgChatId) {
          return sendJson(res, 400, {
            success: false,
            error: `Worker "${worker.name}" has not linked Telegram yet. Give them key "${worker.key}" to send to the bot.`
          });
        }

        try {
          const sent = await botEngine.sendMessage(tgChatId, `💬 *Message from Admin:*\n\n${text.trim()}`);
          if (!sent) {
            return sendJson(res, 500, { success: false, error: botEngine.lastError || 'Failed to send message via Telegram' });
          }
          return sendJson(res, 200, { success: true, message: 'Message delivered to Telegram' });
        } catch (err) {
          return sendJson(res, 500, { success: false, error: err.message });
        }
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

      // POST /api/masi/extract (Preview extracted data from masi.cc.cd)
      if (req.method === 'POST' && parsedUrl === '/api/masi/extract') {
        const body = await parseJsonBody(req);
        const { bossKey } = body;
        if (!bossKey) return sendJson(res, 400, { success: false, error: 'Boss Key is required' });

        try {
          const masiData = await extractMasiData(bossKey);
          return sendJson(res, 200, {
            success: true,
            overview: masiData.overview,
            workers: masiData.workers,
            ordersCount: masiData.orders.length
          });
        } catch (err) {
          return sendJson(res, 400, { success: false, error: err.message });
        }
      }

      // POST /api/masi/sync (Import & sync extracted workers and stats into database)
      if (req.method === 'POST' && parsedUrl === '/api/masi/sync') {
        const body = await parseJsonBody(req);
        const { bossKey, masiWorkers, defaultRate } = body;

        let workerList = [];

        const effectiveBossKey = (bossKey || (db.settings && db.settings.bossKey) || 'WORKER-B030-0827-9A88-4A04').trim();

        // Accept pre-extracted workers from client (avoids double API call)
        if (Array.isArray(masiWorkers) && masiWorkers.length > 0) {
          workerList = masiWorkers;
        } else if (effectiveBossKey) {
          try {
            const masiData = await extractMasiData(effectiveBossKey);
            workerList = masiData.workers;
          } catch (err) {
            return sendJson(res, 400, { success: false, error: err.message });
          }
        } else {
          return sendJson(res, 400, { success: false, error: 'Boss Key is required' });
        }

        let importedWorkers = 0;
        let updatedWorkers = 0;

        workerList.forEach(mw => {
          const existing = db.workers.find(w =>
            (w.key && w.key.toUpperCase() === (mw.key || '').toUpperCase()) ||
            (w.name && w.name.toLowerCase() === (mw.name || '').toLowerCase())
          );

          if (existing) {
            existing.name = mw.name;
            existing.key = mw.key;
            existing.completedOrders = Number(mw.completedOrders || mw.completedCount || 0);
            existing.failCount = Number(mw.failCount || 0);
            existing.successRate = Number(mw.successRate || 0);
            existing.customSuccessRate = Number(mw.successRate || 0);
            existing.d7Done = Number(mw.d7Done || 0);
            existing.d7Fail = Number(mw.d7Fail || 0);
            existing.d7Rate = Number(mw.d7Rate || 0);
            existing.online = Boolean(mw.online);
            existing.status = mw.active !== false ? 'active' : 'paused';
            existing.source = 'masi';
            existing.lastSyncedAt = new Date().toISOString();
            updatedWorkers++;
          } else {
            db.workers.push({
              id: `w-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
              name: mw.name,
              key: mw.key,
              rate: Number(defaultRate) || 15.00,
              completedOrders: Number(mw.completedOrders || mw.completedCount || 0),
              failCount: Number(mw.failCount || 0),
              successRate: Number(mw.successRate || 0),
              customSuccessRate: Number(mw.successRate || 0),
              d7Done: Number(mw.d7Done || 0),
              d7Fail: Number(mw.d7Fail || 0),
              d7Rate: Number(mw.d7Rate || 0),
              online: Boolean(mw.online),
              telegramId: null,
              telegramUsername: null,
              linkedAt: null,
              status: mw.active !== false ? 'active' : 'paused',
              source: 'masi',
              lastSyncedAt: new Date().toISOString()
            });
            importedWorkers++;
          }
        });

        dbManager.saveDb();

        return sendJson(res, 200, {
          success: true,
          importedWorkers,
          updatedWorkers,
          totalWorkers: db.workers.length,
          workers: db.workers
        });
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
};

const server = http.createServer(requestHandler);

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`🚀 OrderFlow Dashboard & API running at: http://localhost:${PORT}`);
    console.log(`🤖 Telegram Bot Engine initialized`);
    console.log(`======================================================\n`);
  });
}

module.exports = (req, res) => {
  if (req && res) {
    return requestHandler(req, res);
  }
  return server;
};

