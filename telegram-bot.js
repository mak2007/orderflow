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
      // Worker just types their key directly (no command needed)
      const possibleKey = text.trim().toUpperCase();
      if (possibleKey.startsWith('WORKER-') || possibleKey.startsWith('KEY-')) {
        await this.handleBill(chatId, from, text.trim());
      }
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
💵 *Pay Rate:* $${Number(worker.rate || 15).toFixed(2)} per order

📌 *What you can do now:*
• \`/submit <order_id> <order_number> <unique_id> [notes]\` — Submit new order
• \`/stats\` — View your completed orders, success rate & earnings across all your keys
• \`/balance\` — Check your unpaid balance
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
• *Payout Value:* $${rate.toFixed(2)}
• *Status:* 🟡 *Unsold Inventory*
• *Notes:* ${notes}

Your order is now live on the dashboard and waiting to be sold!
`;
    await this.sendMessage(chatId, confirmationMsg);
  }

  // Command: /stats
  async handleStats(chatId, from) {
    const workers = this.findWorkersForUser(chatId, from);
    if (!workers || workers.length === 0) {
      await this.sendMessage(chatId, `⚠️ *Account Not Linked!*\nPlease link your account first with: \`/link YOUR_KEY\``);
      return;
    }

    const db = this.dbManager.getDb();
    const primaryWorker = workers[0];
    const workerKeys = workers.map(w => w.key.toUpperCase());
    const workerNames = workers.map(w => w.name.toLowerCase());

    const orders = db.orders.filter(o => 
      (o.workerKey && workerKeys.includes(o.workerKey.toUpperCase())) ||
      (o.workerName && workerNames.includes(o.workerName.toLowerCase()))
    );

    const localTotal = orders.length;
    const localCompleted = orders.filter(o => o.inventoryStatus === 'sold' && o.fulfillmentStatus === 'fulfilled').length;
    
    // Sum extracted completed orders across all their keys
    const extractedCompleted = workers.reduce((sum, w) => sum + (Number(w.completedOrders) || 0), 0);
    const extractedFail = workers.reduce((sum, w) => sum + (Number(w.failCount) || 0), 0);

    const completedOrders = Math.max(localCompleted, extractedCompleted);
    const totalOrders = Math.max(localTotal, extractedCompleted + extractedFail);
    const soldOrders = orders.filter(o => o.inventoryStatus === 'sold').length;
    const unsoldCount = orders.filter(o => o.inventoryStatus === 'unsold').length;
    const unfulfilledSold = orders.filter(o => o.inventoryStatus === 'sold' && o.fulfillmentStatus === 'unfulfilled').length;

    // Success Rate calculation: Admin decided rate takes priority if set, else combined
    let successRate = '0.0';
    const isCustomRate = primaryWorker.customSuccessRate !== null && primaryWorker.customSuccessRate !== undefined && primaryWorker.customSuccessRate !== '';
    if (isCustomRate) {
      successRate = Number(primaryWorker.customSuccessRate).toFixed(1);
    } else {
      successRate = totalOrders > 0 
        ? ((completedOrders / totalOrders) * 100).toFixed(1) 
        : (workers.length === 1 && primaryWorker.successRate !== undefined ? Number(primaryWorker.successRate).toFixed(1) : '0.0');
    }

    // Payout calculations
    const defaultRate = Number(primaryWorker.rate) || 15.00;
    const totalEarned = completedOrders * defaultRate;

    const paidTotal = orders
      .filter(o => o.workerPaymentStatus === 'paid')
      .reduce((sum, o) => sum + (Number(o.payoutAmount) || defaultRate), 0);

    const unpaidTotal = orders
      .filter(o => o.workerPaymentStatus === 'unpaid')
      .reduce((sum, o) => sum + (Number(o.payoutAmount) || defaultRate), 0);

    const paidCount = orders.filter(o => o.workerPaymentStatus === 'paid').length;
    const unpaidCount = orders.filter(o => o.workerPaymentStatus === 'unpaid').length;

    let keysBlock = '';
    if (workers.length > 1) {
      keysBlock = `👥 *Assigned Keys (${workers.length}):*\n` + workers.map(w =>
        `• \`${w.key}\` (${w.name}): *${w.completedOrders || 0}* done | *${w.customSuccessRate || w.successRate || 0}%* rate`
      ).join('\n') + '\n';
    } else {
      keysBlock = `🔑 *Key:* \`${primaryWorker.key}\`\n`;
    }

    const statsMsg = `
📊 *Performance & Payout Statistics*

👤 *Guy / Worker:* ${primaryWorker.personName || primaryWorker.name} (${primaryWorker.telegramUsername || ''})
${keysBlock}💵 *Base Rate:* $${defaultRate.toFixed(2)} / order

━━━━━━━━━━━━━━━━━━━━
📦 *Combined Order Metrics:*
• *Total Completed:* ${completedOrders} orders
• ⚠️ *Sold (Awaiting Delivery):* ${unfulfilledSold}
• 🟡 *Unsold in Stock:* ${unsoldCount}

🎯 *Success Rate:* *${successRate}%*${isCustomRate ? ' _(Admin Decided)_' : ''}
━━━━━━━━━━━━━━━━━━━━
💰 *Payout Summary:*
• *Total Earned:* $${totalEarned.toFixed(2)}
• *Settled / Paid:* $${paidTotal.toFixed(2)} (${paidCount} orders)
• 🔴 *Pending Owed:* *$${unpaidTotal.toFixed(2)}* (${unpaidCount} orders)
━━━━━━━━━━━━━━━━━━━━
`;
    await this.sendMessage(chatId, statsMsg);
  }

  // Command: /pay or /balance
  async handleBalance(chatId, from) {
    const workers = this.findWorkersForUser(chatId, from);
    if (!workers || workers.length === 0) {
      await this.sendMessage(chatId, `⚠️ *Account Not Linked!*\nPlease link your account first with: \`/link YOUR_KEY\``);
      return;
    }

    const primaryWorker = workers[0];
    const workerKeys = workers.map(w => w.key.toUpperCase());
    const workerNames = workers.map(w => w.name.toLowerCase());

    const db = this.dbManager.getDb();
    const orders = db.orders.filter(o => 
      (o.workerKey && workerKeys.includes(o.workerKey.toUpperCase())) ||
      (o.workerName && workerNames.includes(o.workerName.toLowerCase()))
    );

    const defaultRate = Number(primaryWorker.rate) || 15.00;
    const unpaidOrders = orders.filter(o => o.workerPaymentStatus === 'unpaid');
    const unpaidTotal = unpaidOrders.reduce((sum, o) => sum + (Number(o.payoutAmount) || defaultRate), 0);
    const paidOrders = orders.filter(o => o.workerPaymentStatus === 'paid');
    const paidTotal = paidOrders.reduce((sum, o) => sum + (Number(o.payoutAmount) || defaultRate), 0);

    let keysList = workers.map(w => `\`${w.key}\``).join(', ');

    const balanceMsg = `
💳 *Your Payout Balance*

👤 *Guy / Worker:* ${primaryWorker.personName || primaryWorker.name} (${primaryWorker.telegramUsername || ''})
🔑 *Keys:* ${keysList}

🔴 *Current Pending Balance:* *$${unpaidTotal.toFixed(2)}* (${unpaidOrders.length} unpaid orders)
🟢 *Total Cleared to Date:* $${paidTotal.toFixed(2)} (${paidOrders.length} paid orders)

_Payments are recorded and verified by your administrator._
`;
    await this.sendMessage(chatId, balanceMsg);
  }

  // Command: /help
  async handleHelp(chatId) {
    const helpMsg = `
🤖 *Worker Bill Bot — Commands:*

🧾 *Billing:*
• Just paste your key → instant bill
• \`/bill YOUR_KEY\` — Generate bill for any key
• \`/refresh\` — Pull latest live stats & regenerate bill

🔗 *Account:*
• \`/link YOUR_KEY\` — Save your key to this account
• \`/stats\` — Full performance breakdown
• \`/balance\` — Unpaid earnings balance

📦 *Orders:*
• \`/submit <order_id> <order_no> <unique_id> [notes]\` — Submit order

• \`/help\` — Show this message
`;
    await this.sendMessage(chatId, helpMsg);
  }

  // ── BILL GENERATION ──────────────────────────────────────────────────────

  // Build the bill text from a worker record (uses masi live data if present)
  buildBillText(worker, db) {
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

    const rate = Number(worker.rate) || Number(db.settings && db.settings.defaultRate) || 15;
    const completed = Number(worker.completedOrders) || 0;
    const failed = Number(worker.failCount) || 0;
    const total = completed + failed;
    const successRate = total > 0 ? ((completed / total) * 100).toFixed(1) : (Number(worker.successRate) || 0).toFixed(1);
    const d7Done = Number(worker.d7Done) || 0;
    const d7Fail = Number(worker.d7Fail) || 0;
    const d7Rate = Number(worker.d7Rate) || (d7Done + d7Fail > 0 ? ((d7Done / (d7Done + d7Fail)) * 100).toFixed(1) : 0);
    const todayDone = Number(worker.todayDone) || 0;

    const totalEarned = completed * rate;
    const paidAmount = Number(worker.paidAmount) || 0;
    const unpaid = Math.max(0, totalEarned - paidAmount);

    // Performance badge
    const rateNum = parseFloat(successRate);
    let badge = '⚪ New';
    if (rateNum >= 80) badge = '🏆 Top Performer';
    else if (rateNum >= 60) badge = '🟢 Good';
    else if (rateNum >= 40) badge = '🟡 Average';
    else if (total > 0) badge = '🔴 Needs Improvement';

    const paidStatus = unpaid <= 0 && totalEarned > 0 ? '✅ FULLY PAID' : (unpaid > 0 ? `🔴 ₹${unpaid.toFixed(2)} PENDING` : '—');

    return `
🧾 *WORKER PERFORMANCE BILL*
━━━━━━━━━━━━━━━━━━━━━━━━
📅 *Date:* ${dateStr} ${timeStr}
━━━━━━━━━━━━━━━━━━━━━━━━

👤 *Name:* ${worker.personName || worker.name}
🔑 *Key:* \`${worker.key}\`
⭐ *Status:* ${badge}
📍 *Online:* ${worker.online ? '🟢 Yes' : '⚪ No'}

━━━━━━━━━━━━━━━━━━━━━━━━
📦 *ALL-TIME PERFORMANCE:*
• ✅ Completed: *${completed}*
• ❌ Failed/Released: *${failed}*
• 📊 Total Attempted: *${total}*
• 🎯 Success Rate: *${successRate}%*

📅 *LAST 7 DAYS:*
• ✅ Done: *${d7Done}*
• ❌ Fail: *${d7Fail}*
• 🎯 Rate: *${typeof d7Rate === 'number' ? d7Rate.toFixed(1) : d7Rate}%*

🌅 *TODAY:*
• ✅ Completed: *${todayDone}*

━━━━━━━━━━━━━━━━━━━━━━━━
💰 *EARNINGS BILL:*
• 💵 Rate per Order: *$${rate.toFixed(2)}*
• 📦 Orders Completed: *${completed}*
• 💴 Total Earned: *$${totalEarned.toFixed(2)}*
• 🟢 Already Paid: *$${paidAmount.toFixed(2)}*
• ${paidStatus}
━━━━━━━━━━━━━━━━━━━━━━━━
_Live data from masi.cc.cd_ 🔄
`;
  }

  // Command: /bill [KEY] — generate bill for a key (or linked account)
  async handleBill(chatId, from, rawKey) {
    const db = this.dbManager.getDb();
    let worker = null;

    if (rawKey) {
      // Look up by provided key
      const key = rawKey.trim();
      worker = db.workers.find(w => w.key && w.key.toUpperCase() === key.toUpperCase());
      if (!worker) {
        await this.sendMessage(chatId, `❌ *Key not found:* \`${key}\`\n\nMake sure you paste the full key exactly.\n_Example: \`WORKER-XXXX-XXXX-XXXX-XXXX\`_`);
        return;
      }
    } else {
      // Use linked account
      const workers = this.findWorkersForUser(chatId, from);
      if (!workers || workers.length === 0) {
        await this.sendMessage(chatId, `⚠️ *No key linked!*\n\nSend your key directly:\n\`WORKER-XXXX-XXXX-XXXX-XXXX\`\n\nOr link it: \`/link YOUR_KEY\``);
        return;
      }
      worker = workers[0];
    }

    // Send "fetching" notification
    await this.sendMessage(chatId, `⏳ Fetching live data for *${worker.name}*...`);

    // Try to refresh from masi live
    try {
      const { callMasiApi } = require('./sync-masi');
      const bossKey = db.settings && db.settings.bossKey;
      if (bossKey) {
        // Find this specific worker from masi team
        const teamData = await callMasiApi('api/worker/team', bossKey, {});
        const teamList = teamData.team || [];
        const liveWorker = teamList.find(w =>
          (w.access_key && w.access_key.toUpperCase() === worker.key.toUpperCase()) ||
          (w.name && w.name.toLowerCase() === worker.name.toLowerCase())
        );
        if (liveWorker) {
          const d7 = (liveWorker.recent && liveWorker.recent.d7) || {};
          worker.completedOrders = Number(liveWorker.completed_count || 0);
          worker.failCount = Number(liveWorker.release_count || 0) + Number(liveWorker.expired_count || 0) + Number(liveWorker.not_landed_count || 0);
          worker.successRate = liveWorker.success_rate !== undefined ? Number(liveWorker.success_rate) : (d7.rate !== undefined ? Number(d7.rate) : 0);
          worker.d7Done = Number(d7.ok || 0);
          worker.d7Fail = Number(d7.fail || 0);
          worker.d7Rate = Number(d7.rate || 0);
          worker.todayDone = Number((liveWorker.recent && liveWorker.recent.today && liveWorker.recent.today.ok) || 0);
          worker.online = Boolean(liveWorker.online);
          worker.lastSyncedAt = new Date().toISOString();
          this.dbManager.saveDb();
        }
      }
    } catch (e) {
      // Non-fatal — use cached data
      console.warn('[Bill] Could not fetch live masi data:', e.message);
    }

    const billText = this.buildBillText(worker, db);
    await this.sendMessage(chatId, billText);
  }

  // Command: /refresh — refresh live stats for linked account then show bill
  async handleRefreshAndBill(chatId, from) {
    const db = this.dbManager.getDb();
    const workers = this.findWorkersForUser(chatId, from);

    if (!workers || workers.length === 0) {
      await this.sendMessage(chatId, `⚠️ *No key linked!*\n\nSend your key: \`WORKER-XXXX-XXXX-XXXX-XXXX\`\nOr: \`/link YOUR_KEY\``);
      return;
    }

    await this.sendMessage(chatId, `🔄 *Refreshing live data from masi.cc.cd...*`);

    const bossKey = db.settings && db.settings.bossKey;
    let refreshed = 0;

    if (bossKey) {
      try {
        const { callMasiApi } = require('./sync-masi');
        const teamData = await callMasiApi('api/worker/team', bossKey, {});
        const teamList = teamData.team || [];

        for (const w of workers) {
          const liveWorker = teamList.find(lw =>
            (lw.access_key && lw.access_key.toUpperCase() === w.key.toUpperCase()) ||
            (lw.name && lw.name.toLowerCase() === w.name.toLowerCase())
          );
          if (liveWorker) {
            const d7 = (liveWorker.recent && liveWorker.recent.d7) || {};
            w.completedOrders = Number(liveWorker.completed_count || 0);
            w.failCount = Number(liveWorker.release_count || 0) + Number(liveWorker.expired_count || 0) + Number(liveWorker.not_landed_count || 0);
            w.successRate = liveWorker.success_rate !== undefined ? Number(liveWorker.success_rate) : 0;
            w.d7Done = Number(d7.ok || 0);
            w.d7Fail = Number(d7.fail || 0);
            w.d7Rate = Number(d7.rate || 0);
            w.todayDone = Number((liveWorker.recent && liveWorker.recent.today && liveWorker.recent.today.ok) || 0);
            w.online = Boolean(liveWorker.online);
            w.lastSyncedAt = new Date().toISOString();
            refreshed++;
          }
        }
        this.dbManager.saveDb();
      } catch (e) {
        await this.sendMessage(chatId, `⚠️ Could not reach masi.cc.cd — showing cached data.`);
      }
    } else {
      await this.sendMessage(chatId, `⚠️ No Boss Key set on server. Showing cached data.`);
    }

    // Show bill for primary worker
    const billText = this.buildBillText(workers[0], db);
    await this.sendMessage(chatId, billText);
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

💵 *Amount Cleared:* *$${Number(amount).toFixed(2)}*
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
