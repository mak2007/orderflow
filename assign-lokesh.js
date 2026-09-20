const fs = require('fs');
const { callMasiApi } = require('./sync-masi');

const userList = [
  { key: 'WORKER-0294-80C8-2460-75BA', orders: 4 },
  { key: 'WORKER-6676-F4D9-2147-A574', orders: 1 },
  { key: 'WORKER-4707-1239-E315-45EC', orders: 4 },
  { key: 'WORKER-118D-8094-DCC7-26D1', orders: 1 },
  { key: 'WORKER-E066-68BB-5788-5D13', orders: 0 },
  { key: 'WORKER-8541-C1F7-7407-CE6E', orders: 4 },
  { key: 'WORKER-3679-B63F-244A-40C1', orders: 0 },
  { key: 'WORKER-BCA3-777D-223B-D9E9', orders: 0 },
  { key: 'WORKER-C113-B382-50E1-DBE9', orders: 0 },
  { key: 'WORKER-B6BA-FD40-2DD5-889C', orders: 4 },
  { key: 'WORKER-1056-C400-A79B-F7B6', orders: 2 },
  { key: 'WORKER-EF4D-642C-387E-D727', orders: 1 },
  { key: 'WORKER-D713-6BEC-56C8-4C85', orders: 3 },
  { key: 'WORKER-EB2E-DF5D-1674-6B52', orders: 7 },
  { key: 'WORKER-339D-6A6C-BA52-CC3A', orders: 13 },
  { key: 'WORKER-E0F5-49CA-9564-7425', orders: 3 },
  { key: 'WORKER-79CB-C0AF-22A2-2BDD', orders: 1 },
  { key: 'WORKER-ABC7-A12B-7A80-E0C4', orders: 1 },
  { key: 'WORKER-79CB-C0AF-22A2-2BBD', orders: 1 },
  { key: 'WORKER-C0FC-E82A-3F32-5B8F', orders: 1 }
];

async function updateDb() {
  const dbPath = 'data/database.json';
  const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  const bossKey = (db.settings && db.settings.bossKey) || 'WORKER-B030-0827-9A88-4A04';

  let masiTeam = [];
  try {
    const res = await callMasiApi('api/worker/team', bossKey, {});
    masiTeam = res.team || [];
  } catch (e) {
    console.warn('Masi API fetch error:', e.message);
  }

  userList.forEach(item => {
    const k = item.key.toUpperCase();
    let worker = db.workers.find(w => w.key && w.key.toUpperCase() === k);
    const masiW = masiTeam.find(w => w.access_key && w.access_key.toUpperCase() === k);

    if (!worker) {
      worker = {
        id: 'w-lokesh-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
        name: masiW ? masiW.name : ('Lokesh-' + k.slice(-4)),
        key: k,
        personName: 'Lokesh',
        rate: 15.00,
        completedOrders: Math.max(item.orders, masiW ? Number(masiW.completed_count || 0) : 0),
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
      worker.personName = 'Lokesh';
      if (item.orders !== undefined) {
        worker.completedOrders = Math.max(item.orders, worker.completedOrders || 0, masiW ? Number(masiW.completed_count || 0) : 0);
      }
      if (masiW) {
        worker.name = masiW.name;
        worker.online = Boolean(masiW.online);
        worker.todayDone = Number((masiW.recent && masiW.recent.today && masiW.recent.today.ok) || worker.todayDone || 0);
        worker.d7Done = Number((masiW.recent && masiW.recent.d7 && masiW.recent.d7.ok) || worker.d7Done || 0);
      }
      worker.updatedAt = new Date().toISOString();
    }
  });

  // Also group other existing Lokesh keys
  db.workers.forEach(w => {
    if (w.name && (w.name.toLowerCase() === 'lokesh' || w.name.toLowerCase().startsWith('lokesh0'))) {
      w.personName = 'Lokesh';
    }
  });

  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
  if (fs.existsSync('public/data/database.json')) {
    fs.writeFileSync('public/data/database.json', JSON.stringify(db, null, 2), 'utf8');
  }

  const allLokesh = db.workers.filter(w => w.personName === 'Lokesh');
  const totalOrders = allLokesh.reduce((s, w) => s + (Number(w.completedOrders) || 0), 0);
  console.log('Success! Total keys under Lokesh:', allLokesh.length);
  console.log('Total completed orders across Lokesh keys:', totalOrders);
  allLokesh.forEach((w, i) => {
    console.log((i + 1) + '. ' + w.key + ' (' + w.name + '): ' + w.completedOrders + ' orders');
  });
}

updateDb().catch(console.error);
