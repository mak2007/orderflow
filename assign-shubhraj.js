const fs = require('fs');
const { callMasiApi } = require('./sync-masi');

const userList = [
  { key: 'WORKER-8109-C7C6-FB50-BC5A', label: 'woralam' },
  { key: 'WORKER-56A9-D784-C065-A300', label: 'mahakal 02' },
  { key: 'WORKER-BAF8-8A3C-3CA1-5604', label: 'luffyd' },
  { key: 'WORKER-339D-6A6C-BA52-CC3A', label: 'loksjx' },
  { key: 'WORKER-1DF3-63BE-3F95-436B', label: 'Scem' },
  { key: 'WORKER-4E6A-803A-7C90-443F', label: 'Rajxk' },
  { key: 'WORKER-E0EF-B1DA-9487-CD01', label: 'Ss03' },
  { key: 'WORKER-3EA9-3172-83F5-8CBD', label: 'Ss02' },
  { key: 'WORKER-B6BA-FD40-2DD5-889C', label: 'Lodka' },
  { key: 'WORKER-1056-C400-A79B-F7B6', label: 'Loajcjc' },
  { key: 'WORKER-79DB-1DC9-9F9D-4395', label: 'Ss01' },
  { key: 'WORKER-EF4D-642C-387E-D727', label: 'Djdjdjd' }
];

async function run() {
  const dbPath = 'data/database.json';
  const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  const bossKey = (db.settings && db.settings.bossKey) || 'WORKER-B030-0827-9A88-4A04';

  const [ordersRes, teamRes] = await Promise.all([
    callMasiApi('api/worker/team', bossKey, { action: 'orders', range: 'all', limit: 1000 }).catch(() => ({ orders: [] })),
    callMasiApi('api/worker/team', bossKey, {}).catch(() => ({ team: [] }))
  ]);

  const team = teamRes.team || [];
  const allOrders = ordersRes.orders || [];

  const tStart = new Date('2026-09-20T02:00:00+05:30').getTime() / 1000;
  const tEnd = new Date('2026-09-21T02:00:00+05:30').getTime() / 1000;
  const orders24h = allOrders.filter(o => o.created_at >= tStart && o.created_at <= tEnd);

  const stats24h = {};
  orders24h.forEach(o => {
    const name = (o.worker_name || '').toLowerCase();
    if (!stats24h[name]) stats24h[name] = { completed: 0, failed: 0, expired: 0, total: 0 };
    stats24h[name].total++;
    if (o.status === 'completed' || Number(o.completed_at) > 0) stats24h[name].completed++;
    else if (o.status === 'failed') stats24h[name].failed++;
    else if (o.status === 'expired') stats24h[name].expired++;
  });

  const assigned = [];
  let total24hDone = 0;
  let totalAllTimeDone = 0;

  // Deduplicate userList by key
  const uniqueKeys = [];
  const dedupedList = [];
  userList.forEach(item => {
    const k = item.key.toUpperCase();
    if (!uniqueKeys.includes(k)) {
      uniqueKeys.push(k);
      dedupedList.push(item);
    }
  });

  dedupedList.forEach(item => {
    const k = item.key.toUpperCase();
    const masiW = team.find(w => w.access_key && w.access_key.toUpperCase() === k);
    let worker = db.workers.find(w => w.key && w.key.toUpperCase() === k);

    const mName = masiW ? masiW.name : item.label;
    const s24 = stats24h[mName.toLowerCase()] || { completed: 0, failed: 0, expired: 0, total: 0 };
    const allTime = masiW ? Number(masiW.completed_count || 0) : 0;

    total24hDone += s24.completed;
    totalAllTimeDone += allTime;

    if (!worker) {
      worker = {
        id: 'w-shubhraj-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
        name: mName,
        key: k,
        personName: 'Shubhraj Singh',
        rate: 15.00,
        completedOrders: allTime,
        done24h: s24.completed,
        fail24h: s24.failed,
        paidCount: 0,
        paidAmount: 0,
        failCount: masiW ? Number(masiW.release_count || 0) : 0,
        successRate: masiW ? Number(masiW.rate || 0) : 0,
        todayDone: masiW ? Number((masiW.recent && masiW.recent.today && masiW.recent.today.ok) || 0) : 0,
        d7Done: masiW ? Number((masiW.recent && masiW.recent.d7 && masiW.recent.d7.ok) || 0) : 0,
        online: masiW ? Boolean(masiW.online) : false,
        status: 'active',
        source: masiW ? 'masi' : 'custom',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      db.workers.push(worker);
    } else {
      worker.personName = 'Shubhraj Singh';
      worker.name = mName;
      worker.done24h = s24.completed;
      worker.fail24h = s24.failed;
      if (allTime > 0) worker.completedOrders = allTime;
      if (masiW) {
        worker.online = Boolean(masiW.online);
        worker.todayDone = Number((masiW.recent && masiW.recent.today && masiW.recent.today.ok) || worker.todayDone || 0);
        worker.d7Done = Number((masiW.recent && masiW.recent.d7 && masiW.recent.d7.ok) || worker.d7Done || 0);
      }
      worker.updatedAt = new Date().toISOString();
    }

    assigned.push({
      label: item.label,
      name: mName,
      key: k,
      done24h: s24.completed,
      fail24h: s24.failed,
      expired24h: s24.expired,
      allTimeDone: allTime,
      online: masiW ? Boolean(masiW.online) : false
    });
  });

  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
  if (fs.existsSync('public/data/database.json')) {
    fs.writeFileSync('public/data/database.json', JSON.stringify(db, null, 2), 'utf8');
  }

  console.log(JSON.stringify({
    personName: 'Shubhraj Singh',
    totalKeys: assigned.length,
    total24hDone,
    totalAllTimeDone,
    workers: assigned
  }, null, 2));
}

run().catch(console.error);
