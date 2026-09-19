// Sync Masi Boss Data into database.json
const fs = require('fs');
const path = require('path');
const { extractMasiData } = require('./sync-masi.js');

const BOSS_KEY = process.argv[2] || 'WORKER-B030-0827-9A88-4A04';
const DB_PATH = path.join(__dirname, 'data', 'database.json');

async function sync() {
  console.log(`\nConnecting to Masi Boss API using key: ${BOSS_KEY}...`);
  const masiData = await extractMasiData(BOSS_KEY);

  console.log(`Fetched ${masiData.workers.length} workers from Masi Boss.`);

  let db = { settings: {}, workers: [], orders: [] };
  if (fs.existsSync(DB_PATH)) {
    try {
      db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
    } catch (e) {
      console.warn('Failed to parse database.json, initializing fresh structure');
    }
  }

  if (!db.workers) db.workers = [];
  if (!db.orders) db.orders = [];
  if (!db.settings) db.settings = {};

  let added = 0;
  let updated = 0;

  masiData.workers.forEach((mw, idx) => {
    const existing = db.workers.find(w =>
      (w.key && w.key.toUpperCase() === mw.key.toUpperCase()) ||
      (w.name && w.name.toLowerCase() === mw.name.toLowerCase())
    );

    if (existing) {
      existing.name = mw.name;
      existing.key = mw.key;
      existing.completedOrders = mw.completedCount;
      existing.failCount = mw.failCount;
      existing.successRate = mw.successRate;
      if (existing.customSuccessRate === undefined || existing.customSuccessRate === null) {
        existing.customSuccessRate = mw.successRate;
      }
      existing.d7Done = mw.d7Done;
      existing.d7Fail = mw.d7Fail;
      existing.d7Rate = mw.d7Rate;
      existing.todayDone = mw.todayDone;
      existing.online = mw.online;
      existing.status = mw.active ? 'active' : 'paused';
      existing.source = 'masi';
      existing.lastSyncedAt = new Date().toISOString();
      updated++;
    } else {
      db.workers.push({
        id: `w-masi-${idx + 1}`,
        name: mw.name,
        key: mw.key,
        telegramId: null,
        telegramUsername: null,
        rate: Number(db.settings.defaultRate) || 15.00,
        completedOrders: mw.completedCount,
        failCount: mw.failCount,
        successRate: mw.successRate,
        customSuccessRate: mw.successRate,
        d7Done: mw.d7Done,
        d7Fail: mw.d7Fail,
        d7Rate: mw.d7Rate,
        todayDone: mw.todayDone,
        online: mw.online,
        status: mw.active ? 'active' : 'paused',
        source: 'masi',
        linkedAt: null,
        lastSyncedAt: new Date().toISOString()
      });
      added++;
    }
  });

  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf8');
  console.log(`\nSync Complete:`);
  console.log(`- New Workers Added: ${added}`);
  console.log(`- Workers Updated: ${updated}`);
  console.log(`- Total Workers in DB: ${db.workers.length}`);

  // Summary of workers with completed orders or non-zero success rate
  const activeWorkers = db.workers.filter(w => (w.completedOrders > 0 || w.successRate > 0));
  console.log(`\nFound ${activeWorkers.length} workers with order history / success rate:\n`);
  activeWorkers.forEach(w => {
    console.log(`• ${w.name.padEnd(16)} | Key: ${w.key.padEnd(28)} | Completed: ${String(w.completedOrders).padStart(3)} | Success Rate: ${w.successRate.toFixed(1)}% | Status: ${w.online ? 'Online' : 'Offline'}`);
  });
}

sync().catch(err => {
  console.error('Sync error:', err);
  process.exit(1);
});
