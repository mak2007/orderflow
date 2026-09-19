// Masi Boss Extractor & Sync Utility
// Extracts workers, access keys, completed orders count, and success rate from https://masi.cc.cd/boss
const https = require('https');

function callMasiApi(path, bossKey, payload = {}) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(payload);
    const options = {
      hostname: 'masi.cc.cd',
      port: 443,
      path: '/' + path.replace(/^\/+/, ''),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Worker-Key': bossKey,
        'Content-Length': Buffer.byteLength(postData)
      },
      timeout: 15000
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const data = JSON.parse(body);
          if (res.statusCode >= 200 && res.statusCode < 300 && data.ok !== false) {
            resolve(data);
          } else {
            reject(new Error(data.error || `HTTP ${res.statusCode}: ${body}`));
          }
        } catch (e) {
          reject(new Error(`Failed to parse response: ${body.slice(0, 100)}`));
        }
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request to masi.cc.cd timed out'));
    });

    req.write(postData);
    req.end();
  });
}

// Extract and normalize worker data from masi
async function extractMasiData(bossKey) {
  if (!bossKey || !bossKey.trim()) {
    throw new Error('Boss Key is required');
  }
  const key = bossKey.trim();

  // 1. Fetch team members and overview
  const teamData = await callMasiApi('api/worker/team', key, {});
  const teamList = teamData.team || [];

  // 2. Fetch order history
  let ordersList = [];
  try {
    const ordersData = await callMasiApi('api/worker/team', key, {
      action: 'orders',
      range: 'all',
      limit: 500
    });
    ordersList = ordersData.orders || [];
  } catch (err) {
    console.warn('Could not fetch orders list from masi:', err.message);
  }

  // Parse workers
  const workers = teamList.map(w => {
    const d7 = (w.recent && w.recent.d7) || {};
    const successRate = w.success_rate !== undefined 
      ? Number(w.success_rate) 
      : (d7.rate !== undefined ? Number(d7.rate) : 0);

    return {
      workerId: w.worker_id,
      name: w.name,
      key: w.access_key || `WORKER-${w.name.toUpperCase()}`,
      completedCount: Number(w.completed_count || 0),
      failCount: Number(w.release_count || 0) + Number(w.expired_count || 0) + Number(w.not_landed_count || 0),
      successRate: successRate,
      active: w.active !== false,
      online: Boolean(w.online),
      d7Done: Number(d7.ok || 0),
      d7Fail: Number(d7.fail || 0),
      d7Rate: Number(d7.rate || 0),
      todayDone: Number((w.recent && w.recent.today && w.recent.today.ok) || 0),
      raw: w
    };
  });

  return {
    overview: teamData.overview || {},
    workers,
    orders: ordersList
  };
}

module.exports = {
  callMasiApi,
  extractMasiData
};

// If run directly from CLI: node sync-masi.js <BOSS_KEY>
if (require.main === module) {
  const inputKey = process.argv[2];
  if (!inputKey) {
    console.log('\nUsage: node sync-masi.js <YOUR_BOSS_KEY>');
    console.log('Example: node sync-masi.js WORKER-ABCD-1234-EFGH-5678\n');
    process.exit(1);
  }

  console.log(`\n🔍 Connecting to https://masi.cc.cd/boss using key: ${inputKey}...`);
  extractMasiData(inputKey).then(data => {
    console.log(`\n✅ Connected successfully! Extracted ${data.workers.length} workers.`);
    console.log('\n================ WORKER STATISTICS ================');
    data.workers.forEach((w, i) => {
      console.log(`\n[${i+1}] Worker: ${w.name}`);
      console.log(`    🔑 Key: ${w.key}`);
      console.log(`    📦 Completed Orders: ${w.completedCount}`);
      console.log(`    🎯 Success Rate: ${w.successRate.toFixed(1)}%`);
      console.log(`    📅 7-Day Performance: ${w.d7Done} Done / ${w.d7Fail} Fail (${w.d7Rate.toFixed(1)}%)`);
      console.log(`    ⚡ Status: ${w.active ? 'Active' : 'Inactive'} | ${w.online ? '🟢 Online' : '⚪ Offline'}`);
    });
    console.log('\n===================================================\n');
  }).catch(err => {
    console.error('\n❌ Extraction failed:', err.message, '\n');
    process.exit(1);
  });
}
