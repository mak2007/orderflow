// Telegram Bot Engine for OrderFlow & Inventory Hub
// Native Node.js HTTPS implementation - Zero external dependencies!
const https = require('https');

class TelegramBotEngine {
  constructor(dbManager) {
    this.dbManager = dbManager;
    this.botToken = '';
    this.botUsername = '';
    this.isPolling = false;
    this.pollAbortController = null;
    this.offset = 0;
    this.lastError = null;
    this.lastPollTime = null;
  }

  // Set or update token
  setToken(token) {
    this.botToken = (token || '').trim();
  }

  // Make HTTPS request to Telegram Bot API
  async callApi(method, payload = {}) {
    if (!this.botToken) {
      throw new Error('Telegram Bot Token is not configured');
    }

    return new Promise((resolve, reject) => {
      const postData = JSON.stringify(payload);
      const options = {
        hostname: 'api.telegram.org',
        port: 443,
        path: `/bot${this.botToken}/${method}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        },
        timeout: 35000
      };

      const req = https.request(options, (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
          try {
            const data = JSON.parse(body);
            if (data.ok) {
              resolve(data.result);
            } else {
              reject(new Error(data.description || 'Telegram API error'));
            }
          } catch (e) {
            reject(new Error(`Failed to parse Telegram API response: ${body}`));
          }
        });
      });

      req.on('error', (err) => reject(err));
      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Telegram API request timeout'));
      });

      req.write(postData);
      req.end();
    });
  }

  // Send a markdown message to a chat
  async sendMessage(chatId, text, extra = {}) {
    try {
      return await this.callApi('sendMessage', {
        chat_id: chatId,
        text: text,
        parse_mode: 'Markdown',
        ...extra
      });
    } catch (err) {
      console.error(`[Telegram Bot] Error sending message to ${chatId}:`, err.message);
      this.lastError = err.message;
      return null;
    }
  }

  // Start polling for updates
  async start() {
    if (!this.botToken) {
      this.lastError = 'No bot token provided';
      return false;
    }

    try {
      // Verify bot token with getMe
      const me = await this.callApi('getMe');
      this.botUsername = me.username;
      this.isPolling = true;
      this.lastError = null;
      console.log(`\n🤖 [Telegram Bot] Connected successfully as @${this.botUsername}`);

      // Save bot username to DB
      const db = this.dbManager.getDb();
      if (db.settings) {
        db.settings.botUsername = me.username;
        this.dbManager.saveDb();
      }

      // Begin polling loop
      this.pollLoop();
      return true;
    } catch (err) {
      this.lastError = err.message;
      this.isPolling = false;
      console.error('[Telegram Bot] Connection failed:', err.message);
      return false;
    }
  }

  // Stop polling
  stop() {
    this.isPolling = false;
    console.log('[Telegram Bot] Polling stopped');
  }

  // Continuous polling loop
  async pollLoop() {
    while (this.isPolling) {
      try {
        this.lastPollTime = new Date().toISOString();
        const updates = await this.callApi('getUpdates', {
          offset: this.offset,
          timeout: 20
        });

        if (Array.isArray(updates)) {
          for (const update of updates) {
            this.offset = update.update_id + 1;
            await this.handleUpdate(update);
          }
        }
      } catch (err) {
        if (this.isPolling) {
          // If network error, pause briefly before retrying
          this.lastError = err.message;
          await new Promise(r => setTimeout(r, 4000));
        }
      }
    }
  }

  // Handle incoming update
  async handleUpdate(update) {
    if (!update.message || !update.message.text) return;

    const msg = update.message;
    const chatId = msg.chat.id;
    const from = msg.from;
    const text = msg.text.trim();

    const parts = text.split(/\s+/);
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    if (command === '/start') {
      await this.handleStart(chatId, from);
    } else if (command === '/link' || command === '/register') {
      await this.handleLink(chatId, from, args[0]);
    } else if (command === '/submit' || command === '/add') {
      await this.handleSubmit(chatId, from, args);
    } else if (command === '/stats' || command === '/myorders') {
      await this.handleStats(chatId, from);
    } else if (command === '/pay' || command === '/balance') {
      await this.handleBalance(chatId, from);
    } else if (command === '/bill' || command === '/invoice') {
      await this.handleBill(chatId, from, args[0]);
    } else if (command === '/refresh') {
      await this.handleRefreshAndBill(chatId, from);
    } else if (command === '/help') {
      await this.handleHelp(chatId);
    } else if (!text.startsWith('/')) {
      // Worker just types their key or name directly (no command needed)
      await this.handleBill(chatId, from, text.trim());
    } else {
      if (text.startsWith('/')) {
        await this.sendMessage(chatId, `❓ Unknown command: \`${command}\`\nSend /help to see all available commands.`);
      }
    }
  }

  // Command: /start
  async handleStart(chatId, from) {
    const welcomeText = `
👋 *Welcome to the Worker Bill Bot!*

🧾 *Get your bill instantly — just send your key:*

Just paste your worker key like this:
\`WORKER-XXXX-XXXX-XXXX-XXXX\`

Or use commands:
• \`/bill YOUR_KEY\` — Generate your bill instantly
• \`/refresh\` — Re-fetch live stats & update your bill
• \`/link YOUR_KEY\` — Save your key (so you don't type it each time)
• \`/stats\` — View full performance breakdown
• \`/balance\` — Check unpaid earnings
• \`/help\` — All commands

_Worker stats are pulled live from masi.cc.cd_ 🔄
`;
    await this.sendMessage(chatId, welcomeText);
  }

  // Command: /link <KEY>
  async handleLink(chatId, from, rawKey) {
    if (!rawKey) {
      await this.sendMessage(chatId, `⚠️ *Missing Key!*\nUsage: \`/link YOUR_KEY\`\n_Example: \`/link KEY-ALEX-9921\`_`);
      return;
    }

    const key = rawKey.trim();
    const db = this.dbManager.getDb();
    const worker = db.workers.find(w => w.key && w.key.toUpperCase() === key.toUpperCase());

    if (!worker) {
      await this.sendMessage(chatId, `❌ *Invalid Worker Key: \`${key}\`*\nCould not find a worker assigned to this key. Please ask your admin for your assigned key.`);
      return;
    }

    const username = from.username ? `@${from.username}` : (from.first_name || 'Worker');
    worker.telegramId = chatId.toString();
    worker.telegramUsername = username;
    worker.linkedAt = new Date().toISOString();

    // Auto-link ALL other keys assigned to this same Telegram username or guy
    const otherLinkedKeys = [];
    db.workers.forEach(w => {
      if (w.key.toUpperCase() !== worker.key.toUpperCase()) {
        const matchesUsername = w.telegramUsername && w.telegramUsername.toLowerCase() === username.toLowerCase();
        const matchesGuy = (worker.personName && w.personName && w.personName.toLowerCase() === worker.personName.toLowerCase());
        if (matchesUsername || matchesGuy) {
          w.telegramId = chatId.toString();
          w.telegramUsername = username;
          w.linkedAt = new Date().toISOString();
          otherLinkedKeys.push(w);
        }
      }
    });

    // Also update matching worker orders with username
    db.orders.forEach(o => {
      if (o.workerKey === worker.key || o.workerName === worker.name) {
        o.telegramUsername = username;
      }
    });

    this.dbManager.saveDb();

    let keysListText = `🔑 *Assigned Key:* \`${worker.key}\``;
    if (otherLinkedKeys.length > 0) {
      keysListText = `🔑 *Primary Key:* \`${worker.key}\`\n👥 *Additional Keys Grouped to You (${otherLinkedKeys.length}):*\n` +
        otherLinkedKeys.map(k => `• \`${k.key}\` (${k.name})`).join('\n');
    }

    const successMsg = `
✅ *Account Linked Successfully!*

👤 *Guy / Worker:* ${worker.personName || worker.name} (${username})
${keysListText}
⚡ *Status:* Active Worker Account

📌 *What you can do now:*
• Send your key anytime to get your latest live bill
• \`/bill\` — View your performance summary & recent completed orders
• \`/refresh\` — Refresh live data & update bill
• \`/stats\` — View full performance breakdown
• \`/balance\` — Check unpaid balance
• \`/help\` — See command details
`;
    await this.sendMessage(chatId, successMsg);
  }

  // Helper: Find all worker keys assigned to this Telegram user
  findWorkersForUser(chatId, from) {
    const db = this.dbManager.getDb();
    const uname = (from && from.username) ? `@${from.username.toLowerCase()}` : null;
    const cid = chatId ? chatId.toString() : null;

    return db.workers.filter(w => {
      if (cid && w.telegramId && w.telegramId.toString() === cid) return true;
      if (uname && w.telegramUsername && w.telegramUsername.toLowerCase() === uname) return true;
      return false;
    });
  }

  // Helper: Find primary worker by Telegram Chat ID
  findWorkerByChatId(chatId) {
    const db = this.dbManager.getDb();
    return db.workers.find(w => w.telegramId && w.telegramId.toString() === chatId.toString());
  }

  // Command: /submit <order_id> <order_number> <unique_id> [notes]
  async handleSubmit(chatId, from, args) {
    const workers = this.findWorkersForUser(chatId, from);
    const worker = workers[0] || this.findWorkerByChatId(chatId);

    if (!worker) {
      await this.sendMessage(chatId, `⚠️ *Your Telegram account is not linked!*\nPlease connect your worker key first:\n👉 \`/link YOUR_KEY\``);
      return;
    }

    if (args.length < 3) {
      const usage = `
⚠️ *Incomplete Order Submission!*

*Format:*
\`/submit <order_id> <order_number> <unique_id> [optional_notes]\`

*Example:*
\`/submit ORD-8841 NO-3120 UQ-94812 Priority shipment\`
`;
      await this.sendMessage(chatId, usage);
      return;
    }

    const orderId = args[0].trim();
    const orderNumber = args[1].trim();
    const uniqueId = args[2].trim();
    const notes = args.slice(3).join(' ') || 'Submitted via Telegram Bot';

    const db = this.dbManager.getDb();

    // Check for duplicate Order ID
    const exists = db.orders.some(o => o.orderId.toLowerCase() === orderId.toLowerCase());
    if (exists) {
      await this.sendMessage(chatId, `⚠️ *Duplicate Order ID:* Order \`${orderId}\` has already been submitted in the system.`);
      return;
    }

    const rate = Number(worker.rate) || Number(db.settings.defaultRate) || 15.00;
    const newOrder = {
      id: `ord-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      workerKey: worker.key,
      workerName: worker.name,
      telegramUsername: worker.telegramUsername || `@${from.username || 'user'}`,
      orderId: orderId,
      orderNumber: orderNumber,
      uniqueId: uniqueId,
      payoutAmount: rate,
      inventoryStatus: 'unsold',
      fulfillmentStatus: 'unfulfilled',
      workerPaymentStatus: 'unpaid',
      notes: notes,
      createdAt: new Date().toISOString(),
      soldAt: null,
      fulfilledAt: null,
      paidAt: null
    };

    db.orders.unshift(newOrder);
    this.dbManager.saveDb();

    const confirmationMsg = `
📦 *Order Successfully Submitted!*

• *Order ID:* \`${orderId}\`
• *Order Number:* \`${orderNumber}\`
• *Unique ID:* \`${uniqueId}\`
• *Value:* ₹${rate.toFixed(2)}
• *Status:* 🟡 *Unsold Inventory*
• *Notes:* ${notes}

Your order is now live on the dashboard and waiting to be sold!
`;
    await this.sendMessage(chatId, confirmationMsg);
  }

  // Command: /stats — shows live bill & recent completed orders with NO rates
  async handleStats(chatId, from) {
    const workers = this.findWorkersForUser(chatId, from);
    if (!workers || workers.length === 0) {
      await this.sendMessage(chatId, `⚠️ *Account Not Linked!*\nPlease link your account first with: \`/link YOUR_KEY\`\nOr simply send your worker key directly.`);
      return;
    }
    await this.handleBill(chatId, from, workers[0].key);
  }

  // Command: /pay or /balance
  async handleBalance(chatId, from) {
    const workers = this.findWorkersForUser(chatId, from);
    if (!workers || workers.length === 0) {
      await this.sendMessage(chatId, `⚠️ *Account Not Linked!*\nPlease link your account first with: \`/link YOUR_KEY\`\nOr simply send your worker key directly.`);
      return;
    }

    const primaryWorker = workers[0];
    const db = this.dbManager.getDb();
    const payPerOrder = Number(primaryWorker.rate) || Number(db.settings && db.settings.defaultRate) || 15.00;
    const completed = Number(primaryWorker.completedOrders) || 0;
    const totalEarned = completed * payPerOrder;
    const paidAmount = Number(primaryWorker.paidAmount) || 0;
    const unpaid = Math.max(0, totalEarned - paidAmount);

    let keysList = workers.map(w => `\`${w.key}\``).join(', ');

    const balanceMsg = `
💳 *Your Payout Balance*
━━━━━━━━━━━━━━━━━━━━━━━━
👤 *Worker:* ${primaryWorker.personName || primaryWorker.name} (${primaryWorker.telegramUsername || ''})
🔑 *Keys:* ${keysList}
📦 *Completed Orders:* ${completed}

💰 *Payment Status:*
• 🟢 *Total Amount in Rs Paid:* ₹${paidAmount.toFixed(2)}
• 💵 *Total Amount in Rs:* ₹${totalEarned.toFixed(2)}
${unpaid > 0 ? `• 🔴 *Pending Amount in Rs:* ₹${unpaid.toFixed(2)}` : '• ✅ *Status:* Fully Paid'}

_Payments are recorded and verified by your administrator._
`;
    await this.sendMessage(chatId, balanceMsg);
  }

  // Command: /help
  async handleHelp(chatId) {
    const helpMsg = `
🤖 *Worker Bill Bot — Commands:*

🧾 *Billing & Live Sync:*
• Send your key directly → instant live bill with recent orders
• \`/bill [YOUR_KEY]\` — Generate live bill with recent completed orders
• \`/refresh\` — Re-fetch live stats from masi.cc.cd & update bill
• \`/stats\` — View latest performance overview

🔗 *Account:*
• \`/link YOUR_KEY\` — Save your key to this Telegram account
• \`/balance\` — Check unpaid earnings balance

📦 *Orders:*
• \`/submit <order_id> <order_no> <unique_id> [notes]\` — Submit order

• \`/help\` — Show this message
`;
    await this.sendMessage(chatId, helpMsg);
  }

  // ── LIVE MASI DATA & RECENT ORDERS SYNC ───────────────────────────────────

  // Fetch live worker stats and recent completed orders from masi.cc.cd
  async fetchLiveWorkerDataAndOrders(workerKeyOrName) {
    const db = this.dbManager.getDb();
    const bossKey = (db.settings && db.settings.bossKey) || 'WORKER-B030-0827-9A88-4A04';
    if (!bossKey) {
      return { liveWorker: null, completedOrders: [] };
    }

    const { callMasiApi } = require('./sync-masi');
    try {
      const searchKey = (workerKeyOrName || '').trim();
      const [teamData, ordersData] = await Promise.all([
        callMasiApi('api/worker/team', bossKey, {}).catch(e => {
          console.warn('[Bot Sync] Team API error:', e.message);
          return { team: [] };
        }),
        callMasiApi('api/worker/team', bossKey, { action: 'orders', range: 'all', limit: 1000 }).catch(e => {
          console.warn('[Bot Sync] Orders API error:', e.message);
          return { orders: [] };
        })
      ]);

      const teamList = teamData.team || [];
      const allOrders = ordersData.orders || [];

      // Find worker by access_key or name
      const liveWorker = teamList.find(w =>
        (w.access_key && w.access_key.toUpperCase() === searchKey.toUpperCase()) ||
        (w.name && w.name.toLowerCase() === searchKey.toLowerCase())
      );

      // Find completed orders for this worker
      let completedOrders = [];
      if (liveWorker) {
        completedOrders = allOrders.filter(o =>
          (o.worker_id && o.worker_id === liveWorker.worker_id) ||
          (o.worker_name && o.worker_name.toLowerCase() === liveWorker.name.toLowerCase())
        ).filter(o => o.status === 'completed' || (Number(o.completed_at) || 0) > 0);
      } else {
        completedOrders = allOrders.filter(o =>
          o.worker_name && o.worker_name.toLowerCase() === searchKey.toLowerCase()
        ).filter(o => o.status === 'completed' || (Number(o.completed_at) || 0) > 0);
      }

      // Also merge any completed orders from local db
      const localOrders = (db.orders || []).filter(o =>
        (o.workerKey && o.workerKey.toUpperCase() === searchKey.toUpperCase()) ||
        (liveWorker && o.workerKey && o.workerKey.toUpperCase() === (liveWorker.access_key || '').toUpperCase()) ||
        (liveWorker && o.workerName && o.workerName.toLowerCase() === liveWorker.name.toLowerCase())
      ).filter(o => o.fulfillmentStatus === 'fulfilled' || o.inventoryStatus === 'sold');

      localOrders.forEach(lo => {
        const already = completedOrders.some(co => co.order_id === lo.orderId || co.order_id === lo.id);
        if (!already) {
          completedOrders.push({
            order_id: lo.orderId || lo.id,
            completed_at: lo.fulfilledAt ? Math.floor(new Date(lo.fulfilledAt).getTime() / 1000) : (lo.createdAt ? Math.floor(new Date(lo.createdAt).getTime() / 1000) : 0),
            ticket: lo.uniqueId || lo.orderNumber || '',
            email: lo.telegramUsername || '',
            reward_cents: (Number(lo.payoutAmount) || 15) * 100,
            status: 'completed'
          });
        }
      });

      // Sort newest completed first
      completedOrders.sort((a, b) => (Number(b.completed_at) || 0) - (Number(a.completed_at) || 0));

      return {
        liveWorker,
        completedOrders
      };
    } catch (err) {
      console.error('[Bot Sync Error]:', err.message);
      return { liveWorker: null, completedOrders: [] };
    }
  }

  // ── BILL GENERATION ──────────────────────────────────────────────────────

  // Build the bill text from a worker record (strictly NO rate, with recent completed orders)
  buildBillText(worker, db, completedOrders = []) {
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

    const payPerOrder = Number(worker.rate) || Number(db.settings && db.settings.defaultRate) || 15;
    const completed = Number(worker.completedOrders) || (completedOrders ? completedOrders.length : 0);
    const d7Done = Number(worker.d7Done) || 0;
    const todayDone = Number(worker.todayDone) || 0;

    const totalEarned = completed * payPerOrder;
    const paidAmount = Number(worker.paidAmount) || 0;
    const unpaid = Math.max(0, totalEarned - paidAmount);

    let paymentBlock = '';
    if (paidAmount > 0) {
      paymentBlock = `• 🟢 *Total Amount in Rs Paid:* ₹${paidAmount.toFixed(2)}`;
      if (unpaid > 0) {
        paymentBlock += `\n• 💵 *Total Amount in Rs:* ₹${totalEarned.toFixed(2)}`;
        paymentBlock += `\n• 🔴 *Pending in Rs:* ₹${unpaid.toFixed(2)}`;
      } else {
        paymentBlock += `\n• ✅ *Status:* Fully Paid`;
      }
    } else {
      paymentBlock = `• 🟢 *Total Amount in Rs Paid:* ₹0.00\n• 💵 *Total Amount in Rs:* ₹${totalEarned.toFixed(2)}`;
      if (unpaid > 0) {
        paymentBlock += `\n• 🔴 *Pending in Rs:* ₹${unpaid.toFixed(2)}`;
      }
    }

    // Format recent completed orders
    let recentOrdersSection = '';
    if (completedOrders && completedOrders.length > 0) {
      const topOrders = completedOrders.slice(0, 10);
      const ordersLines = topOrders.map((o, idx) => {
        let time = 'Recent';
        if (o.completed_at) {
          try {
            const d = new Date(Number(o.completed_at) * 1000);
            time = d.toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true });
          } catch (e) {}
        }
        const ticketPart = o.ticket ? ` | 🎟️ \`${o.ticket}\`` : '';
        const emailPart = o.email ? ` (${o.email})` : '';
        return `• \`${o.order_id}\` — ${time}${ticketPart}${emailPart}`;
      }).join('\n');

      recentOrdersSection = `
📋 *MOST RECENT COMPLETED ORDERS (${topOrders.length}):*
${ordersLines}
${completedOrders.length > 10 ? `_...and ${completedOrders.length - 10} more completed orders recorded_` : ''}
`;
    } else {
      recentOrdersSection = `
📋 *MOST RECENT COMPLETED ORDERS:*
• _No recent completed orders found in current batch._
`;
    }

    return `
🧾 *WORKER PERFORMANCE BILL*
━━━━━━━━━━━━━━━━━━━━━━━━
📅 *Date:* ${dateStr} ${timeStr}
━━━━━━━━━━━━━━━━━━━━━━━━

👤 *Worker:* ${worker.personName || worker.name}
🔑 *Key:* \`${worker.key}\`
📍 *Online Status:* ${worker.online ? '🟢 Online' : '⚪ Offline'}

━━━━━━━━━━━━━━━━━━━━━━━━
📦 *COMPLETED ORDERS OVERVIEW:*
• ✅ *Total Completed:* ${completed} orders
• 📅 *Last 7 Days:* ${d7Done} orders
• 🌅 *Today:* ${todayDone} orders

━━━━━━━━━━━━━━━━━━━━━━━━
💰 *PAYMENT:*
${paymentBlock}
━━━━━━━━━━━━━━━━━━━━━━━━${recentOrdersSection}━━━━━━━━━━━━━━━━━━━━━━━━
_🔄 Synced live with masi.cc.cd_
`;
  }

  // Command: /bill [KEY] — generate bill for a key (or linked account) synced with live data
  async handleBill(chatId, from, rawKey) {
    const db = this.dbManager.getDb();
    let searchKey = '';

    if (rawKey && rawKey.trim()) {
      searchKey = rawKey.trim();
    } else {
      const workers = this.findWorkersForUser(chatId, from);
      if (!workers || workers.length === 0) {
        await this.sendMessage(chatId, `⚠️ *No key linked!*\n\nSend your key directly:\n\`WORKER-XXXX-XXXX-XXXX-XXXX\`\n\nOr link it: \`/link YOUR_KEY\``);
        return;
      }
      searchKey = workers[0].key;
    }

    await this.sendMessage(chatId, `⏳ *Syncing live data from masi.cc.cd...*`);

    // Fetch live data & live completed orders
    const { liveWorker, completedOrders } = await this.fetchLiveWorkerDataAndOrders(searchKey);

    let worker = db.workers.find(w =>
      (w.key && w.key.toUpperCase() === searchKey.toUpperCase()) ||
      (w.name && w.name.toLowerCase() === searchKey.toLowerCase())
    );

    if (liveWorker) {
      if (!worker) {
        worker = {
          id: `w-masi-${Date.now()}`,
          name: liveWorker.name,
          key: liveWorker.access_key || searchKey,
          worker_id: liveWorker.worker_id,
          telegramId: chatId ? chatId.toString() : null,
          telegramUsername: from && from.username ? `@${from.username}` : null,
          rate: Number(db.settings && db.settings.defaultRate) || 15.00,
          paidAmount: 0,
          paidCount: 0,
          status: liveWorker.active !== false ? 'active' : 'paused',
          source: 'masi'
        };
        db.workers.push(worker);
      }

      // Update worker with live masi stats
      worker.name = liveWorker.name;
      worker.key = liveWorker.access_key || worker.key;
      worker.worker_id = liveWorker.worker_id;
      worker.completedOrders = Number(liveWorker.completed_count || 0);
      worker.failCount = Number(liveWorker.release_count || 0) + Number(liveWorker.expired_count || 0) + Number(liveWorker.not_landed_count || 0);
      const d7 = (liveWorker.recent && liveWorker.recent.d7) || {};
      worker.d7Done = Number(d7.ok || 0);
      worker.d7Fail = Number(d7.fail || 0);
      worker.todayDone = Number((liveWorker.recent && liveWorker.recent.today && liveWorker.recent.today.ok) || 0);
      worker.online = Boolean(liveWorker.online);
      worker.lastSyncedAt = new Date().toISOString();

      this.dbManager.saveDb();
    }

    if (!worker) {
      await this.sendMessage(chatId, `❌ *Worker Key Not Found:* \`${searchKey}\`\nPlease check your key and send it again.`);
      return;
    }

    const billText = this.buildBillText(worker, db, completedOrders);
    await this.sendMessage(chatId, billText);
  }

  // Command: /refresh — refresh live stats for linked account then show bill
  async handleRefreshAndBill(chatId, from) {
    const workers = this.findWorkersForUser(chatId, from);
    if (!workers || workers.length === 0) {
      await this.sendMessage(chatId, `⚠️ *No key linked!*\n\nSend your key: \`WORKER-XXXX-XXXX-XXXX-XXXX\`\nOr: \`/link YOUR_KEY\``);
      return;
    }
    await this.handleBill(chatId, from, workers[0].key);
  }

  // ── END BILL SECTION ────────────────────────────────────────────────────

  // Send Automated Payout Notification when Admin marks as Paid
  async sendPayoutNotification(workerKey, amount, ordersCount) {
    const db = this.dbManager.getDb();
    const worker = db.workers.find(w => w.key && w.key.toUpperCase() === workerKey.toUpperCase());

    if (!worker || !worker.telegramId) {
      return false;
    }

    const alertMsg = `
🎉 *PAYMENT ALERT!*

Hi ${worker.name}! Your administrator has just processed and cleared your payout:

💵 *Total Amount in Rs Paid:* *₹${Number(amount).toFixed(2)}*
📦 *Orders Settled:* ${ordersCount} order(s)
📅 *Date:* ${new Date().toLocaleDateString()}

Send \`/stats\` or \`/balance\` to check your updated account overview. Thank you for your work!
`;
    return await this.sendMessage(worker.telegramId, alertMsg);
  }

  // Status for Dashboard
  getStatus() {
    return {
      isConfigured: Boolean(this.botToken),
      isPolling: this.isPolling,
      botUsername: this.botUsername,
      lastError: this.lastError,
      lastPollTime: this.lastPollTime
    };
  }
}

module.exports = TelegramBotEngine;
