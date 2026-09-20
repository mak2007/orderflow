// Extract strictly the last 24 hours of data from masi.cc.cd
const fs = require('fs');
const path = require('path');
const { extractMasi24hData } = require('./sync-masi');

async function main() {
  const dbPath = path.join(__dirname, 'data', 'database.json');
  let bossKey = 'WORKER-B030-0827-9A88-4A04';

  if (fs.existsSync(dbPath)) {
    try {
      const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
      if (db.settings && db.settings.bossKey) {
        bossKey = db.settings.bossKey;
      }
    } catch (e) {}
  }

  // Allow passing custom key or range as CLI argument
  // Usage: node extract-24h.js [BOSS_KEY] [24h|today]
  if (process.argv[2] && process.argv[2].startsWith('WORKER-')) {
    bossKey = process.argv[2];
  }
  const range = process.argv[3] || '24h';

  console.log('\n======================================================');
  console.log(`⏱️  EXTRACTING LAST 24 HOURS DATA FROM MASI.CC.CD`);
  console.log(`🔑  Boss Key: ${bossKey}`);
  console.log(`⏳  Time Window: Last 24 Hours (Range: ${range})`);
  console.log('======================================================\n');

  try {
    const data = await extractMasi24hData(bossKey, range);

    console.log(`✅ Extraction Complete!`);
    console.log(`📅 Extracted At: ${new Date(data.extractedAt).toLocaleString('en-IN')}`);
    console.log(`📦 Total Orders In Last 24 Hours: ${data.totalOrders24h}`);
    console.log(`✅ Total Completed In Last 24 Hours: ${data.totalCompleted24h}`);
    console.log(`👥 Active Workers In Last 24 Hours: ${data.activeWorkersCount}`);
    console.log('\n------------------------------------------------------');
    console.log('📊 ACTIVE WORKERS PERFORMANCE (LAST 24 HOURS):');
    console.log('------------------------------------------------------');

    if (data.activeWorkers24h.length === 0) {
      console.log('No worker activity recorded in the last 24 hours yet.');
    } else {
      // Sort highest completed first
      data.activeWorkers24h.sort((a, b) => b.done24h - a.done24h);
      data.activeWorkers24h.forEach((w, idx) => {
        console.log(`[${idx + 1}] ${w.name.padEnd(20)} | Completed: ${String(w.done24h).padStart(3)} | Failed: ${String(w.fail24h).padStart(2)} | Online: ${w.online ? '🟢' : '⚪'} | Key: ${w.key}`);
      });
    }

    console.log('\n------------------------------------------------------');
    console.log(`📋 RECENT ORDERS IN LAST 24 HOURS (${data.orders.length}):`);
    console.log('------------------------------------------------------');
    data.orders.slice(0, 15).forEach((o, idx) => {
      let time = 'Recent';
      if (o.completed_at || o.created_at) {
        time = new Date((o.completed_at || o.created_at) * 1000).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
      }
      console.log(`${idx + 1}. [${o.status.toUpperCase()}] ${time} | ${o.worker_name || 'Worker'} | Order: ${o.order_id} ${o.ticket ? '| Ticket: ' + o.ticket : ''}`);
    });

    if (data.orders.length > 15) {
      console.log(`... and ${data.orders.length - 15} more orders in last 24h.`);
    }

    // Save to data/masi-24h.json
    const outPath = path.join(__dirname, 'data', 'masi-24h.json');
    fs.writeFileSync(outPath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`\n💾 Saved full 24-hour dataset to: ${outPath}\n`);

  } catch (err) {
    console.error('\n❌ Extraction Failed:', err.message, '\n');
    process.exit(1);
  }
}

main();
