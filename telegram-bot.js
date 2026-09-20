// Telegram Bot Engine for OrderFlow & Inventory Hub
// Native Node.js HTTPS implementation - Zero external dependencies!
const https = require('https');

const OFFICIAL_CHANNEL = 'https://t.me/madmax00711';
const OFFICIAL_CHANNEL_HANDLE = '@madmax00711';

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

  // Helper to check if a user is in the required official channel (@madmax00711)
  async isUserInChannel(userId) {
    if (!this.botToken || !userId) return null;
    try {
      const res = await this.callApi('getChatMember', {
        chat_id: OFFICIAL_CHANNEL_HANDLE,
        user_id: userId
      });
      if (res && res.status) {
        return ['creator', 'administrator', 'member', 'restricted'].includes(res.status);
      }
    } catch (err) {
      // If the bot is not yet added as admin to the channel, Telegram returns an error.
      // We return null so we don't hard-block workers unexpectedly, while still telling them to join.
      return null;
    }
    return false;
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

  // Helper: Normalize username (lowercase, trimmed, without leading @)
  normalizeUsername(uname) {
    if (!uname) return '';
    return uname.toString().trim().toLowerCase().replace(/^@/, '');
  }

  // Helper: Owner display name for key
  getWorkerOwnerName(worker) {
    if (!worker) return 'System Admin';
    if (worker.telegramUsername) {
      const u = worker.telegramUsername.trim();
      return u.startsWith('@') ? u : `@${u}`;
    }
    if (worker.personName) return worker.personName;
    if (worker.name) return worker.name;
    return 'System Admin';
  }

  // Helper: Find all worker keys assigned to this Telegram user
  findWorkersForUser(chatId, from) {
    const db = this.dbManager.getDb();
    const userUname = this.normalizeUsername(from?.username);
    const cid = chatId ? chatId.toString() : null;

    return db.workers.filter(w => {
      const assignedUname = this.normalizeUsername(w.telegramUsername);
      // Strict match: admin assigned this telegram username to this key
      if (userUname && assignedUname && assignedUname === userUname) {
        return true;
      }
      // Or already authenticated with this chat ID
      if (cid && w.telegramId && w.telegramId.toString() === cid) {
        if (!assignedUname || (userUname && assignedUname === userUname)) {
          return true;
        }
      }
      return false;
    });
  }

  // Helper: Find primary worker by Telegram Chat ID
  findWorkerByChatId(chatId) {
    const db = this.dbManager.getDb();
    return db.workers.find(w => w.telegramId && w.telegramId.toString() === chatId.toString());
  }

  // Helper: Check if a key is authorized for this Telegram user
  isKeyAuthorizedForUser(worker, from, chatId) {
    if (!worker) return false;
    const userUname = this.normalizeUsername(from?.username);
    const assignedUname = this.normalizeUsername(worker.telegramUsername);
    const cid = chatId ? chatId.toString() : null;

    // 1. If admin assigned a username to this key, user's Telegram username MUST match it
    if (userUname && assignedUname && assignedUname === userUname) {
      return true;
    }

    // 2. If already linked to this chat ID and username matches
    if (cid && worker.telegramId && worker.telegramId.toString() === cid) {
      if (!assignedUname || (userUname && assignedUname === userUname)) {
        return true;
      }
    }

    return false;
  }

  // Handle incoming update
  async handleUpdate(update) {
    // Handle inline button callbacks
    if (update.callback_query) {
      const cb = update.callback_query;
      const chatId = cb.message ? cb.message.chat.id : cb.from.id;
      const data = cb.data;

      try {
        await this.callApi('answerCallbackQuery', { callback_query_id: cb.id });
      } catch (e) {}

      if (data === 'check_joined' || data === 'verify_channel') {
        const inChannel = await this.isUserInChannel(cb.from.id);
        if (inChannel === false) {
          await this.sendMessage(chatId, `⚠️ *You have not joined the channel yet!*\n\n👉 Join here: https://t.me/madmax00711\n\nPlease join the channel first, then click "✅ I Have Joined" below!`, {
            reply_markup: {
              inline_keyboard: [
                [{ text: '📢 Join Official Channel 1st', url: OFFICIAL_CHANNEL }],
                [{ text: '✅ I Have Joined!', callback_data: 'check_joined' }]
              ]
            }
          });
          return;
        }

        // Verified
        await this.handleStart(chatId, cb.from);
        return;
      } else if (data === 'view_bill') {
        await this.handleBill(chatId, cb.from);
        return;
      } else if (data === 'view_balance') {
        await this.handleBalance(chatId, cb.from);
        return;
      } else if (data === 'withdraw_leftover') {
        await this.handleLeftoverRequest(chatId, cb.from);
        return;
      } else if (data === 'my_keys') {
        await this.handleMyKeys(chatId, cb.from);
        return;
      } else if (data === 'prompt_connect') {
        await this.sendMessage(chatId, `🔑 *Please send your worker key directly:*\n\`WORKER-XXXX-XXXX-XXXX-XXXX\``);
        return;
      }
    }

    if (!update.message || !update.message.text) return;

    const msg = update.message;
    const chatId = msg.chat.id;
    const from = msg.from;
    const text = msg.text.trim();

    const parts = text.split(/\s+/);
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    if (command === '/start') {
      await this.handleStart(chatId, from, args[0]);
    } else if (command === '/channel') {
      await this.handleChannel(chatId);
    } else if (command === '/connect' || command === '/link' || command === '/register') {
      await this.handleConnectKey(chatId, from, args.join(' '));
    } else if (command === '/mykeys' || command === '/keys') {
      await this.handleMyKeys(chatId, from);
    } else if (command === '/request' || command === '/payout' || command === '/withdraw') {
      await this.handlePayoutRequest(chatId, from, args[0]);
    } else if (command === '/reqforleftover' || command === '/leftover' || command === '/withdrawleftover') {
      await this.handleLeftoverRequest(chatId, from);
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
      // User typed their key or search query directly -> connect & verify username match
      await this.handleConnectKey(chatId, from, text.trim());
    } else {
      await this.sendMessage(chatId, `❓ Unknown command: \`${command}\`\nSend /help to see all available commands.`);
    }
  }

  // Command: /channel — Show official channel link
  async handleChannel(chatId) {
    const channelMsg = `📢 *OFFICIAL CHANNEL — JOIN 1ST!*
━━━━━━━━━━━━━━━━━━━━━━━━
Join our official channel for real-time task announcements, order assignments, and payout receipts:

👉 *Official Channel:* https://t.me/madmax00711
━━━━━━━━━━━━━━━━━━━━━━━━`;
    await this.sendMessage(chatId, channelMsg, {
      reply_markup: {
        inline_keyboard: [
          [{ text: '📢 Open Official Channel', url: OFFICIAL_CHANNEL }]
        ]
      }
    });
  }

  // Command: /start [payload]
  async handleStart(chatId, from, payload) {
    if (payload) {
      const cleanKey = payload.replace(/^link_/, '').trim();
      if (cleanKey) {
        return await this.handleConnectKey(chatId, from, cleanKey);
      }
    }

    const inChannel = await this.isUserInChannel(from?.id);
    if (inChannel === false) {
      const gateMsg = `👋 *Welcome to Worker Hub!*

📢 *ACTION REQUIRED: JOIN OUR OFFICIAL CHANNEL 1ST!*
━━━━━━━━━━━━━━━━━━━━━━━━
You must join our official channel before accessing orders and bills:
👉 https://t.me/madmax00711

_We post all task announcements, order updates & payment receipts there._
━━━━━━━━━━━━━━━━━━━━━━━━
1️⃣ Click the button below to join the channel.
2️⃣ Then tap "✅ I Have Joined" to unlock your account!`;
      await this.sendMessage(chatId, gateMsg, {
        reply_markup: {
          inline_keyboard: [
            [{ text: '📢 Join Official Channel 1st', url: OFFICIAL_CHANNEL }],
            [{ text: '✅ I Have Joined!', callback_data: 'check_joined' }]
          ]
        }
      });
      return;
    }

    const userUname = this.normalizeUsername(from?.username);
    const userWorkers = this.findWorkersForUser(chatId, from);

    // If user has NO assigned keys: show ONLY the connect onboarding
    if (userWorkers.length === 0) {
      const connectOnlyMsg = `👋 *Welcome to Worker Hub!*

📢 *OFFICIAL CHANNEL (JOIN 1ST!):*
👉 https://t.me/madmax00711
_Join our official channel for task announcements & payout receipts._
━━━━━━━━━━━━━━━━━━━━━━━━
🔑 *Connect Your Worker Key:*
Please send your assigned worker key directly in this chat:
\`WORKER-XXXX-XXXX-XXXX-XXXX\`

${userUname ? `_Your Telegram account:_ *@${userUname}*` : `_⚠️ Note: Please set a username in your Telegram profile so your key can be verified._`}

_🔒 Note: Each key is locked to its authorized Telegram username. If you need a key assigned, please contact support:_
• *Official Channel:* https://t.me/madmax00711
• *Support:* @madmax00711
━━━━━━━━━━━━━━━━━━━━━━━━`;
      await this.sendMessage(chatId, connectOnlyMsg, {
        reply_markup: {
          inline_keyboard: [
            [{ text: '📢 Join Official Channel 1st', url: OFFICIAL_CHANNEL }]
          ]
        }
      });
      return;
    }

    // User ALREADY has connected keys: show welcome back summary (NO orders dump)
    const primary = userWorkers[0];
    const totalCompleted = userWorkers.reduce((sum, w) => sum + (Number(w.completedOrders) || 0), 0);
    const totalPaid = userWorkers.reduce((sum, w) => sum + (Number(w.paidCount) || 0), 0);
    const totalLeftover = Math.max(0, totalCompleted - totalPaid);
    const totalTodayDone = userWorkers.reduce((sum, w) => sum + (Number(w.todayDone) || 0), 0);
    const isSettled = (totalCompleted > 0 && totalPaid >= totalCompleted);

    const welcomeBackMsg = `👋 *Welcome Back, ${primary.personName || primary.name}!*
━━━━━━━━━━━━━━━━━━━━━━━━
👤 *Telegram:* @${userUname}
🔑 *Connected Keys (${userWorkers.length}):*
${userWorkers.map(w => `• \`${w.key}\` (${w.personName || w.name})`).join('\n')}

📊 *Orders Settlement Status:*
• 📦 *Total Completed Orders:* *${totalCompleted}*
• ✅ *Total Settled:* *${totalPaid}/${totalCompleted}*
• ⏳ *Leftover Unsettled:* *${totalLeftover}* order(s)
• 🌅 *Today Done:* *${totalTodayDone}* orders

📌 *Status:* ${isSettled ? '✅ *Fully Settled*' : (totalLeftover > 0 ? `⏳ *${totalLeftover} Leftover Orders Pending Settlement*` : '⚪ *No Orders Yet*')}

📢 *Official Channel:* https://t.me/madmax00711
━━━━━━━━━━━━━━━━━━━━━━━━
💡 *Commands:*
• \`/balance\` — View settlement progress & leftover
• \`/withdraw <orders>\` — Request payout (e.g. \`/withdraw 10\`)
• \`/reqforleftover\` — Withdraw all ${totalLeftover} leftover orders
• \`/bill\` — View performance bill
• \`/mykeys\` — View your connected keys`;

    await this.sendMessage(chatId, welcomeBackMsg, {
      reply_markup: {
        inline_keyboard: [
          [{ text: '🧾 View Bill', callback_data: 'view_bill' }, { text: '💳 Balance', callback_data: 'view_balance' }],
          [{ text: '💸 Withdraw Leftover', callback_data: 'withdraw_leftover' }],
          [{ text: '📢 Official Channel', url: OFFICIAL_CHANNEL }]
        ]
      }
    });
  }

  // Command: /connect or /link or direct key input
  async handleConnectKey(chatId, from, rawInput) {
    const userUname = this.normalizeUsername(from?.username);

    // 1. Telegram username required
    if (!userUname) {
      await this.sendMessage(chatId, `⚠️ *Telegram Username Required!*
━━━━━━━━━━━━━━━━━━━━━━━━
Your Telegram account does not have a public @username set.

Worker keys are locked to authorized Telegram usernames configured by your admin.

*To set your username:*
1️⃣ Open Telegram *Settings*
2️⃣ Tap *Edit Profile* (or tap *Username*)
3️⃣ Choose an @username and save
4️⃣ Return here and send your worker key again!

👉 *Official Channel / Support:* https://t.me/madmax00711
━━━━━━━━━━━━━━━━━━━━━━━━`, {
        reply_markup: {
          inline_keyboard: [
            [{ text: '📢 Official Channel', url: OFFICIAL_CHANNEL }]
          ]
        }
      });
      return;
    }

    // 2. Extract key from input
    if (!rawInput || !rawInput.trim()) {
      await this.sendMessage(chatId, `🔑 *Enter Your Assigned Worker Key*
━━━━━━━━━━━━━━━━━━━━━━━━
Please send your worker key to connect your account:
\`WORKER-XXXX-XXXX-XXXX-XXXX\`

_You can retry as many times as needed._
━━━━━━━━━━━━━━━━━━━━━━━━`);
      return;
    }

    const trimmed = rawInput.trim();
    // Match any WORKER-... or KEY-... pattern or use whole string
    const keyMatch = trimmed.match(/(WORKER-[A-Za-z0-9-]+|KEY-[A-Za-z0-9-]+)/i);
    const searchKey = keyMatch ? keyMatch[1].trim() : trimmed.split(/\s+/)[0];

    const db = this.dbManager.getDb();
    let worker = db.workers.find(w =>
      (w.key && w.key.toUpperCase() === searchKey.toUpperCase()) ||
      (w.name && w.name.toLowerCase() === searchKey.toLowerCase())
    );

    // If not in DB, attempt live sync from Masi to see if it's a valid Masi worker key
    if (!worker) {
      try {
        const { liveWorker } = await this.fetchLiveWorkerDataAndOrders(searchKey);
        if (liveWorker) {
          worker = db.workers.find(w => w.key && w.key.toUpperCase() === (liveWorker.access_key || searchKey).toUpperCase());
          if (!worker) {
            worker = {
              id: `w-masi-${Date.now()}`,
              name: liveWorker.name,
              key: liveWorker.access_key || searchKey,
              worker_id: liveWorker.worker_id,
              telegramId: null,
              telegramUsername: null,
              rate: 15.00,
              completedOrders: Number(liveWorker.completed_count || 0),
              paidAmount: 0,
              paidCount: 0,
              status: 'active',
              source: 'masi'
            };
            db.workers.push(worker);
            this.dbManager.saveDb();
          }
        }
      } catch (e) {}
    }

    // 3. If key still not found: allow multiple attempts
    if (!worker) {
      await this.sendMessage(chatId, `❌ *Worker Key Not Recognized:* \`${searchKey}\`
━━━━━━━━━━━━━━━━━━━━━━━━
We could not find any active worker key matching this.

🔄 *Please check your spelling and try again!*
You can copy-paste the exact key directly in this chat. Multiple attempts are allowed.

_Example:_ \`WORKER-0BE2-72E7-D72A-E15F\`

👉 *Need Help? Contact Support:*
• *Official Channel:* https://t.me/madmax00711
• *Support:* @madmax00711
━━━━━━━━━━━━━━━━━━━━━━━━`, {
        reply_markup: {
          inline_keyboard: [
            [{ text: '📢 Join Official Channel', url: OFFICIAL_CHANNEL }]
          ]
        }
      });
      return;
    }

    // 4. CHECK USERNAME AUTHORIZATION
    const isAuthorized = this.isKeyAuthorizedForUser(worker, from, chatId);

    if (!isAuthorized) {
      const ownerDisplay = this.getWorkerOwnerName(worker);
      await this.sendMessage(chatId, `🚫 *Access Denied!*
━━━━━━━━━━━━━━━━━━━━━━━━
This key (\`${worker.key}\`) belongs to owner: *${ownerDisplay}*

Your Telegram account (@${userUname}) is not authorized to access this key.

👉 *Please contact the owner or contact support:*
• *Official Channel:* https://t.me/madmax00711
• *Admin Support:* @madmax00711
━━━━━━━━━━━━━━━━━━━━━━━━`, {
        reply_markup: {
          inline_keyboard: [
            [{ text: '📢 Official Channel', url: OFFICIAL_CHANNEL }],
            [{ text: '💬 Contact Support', url: OFFICIAL_CHANNEL }]
          ]
        }
      });
      return;
    }

    // 5. SUCCESS: Link account!
    worker.telegramId = chatId.toString();
    worker.telegramUsername = `@${userUname}`;
    worker.linkedAt = new Date().toISOString();

    // Also link any other keys in db.workers assigned to this same username
    db.workers.forEach(w => {
      const wAssigned = this.normalizeUsername(w.telegramUsername);
      if (wAssigned && wAssigned === userUname) {
        w.telegramId = chatId.toString();
        w.telegramUsername = `@${userUname}`;
        w.linkedAt = new Date().toISOString();
      }
    });

    this.dbManager.saveDb();

    // Calculate aggregated totals across all user's keys
    const userWorkers = this.findWorkersForUser(chatId, from);
    const totalCompleted = userWorkers.reduce((sum, w) => sum + (Number(w.completedOrders) || 0), 0);
    const totalPaid = userWorkers.reduce((sum, w) => sum + (Number(w.paidCount) || 0), 0);
    const totalLeftover = Math.max(0, totalCompleted - totalPaid);
    const totalTodayDone = userWorkers.reduce((sum, w) => sum + (Number(w.todayDone) || 0), 0);
    const isSettled = (totalCompleted > 0 && totalPaid >= totalCompleted);
    const hasPendingWithdrawal = userWorkers.some(w => w.payoutRequestStatus === 'pending');
    const pendingOrders = userWorkers.reduce((sum, w) => sum + (w.payoutRequestStatus === 'pending' ? (Number(w.payoutRequestedOrders) || 0) : 0), 0);

    const keysListText = userWorkers.map(w => `• \`${w.key}\` (${w.personName || w.name || 'Worker'})`).join('\n');

    const successMsg = `✅ *Account Connected Successfully!*
━━━━━━━━━━━━━━━━━━━━━━━━
👤 *Worker:* ${worker.personName || worker.name} (@${userUname})
🔑 *Total Keys Connected (${userWorkers.length}):*
${keysListText}

📊 *Orders Settlement Status:*
• 📦 *Total Completed Orders:* *${totalCompleted}*
• ✅ *Total Settled:* *${totalPaid}/${totalCompleted}*
• ⏳ *Leftover Unsettled:* *${totalLeftover}* order(s)
• 🌅 *Today Done:* *${totalTodayDone}* orders

📌 *Status:* ${isSettled ? '✅ *Fully Settled*' : (totalLeftover > 0 ? `⏳ *${totalLeftover} Leftover Orders Pending Settlement*` : '⚪ *No Orders Yet*')}
${hasPendingWithdrawal ? `• 🔔 *Pending Withdrawal Request:* ${pendingOrders || totalLeftover} order(s)\n` : ''}
📢 *Official Channel (Join 1st!):* https://t.me/madmax00711
━━━━━━━━━━━━━━━━━━━━━━━━
💡 *Available Commands:*
• \`/balance\` — Check settled orders & leftover count
• \`/withdraw <orders>\` — Request withdrawal (e.g. \`/withdraw 10\`)
• \`/reqforleftover\` — Request withdrawal for all ${totalLeftover} leftover orders
• \`/bill\` — View performance bill
• \`/mykeys\` — View your connected keys
• \`/help\` — See all commands`;

    await this.sendMessage(chatId, successMsg, {
      reply_markup: {
        inline_keyboard: [
          [{ text: '🧾 View Bill', callback_data: 'view_bill' }, { text: '💳 Balance', callback_data: 'view_balance' }],
          [{ text: '💸 Withdraw Leftover', callback_data: 'withdraw_leftover' }],
          [{ text: '📢 Official Channel', url: OFFICIAL_CHANNEL }]
        ]
      }
    });
  }

  // Command: /link alias to handleConnectKey
  async handleLink(chatId, from, rawKey) {
    return await this.handleConnectKey(chatId, from, rawKey);
  }

  // Command: /mykeys — Show all keys assigned to this Telegram account
  async handleMyKeys(chatId, from) {
    const userWorkers = this.findWorkersForUser(chatId, from);
    const userUname = this.normalizeUsername(from?.username);

    if (!userWorkers || userWorkers.length === 0) {
      await this.sendMessage(chatId, `⚠️ *No Keys Connected Yet!*\n\nPlease send your assigned worker key to connect your account:\n\`WORKER-XXXX-XXXX-XXXX-XXXX\`\n\nOr contact support: @madmax00711`);
      return;
    }

    const totalCompleted = userWorkers.reduce((sum, w) => sum + (Number(w.completedOrders) || 0), 0);
    const totalPaid = userWorkers.reduce((sum, w) => sum + (Number(w.paidCount) || 0), 0);
    const totalLeftover = Math.max(0, totalCompleted - totalPaid);

    let keysList = userWorkers.map((w, i) => {
      const c = Number(w.completedOrders) || 0;
      const p = Number(w.paidCount) || 0;
      const l = Math.max(0, c - p);
      return `${i + 1}️⃣ *Key:* \`${w.key}\`\n   • Name: ${w.personName || w.name}\n   • Orders: ${c} completed | ${p}/${c} settled | Leftover: ${l}`;
    }).join('\n\n');

    const msg = `🔑 *YOUR CONNECTED KEYS (${userWorkers.length})*
━━━━━━━━━━━━━━━━━━━━━━━━
👤 *Telegram:* @${userUname}

${keysList}

━━━━━━━━━━━━━━━━━━━━━━━━
📊 *Combined Totals:*
• 📦 Total Completed: *${totalCompleted}* orders
• ✅ Settled: *${totalPaid}/${totalCompleted}*
• ⏳ Leftover: *${totalLeftover}* order(s)

📢 *Official Channel:* https://t.me/madmax00711`;

    await this.sendMessage(chatId, msg, {
      reply_markup: {
        inline_keyboard: [
          [{ text: '🧾 View Bill', callback_data: 'view_bill' }, { text: '💳 Balance', callback_data: 'view_balance' }],
          [{ text: '📢 Official Channel', url: OFFICIAL_CHANNEL }]
        ]
      }
    });
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

    const newOrder = {
      id: `ord-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      workerKey: worker.key,
      workerName: worker.name,
      telegramUsername: worker.telegramUsername || `@${from.username || 'user'}`,
      orderId: orderId,
      orderNumber: orderNumber,
      uniqueId: uniqueId,
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
• *Status:* 🟡 *Unsold Inventory*
• *Notes:* ${notes}

Your order is now live on the dashboard and waiting to be sold!
`;
    await this.sendMessage(chatId, confirmationMsg);
  }

  // Command: /stats — shows live bill summary
  async handleStats(chatId, from) {
    await this.handleBill(chatId, from);
  }

  // Command: /pay or /balance — shows performance & settlement status
  async handleBalance(chatId, from) {
    const userWorkers = this.findWorkersForUser(chatId, from);
    const userUname = this.normalizeUsername(from?.username);

    if (!userWorkers || userWorkers.length === 0) {
      await this.sendMessage(chatId, `⚠️ *No Worker Key Connected!*

Please send your assigned worker key to connect:
\`WORKER-XXXX-XXXX-XXXX-XXXX\`

_Or contact support: @madmax00711_`, {
        reply_markup: {
          inline_keyboard: [
            [{ text: '📢 Official Channel', url: OFFICIAL_CHANNEL }]
          ]
        }
      });
      return;
    }

    const primaryWorker = userWorkers[0];
    const totalCompleted = userWorkers.reduce((sum, w) => sum + (Number(w.completedOrders) || 0), 0);
    const totalPaid = userWorkers.reduce((sum, w) => sum + (Number(w.paidCount) || 0), 0);
    const totalLeftover = Math.max(0, totalCompleted - totalPaid);
    const totalTodayDone = userWorkers.reduce((sum, w) => sum + (Number(w.todayDone) || 0), 0);
    const isSettled = (totalCompleted > 0 && totalPaid >= totalCompleted);
    const hasPendingWithdrawal = userWorkers.some(w => w.payoutRequestStatus === 'pending');
    const pendingOrders = userWorkers.reduce((sum, w) => sum + (w.payoutRequestStatus === 'pending' ? (Number(w.payoutRequestedOrders) || 0) : 0), 0);

    let keysList = userWorkers.map(w => `\`${w.key}\``).join(', ');

    const balanceMsg = `💳 *Your Settlement & Performance Status*
━━━━━━━━━━━━━━━━━━━━━━━━
👤 *Worker:* ${primaryWorker.personName || primaryWorker.name} (@${userUname})
🔑 *Keys (${userWorkers.length}):* ${keysList}

📊 *Orders Settlement:*
• 📦 *Total Completed Orders:* *${totalCompleted}*
• ✅ *Total Settled:* *${totalPaid}/${totalCompleted}*
• ⏳ *Leftover Unsettled:* *${totalLeftover}* order(s)
• 🌅 *Today Done:* *${totalTodayDone}*

📌 *Status:*
${isSettled ? `• ✅ *Fully Settled (${totalCompleted}/${totalCompleted})*` : (totalLeftover > 0 ? `• ⏳ *${totalLeftover} Leftover Orders Pending Settlement*` : '• ⚪ *No Orders Yet*')}
${hasPendingWithdrawal ? `• 🔔 *Pending Withdrawal Request:* ${pendingOrders || totalLeftover} order(s)\n` : ''}${isSettled && primaryWorker.lastPaidAt ? `• 📅 *Last Settled:* ${new Date(primaryWorker.lastPaidAt).toLocaleDateString('en-IN')}\n` : ''}
📢 *Official Channel (Join 1st!):* https://t.me/madmax00711

💡 *Withdrawal Options:*
• \`/withdraw <orders>\` — Request payout for specific number of orders (e.g. \`/withdraw 5\`)
• \`/reqforleftover\` — Request withdrawal for all ${totalLeftover} leftover orders
• \`/bill\` — View performance bill`;

    await this.sendMessage(chatId, balanceMsg, {
      reply_markup: {
        inline_keyboard: [
          [{ text: '🧾 View Bill', callback_data: 'view_bill' }, { text: '💸 Withdraw Leftover', callback_data: 'withdraw_leftover' }],
          [{ text: '📢 Join Official Channel 1st', url: OFFICIAL_CHANNEL }]
        ]
      }
    });
  }

  // Command: /help
  async handleHelp(chatId) {
    const helpMsg = `🤖 *Worker Hub Bot — Commands:*

📢 *OFFICIAL CHANNEL (JOIN 1ST!):*
👉 https://t.me/madmax00711

🔑 *Account & Keys:*
• Send your worker key directly to connect (e.g. \`WORKER-XXXX-XXXX-XXXX-XXXX\`)
• \`/mykeys\` — View all keys assigned to your Telegram account
• \`/connect YOUR_KEY\` — Connect your assigned worker key
• \`/channel\` — Official announcements channel link

🧾 *Billing & Balance:*
• \`/bill\` — View your performance summary bill (strictly NO order spam)
• \`/balance\` — Check settled orders (e.g. 20/20) & leftover balance
• \`/refresh\` — Refresh live data from masi.cc.cd

💸 *Withdrawals:*
• \`/withdraw <orders>\` — Request withdrawal for specific order count (e.g. \`/withdraw 10\`)
• \`/reqforleftover\` — Request withdrawal for all remaining leftover orders

📦 *Orders:*
• \`/submit <order_id> <order_no> <unique_id> [notes]\` — Submit new order`;

    await this.sendMessage(chatId, helpMsg, {
      reply_markup: {
        inline_keyboard: [
          [{ text: '📢 Join Official Channel 1st', url: OFFICIAL_CHANNEL }]
        ]
      }
    });
  }

  // ── LIVE MASI DATA SYNC ───────────────────────────────────────────────────

  // Fetch live worker stats from masi.cc.cd
  async fetchLiveWorkerDataAndOrders(workerKeyOrName) {
    const db = this.dbManager.getDb();
    const bossKey = (db.settings && db.settings.bossKey) || 'WORKER-B030-0827-9A88-4A04';
    if (!bossKey) {
      return { liveWorker: null, completedOrders: [] };
    }

    const { callMasiApi } = require('./sync-masi');
    try {
      const searchKey = (workerKeyOrName || '').trim();
      const teamData = await callMasiApi('api/worker/team', bossKey, {}).catch(e => {
        console.warn('[Bot Sync] Team API error:', e.message);
        return { team: [] };
      });

      const teamList = teamData.team || [];

      // Find worker by access_key or name
      const liveWorker = teamList.find(w =>
        (w.access_key && w.access_key.toUpperCase() === searchKey.toUpperCase()) ||
        (w.name && w.name.toLowerCase() === searchKey.toLowerCase())
      );

      return {
        liveWorker,
        completedOrders: []
      };
    } catch (err) {
      console.error('[Bot Sync Error]:', err.message);
      return { liveWorker: null, completedOrders: [] };
    }
  }

  // ── BILL GENERATION (NO COMPLETED ORDERS LIST) ─────────────────────────────

  // Build the bill text from a worker record (strictly NO rate, NO order list dump)
  buildBillText(worker, db) {
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

    const completed = Number(worker.completedOrders) || 0;
    const paidCount = Number(worker.paidCount) || 0;
    const leftover = Math.max(0, completed - paidCount);
    const d7Done = Number(worker.d7Done) || 0;
    const todayDone = Number(worker.todayDone) || 0;

    const isSettled = (completed > 0 && paidCount >= completed) || worker.paymentStatus === 'paid';
    const statusText = isSettled ? `✅ *Fully Settled (${completed}/${completed})*` : (leftover > 0 ? `⏳ *${leftover} Leftover Orders Pending Settlement*` : '⚪ *No Orders Yet*');

    return `🧾 *WORKER PERFORMANCE BILL*
━━━━━━━━━━━━━━━━━━━━━━━━
📅 *Date:* ${dateStr} ${timeStr}
━━━━━━━━━━━━━━━━━━━━━━━━

👤 *Worker:* ${worker.personName || worker.name} (${worker.telegramUsername || ''})
🔑 *Key:* \`${worker.key}\`
📍 *Online Status:* ${worker.online ? '🟢 Online' : '⚪ Offline'}

━━━━━━━━━━━━━━━━━━━━━━━━
📦 *COMPLETED ORDERS OVERVIEW:*
• ✅ *Total Completed Orders:* *${completed}*
• 🌅 *Today Done:* *${todayDone}* orders
• 📅 *Last 7 Days:* *${d7Done}* orders

━━━━━━━━━━━━━━━━━━━━━━━━
💰 *SETTLEMENT STATUS:*
• 📊 *Progress:* *${paidCount}/${completed}* orders settled
• ⏳ *Leftover Unsettled:* *${leftover}* order(s)
• 📌 *Status:* ${statusText}
${worker.payoutRequestStatus === 'pending' ? `• 🔔 *Pending Withdrawal Request:* ${worker.payoutRequestedOrders || leftover} order(s)\n` : ''}${isSettled && worker.lastPaidAt ? `• 📅 *Settled Date:* ${new Date(worker.lastPaidAt).toLocaleDateString('en-IN')}\n` : ''}━━━━━━━━━━━━━━━━━━━━━━━━
📢 *Official Channel (Join 1st!):* https://t.me/madmax00711
_🔄 Synced live with masi.cc.cd_`;
  }

  // Command: /bill [KEY] — generate bill with live data (strictly NO order dump)
  async handleBill(chatId, from, rawKey) {
    const db = this.dbManager.getDb();
    const userUname = this.normalizeUsername(from?.username);

    let searchKey = '';

    if (rawKey && rawKey.trim()) {
      searchKey = rawKey.trim();
      let worker = db.workers.find(w =>
        (w.key && w.key.toUpperCase() === searchKey.toUpperCase()) ||
        (w.name && w.name.toLowerCase() === searchKey.toLowerCase())
      );

      if (!worker) {
        await this.sendMessage(chatId, `❌ *Worker Key Not Recognized:* \`${searchKey}\`\nPlease check your key and try again, or contact support (@madmax00711).`);
        return;
      }

      // Check authorization
      const isAuthorized = this.isKeyAuthorizedForUser(worker, from, chatId);
      if (!isAuthorized) {
        const ownerDisplay = this.getWorkerOwnerName(worker);
        await this.sendMessage(chatId, `🚫 *Access Denied!*
━━━━━━━━━━━━━━━━━━━━━━━━
This key (\`${worker.key}\`) belongs to owner: *${ownerDisplay}*

Your Telegram account (@${userUname || 'no_username'}) is not authorized to access this key.

👉 *Please contact the owner or contact support:*
• *Official Channel:* https://t.me/madmax00711
• *Support:* @madmax00711
━━━━━━━━━━━━━━━━━━━━━━━━`, {
          reply_markup: {
            inline_keyboard: [
              [{ text: '📢 Official Channel', url: OFFICIAL_CHANNEL }],
              [{ text: '💬 Contact Support', url: OFFICIAL_CHANNEL }]
            ]
          }
        });
        return;
      }

      await this.sendMessage(chatId, `⏳ *Syncing live data from masi.cc.cd...*`);
      const { liveWorker } = await this.fetchLiveWorkerDataAndOrders(worker.key);
      if (liveWorker) {
        worker.completedOrders = Number(liveWorker.completed_count || 0);
        worker.online = Boolean(liveWorker.online);
        const d7 = (liveWorker.recent && liveWorker.recent.d7) || {};
        worker.d7Done = Number(d7.ok || 0);
        worker.todayDone = Number((liveWorker.recent && liveWorker.recent.today && liveWorker.recent.today.ok) || 0);
        this.dbManager.saveDb();
      }

      const billText = this.buildBillText(worker, db);
      await this.sendMessage(chatId, billText, {
        reply_markup: {
          inline_keyboard: [
            [{ text: '💳 Balance', callback_data: 'view_balance' }, { text: '💸 Withdraw Leftover', callback_data: 'withdraw_leftover' }],
            [{ text: '📢 Join Official Channel 1st', url: OFFICIAL_CHANNEL }]
          ]
        }
      });
      return;
    }

    // No rawKey: fetch for all keys belonging to this user
    const userWorkers = this.findWorkersForUser(chatId, from);
    if (!userWorkers || userWorkers.length === 0) {
      await this.sendMessage(chatId, `⚠️ *No Worker Key Connected!*

Please send your assigned worker key to connect:
\`WORKER-XXXX-XXXX-XXXX-XXXX\`

_🔒 Note: Access is locked to authorized Telegram accounts._`, {
        reply_markup: {
          inline_keyboard: [
            [{ text: '📢 Official Channel', url: OFFICIAL_CHANNEL }]
          ]
        }
      });
      return;
    }

    await this.sendMessage(chatId, `⏳ *Syncing live data from masi.cc.cd...*`);

    // Sync live data for primary worker
    const primaryWorker = userWorkers[0];
    const { liveWorker } = await this.fetchLiveWorkerDataAndOrders(primaryWorker.key);
    if (liveWorker) {
      primaryWorker.completedOrders = Number(liveWorker.completed_count || 0);
      primaryWorker.online = Boolean(liveWorker.online);
      const d7 = (liveWorker.recent && liveWorker.recent.d7) || {};
      primaryWorker.d7Done = Number(d7.ok || 0);
      primaryWorker.todayDone = Number((liveWorker.recent && liveWorker.recent.today && liveWorker.recent.today.ok) || 0);
      this.dbManager.saveDb();
    }

    if (userWorkers.length === 1) {
      const billText = this.buildBillText(primaryWorker, db);
      await this.sendMessage(chatId, billText, {
        reply_markup: {
          inline_keyboard: [
            [{ text: '💳 Balance', callback_data: 'view_balance' }, { text: '💸 Withdraw Leftover', callback_data: 'withdraw_leftover' }],
            [{ text: '📢 Join Official Channel 1st', url: OFFICIAL_CHANNEL }]
          ]
        }
      });
      return;
    }

    // Multi-key summary
    const totalCompleted = userWorkers.reduce((sum, w) => sum + (Number(w.completedOrders) || 0), 0);
    const totalPaid = userWorkers.reduce((sum, w) => sum + (Number(w.paidCount) || 0), 0);
    const totalLeftover = Math.max(0, totalCompleted - totalPaid);
    const totalTodayDone = userWorkers.reduce((sum, w) => sum + (Number(w.todayDone) || 0), 0);
    const isSettled = (totalCompleted > 0 && totalPaid >= totalCompleted);

    let breakdown = userWorkers.map(w => {
      const c = Number(w.completedOrders) || 0;
      const p = Number(w.paidCount) || 0;
      const l = Math.max(0, c - p);
      return `• \`${w.key}\`: *${c}* completed | *${p}/${c}* settled | *${l}* leftover`;
    }).join('\n');

    const multiBillText = `🧾 *MULTI-KEY PERFORMANCE BILL*
━━━━━━━━━━━━━━━━━━━━━━━━
👤 *Worker:* ${primaryWorker.personName || primaryWorker.name} (@${userUname})
🔑 *Connected Keys (${userWorkers.length}):*

${breakdown}

━━━━━━━━━━━━━━━━━━━━━━━━
📦 *COMBINED OVERVIEW:*
• ✅ *Total Completed Orders:* *${totalCompleted}*
• 📊 *Total Settled:* *${totalPaid}/${totalCompleted}*
• ⏳ *Leftover Unsettled:* *${totalLeftover}* order(s)
• 🌅 *Today Done:* *${totalTodayDone}* orders
• 📌 *Status:* ${isSettled ? '✅ *Fully Settled*' : `⏳ *${totalLeftover} Pending Settlement*`}
━━━━━━━━━━━━━━━━━━━━━━━━
📢 *Official Channel (Join 1st!):* https://t.me/madmax00711
_🔄 Synced live with masi.cc.cd_`;

    await this.sendMessage(chatId, multiBillText, {
      reply_markup: {
        inline_keyboard: [
          [{ text: '💳 Balance', callback_data: 'view_balance' }, { text: '💸 Withdraw Leftover', callback_data: 'withdraw_leftover' }],
          [{ text: '📢 Join Official Channel 1st', url: OFFICIAL_CHANNEL }]
        ]
      }
    });
  }

  // Command: /withdraw or /request [orders] — worker requests withdrawal for specified orders
  async handlePayoutRequest(chatId, from, rawOrders) {
    const userWorkers = this.findWorkersForUser(chatId, from);
    const userUname = this.normalizeUsername(from?.username);

    if (!userWorkers || userWorkers.length === 0) {
      await this.sendMessage(chatId, `⚠️ *No Worker Key Connected!*\nPlease send your worker key to connect your account:\n\`WORKER-XXXX-XXXX-XXXX-XXXX\``);
      return;
    }

    const primaryWorker = userWorkers[0];
    const totalCompleted = userWorkers.reduce((sum, w) => sum + (Number(w.completedOrders) || 0), 0);
    const totalPaid = userWorkers.reduce((sum, w) => sum + (Number(w.paidCount) || 0), 0);
    const totalLeftover = Math.max(0, totalCompleted - totalPaid);

    if (totalCompleted === 0) {
      await this.sendMessage(chatId, `⚪ *No Completed Orders Yet!*\nDo some tasks first to complete orders.`);
      return;
    }

    if (totalLeftover <= 0) {
      await this.sendMessage(chatId, `ℹ️ *Already Settled!*\nAll your completed tasks (*${totalCompleted}/${totalCompleted}*) are already marked as Paid & Settled.`);
      return;
    }

    let requestedOrders = totalLeftover;
    let requestType = 'all';

    if (rawOrders && rawOrders.trim()) {
      const parsed = parseInt(rawOrders.trim(), 10);
      if (isNaN(parsed) || parsed <= 0) {
        await this.sendMessage(chatId, `⚠️ *Invalid Order Count!*\nPlease specify a positive number of orders to withdraw.\n_Example: \`/withdraw 10\` or \`/reqforleftover\`_`);
        return;
      }
      if (parsed > totalLeftover) {
        await this.sendMessage(chatId, `⚠️ *Request Exceeds Leftover Balance!*\n• Total Completed: *${totalCompleted}*\n• Already Settled: *${totalPaid}/${totalCompleted}*\n• Leftover Available: *${totalLeftover}* order(s)\n\nYou cannot request ${parsed} orders. Please request up to *${totalLeftover}* orders (e.g. \`/withdraw ${totalLeftover}\` or \`/reqforleftover\`).`);
        return;
      }
      requestedOrders = parsed;
      requestType = 'custom';
    }

    primaryWorker.payoutRequestedOrders = requestedOrders;
    primaryWorker.payoutRequestType = requestType;
    primaryWorker.payoutRequestedAt = new Date().toISOString();
    primaryWorker.payoutRequestStatus = 'pending';
    this.dbManager.saveDb();

    const ackMsg = `✅ *WITHDRAWAL REQUEST SUBMITTED!*
━━━━━━━━━━━━━━━━━━━━━━━━
👤 *Worker:* ${primaryWorker.personName || primaryWorker.name} (@${userUname})
🔑 *Key(s):* ${userWorkers.map(w => `\`${w.key}\``).join(', ')}

📦 *Requested to Withdraw:* *${requestedOrders}* order(s)
📊 *Current Status:* *${totalPaid}/${totalCompleted}* settled
⏳ *Remaining After Payout:* *${totalLeftover - requestedOrders}* order(s)
📅 *Date:* ${new Date().toLocaleDateString('en-IN')}

⏳ *Status:* *Sent to Admin on Dashboard*
Your administrator has been notified to settle your *${requestedOrders}* requested orders. You will receive an instant alert here as soon as payout is processed!

📢 *Official Channel (Join 1st!):* https://t.me/madmax00711
━━━━━━━━━━━━━━━━━━━━━━━━`;

    await this.sendMessage(chatId, ackMsg, {
      reply_markup: {
        inline_keyboard: [
          [{ text: '💳 Balance', callback_data: 'view_balance' }],
          [{ text: '📢 Join Official Channel 1st', url: OFFICIAL_CHANNEL }]
        ]
      }
    });
  }

  // Command: /reqforleftover — worker requests withdrawal for all remaining unsettled orders
  async handleLeftoverRequest(chatId, from) {
    const userWorkers = this.findWorkersForUser(chatId, from);
    const userUname = this.normalizeUsername(from?.username);

    if (!userWorkers || userWorkers.length === 0) {
      await this.sendMessage(chatId, `⚠️ *No Worker Key Connected!*\nPlease send your worker key to connect your account:\n\`WORKER-XXXX-XXXX-XXXX-XXXX\``);
      return;
    }

    const primaryWorker = userWorkers[0];
    const totalCompleted = userWorkers.reduce((sum, w) => sum + (Number(w.completedOrders) || 0), 0);
    const totalPaid = userWorkers.reduce((sum, w) => sum + (Number(w.paidCount) || 0), 0);
    const totalLeftover = Math.max(0, totalCompleted - totalPaid);

    if (totalLeftover <= 0) {
      await this.sendMessage(chatId, `ℹ️ *No Leftover Balance!*\nAll your completed tasks (*${totalCompleted}/${totalCompleted}*) are already paid and settled.`);
      return;
    }

    primaryWorker.payoutRequestedOrders = totalLeftover;
    primaryWorker.payoutRequestType = 'leftover';
    primaryWorker.payoutRequestedAt = new Date().toISOString();
    primaryWorker.payoutRequestStatus = 'pending';
    this.dbManager.saveDb();

    const ackMsg = `✅ *LEFTOVER WITHDRAWAL REQUESTED!*
━━━━━━━━━━━━━━━━━━━━━━━━
👤 *Worker:* ${primaryWorker.personName || primaryWorker.name} (@${userUname})
🔑 *Key(s):* ${userWorkers.map(w => `\`${w.key}\``).join(', ')}

📦 *Leftover Orders to Settle:* *${totalLeftover}* order(s)
📊 *Current Status:* *${totalPaid}/${totalCompleted}* settled
📅 *Date:* ${new Date().toLocaleDateString('en-IN')}

⏳ *Status:* *Sent to Admin on Dashboard*
Your administrator has been notified to settle your *${totalLeftover}* leftover orders. You will receive an instant alert here as soon as payout is processed!

📢 *Official Channel (Join 1st!):* https://t.me/madmax00711
━━━━━━━━━━━━━━━━━━━━━━━━`;

    await this.sendMessage(chatId, ackMsg, {
      reply_markup: {
        inline_keyboard: [
          [{ text: '💳 Balance', callback_data: 'view_balance' }],
          [{ text: '📢 Join Official Channel 1st', url: OFFICIAL_CHANNEL }]
        ]
      }
    });
  }

  // Command: /refresh — refresh live stats for linked account then show bill
  async handleRefreshAndBill(chatId, from) {
    await this.handleBill(chatId, from);
  }

  // ── END BILL SECTION ────────────────────────────────────────────────────

  // Send Automated Payout Notification when Admin marks as Paid
  async sendPayoutNotification(workerKey, ordersCount) {
    const db = this.dbManager.getDb();
    const worker = db.workers.find(w => w.key && w.key.toUpperCase() === (workerKey || '').toUpperCase());

    if (!worker || !worker.telegramId) {
      return false;
    }

    const alertMsg = `
🎉 *PAYOUT COMPLETED & SETTLED!*
━━━━━━━━━━━━━━━━━━━━━━━━
Hi ${worker.personName || worker.name}! Your administrator has cleared your payout:

📦 *Orders Settled:* *${ordersCount}* completed order(s)
📅 *Date:* ${new Date().toLocaleDateString('en-IN')}
📢 *Official Channel (Join 1st!):* https://t.me/madmax00711
━━━━━━━━━━━━━━━━━━━━━━━━
Send \`/stats\` or \`/balance\` to check your updated settlement status. Thank you!
`;
    return await this.sendMessage(worker.telegramId, alertMsg, {
      reply_markup: {
        inline_keyboard: [
          [{ text: '📢 Join Official Channel 1st', url: OFFICIAL_CHANNEL }]
        ]
      }
    });
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
