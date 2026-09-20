// Masi Boss Extractor & Sync Utility
// Extracts workers, access keys, completed orders count, and success rate from https://masi.cc.cd/boss
const https = require('https');

function callMasiApi(path, bossKey, payload = null, method = 'POST') {
  return new Promise((resolve, reject) => {
    const postData = payload ? JSON.stringify(payload) : '';
    const options = {
      hostname: 'masi.cc.cd',
      port: 443,
      path: '/' + path.replace(/^\/+/, ''),
      method: method,
      headers: {
        'Accept': 'application/json',
        'X-Worker-Key': bossKey
      },
      timeout: 15000
    };

    if (method === 'POST') {
      options.headers['Content-Type'] = 'application/json';
      options.headers['Content-Length'] = Buffer.byteLength(postData);
    }

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

    if (method === 'POST') req.write(postData);
    req.end();
  });
}

// Extract and normalize worker data from masi
async function extractMasiData(bossKey) {
  if (!bossKey || !bossKey.trim()) {
    throw new Error('Boss Key is required');
  }
  const key = bossKey.trim();

  // 1. Fetch boss overview (withdrawals, balance, amount withdrawn total)
  let masiOverview = {};
  try {
    masiOverview = await callMasiApi('api/worker/overview', key, null, 'GET');
  } catch (err) {
    console.warn('Could not fetch overview from masi:', err.message);
  }

  // 2. Fetch team members
  const teamData = await callMasiApi('api/worker/team', key, {});
  const teamList = teamData.team || [];

  // 3. Fetch order history
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

  // Calculate amount withdrawn total & paid today from Masi overview
  const withdrawals = (masiOverview && masiOverview.withdrawals) || [];
  const limitDay = (masiOverview && masiOverview.withdrawal_daily_limit && masiOverview.withdrawal_daily_limit.day) || new Date().toISOString().slice(0, 10);
  
  const paidTodayWithdrawals = withdrawals.filter(w => {
    if (w.status !== 'paid') return false;
    const d = new Date(w.created_at * 1000).toISOString().slice(0, 10);
    return d === limitDay;
  });

  const paidTodayCents = paidTodayWithdrawals.reduce((sum, w) => sum + (Number(w.amount_cents) || 0), 0);
  const withdrawnPaidCents = Number(masiOverview.withdrawn_paid_cents || 0);
  const balanceCents = Number((masiOverview.worker && masiOverview.worker.balance_cents) || 0);

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
    overview: {
      withdrawnPaidCents,
      withdrawnPaidTotal: (withdrawnPaidCents / 100),
      paidTodayCents,
      paidTodayTotal: (paidTodayCents / 100),
      balanceCents,
      balanceTotal: (balanceCents / 100),
      limitDay,
      todayWithdrawalsCount: paidTodayWithdrawals.length,
      withdrawals: withdrawals.slice(0, 10)
    },
    workers,
    orders: ordersList
  };
}

// Extract strictly last 24h data from masi
async function extractMasi24hData(bossKey, range = '24h') {
  if (!bossKey || !bossKey.trim()) {
    throw new Error('Boss Key is required');
  }
  const key = bossKey.trim();

  const [teamData, ordersData] = await Promise.all([
    callMasiApi('api/worker/team', key, {}).catch(e => {
      console.warn('Could not fetch team from masi:', e.message);
      return { team: [] };
    }),
    callMasiApi('api/worker/team', key, {
      action: 'orders',
      range: range, // '24h' or 'today'
      limit: 1000
    }).catch(e => {
      console.warn('Could not fetch 24h orders from masi:', e.message);
      return { orders: [] };
    })
  ]);

  const teamList = teamData.team || [];
  const rawOrders = ordersData.orders || [];

  const nowSec = Math.floor(Date.now() / 1000);
  const cutoff24h = nowSec - (24 * 60 * 60);

  // Filter orders strictly within the last 24 hours
  const orders24h = rawOrders.filter(o => {
    const t = Number(o.completed_at || o.created_at || 0);
    return t >= cutoff24h;
  });

  // Calculate 24h completed count per worker
  const workerStats24h = {};
  orders24h.forEach(o => {
    const wKey = (o.worker_key || '').toUpperCase();
    const wName = (o.worker_name || '').toLowerCase();
    const isCompleted = o.status === 'completed' || Number(o.completed_at) > 0;

    const identifier = wKey || wName || o.worker_id || 'unknown';
    if (!workerStats24h[identifier]) {
      workerStats24h[identifier] = { completed: 0, failed: 0, total: 0 };
    }
    workerStats24h[identifier].total++;
    if (isCompleted) {
      workerStats24h[identifier].completed++;
    } else {
      workerStats24h[identifier].failed++;
    }
  });

  // Attach 24h stats to workers
  const workers = teamList.map(w => {
    const stats = workerStats24h[w.access_key ? w.access_key.toUpperCase() : ''] ||
                  workerStats24h[w.name ? w.name.toLowerCase() : ''] ||
                  workerStats24h[w.worker_id || ''] ||
                  { completed: 0, failed: 0, total: 0 };

    return {
      workerId: w.worker_id,
      name: w.name,
      key: w.access_key || `WORKER-${w.name.toUpperCase()}`,
      done24h: stats.completed,
      fail24h: stats.failed,
      total24h: stats.total,
      todayDone: Number((w.recent && w.recent.today && w.recent.today.ok) || stats.completed),
      allTimeCompleted: Number(w.completed_count || 0),
      online: Boolean(w.online),
      active: w.active !== false
    };
  });

  // Only active workers in last 24h or all workers with 24h stats
  const activeWorkers24h = workers.filter(w => w.done24h > 0 || w.fail24h > 0);

  return {
    range,
    extractedAt: new Date().toISOString(),
    totalOrders24h: orders24h.length,
    totalCompleted24h: orders24h.filter(o => o.status === 'completed' || Number(o.completed_at) > 0).length,
    activeWorkersCount: activeWorkers24h.length,
    activeWorkers24h,
    allWorkers: workers,
    orders: orders24h
  };
}

module.exports = {
  callMasiApi,
  extractMasiData,
  extractMasi24hData
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
