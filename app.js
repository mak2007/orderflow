// Masi Team & Worker Performance Hub Logic
// Multi-Key Grouping, Telegram Bot Integration & Masi Boss Sync
(function() {
  'use strict';

  const STORAGE_KEY = 'masi_team_hub_v2';
  const API_BASE = '/api';

  // Default pre-seeded workers from database.json for static / cold-start visits
  const DEFAULT_WORKERS = [{"id":"w-1","name":"Alex Carter","key":"KEY-ALEX-9921","telegramId":"981245601","telegramUsername":"@alex_carter_ops","rate":15,"linkedAt":"2026-09-18T10:30:00.000Z","status":"active"},{"id":"w-2","name":"Maria Santos","key":"KEY-MARIA-8812","telegramId":"771239012","telegramUsername":"@maria_santos_track","rate":18,"linkedAt":"2026-09-18T11:45:00.000Z","status":"active"},{"id":"w-3","name":"David Kim","key":"KEY-DAVID-4409","telegramId":"651928304","telegramUsername":"@david_kim99","rate":15,"linkedAt":"2026-09-19T08:15:00.000Z","status":"active"},{"id":"w-4","name":"Samira Khan","key":"KEY-SAMIRA-7320","telegramId":null,"telegramUsername":null,"rate":20,"linkedAt":null,"status":"active"},{"id":"w-masi-1","name":"123","key":"WORKER-68ED-D46A-CDA5-13BF","telegramId":null,"telegramUsername":null,"rate":15,"completedOrders":0,"failCount":0,"successRate":0,"customSuccessRate":0,"d7Done":0,"d7Fail":0,"d7Rate":0,"todayDone":0,"online":false,"status":"active","source":"masi","linkedAt":null,"lastSyncedAt":"2026-09-19T21:53:52.952Z"},{"id":"w-masi-2","name":"Abhay","key":"WORKER-B658-8C55-77BB-6D13","telegramId":null,"telegramUsername":null,"rate":15,"completedOrders":0,"failCount":1,"successRate":0,"customSuccessRate":0,"d7Done":0,"d7Fail":0,"d7Rate":0,"todayDone":0,"online":false,"status":"active","source":"masi","linkedAt":null,"lastSyncedAt":"2026-09-19T21:53:52.954Z"},{"id":"w-masi-3","name":"Aditya01","key":"WORKER-018C-7DE1-F02E-0DCA","telegramId":null,"telegramUsername":null,"rate":15,"completedOrders":0,"failCount":1,"successRate":0,"customSuccessRate":0,"d7Done":0,"d7Fail":0,"d7Rate":0,"todayDone":0,"online":false,"status":"active","source":"masi","linkedAt":null,"lastSyncedAt":"2026-09-19T21:53:52.954Z"},{"id":"w-masi-4","name":"Adityasingh","key":"WORKER-A49B-FD25-122A-244D","telegramId":null,"telegramUsername":null,"rate":15,"completedOrders":1,"failCount":1,"successRate":50,"customSuccessRate":50,"d7Done":0,"d7Fail":0,"d7Rate":0,"todayDone":0,"online":false,"status":"active","source":"masi","linkedAt":null,"lastSyncedAt":"2026-09-19T21:53:52.954Z"},{"id":"w-masi-5","name":"Admirme","key":"WORKER-E7B4-B8F1-3690-E0FA","telegramId":null,"telegramUsername":null,"rate":15,"completedOrders":10,"failCount":15,"successRate":40,"customSuccessRate":40,"d7Done":0,"d7Fail":0,"d7Rate":0,"todayDone":0,"online":false,"status":"active","source":"masi","linkedAt":null,"lastSyncedAt":"2026-09-19T21:53:52.954Z"},{"id":"w-masi-6","name":"Advik","key":"WORKER-CC75-C8CC-75B4-A6C1","telegramId":null,"telegramUsername":null,"rate":15,"completedOrders":0,"failCount":0,"successRate":0,"customSuccessRate":0,"d7Done":0,"d7Fail":0,"d7Rate":0,"todayDone":0,"online":false,"status":"active","source":"masi","linkedAt":null,"lastSyncedAt":"2026-09-19T21:53:52.954Z"},{"id":"w-masi-7","name":"Ak","key":"WORKER-C92F-3FD9-6111-FC81","telegramId":null,"telegramUsername":null,"rate":15,"completedOrders":2,"failCount":4,"successRate":33.3,"customSuccessRate":33.3,"d7Done":0,"d7Fail":0,"d7Rate":0,"todayDone":0,"online":false,"status":"active","source":"masi","linkedAt":null,"lastSyncedAt":"2026-09-19T21:53:52.954Z"},{"id":"w-masi-8","name":"Alam00","key":"WORKER-0BE2-72E7-D72A-E15F","telegramId":null,"telegramUsername":"@alam_tg","rate":15,"completedOrders":26,"failCount":29,"successRate":47.3,"customSuccessRate":47.3,"d7Done":0,"d7Fail":0,"d7Rate":0,"todayDone":0,"online":false,"status":"active","source":"masi","linkedAt":null,"lastSyncedAt":"2026-09-19T21:53:52.954Z","personName":"Alam","updatedAt":"2026-09-19T22:01:54.911Z"},{"id":"w-masi-9","name":"Alam0000","key":"WORKER-EEA7-F4C4-1EF8-7BBC","telegramId":null,"telegramUsername":"@alam_tg","rate":15,"completedOrders":15,"failCount":17,"successRate":46.9,"customSuccessRate":46.9,"d7Done":0,"d7Fail":0,"d7Rate":0,"todayDone":0,"online":false,"status":"active","source":"masi","linkedAt":null,"lastSyncedAt":"2026-09-19T21:53:52.954Z","personName":"Alam","updatedAt":"2026-09-19T22:01:54.912Z"},{"id":"w-masi-10","name":"Aurkumar","key":"WORKER-6068-6ACF-3014-9778","telegramId":null,"telegramUsername":null,"rate":15,"completedOrders":0,"failCount":0,"successRate":0,"customSuccessRate":0,"d7Done":0,"d7Fail":0,"d7Rate":0,"todayDone":0,"online":false,"status":"active","source":"masi","linkedAt":null,"lastSyncedAt":"2026-09-19T21:53:52.954Z"},{"id":"w-masi-11","name":"Ayyywho","key":"WORKER-FBFC-15EB-BDC4-2F0C","telegramId":null,"telegramUsername":null,"rate":15,"completedOrders":0,"failCount":0,"successRate":0,"customSuccessRate":0,"d7Done":0,"d7Fail":0,"d7Rate":0,"todayDone":0,"online":false,"status":"active","source":"masi","linkedAt":null,"lastSyncedAt":"2026-09-19T21:53:52.954Z"},{"id":"w-masi-12","name":"Blaster","key":"WORKER-33D3-D5B1-2681-E1AA","telegramId":null,"telegramUsername":null,"rate":15,"completedOrders":0,"failCount":3,"successRate":0,"customSuccessRate":0,"d7Done":0,"d7Fail":0,"d7Rate":0,"todayDone":0,"online":false,"status":"active","source":"masi","linkedAt":null,"lastSyncedAt":"2026-09-19T21:53:52.954Z"},{"id":"w-masi-13","name":"Bybjt02","key":"WORKER-1C01-2A56-61F9-DEB8","telegramId":null,"telegramUsername":null,"rate":15,"completedOrders":0,"failCount":0,"successRate":0,"customSuccessRate":0,"d7Done":0,"d7Fail":0,"d7Rate":0,"todayDone":0,"online":false,"status":"active","source":"masi","linkedAt":null,"lastSyncedAt":"2026-09-19T21:53:52.954Z"},{"id":"w-masi-14","name":"Challenger","key":"WORKER-0E16-0968-196F-7A25","telegramId":null,"telegramUsername":null,"rate":15,"completedOrders":5,"failCount":8,"successRate":38.5,"customSuccessRate":38.5,"d7Done":0,"d7Fail":0,"d7Rate":0,"todayDone":0,"online":false,"status":"active","source":"masi","linkedAt":null,"lastSyncedAt":"2026-09-19T21:53:52.954Z"},{"id":"w-masi-15","name":"Chikudon","key":"WORKER-C32E-DB2B-9226-4B04","telegramId":null,"telegramUsername":null,"rate":15,"completedOrders":0,"failCount":2,"successRate":0,"customSuccessRate":0,"d7Done":0,"d7Fail":0,"d7Rate":0,"todayDone":0,"online":false,"status":"active","source":"masi","linkedAt":null,"lastSyncedAt":"2026-09-19T21:53:52.954Z"},{"id":"w-masi-16","name":"Cixiid","key":"WORKER-CCB2-8079-028A-FC37","telegramId":null,"telegramUsername":null,"rate":15,"completedOrders":0,"failCount":0,"successRate":0,"customSuccessRate":0,"d7Done":0,"d7Fail":0,"d7Rate":0,"todayDone":0,"online":false,"status":"active","source":"masi","linkedAt":null,"lastSyncedAt":"2026-09-19T21:53:52.954Z"},{"id":"w-masi-17","name":"Cloudwork","key":"WORKER-3BB0-C071-2ED9-7F1A","telegramId":null,"telegramUsername":null,"rate":15,"completedOrders":0,"failCount":5,"successRate":0,"customSuccessRate":0,"d7Done":0,"d7Fail":0,"d7Rate":0,"todayDone":0,"online":false,"status":"active","source":"masi","linkedAt":null,"lastSyncedAt":"2026-09-19T21:53:52.954Z"},{"id":"w-masi-18","name":"Cr7","key":"WORKER-CR7","telegramId":null,"telegramUsername":null,"rate":15,"completedOrders":4,"failCount":7,"successRate":36.4,"customSuccessRate":36.4,"d7Done":0,"d7Fail":0,"d7Rate":0,"todayDone":0,"online":false,"status":"active","source":"masi","linkedAt":null,"lastSyncedAt":"2026-09-19T21:53:52.954Z"},{"id":"w-masi-19","name":"Cr70","key":"WORKER-C9AF-C036-4D0E-03DE","telegramId":null,"telegramUsername":null,"rate":15,"completedOrders":2,"failCount":6,"successRate":25,"customSuccessRate":25,"d7Done":0,"d7Fail":0,"d7Rate":0,"todayDone":0,"online":false,"status":"active","source":"masi","linkedAt":null,"lastSyncedAt":"2026-09-19T21:53:52.954Z"},{"id":"w-masi-20","name":"D10","key":"WORKER-EB89-186B-D312-4CB7","telegramId":null,"telegramUsername":null,"rate":15,"completedOrders":0,"failCount":3,"successRate":0,"customSuccessRate":0,"d7Done":0,"d7Fail":0,"d7Rate":0,"todayDone":0,"online":false,"status":"active","source":"masi","linkedAt":null,"lastSyncedAt":"2026-09-19T21:53:52.954Z"},{"id":"w-masi-21","name":"Deepu","key":"WORKER-B96B-1CAA-0E18-3401","telegramId":null,"telegramUsername":null,"rate":15,"completedOrders":3,"failCount":1,"successRate":75,"customSuccessRate":75,"d7Done":0,"d7Fail":0,"d7Rate":0,"todayDone":0,"online":false,"status":"active","source":"masi","linkedAt":null,"lastSyncedAt":"2026-09-19T21:53:52.954Z"},{"id":"w-masi-22","name":"Dididi","key":"WORKER-118D-8094-DCC7-26D1","telegramId":null,"telegramUsername":null,"rate":15,"completedOrders":1,"failCount":4,"successRate":20,"customSuccessRate":20,"d7Done":0,"d7Fail":0,"d7Rate":0,"todayDone":0,"online":false,"status":"active","source":"masi","linkedAt":null,"lastSyncedAt":"2026-09-19T21:53:52.954Z"},{"id":"w-masi-23","name":"Didisi","key":"WORKER-4707-1239-E315-45EC","telegramId":null,"telegramUsername":null,"rate":15,"completedOrders":0,"failCount":0,"successRate":0,"customSuccessRate":0,"d7Done":0,"d7Fail":0,"d7Rate":0,"todayDone":0,"online":false,"status":"active","source":"masi","linkedAt":null,"lastSyncedAt":"2026-09-19T21:53:52.954Z"},{"id":"w-masi-24","name":"Disisisi","key":"WORKER-D713-6BEC-56C8-4C85","telegramId":null,"telegramUsername":null,"rate":15,"completedOrders":2,"failCount":0,"successRate":100,"customSuccessRate":100,"d7Done":0,"d7Fail":0,"d7Rate":0,"todayDone":0,"online":false,"status":"active","source":"masi","linkedAt":null,"lastSyncedAt":"2026-09-19T21:53:52.954Z"},{"id":"w-masi-25","name":"Dj02","key":"WORKER-F6D6-FB9D-221C-0EF9","telegramId":null,"telegramUsername":null,"rate":15,"completedOrders":0,"failCount":0,"successRate":0,"customSuccessRate":0,"d7Done":0,"d7Fail":0,"d7Rate":0,"todayDone":0,"online":false,"status":"active","source":"masi","linkedAt":null,"lastSyncedAt":"2026-09-19T21:53:52.954Z"},{"id":"w-masi-26","name":"Dj03","key":"WORKER-878A-C6EB-0BD9-08C1","telegramId":null,"telegramUsername":null,"rate":15,"completedOrders":0,"failCount":0,"successRate":0,"customSuccessRate":0,"d7Done":0,"d7Fail":0,"d7Rate":0,"todayDone":0,"online":false,"status":"active","source":"masi","linkedAt":null,"lastSyncedAt":"2026-09-19T21:53:52.954Z"},{"id":"w-masi-27","name":"Dj04","key":"WORKER-3FAE-1D26-F94D-F775","telegramId":null,"telegramUsername":null,"rate":15,"completedOrders":3,"failCount":10,"successRate":23.1,"customSuccessRate":23.1,"d7Done":0,"d7Fail":0,"d7Rate":0,"todayDone":0,"online":false,"status":"paused","source":"masi","linkedAt":null,"lastSyncedAt":"2026-09-19T21:53:52.954Z"},{"id":"w-masi-28","name":"Djalok","key":"WORKER-6366-4DB5-BF4A-AB8A","telegramId":null,"telegramUsername":null,"rate":15,"completedOrders":0,"failCount":0,"successRate":0,"customSuccessRate":0,"d7Done":0,"d7Fail":0,"d7Rate":0,"todayDone":0,"online":false,"status":"active","source":"masi","linkedAt":null,"lastSyncedAt":"2026-09-19T21:53:52.954Z"},{"id":"w-masi-29","name":"Djdjdjd","key":"WORKER-EF4D-642C-387E-D727","telegramId":null,"telegramUsername":null,"rate":15,"completedOrders":0,"failCount":0,"successRate":0,"customSuccessRate":0,"d7Done":0,"d7Fail":0,"d7Rate":0,"todayDone":0,"online":false,"status":"active","source":"masi","linkedAt":null,"lastSyncedAt":"2026-09-19T21:53:52.954Z"},{"id":"w-masi-30","name":"Dns","key":"WORKER-E7F5-94AB-4FC4-A2E2","telegramId":null,"telegramUsername":null,"rate":15,"completedOrders":0,"failCount":0,"successRate":0,"customSuccessRate":0,"d7Done":0,"d7Fail":0,"d7Rate":0,"todayDone":0,"online":false,"status":"active","source":"masi","linkedAt":null,"lastSyncedAt":"2026-09-19T21:53:52.954Z"},{"id":"w-masi-31","name":"Dot¥","key":"WORKER-5307-1906-F177-ABFD","telegramId":null,"telegramUsername":null,"rate":15,"completedOrders":9,"failCount":7,"successRate":56.2,"customSuccessRate":56.2,"d7Done":0,"d7Fail":0,"d7Rate":0,"todayDone":0,"online":false,"status":"active","source":"masi","linkedAt":null,"lastSyncedAt":"2026-09-19T21:53:52.954Z"},{"id":"w-masi-32","name":"Dudeinsane02","key":"WORKER-59C1-8C19-1F3E-B6F1","telegramId":null,"telegramUsername":null,"rate":15,"completedOrders":7,"failCount":3,"successRate":70,"customSuccessRate":70,"d7Done":0,"d7Fail":0,"d7Rate":0,"todayDone":0,"online":false,"status":"active","source":"masi","linkedAt":null,"lastSyncedAt":"2026-09-19T21:53:52.954Z"},{"id":"w-masi-33","name":"Dududu","key":"WORKER-3747-6321-8CE8-C541","telegramId":null,"telegramUsername":null,"rate":15,"completedOrders":0,"failCount":0,"successRate":0,"customSuccessRate":0,"d7Done":0,"d7Fail":0,"d7Rate":0,"todayDone":0,"online":false,"status":"active","source":"masi","linkedAt":null,"lastSyncedAt":"2026-09-19T21:53:52.954Z"},{"id":"w-masi-34","name":"Earner01","key":"WORKER-4A32-67A8-60EC-91DA","telegramId":null,"telegramUsername":null,"rate":15,"completedOrders":1,"failCount":3,"successRate":25,"customSuccessRate":25,"d7Done":0,"d7Fail":0,"d7Rate":0,"todayDone":0,"online":false,"status":"active","source":"masi","linkedAt":null,"lastSyncedAt":"2026-09-19T21:53:52.954Z"},{"id":"w-masi-35","name":"Earner02","key":"WORKER-402C-7287-99F9-9B03","telegramId":null,"telegramUsername":null,"rate":15,"completedOrders":0,"failCount":3,"successRate":0,"customSuccessRate":0,"d7Done":0,"d7Fail":0,"d7Rate":0,"todayDone":0,"online":false,"status":"active","source":"masi","linkedAt":null,"lastSyncedAt":"2026-09-19T21:53:52.954Z"},{"id":"w-masi-36","name":"Earner03","key":"WORKER-56E9-7CB1-60C2-7D23","telegramId":null,"telegramUsername":null,"rate":15,"completedOrders":0,"failCount":4,"successRate":0,"customSuccessRate":0,"d7Done":0,"d7Fail":0,"d7Rate":0,"todayDone":0,"online":false,"status":"active","source":"masi","linkedAt":null,"lastSyncedAt":"2026-09-19T21:53:52.954Z"},{"id":"w-masi-37","name":"Euuxuc","key":"WORKER-B4EE-C6F7-95D1-87A6","telegramId":null,"telegramUsername":null,"rate":15,"completedOrders":2,"failCount":8,"successRate":20,"customSuccessRate":20,"d7Done":0,"d7Fail":0,"d7Rate":0,"todayDone":0,"online":false,"status":"active","source":"masi","linkedAt":null,"lastSyncedAt":"2026-09-19T21:53:52.954Z"},{"id":"w-masi-38","name":"Feeroz","key":"WORKER-7134-44D4-B1CA-9737","telegramId":null,"telegramUsername":null,"rate":15,"completedOrders":1,"failCount":3,"successRate":25,"customSuccessRate":25,"d7Done":0,"d7Fail":0,"d7Rate":0,"todayDone":0,"online":false,"status":"active","source":"masi","linkedAt":null,"lastSyncedAt":"2026-09-19T21:53:52.954Z"},{"id":"w-masi-39","name":"Gapplayz","key":"WORKER-4543-C819-5692-1BB1","telegramId":null,"telegramUsername":null,"rate":15,"completedOrders":0,"failCount":0,"successRate":0,"customSuccessRate":0,"d7Done":0,"d7Fail":0,"d7Rate":0,"todayDone":0,"online":false,"status":"active","source":"masi","linkedAt":null,"lastSyncedAt":"2026-09-19T21:53:52.954Z"},{"id":"w-masi-40","name":"Gfff","key":"WORKER-E1B6-0B2A-6D2A-7533","telegramId":null,"telegramUsername":null,"rate":15,"completedOrders":0,"failCount":5,"successRate":0,"customSuccessRate":0,"d7Done":0,"d7Fail":0,"d7Rate":0,"todayDone":0,"online":false,"status":"active","source":"masi","linkedAt":null,"lastSyncedAt":"2026-09-19T21:53:52.954Z"},{"id":"w-masi-41","name":"Gmailworker","key":"WORKER-B0B4-D1C3-12CA-9A38","telegramId":null,"telegramUsername":null,"rate":15,"completedOrders":0,"failCount":0,"successRate":0,"customSuccessRate":0,"d7Done":0,"d7Fail":0,"d7Rate":0,"todayDone":0,"online":false,"status":"active","source":"masi","linkedAt":null,"lastSyncedAt":"2026-09-19T21:53:52.954Z"},{"id":"w-masi-42","name":"Godmode","key":"WORKER-8739-EBA5-8249-E4E6","telegramId":null,"telegramUsername":null,"rate":15,"completedOrders":6,"failCount":3,"successRate":66.7,"customSuccessRate":66.7,"d7Done":0,"d7Fail":0,"d7Rate":0,"todayDone":0,"online":false,"status":"active","source":"masi","linkedAt":null,"lastSyncedAt":"2026-09-19T21:53:52.954Z"},{"id":"w-masi-43","name":"Gudu","key":"WORKER-C7FC-4778-5612-D883","telegramId":null,"telegramUsername":null,"rate":15,"completedOrders":0,"failCount":0,"successRate":0,"customSuccessRate":0,"d7Done":0,"d7Fail":0,"d7Rate":0,"todayDone":0,"online":false,"status":"active","source":"masi","linkedAt":null,"lastSyncedAt":"2026-09-19T21:53:52.954Z"},{"id":"w-masi-44","name":"Gulam","key":"WORKER-557F-401D-E2F1-D890","telegramId":null,"telegramUsername":null,"rate":15,"completedOrders":0,"failCount":0,"successRate":0,"customSuccessRate":0,"d7Done":0,"d7Fail":0,"d7Rate":0,"todayDone":0,"online":false,"status":"active","source":"masi","linkedAt":null,"lastSyncedAt":"2026-09-19T21:53:52.954Z"},{"id":"w-masi-45","name":"Harshsharma","key":"WORKER-HARSHSHARMA","telegramId":null,"telegramUsername":null,"rate":15,"completedOrders":0,"failCount":2,"successRate":0,"customSuccessRate":0,"d7Done":0,"d7Fail":0,"d7Rate":0,"todayDone":0,"online":false,"status":"active","source":"masi","linkedAt":null,"lastSyncedAt":"2026-09-19T21:53:52.954Z"},{"id":"w-masi-46","name":"Hashir","key":"WORKER-A67D-1498-7200-CC8C","telegramId":null,"telegramUsername":null,"rate":15,"completedOrders":15,"failCount":3,"successRate":83.3,"customSuccessRate":83.3,"d7Done":0,"d7Fail":0,"d7Rate":0,"todayDone":0,"online":false,"status":"active","source":"masi","linkedAt":null,"lastSyncedAt":"2026-09-19T21:53:52.954Z"},{"id":"w-masi-47","name":"Hello","key":"WORKER-8DCB-B8EE-4467-79DA","telegramId":null,"telegramUsername":null,"rate":15,"completedOrders":6,"failCount":4,"successRate":60,"customSuccessRate":0,"d7Done":0,"d7Fail":0,"d7Rate":0,"todayDone":0,"online":false,"status":"active","source":"masi","linkedAt":null,"lastSyncedAt":"2026-09-19T21:53:52.954Z"},{"id":"w-masi-49","name":"Helloji","key":"WORKER-8544-5326-335F-F3B9","telegramId":null,"telegramUsername":null,"rate":15,"completedOrders":0,"failCount":1,"successRate":0,"customSuccessRate":0,"d7Done":0,"d7Fail":0,"d7Rate":0,"todayDone":0,"online":false,"status":"active","source":"masi","linkedAt":null,"lastSyncedAt":"2026-09-19T21:53:52.954Z"},{"id":"w-masi-50","name":"Heyiuu","key":"WORKER-B942-D8C6-4F64-0F31","telegramId":null,"telegramUsername":null,"rate":15,"completedOrders":6,"failCount":2,"successRate":75,"customSuccessRate":75,"d7Done":0,"d7Fail":0,"d7Rate":0,"todayDone":0,"online":false,"status":"active","source":"masi","linkedAt":null,"lastSyncedAt":"2026-09-19T21:53:52.954Z"},{"id":"w-masi-51","name":"Heysirjienglish","key":"WORKER-977C-5BBE-D7E2-A855","telegramId":null,"telegramUsername":null,"rate":15,"completedOrders":13,"failCount":1,"successRate":92.9,"customSuccessRate":92.9,"d7Done":0,"d7Fail":0,"d7Rate":0,"todayDone":0,"online":false,"status":"active","source":"masi","linkedAt":null,"lastSyncedAt":"2026-09-19T21:53:52.954Z"},{"id":"w-masi-52","name":"Heyy","key":"WORKER-B34D-1928-4194-B342","telegramId":null,"telegramUsername":null,"rate":15,"completedOrders":0,"failCount":2,"successRate":0,"customSuccessRate":0,"d7Done":0,"d7Fail":0,"d7Rate":0,"todayDone":0,"online":false,"status":"active","source":"masi","linkedAt":null,"lastSyncedAt":"2026-09-19T21:53:52.954Z"},{"id":"w-masi-53","name":"Hyper","key":"WORKER-90F3-BECB-0B7D-9D81","telegramId":null,"telegramUsername":null,"rate":15,"completedOrders":8,"failCount":3,"successRate":72.7,"customSuccessRate":72.7,"d7Done":0,"d7Fail":0,"d7Rate":0,"todayDone":0,"online":false,"status":"active","source":"masi","linkedAt":null,"lastSyncedAt":"2026-09-19T21:53:52.954Z"},{"id":"w-masi-54","name":"HyperX","key":"WORKER-F4CC-5C42-85A9-617F","telegramId":null,"telegramUsername":null,"rate":15,"completedOrders":1,"failCount":1,"successRate":50,"customSuccessRate":50,"d7Done":0,"d7Fail":0,"d7Rate":0,"todayDone":0,"online":false,"status":"active","source":"masi","linkedAt":null,"lastSyncedAt":"2026-09-19T21:53:52.954Z"},{"id":"w-masi-55","name":"Iminsane01","key":"WORKER-747C-1233-B308-9CDE","telegramId":null,"telegramUsername":null,"rate":15,"completedOrders":1,"failCount":5,"successRate":16.7,"customSuccessRate":16.7,"d7Done":0,"d7Fail":0,"d7Rate":0,"todayDone":0,"online":false,"status":"active","source":"masi","linkedAt":null,"lastSyncedAt":"2026-09-19T21:53:52.954Z"},{"id":"w-masi-56","name":"Ishan","key":"WORKER-DF15-B033-78B0-95CE","telegramId":null,"telegramUsername":null,"rate":15,"completedOrders":0,"failCount":1,"successRate":0,"customSuccessRate":0,"d7Done":0,"d7Fail":0,"d7Rate":0,"todayDone":0,"online":false,"status":"active","source":"masi","linkedAt":null,"lastSyncedAt":"2026-09-19T21:53:52.954Z"},{"id":"w-masi-57","name":"Jaat","key":"WORKER-79CC-8050-218F-0467","telegramId":null,"telegramUsername":null,"rate":15,"completedOrders":1,"failCount":3,"successRate":25,"customSuccessRate":25,"d7Done":0,"d7Fail":0,"d7Rate":0,"todayDone":0,"online":false,"status":"active","source":"masi","linkedAt":null,"lastSyncedAt":"2026-09-19T21:53:52.954Z"},{"id":"w-masi-58","name":"Jaatuuu","key":"WORKER-B5BE-4F06-074D-7BC0","telegramId":null,"telegramUsername":null,"rate":15,"completedOrders":1,"failCount":1,"successRate":50,"customSuccessRate":50,"d7Done":0,"d7Fail":0,"d7Rate":0,"todayDone":0,"online":false,"status":"active","source":"masi","linkedAt":null,"lastSyncedAt":"2026-09-19T21:53:52.954Z"},{"id":"w-masi-59","name":"Jaganji","key":"WORKER-B259-F48A-EA7D-0B41","telegramId":null,"telegramUsername":null,"rate":15,"completedOrders":0,"failCount":2,"successRate":0,"customSuccessRate":0,"d7Done":0,"d7Fail":0,"d7Rate":0,"todayDone":0,"online":false,"status":"active","source":"masi","linkedAt":null,"lastSyncedAt":"2026-09-19T21:53:52.955Z"},{"id":"w-masi-60","name":"Jeeban","key":"WORKER-1C88-3F98-FFC2-23DD","telegramId":null,"telegramUsername":null,"rate":15,"completedOrders":7,"failCount":11,"successRate":38.9,"customSuccessRate":38.9,"d7Done":0,"d7Fail":0,"d7Rate":0,"todayDone":0,"online":false,"status":"active","source":"masi","linkedAt":null,"lastSyncedAt":"2026-09-19T21:53:52.955Z"},{"id":"w-masi-61","name":"Kanha","key":"WORKER-93EA-EDA3-402A-7BB8","telegramId":null,"telegramUsername":null,"rate":15,"completedOrders":4,"failCount":2,"successRate":66.7,"customSuccessRate":66.7,"d7Done":0,"d7Fail":0,"d7Rate":0,"todayDone":0,"online":false,"status":"active","source":"masi","linkedAt":null,"lastSyncedAt":"2026-09-19T21:53:52.955Z"},{"id":"w-masi-62","name":"Lejand","key":"WORKER-2112-FE95-3A67-4FC2","telegramId":null,"telegramUsername":null,"rate":15,"completedOrders":0,"failCount":0,"successRate":0,"customSuccessRate":0,"d7Done":0,"d7Fail":0,"d7Rate":0,"todayDone":0,"online":false,"status":"active","source":"masi","linkedAt":null,"lastSyncedAt":"2026-09-19T21:53:52.955Z"},{"id":"w-masi-63","name":"Loajcjc","key":"WORKER-1056-C400-A79B-F7B6","telegramId":null,"telegramUsername":null,"rate":15,"completedOrders":0,"failCount":0,"successRate":0,"customSuccessRate":0,"d7Done":0,"d7Fail":0,"d7Rate":0,"todayDone":0,"online":false,"status":"active","source":"masi","linkedAt":null,"lastSyncedAt":"2026-09-19T21:53:52.955Z"},{"id":"w-masi-64","name":"Lobb","key":"WORKER-9695-2019-70EB-F4A2","telegramId":null,"telegramUsername":null,"rate":15,"completedOrders":0,"failCount":0,"successRate":0,"customSuccessRate":0,"d7Done":0,"d7Fail":0,"d7Rate":0,"todayDone":0,"online":false,"status":"active","source":"masi","linkedAt":null,"lastSyncedAt":"2026-09-19T21:53:52.955Z"},{"id":"w-masi-65","name":"Lodi","key":"WORKER-EB2E-DF5D-1674-6B52","telegramId":null,"telegramUsername":null,"rate":15,"completedOrders":1,"failCount":0,"successRate":100,"customSuccessRate":100,"d7Done":0,"d7Fail":0,"d7Rate":0,"todayDone":0,"online":false,"status":"active","source":"masi","linkedAt":null,"lastSyncedAt":"2026-09-19T21:53:52.955Z"},{"id":"w-masi-66","name":"Lodka","key":"WORKER-B6BA-FD40-2DD5-889C","telegramId":null,"telegramUsername":null,"rate":15,"completedOrders":0,"failCount":1,"successRate":0,"customSuccessRate":0,"d7Done":0,"d7Fail":0,"d7Rate":0,"todayDone":0,"online":false,"status":"active","source":"masi","linkedAt":null,"lastSyncedAt":"2026-09-19T21:53:52.955Z"},{"id":"w-masi-67","name":"Lokda","key":"WORKER-EFA5-4BDF-123F-05C1","telegramId":null,"telegramUsername":null,"rate":15,"completedOrders":0,"failCount":0,"successRate":0,"customSuccessRate":0,"d7Done":0,"d7Fail":0,"d7Rate":0,"todayDone":0,"online":false,"status":"active","source":"masi","linkedAt":null,"lastSyncedAt":"2026-09-19T21:53:52.955Z"},{"id":"w-masi-68","name":"Lokesh","key":"WORKER-ABC7-A12B-7A80-E0C4","telegramId":null,"telegramUsername":null,"rate":15,"completedOrders":0,"failCount":2,"successRate":0,"customSuccessRate":0,"d7Done":0,"d7Fail":0,"d7Rate":0,"todayDone":0,"online":false,"status":"active","source":"masi","linkedAt":null,"lastSyncedAt":"2026-09-19T21:53:52.955Z"},{"id":"w-masi-69","name":"Lokesh01","key":"WORKER-3E41-5164-B37D-3F3B","telegramId":null,"telegramUsername":null,"rate":15,"completedOrders":0,"failCount":0,"successRate":0,"customSuccessRate":0,"d7Done":0,"d7Fail":0,"d7Rate":0,"todayDone":0,"online":false,"status":"paused","source":"masi","linkedAt":null,"lastSyncedAt":"2026-09-19T21:53:52.955Z"},{"id":"w-masi-70","name":"Lokesh02","key":"WORKER-17D4-5EE3-8AB7-443F","telegramId":null,"telegramUsername":null,"rate":15,"completedOrders":1,"failCount":4,"successRate":20,"customSuccessRate":20,"d7Done":0,"d7Fail":0,"d7Rate":0,"todayDone":0,"online":false,"status":"active","source":"masi","linkedAt":null,"lastSyncedAt":"2026-09-19T21:53:52.955Z"},{"id":"w-masi-71","name":"Lokesh04","key":"WORKER-63A5-6858-743E-0EA3","telegramId":null,"telegramUsername":null,"rate":15,"completedOrders":0,"failCount":0,"successRate":0,"customSuccessRate":0,"d7Done":0,"d7Fail":0,"d7Rate":0,"todayDone":0,"online":false,"status":"active","source":"masi","linkedAt":null,"lastSyncedAt":"2026-09-19T21:53:52.955Z"},{"id":"w-masi-72","name":"Loki","key":"WORKER-1956-E7B7-7220-B03F","telegramId":null,"telegramUsername":null,"rate":15,"completedOrders":1,"failCount":4,"successRate":20,"customSuccessRate":20,"d7Done":0,"d7Fail":0,"d7Rate":0,"todayDone":0,"online":false,"status":"active","source":"masi","linkedAt":null,"lastSyncedAt":"2026-09-19T21:53:52.955Z"},{"id":"w-masi-73","name":"Loksjx","key":"WORKER-339D-6A6C-BA52-CC3A","telegramId":null,"telegramUsername":null,"rate":15,"completedOrders":0,"failCount":0,"successRate":0,"customSuccessRate":0,"d7Done":0,"d7Fail":0,"d7Rate":0,"todayDone":0,"online":false,"status":"active","source":"masi","linkedAt":null,"lastSyncedAt":"2026-09-19T21:53:52.955Z"},{"id":"w-masi-74","name":"Lowkey","key":"WORKER-79CB-C0AF-22A2-2BBD","telegramId":null,"telegramUsername":null,"rate":15,"completedOrders":4,"failCount":4,"successRate":50,"customSuccessRate":50,"d7Done":0,"d7Fail":0,"d7Rate":0,"todayDone":0,"online":false,"status":"active","source":"masi","linkedAt":null,"lastSyncedAt":"2026-09-19T21:53:52.955Z"},{"id":"w-masi-75","name":"Mahakal","key":"WORKER-4162-445F-29A4-5059","telegramId":null,"telegramUsername":null,"rate":15,"completedOrders":5,"failCount":12,"successRate":29.4,"customSuccessRate":29.4,"d7Done":0,"d7Fail":0,"d7Rate":0,"todayDone":0,"online":false,"status":"active","source":"masi","linkedAt":null,"lastSyncedAt":"2026-09-19T21:53:52.955Z"},{"id":"w-masi-76","name":"Mahakal02","key":"WORKER-56A9-D784-C065-A300","telegramId":null,"telegramUsername":null,"rate":15,"completedOrders":1,"failCount":4,"successRate":20,"customSuccessRate":20,"d7Done":0,"d7Fail":0,"d7Rate":0,"todayDone":0,"online":false,"status":"active","source":"masi","linkedAt":null,"lastSyncedAt":"2026-09-19T21:53:52.955Z"},{"id":"w-masi-77","name":"Majid","key":"WORKER-BC2F-E0A0-6295-651D","telegramId":null,"telegramUsername":null,"rate":15,"completedOrders":18,"failCount":14,"successRate":56.2,"customSuccessRate":56.2,"d7Done":0,"d7Fail":0,"d7Rate":0,"todayDone":0,"online":false,"status":"active","source":"masi","linkedAt":null,"lastSyncedAt":"2026-09-19T21:53:52.955Z"},{"id":"w-masi-78","name":"Mayank","key":"WORKER-7D72-484C-D0D4-3A24","telegramId":null,"telegramUsername":null,"rate":15,"completedOrders":3,"failCount":3,"successRate":50,"customSuccessRate":50,"d7Done":0,"d7Fail":0,"d7Rate":0,"todayDone":0,"online":false,"status":"active","source":"masi","linkedAt":null,"lastSyncedAt":"2026-09-19T21:53:52.955Z"},{"id":"w-masi-79","name":"Messi","key":"WORKER-32E9-EB8B-84A9-FEB8","telegramId":null,"telegramUsername":null,"rate":15,"completedOrders":4,"failCount":6,"successRate":40,"customSuccessRate":40,"d7Done":0,"d7Fail":0,"d7Rate":0,"todayDone":0,"online":false,"status":"active","source":"masi","linkedAt":null,"lastSyncedAt":"2026-09-19T21:53:52.955Z"},{"id":"w-masi-80","name":"Mohit000","key":"WORKER-EEE7-2516-87CF-F8CD","telegramId":null,"telegramUsername":null,"rate":15,"completedOrders":0,"failCount":0,"successRate":0,"customSuccessRate":0,"d7Done":0,"d7Fail":0,"d7Rate":0,"todayDone":0,"online":false,"status":"active","source":"masi","linkedAt":null,"lastSyncedAt":"2026-09-19T21:53:52.955Z"},{"id":"w-masi-81","name":"Mohit01","key":"WORKER-MOHIT01","telegramId":null,"telegramUsername":null,"rate":15,"completedOrders":10,"failCount":13,"successRate":43.5,"customSuccessRate":43.5,"d7Done":0,"d7Fail":0,"d7Rate":0,"todayDone":0,"online":false,"status":"active","source":"masi","linkedAt":null,"lastSyncedAt":"2026-09-19T21:53:52.955Z"},{"id":"w-masi-82","name":"Namiluffy","key":"WORKER-NAMILUFFY","telegramId":null,"telegramUsername":null,"rate":15,"completedOrders":1,"failCount":3,"successRate":25,"customSuccessRate":25,"d7Done":0,"d7Fail":0,"d7Rate":0,"todayDone":0,"online":false,"status":"active","source":"masi","linkedAt":null,"lastSyncedAt":"2026-09-19T21:53:52.955Z"},{"id":"w-masi-83","name":"Namizoro","key":"WORKER-E311-0D37-0047-3F77","telegramId":null,"telegramUsername":null,"rate":15,"completedOrders":25,"failCount":11,"successRate":69.4,"customSuccessRate":69.4,"d7Done":0,"d7Fail":0,"d7Rate":0,"todayDone":0,"online":false,"status":"active","source":"masi","linkedAt":null,"lastSyncedAt":"2026-09-19T21:53:52.955Z"},{"id":"w-masi-84","name":"Nitin","key":"WORKER-2D3D-E8D5-B6A1-5CD1","telegramId":null,"telegramUsername":null,"rate":15,"completedOrders":6,"failCount":10,"successRate":37.5,"customSuccessRate":37.5,"d7Done":0,"d7Fail":0,"d7Rate":0,"todayDone":0,"online":false,"status":"active","source":"masi","linkedAt":null,"lastSyncedAt":"2026-09-19T21:53:52.956Z"},{"id":"w-masi-85","name":"Nitin01","key":"WORKER-B1CC-5EEB-E61C-EE44","telegramId":null,"telegramUsername":null,"rate":15,"completedOrders":2,"failCount":4,"successRate":33.3,"customSuccessRate":33.3,"d7Done":0,"d7Fail":0,"d7Rate":0,"todayDone":0,"online":false,"status":"active","source":"masi","linkedAt":null,"lastSyncedAt":"2026-09-19T21:53:52.956Z"},{"id":"w-masi-86","name":"Nitin02","key":"WORKER-09A5-B7B8-5F62-4B64","telegramId":null,"telegramUsername":null,"rate":15,"completedOrders":0,"failCount":1,"successRate":0,"customSuccessRate":0,"d7Done":0,"d7Fail":0,"d7Rate":0,"todayDone":0,"online":false,"status":"active","source":"masi","linkedAt":null,"lastSyncedAt":"2026-09-19T21:53:52.956Z"},{"id":"w-masi-87","name":"Okay01","key":"WORKER-04EC-C599-904B-1851","telegramId":null,"telegramUsername":null,"rate":15,"completedOrders":0,"failCount":3,"successRate":0,"customSuccessRate":0,"d7Done":0,"d7Fail":0,"d7Rate":0,"todayDone":0,"online":false,"status":"active","source":"masi","linkedAt":null,"lastSyncedAt":"2026-09-19T21:53:52.957Z"},{"id":"w-masi-88","name":"Ordinary","key":"WORKER-E543-3978-C68F-C64B","telegramId":null,"telegramUsername":null,"rate":15,"completedOrders":0,"failCount":0,"successRate":0,"customSuccessRate":0,"d7Done":0,"d7Fail":0,"d7Rate":0,"todayDone":0,"online":false,"status":"active","source":"masi","linkedAt":null,"lastSyncedAt":"2026-09-19T21:53:52.957Z"},{"id":"w-masi-89","name":"Paras","key":"WORKER-BDF1-12D2-2F99-1ED8","telegramId":null,"telegramUsername":null,"rate":15,"completedOrders":5,"failCount":5,"successRate":50,"customSuccessRate":0,"d7Done":0,"d7Fail":0,"d7Rate":0,"todayDone":0,"online":false,"status":"active","source":"masi","linkedAt":null,"lastSyncedAt":"2026-09-19T21:53:52.957Z"},{"id":"w-masi-91","name":"Paras01","key":"WORKER-FDB1-5ADE-7980-260F","telegramId":null,"telegramUsername":null,"rate":15,"completedOrders":0,"failCount":0,"successRate":0,"customSuccessRate":0,"d7Done":0,"d7Fail":0,"d7Rate":0,"todayDone":0,"online":false,"status":"active","source":"masi","linkedAt":null,"lastSyncedAt":"2026-09-19T21:53:52.957Z"},{"id":"w-masi-92","name":"Paras90","key":"WORKER-61C5-7B83-C6AE-C1C5","telegramId":null,"telegramUsername":null,"rate":15,"completedOrders":0,"failCount":0,"successRate":0,"customSuccessRate":0,"d7Done":0,"d7Fail":0,"d7Rate":0,"todayDone":0,"online":false,"status":"active","source":"masi","linkedAt":null,"lastSyncedAt":"2026-09-19T21:53:52.957Z"},{"id":"w-masi-93","name":"Rahul","key":"WORKER-0F69-C078-3090-47DD","telegramId":null,"telegramUsername":null,"rate":15,"completedOrders":4,"failCount":3,"successRate":57.1,"customSuccessRate":57.1,"d7Done":0,"d7Fail":0,"d7Rate":0,"todayDone":0,"online":false,"status":"active","source":"masi","linkedAt":null,"lastSyncedAt":"2026-09-19T21:53:52.957Z"},{"id":"w-masi-94","name":"Rajxk","key":"WORKER-4E6A-803A-7C90-443F","telegramId":null,"telegramUsername":null,"rate":15,"completedOrders":0,"failCount":0,"successRate":0,"customSuccessRate":0,"d7Done":0,"d7Fail":0,"d7Rate":0,"todayDone":0,"online":false,"status":"active","source":"masi","linkedAt":null,"lastSyncedAt":"2026-09-19T21:53:52.957Z"},{"id":"w-masi-95","name":"Rijukhan","key":"WORKER-3386-E865-8BBD-19FB","telegramId":null,"telegramUsername":null,"rate":15,"completedOrders":0,"failCount":0,"successRate":0,"customSuccessRate":0,"d7Done":0,"d7Fail":0,"d7Rate":0,"todayDone":0,"online":false,"status":"active","source":"masi","linkedAt":null,"lastSyncedAt":"2026-09-19T21:53:52.957Z"},{"id":"w-masi-96","name":"Rizo","key":"WORKER-8CEB-0D2D-F05E-3EF8","telegramId":null,"telegramUsername":null,"rate":15,"completedOrders":0,"failCount":2,"successRate":0,"customSuccessRate":0,"d7Done":0,"d7Fail":0,"d7Rate":0,"todayDone":0,"online":false,"status":"active","source":"masi","linkedAt":null,"lastSyncedAt":"2026-09-19T21:53:52.957Z"},{"id":"w-masi-97","name":"Rohitshrma","key":"WORKER-E93D-1B0D-B982-1F58","telegramId":null,"telegramUsername":null,"rate":15,"completedOrders":0,"failCount":0,"successRate":0,"customSuccessRate":0,"d7Done":0,"d7Fail":0,"d7Rate":0,"todayDone":0,"online":false,"status":"active","source":"masi","linkedAt":null,"lastSyncedAt":"2026-09-19T21:53:52.957Z"},{"id":"w-masi-98","name":"Ruinsane","key":"WORKER-6978-8488-CEA2-5797","telegramId":null,"telegramUsername":null,"rate":15,"completedOrders":14,"failCount":9,"successRate":60.9,"customSuccessRate":60.9,"d7Done":0,"d7Fail":0,"d7Rate":0,"todayDone":0,"online":false,"status":"active","source":"masi","linkedAt":null,"lastSyncedAt":"2026-09-19T21:53:52.957Z"},{"id":"w-masi-99","name":"Rxnhood","key":"WORKER-0A9B-FDDC-5FE5-7076","telegramId":null,"telegramUsername":null,"rate":15,"completedOrders":13,"failCount":23,"successRate":36.1,"customSuccessRate":36.1,"d7Done":0,"d7Fail":0,"d7Rate":0,"todayDone":0,"online":false,"status":"active","source":"masi","linkedAt":null,"lastSyncedAt":"2026-09-19T21:53:52.958Z"},{"id":"w-masi-100","name":"Rxxnhood","key":"WORKER-RXXNHOOD","telegramId":null,"telegramUsername":null,"rate":15,"completedOrders":0,"failCount":3,"successRate":0,"customSuccessRate":0,"d7Done":0,"d7Fail":0,"d7Rate":0,"todayDone":0,"online":false,"status":"active","source":"masi","linkedAt":null,"lastSyncedAt":"2026-09-19T21:53:52.958Z"},{"id":"w-masi-101","name":"Sandy01","key":"WORKER-FCF0-0948-A9C9-DE43","telegramId":null,"telegramUsername":null,"rate":15,"completedOrders":0,"failCount":13,"successRate":0,"customSuccessRate":0,"d7Done":0,"d7Fail":0,"d7Rate":0,"todayDone":0,"online":false,"status":"paused","source":"masi","linkedAt":null,"lastSyncedAt":"2026-09-19T21:53:52.958Z"},{"id":"w-masi-102","name":"Scem","key":"WORKER-1DF3-63BE-3F95-436B","telegramId":null,"telegramUsername":null,"rate":15,"completedOrders":8,"failCount":10,"successRate":44.4,"customSuccessRate":44.4,"d7Done":0,"d7Fail":0,"d7Rate":0,"todayDone":0,"online":false,"status":"active","source":"masi","linkedAt":null,"lastSyncedAt":"2026-09-19T21:53:52.958Z"},{"id":"w-masi-103","name":"Shaurya","key":"WORKER-98D0-D03A-8138-F09A","telegramId":null,"telegramUsername":null,"rate":15,"completedOrders":0,"failCount":0,"successRate":0,"customSuccessRate":0,"d7Done":0,"d7Fail":0,"d7Rate":0,"todayDone":0,"online":false,"status":"active","source":"masi","linkedAt":null,"lastSyncedAt":"2026-09-19T21:53:52.958Z"},{"id":"w-masi-104","name":"Shubhi","key":"WORKER-D81D-CFD7-2A1A-F15C","telegramId":null,"telegramUsername":null,"rate":15,"completedOrders":14,"failCount":14,"successRate":50,"customSuccessRate":50,"d7Done":0,"d7Fail":0,"d7Rate":0,"todayDone":0,"online":false,"status":"active","source":"masi","linkedAt":null,"lastSyncedAt":"2026-09-19T21:53:52.958Z"},{"id":"w-masi-105","name":"Shubka","key":"WORKER-EC22-186C-0AF4-31F3","telegramId":null,"telegramUsername":null,"rate":15,"completedOrders":5,"failCount":4,"successRate":55.6,"customSuccessRate":55.6,"d7Done":0,"d7Fail":0,"d7Rate":0,"todayDone":0,"online":false,"status":"active","source":"masi","linkedAt":null,"lastSyncedAt":"2026-09-19T21:53:52.958Z"},{"id":"w-masi-106","name":"Shubraj","key":"WORKER-E0C0-014A-1AE0-08C0","telegramId":null,"telegramUsername":null,"rate":15,"completedOrders":11,"failCount":5,"successRate":68.8,"customSuccessRate":68.8,"d7Done":0,"d7Fail":0,"d7Rate":0,"todayDone":0,"online":false,"status":"active","source":"masi","linkedAt":null,"lastSyncedAt":"2026-09-19T21:53:52.958Z"},{"id":"w-masi-107","name":"Shubrajos","key":"WORKER-D4CC-0C9F-5984-F1F9","telegramId":null,"telegramUsername":null,"rate":15,"completedOrders":1,"failCount":4,"successRate":20,"customSuccessRate":20,"d7Done":0,"d7Fail":0,"d7Rate":0,"todayDone":0,"online":false,"status":"active","source":"masi","linkedAt":null,"lastSyncedAt":"2026-09-19T21:53:52.958Z"},{"id":"w-masi-108","name":"Sjsjkkske","key":"WORKER-D40F-62DE-2B70-3786","telegramId":null,"telegramUsername":null,"rate":15,"completedOrders":0,"failCount":0,"successRate":0,"customSuccessRate":0,"d7Done":0,"d7Fail":0,"d7Rate":0,"todayDone":0,"online":false,"status":"active","source":"masi","linkedAt":null,"lastSyncedAt":"2026-09-19T21:53:52.958Z"},{"id":"w-masi-109","name":"Sonusingh","key":"WORKER-79E7-D83D-0D37-C64B","telegramId":null,"telegramUsername":null,"rate":15,"completedOrders":0,"failCount":0,"successRate":0,"customSuccessRate":0,"d7Done":0,"d7Fail":0,"d7Rate":0,"todayDone":0,"online":false,"status":"active","source":"masi","linkedAt":null,"lastSyncedAt":"2026-09-19T21:53:52.958Z"},{"id":"w-masi-110","name":"Suraj","key":"WORKER-D238-2A56-029E-AA90","telegramId":null,"telegramUsername":null,"rate":15,"completedOrders":0,"failCount":0,"successRate":0,"customSuccessRate":0,"d7Done":0,"d7Fail":0,"d7Rate":0,"todayDone":0,"online":false,"status":"active","source":"masi","linkedAt":null,"lastSyncedAt":"2026-09-19T21:53:52.958Z"},{"id":"w-masi-111","name":"Tgbhai","key":"WORKER-6C7C-04F2-6FF3-94D0","telegramId":null,"telegramUsername":null,"rate":15,"completedOrders":0,"failCount":0,"successRate":0,"customSuccessRate":0,"d7Done":0,"d7Fail":0,"d7Rate":0,"todayDone":0,"online":false,"status":"active","source":"masi","linkedAt":null,"lastSyncedAt":"2026-09-19T21:53:52.958Z"},{"id":"w-masi-112","name":"Uxusuwi","key":"WORKER-0294-80C8-2460-75BA","telegramId":null,"telegramUsername":null,"rate":15,"completedOrders":0,"failCount":0,"successRate":0,"customSuccessRate":0,"d7Done":0,"d7Fail":0,"d7Rate":0,"todayDone":0,"online":false,"status":"active","source":"masi","linkedAt":null,"lastSyncedAt":"2026-09-19T21:53:52.958Z"},{"id":"w-masi-113","name":"Vansh","key":"WORKER-260A-007A-0A59-BD6D","telegramId":null,"telegramUsername":null,"rate":15,"completedOrders":0,"failCount":0,"successRate":0,"customSuccessRate":0,"d7Done":0,"d7Fail":0,"d7Rate":0,"todayDone":0,"online":false,"status":"active","source":"masi","linkedAt":null,"lastSyncedAt":"2026-09-19T21:53:52.958Z"},{"id":"w-masi-114","name":"W99w8","key":"WORKER-E0F5-49CA-9564-7425","telegramId":null,"telegramUsername":null,"rate":15,"completedOrders":6,"failCount":0,"successRate":100,"customSuccessRate":100,"d7Done":0,"d7Fail":0,"d7Rate":0,"todayDone":0,"online":false,"status":"active","source":"masi","linkedAt":null,"lastSyncedAt":"2026-09-19T21:53:52.958Z"},{"id":"w-masi-115","name":"WORKER-481E-838B-AE10-8B1C","key":"WORKER-3618-F159-C19B-3AA2","telegramId":null,"telegramUsername":null,"rate":15,"completedOrders":0,"failCount":0,"successRate":0,"customSuccessRate":0,"d7Done":0,"d7Fail":0,"d7Rate":0,"todayDone":0,"online":false,"status":"active","source":"masi","linkedAt":null,"lastSyncedAt":"2026-09-19T21:53:52.958Z"},{"id":"w-masi-116","name":"WORKER-977C-5BBE-D7E2-A855","key":"WORKER-68BD-58ED-A01A-6AD9","telegramId":null,"telegramUsername":null,"rate":15,"completedOrders":0,"failCount":0,"successRate":0,"customSuccessRate":0,"d7Done":0,"d7Fail":0,"d7Rate":0,"todayDone":0,"online":false,"status":"active","source":"masi","linkedAt":null,"lastSyncedAt":"2026-09-19T21:53:52.958Z"},{"id":"w-masi-117","name":"WORKER-B030-0827-9A88-4A04","key":"WORKER-267F-227F-81D9-6F2F","telegramId":null,"telegramUsername":null,"rate":15,"completedOrders":0,"failCount":0,"successRate":0,"customSuccessRate":0,"d7Done":0,"d7Fail":0,"d7Rate":0,"todayDone":0,"online":false,"status":"active","source":"masi","linkedAt":null,"lastSyncedAt":"2026-09-19T21:53:52.958Z"},{"id":"w-masi-118","name":"WORKER-B96B-1CAA-0E18-3401","key":"WORKER-1EF9-E286-D052-464F","telegramId":null,"telegramUsername":null,"rate":15,"completedOrders":0,"failCount":0,"successRate":0,"customSuccessRate":0,"d7Done":0,"d7Fail":0,"d7Rate":0,"todayDone":0,"online":false,"status":"active","source":"masi","linkedAt":null,"lastSyncedAt":"2026-09-19T21:53:52.958Z"},{"id":"w-masi-119","name":"Wewon","key":"WORKER-429F-51AE-6DA2-192C","telegramId":null,"telegramUsername":null,"rate":15,"completedOrders":0,"failCount":2,"successRate":0,"customSuccessRate":0,"d7Done":0,"d7Fail":0,"d7Rate":0,"todayDone":0,"online":false,"status":"active","source":"masi","linkedAt":null,"lastSyncedAt":"2026-09-19T21:53:52.958Z"},{"id":"w-masi-120","name":"Woosidk","key":"WORKER-0872-8B7E-1BD4-17CC","telegramId":null,"telegramUsername":null,"rate":15,"completedOrders":0,"failCount":0,"successRate":0,"customSuccessRate":0,"d7Done":0,"d7Fail":0,"d7Rate":0,"todayDone":0,"online":false,"status":"active","source":"masi","linkedAt":null,"lastSyncedAt":"2026-09-19T21:53:52.958Z"},{"id":"w-masi-121","name":"Woralam","key":"WORKER-8109-C7C6-FB50-BC5A","telegramId":null,"telegramUsername":null,"rate":15,"completedOrders":0,"failCount":2,"successRate":0,"customSuccessRate":0,"d7Done":0,"d7Fail":0,"d7Rate":0,"todayDone":0,"online":false,"status":"active","source":"masi","linkedAt":null,"lastSyncedAt":"2026-09-19T21:53:52.958Z"},{"id":"w-masi-122","name":"Worker03","key":"WORKER-09CC-6F82-3224-BF0C","telegramId":null,"telegramUsername":null,"rate":15,"completedOrders":2,"failCount":5,"successRate":28.6,"customSuccessRate":28.6,"d7Done":0,"d7Fail":0,"d7Rate":0,"todayDone":0,"online":false,"status":"active","source":"masi","linkedAt":null,"lastSyncedAt":"2026-09-19T21:53:52.958Z"},{"id":"w-masi-123","name":"Worker09","key":"WORKER-17BA-337C-6CAA-2ADC","telegramId":null,"telegramUsername":null,"rate":15,"completedOrders":0,"failCount":7,"successRate":0,"customSuccessRate":0,"d7Done":0,"d7Fail":0,"d7Rate":0,"todayDone":0,"online":false,"status":"active","source":"masi","linkedAt":null,"lastSyncedAt":"2026-09-19T21:53:52.958Z"},{"id":"w-masi-124","name":"Workerchutiya","key":"WORKER-D94A-DB75-F832-B377","telegramId":null,"telegramUsername":null,"rate":15,"completedOrders":0,"failCount":1,"successRate":0,"customSuccessRate":0,"d7Done":0,"d7Fail":0,"d7Rate":0,"todayDone":0,"online":false,"status":"paused","source":"masi","linkedAt":null,"lastSyncedAt":"2026-09-19T21:53:52.958Z"},{"id":"w-masi-125","name":"Workerz","key":"WORKER-5F65-BAA4-78BC-45C6","telegramId":null,"telegramUsername":null,"rate":15,"completedOrders":1,"failCount":3,"successRate":25,"customSuccessRate":25,"d7Done":0,"d7Fail":0,"d7Rate":0,"todayDone":0,"online":false,"status":"active","source":"masi","linkedAt":null,"lastSyncedAt":"2026-09-19T21:53:52.958Z"},{"id":"w-masi-126","name":"Yashu","key":"WORKER-A957-B0C7-7AC8-B1C2","telegramId":null,"telegramUsername":null,"rate":15,"completedOrders":4,"failCount":6,"successRate":40,"customSuccessRate":40,"d7Done":0,"d7Fail":0,"d7Rate":0,"todayDone":0,"online":false,"status":"active","source":"masi","linkedAt":null,"lastSyncedAt":"2026-09-19T21:53:52.958Z"}];



  // Application State (Task 2 Focused)
  let state = {
    workers: [],
    settings: {
      botToken: '',
      botUsername: ''
    },
    botStatus: {
      isConfigured: false,
      isPolling: false,
      botUsername: '',
      lastError: null
    },
    masiOverview: {
      paidTodayTotal: 0,
      withdrawnPaidTotal: 0,
      balanceTotal: 0
    },
    currentTab: 'guys', // 'guys', 'keys', 'bot'
    searchQuery: '',
    teamAssignTab: 'paste',
    isApiOnline: true,
    pollTimer: null
  };

  // Initialize
  async function init() {
    setupEventListeners();
    await fetchServerState();
    render();

    // Auto-poll state every 4 seconds to sync Telegram links and worker status
    state.pollTimer = setInterval(async () => {
      await fetchServerState(true);
    }, 4000);
  }

  // Fetch state from server with multi-tier fallback
  async function fetchServerState(isBackground = false) {
    try {
      const res = await fetch(`${API_BASE}/state`);
      if (res.ok) {
        const data = await res.json();
        state.isApiOnline = true;
        if (data.workers && data.workers.length > 0) {
          // Merge incoming workers while preserving local paid status if paid
          const currentMap = new Map((state.workers || []).map(w => [w.id, w]));
          state.workers = data.workers.map(nw => {
            const cur = currentMap.get(nw.id);
            if (cur) {
              if (cur.paymentStatus === 'paid' && nw.paymentStatus !== 'paid' && (Number(nw.completedOrders) || 0) <= (Number(cur.paidCount) || 0)) {
                return {
                  ...nw,
                  paymentStatus: 'paid',
                  paidCount: cur.paidCount || nw.completedOrders,
                  lastPaidAt: cur.lastPaidAt || nw.lastPaidAt
                };
              }
            }
            return nw;
          });
        }
        if (data.settings) state.settings = { ...state.settings, ...data.settings };
        if (data.botStatus) state.botStatus = data.botStatus;
        if (data.masiOverview) state.masiOverview = data.masiOverview;

        saveToLocalStorage();
        updateBotStatusPill();
        if (isBackground) {
          renderKPIs();
          renderCurrentPanelQuietly();
        } else {
          render();
        }
        return;
      }
    } catch (err) {
      state.isApiOnline = false;
    }

    // Tier 2: Static database.json fallback (available on Vercel CDN)
    if (!state.workers || state.workers.length === 0) {
      try {
        const staticRes = await fetch('./data/database.json');
        if (staticRes.ok) {
          const staticData = await staticRes.json();
          if (staticData.workers && staticData.workers.length > 0) {
            state.workers = staticData.workers;
            if (staticData.settings) state.settings = { ...state.settings, ...staticData.settings };
            saveToLocalStorage();
            if (!isBackground) render();
            return;
          }
        }
      } catch (staticErr) {
        // Continue to local storage
      }
    }

    if (!isBackground) {
      loadFromLocalStorage();
      // Tier 4: DEFAULT_WORKERS fallback
      if (!state.workers || state.workers.length === 0) {
        state.workers = JSON.parse(JSON.stringify(DEFAULT_WORKERS));
        saveToLocalStorage();
      }
      render();
    }
  }

  function loadFromLocalStorage() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        state.workers = data.workers || [];
        state.settings = data.settings || {};
      }
    } catch (e) {
      console.error('LocalStorage load failed', e);
    }
  }

  function saveToLocalStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        workers: state.workers,
        settings: state.settings
      }));
    } catch (e) {
      console.error('LocalStorage save failed', e);
    }
  }

  // Toast Notification
  window.showToast = function(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let icon = 'ℹ️';
    if (type === 'success') icon = '✓';
    else if (type === 'danger') icon = '✕';
    else if (type === 'warning') icon = '⚠️';

    toast.innerHTML = `
      <span class="font-bold text-sm mr-2">${icon}</span>
      <span class="flex-1 text-xs font-medium">${escapeHtml(message)}</span>
      <button class="text-white/70 hover:text-white ml-2 text-lg leading-none" onclick="this.parentElement.remove()">&times;</button>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  };

  // Clipboard copy helper
  window.copyToClipboard = function(text, label = 'Value') {
    if (!navigator.clipboard) {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      showToast(`Copied ${label}: ${text}`, 'success');
      return;
    }

    navigator.clipboard.writeText(text).then(() => {
      showToast(`Copied ${label}: ${text}`, 'success');
    }).catch(() => {
      showToast(`Could not copy ${label}`, 'danger');
    });
  };

  function updateBotStatusPill() {
    const pill = document.getElementById('bot-status-pill');
    const text = document.getElementById('bot-status-text');
    if (!pill || !text) return;

    if (state.botStatus && state.botStatus.isPolling) {
      pill.className = 'flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100 transition';
      pill.innerHTML = `<span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span><span>@${state.botStatus.botUsername || 'Bot Connected'}</span>`;
    } else if (state.settings && state.settings.botToken) {
      pill.className = 'flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-300 hover:bg-amber-100 transition';
      pill.innerHTML = `<span class="w-2 h-2 rounded-full bg-amber-500"></span><span>Connecting Bot...</span>`;
    } else {
      pill.className = 'flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200 transition';
      pill.innerHTML = `<span class="w-2 h-2 rounded-full bg-slate-400"></span><span>Connect Telegram Bot</span>`;
    }
  }

  // Switch Active Tab
  window.switchTab = function(tabName) {
    state.currentTab = tabName;
    document.querySelectorAll('.tab-btn').forEach(btn => {
      if (btn.dataset.tab === tabName) {
        btn.classList.add('active', 'bg-indigo-50', 'text-indigo-700', 'border-indigo-200');
        btn.classList.remove('text-slate-600');
      } else {
        btn.classList.remove('active', 'bg-indigo-50', 'text-indigo-700', 'border-indigo-200');
        btn.classList.add('text-slate-600');
      }
    });
    render();
  };

  // Helper: Group workers by Telegram Handle or Guy Name
  function getGroupedGuys() {
    const groups = new Map();

    state.workers.forEach(worker => {
      let groupKey = '';
      let displayName = '';
      let tgHandle = (worker.telegramUsername || '').trim();
      if (tgHandle && !tgHandle.startsWith('@')) tgHandle = '@' + tgHandle;

      if (tgHandle) {
        groupKey = 'tg:' + tgHandle.toLowerCase();
        displayName = worker.personName || worker.name || tgHandle;
      } else if (worker.personName && worker.personName.trim()) {
        groupKey = 'person:' + worker.personName.trim().toLowerCase();
        displayName = worker.personName.trim();
      } else {
        groupKey = 'worker:' + (worker.key || worker.name).toLowerCase();
        displayName = worker.name || worker.key;
      }

      if (!groups.has(groupKey)) {
        groups.set(groupKey, {
          id: groupKey,
          displayName: displayName,
          personName: worker.personName || displayName,
          telegramUsername: tgHandle,
          telegramId: worker.telegramId,
          keys: [],
          customSuccessRate: worker.customSuccessRate
        });
      }

      const guy = groups.get(groupKey);
      if (!guy.telegramUsername && tgHandle) guy.telegramUsername = tgHandle;
      if (!guy.telegramId && worker.telegramId) guy.telegramId = worker.telegramId;
      if (worker.personName && (!guy.personName || guy.personName === guy.displayName)) {
        guy.personName = worker.personName;
      }
      guy.keys.push(worker);
    });

    // Compute metrics for each guy (sorted highest to lowest completed orders)
    return Array.from(groups.values()).map(guy => {
      const completedOrders = guy.keys.reduce((sum, k) => sum + (Number(k.completedOrders) || 0), 0);
      const todayDone = guy.keys.reduce((sum, k) => sum + (Number(k.todayDone) || 0), 0);
      const d7Done = guy.keys.reduce((sum, k) => sum + (Number(k.d7Done) || 0), 0);
      const failCount = guy.keys.reduce((sum, k) => sum + (Number(k.failCount) || 0), 0);
      const totalOrders = completedOrders + failCount;

      const isCustomRate = guy.customSuccessRate !== null && guy.customSuccessRate !== undefined && guy.customSuccessRate !== '';
      let rateNum = 0;
      if (isCustomRate) {
        rateNum = Math.min(100, Math.max(0, Number(guy.customSuccessRate)));
      } else if (totalOrders > 0) {
        rateNum = (completedOrders / totalOrders) * 100;
      } else if (guy.keys.length > 0 && guy.keys[0].successRate) {
        rateNum = Number(guy.keys[0].successRate);
      }
      const successRate = rateNum.toFixed(1);

      // Settle check: worker is paid & settled if all keys with orders are paid
      const paidCount = guy.keys.reduce((sum, k) => {
        const c = Number(k.completedOrders) || 0;
        const p = Number(k.paidCount) || (k.paymentStatus === 'paid' ? c : 0);
        return sum + Math.min(c, p);
      }, 0);
      const leftover = Math.max(0, completedOrders - paidCount);
      const fraction = `${paidCount}/${completedOrders}`;
      const isSettled = completedOrders > 0 && paidCount >= completedOrders;

      // Payout & Withdrawal requests from Telegram (/withdraw, /reqforleftover, /request)
      const hasPendingPayoutRequest = guy.keys.some(k => k.payoutRequestStatus === 'pending');
      const requestedOrders = guy.keys.reduce((sum, k) => {
        if (k.payoutRequestStatus === 'pending') {
          return sum + (Number(k.payoutRequestedOrders) || Math.max(0, (Number(k.completedOrders) || 0) - (Number(k.paidCount) || 0)));
        }
        return sum;
      }, 0);

      // Aggregated payment history
      const allHistory = [];
      guy.keys.forEach(k => {
        if (Array.isArray(k.paymentHistory)) {
          allHistory.push(...k.paymentHistory.map(h => ({ ...h, workerKey: k.key })));
        }
      });
      allHistory.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));

      let rateColor = 'text-slate-600 bg-slate-100';
      let progressColor = 'bg-slate-400';
      if (rateNum >= 80) {
        rateColor = 'text-emerald-700 bg-emerald-100';
        progressColor = 'bg-emerald-500';
      } else if (rateNum >= 50) {
        rateColor = 'text-amber-700 bg-amber-100';
        progressColor = 'bg-amber-500';
      } else if (totalOrders > 0 || isCustomRate) {
        rateColor = 'text-rose-700 bg-rose-100';
        progressColor = 'bg-rose-500';
      }

      return {
        ...guy,
        completedOrders,
        paidCount,
        leftover,
        fraction,
        todayDone,
        d7Done,
        totalOrders,
        isCustomRate,
        rateNum,
        successRate,
        rateColor,
        progressColor,
        isSettled,
        hasPendingPayoutRequest,
        requestedOrders,
        paymentHistory: allHistory
      };
    }).sort((a, b) => (Number(b.completedOrders) || 0) - (Number(a.completedOrders) || 0));
  }

  // Render application
  function render() {
    renderKPIs();

    const container = document.getElementById('panel-content');
    if (!container) return;

    if (state.currentTab === 'guys') {
      renderGuysPanel(container);
    } else if (state.currentTab === 'payouts') {
      renderPayoutsPanel(container);
    } else if (state.currentTab === 'keys') {
      renderKeysPanel(container);
    } else if (state.currentTab === 'bot') {
      renderBotPanel(container);
    } else {
      state.currentTab = 'guys';
      renderGuysPanel(container);
    }
  }

  function renderCurrentPanelQuietly() {
    const container = document.getElementById('panel-content');
    if (!container) return;
    const activeEl = document.activeElement;
    if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')) {
      return;
    }
    render();
  }

  // Update top KPI cards with Masi live metrics
  function renderKPIs() {
    const guys = getGroupedGuys();
    const totalKeys = state.workers.length;
    
    const totalCompletedOrders = guys.reduce((sum, g) => sum + (Number(g.completedOrders) || 0), 0);
    const totalAllOrders = guys.reduce((sum, g) => sum + (Number(g.totalOrders) || 0), 0);
    
    let teamSuccessRate = '0%';
    if (totalAllOrders > 0) {
      teamSuccessRate = `${((totalCompletedOrders / totalAllOrders) * 100).toFixed(1)}%`;
    } else {
      const workersWithRate = state.workers.filter(w => Number(w.successRate) > 0 || Number(w.customSuccessRate) > 0);
      if (workersWithRate.length > 0) {
        const avg = workersWithRate.reduce((acc, w) => acc + (Number(w.customSuccessRate || w.successRate) || 0), 0) / workersWithRate.length;
        teamSuccessRate = `${avg.toFixed(1)}%`;
      }
    }
    
    const totalGuys = guys.length;

    const elKeys = document.getElementById('kpi-total-keys');
    const elCompleted = document.getElementById('kpi-completed-orders');
    const elSuccess = document.getElementById('kpi-team-success');
    const elPaidToday = document.getElementById('kpi-paid-today');
    const elTotalWithdrawn = document.getElementById('kpi-total-withdrawn');

    if (elKeys) elKeys.textContent = totalKeys;
    if (elCompleted) elCompleted.textContent = totalCompletedOrders.toLocaleString();
    if (elSuccess) elSuccess.textContent = teamSuccessRate;

    const paidTodayVal = (state.masiOverview && state.masiOverview.paidTodayTotal !== undefined) ? Number(state.masiOverview.paidTodayTotal) : 0;
    const totalWithdrawnVal = (state.masiOverview && state.masiOverview.withdrawnPaidTotal !== undefined) ? Number(state.masiOverview.withdrawnPaidTotal) : 0;

    if (elPaidToday) elPaidToday.textContent = `$${paidTodayVal.toFixed(2)}`;
    if (elTotalWithdrawn) elTotalWithdrawn.textContent = `$${totalWithdrawnVal.toFixed(2)}`;

    // Badges
    const badgeGuys = document.getElementById('tab-badge-guys');
    const badgeKeys = document.getElementById('tab-badge-keys');

    if (badgeGuys) badgeGuys.textContent = totalGuys;
    if (badgeKeys) badgeKeys.textContent = totalKeys;
    const badgePayouts = document.getElementById("tab-badge-payouts");
    if (badgePayouts) badgePayouts.textContent = 24;
  }

  // Filter guys or workers by global search (Always sorted highest to lowest completed orders)
  function filterGuys(guys) {
    let list = guys;
    if (state.searchQuery.trim()) {
      const q = state.searchQuery.trim().toLowerCase();
      list = guys.filter(g => 
        (g.displayName && g.displayName.toLowerCase().includes(q)) ||
        (g.personName && g.personName.toLowerCase().includes(q)) ||
        (g.telegramUsername && g.telegramUsername.toLowerCase().includes(q)) ||
        g.keys.some(k => (k.key && k.key.toLowerCase().includes(q)) || (k.name && k.name.toLowerCase().includes(q)))
      );
    }
    return [...list].sort((a, b) => (Number(b.completedOrders) || 0) - (Number(a.completedOrders) || 0));
  }

  function filterWorkers(workers) {
    let list = workers;
    if (state.searchQuery.trim()) {
      const q = state.searchQuery.trim().toLowerCase();
      list = workers.filter(w =>
        (w.name && w.name.toLowerCase().includes(q)) ||
        (w.key && w.key.toLowerCase().includes(q)) ||
        (w.personName && w.personName.toLowerCase().includes(q)) ||
        (w.telegramUsername && w.telegramUsername.toLowerCase().includes(q))
      );
    }
    return [...list].sort((a, b) => (Number(b.completedOrders) || 0) - (Number(a.completedOrders) || 0));
  }

  // ==========================================
  // PANEL 1: TEAM & GUYS (GROUPED VIEW)
  // ==========================================
  function renderGuysPanel(container) {
    const allGuys = getGroupedGuys();
    const guys = filterGuys(allGuys);

    let html = `
      <div class="space-y-6">
        <!-- Settlement Notice Banner with Direct Link -->
        <div class="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 rounded-xl shadow-md p-4 sm:p-5 text-white flex flex-wrap items-center justify-between gap-4">
          <div class="flex items-center gap-3.5">
            <div class="w-11 h-11 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-2xl shadow-inner">
              💰
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h3 class="text-base font-extrabold tracking-wide">23 Sep Payouts & Settlement Hub Ready!</h3>
                <span class="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-400 text-slate-900 shadow-xs">₹6,983 Total</span>
              </div>
              <p class="text-xs sm:text-sm text-emerald-100 mt-0.5">
                Window: 23 Sep (12 AM – 10 PM IST) • 219 Pass • 24 Telegram Workers • ⚡ <b>One-Tap to Copy Worker Keys</b> enabled
              </p>
            </div>
          </div>
          <button onclick="switchTab('payouts')" class="px-4 py-2.5 rounded-lg text-xs font-extrabold bg-white text-emerald-800 hover:bg-emerald-50 active:scale-95 shadow-md transition flex items-center gap-2">
            <span>📊 View Settlement & Copy Keys</span>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </button>
        </div>

        <!-- Banner & Quick Actions -->
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6 bg-gradient-to-r from-indigo-50/50 via-sky-50/30 to-white flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 class="text-xl font-extrabold text-slate-800 flex items-center gap-2">
              <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
              Team Profiles (Multi-Key Grouping)
            </h2>
            <p class="text-sm text-slate-500 mt-1">
              Multiple keys assigned to the same worker are unified into <b>1 Guy Profile</b> with combined completed orders and pay.
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <button onclick="openTeamAssignModal()" class="px-3.5 py-2 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition flex items-center gap-1.5">
              <span>👥</span> Assign Keys to Guys
            </button>
            <button onclick="openMasiModal()" class="px-3 py-2 rounded-lg text-xs font-bold bg-violet-600 hover:bg-violet-700 text-white shadow-sm transition flex items-center gap-1.5">
              <span>⚡</span> Sync Masi Boss
            </button>
            <button onclick="openAddWorkerModal()" class="px-3 py-2 rounded-lg text-xs font-bold bg-sky-600 hover:bg-sky-700 text-white shadow-sm transition flex items-center gap-1">
              <span>+</span> New Key
            </button>
          </div>
        </div>

        <!-- Instructions Bar -->
        <div class="bg-indigo-50/70 border border-indigo-200 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs text-indigo-900">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-indigo-200 text-indigo-800 flex items-center justify-center font-bold text-sm">💡</div>
            <div>
              <span class="font-bold">Team Tip:</span>
              <span class="text-indigo-800"> Drag any key chip onto another worker's card to merge them. <b>Throw/drop any key to the left side</b> anytime to detach it and revert it back to its original individual worker form!</span>
            </div>
          </div>
          <div class="font-mono text-[11px] bg-white px-2.5 py-1 rounded border border-indigo-200 text-indigo-700 font-semibold whitespace-nowrap">
            ${guys.length} Guys | ${state.workers.length} Keys Total
          </div>
        </div>
        <!-- Pending Requested Withdrawals Banner (if any) -->
        ${(() => {
          const pendingGuys = guys.filter(g => g.hasPendingPayoutRequest);
          if (pendingGuys.length === 0) return '';
          const totalRequestedOrders = pendingGuys.reduce((sum, g) => sum + (g.requestedOrders || 0), 0);
          return `
            <div class="bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 border border-amber-500 rounded-xl p-4 text-slate-900 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div class="flex items-center gap-3">
                <span class="text-2xl animate-bounce">🔔</span>
                <div>
                  <div class="text-xs font-black uppercase tracking-wider text-amber-950">Pending Withdrawal Requests (${pendingGuys.length} Worker${pendingGuys.length > 1 ? 's' : ''})</div>
                  <div class="text-xs text-amber-900 mt-0.5">Total requested: <strong class="font-black text-slate-950">${totalRequestedOrders} orders</strong> across active workers. Click on any profile to review & record payout.</div>
                </div>
              </div>
              <div class="flex items-center gap-2 flex-wrap">
                ${pendingGuys.slice(0, 4).map(pg => `
                  <button onclick="openGuyProfileModal('${escapeHtml(pg.id)}')" class="px-3 py-1 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-lg shadow-xs transition flex items-center gap-1.5">
                    <span>💳</span> ${escapeHtml(pg.displayName)} (${pg.requestedOrders || 0} orders)
                  </button>
                `).join('')}
              </div>
            </div>
          `;
        })()}
    `;

    if (guys.length === 0) {
      html += `
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
          <p class="text-slate-500 mb-4">No team profiles found matching your search.</p>
          <button onclick="openTeamAssignModal()" class="px-4 py-2 bg-indigo-600 text-white font-medium text-xs rounded-lg shadow-sm">
            👥 Assign Keys to Guys
          </button>
        </div>
      </div>`;
      container.innerHTML = html;
      return;
    }

    html += `<div class="grid grid-cols-1 md:grid-cols-2 gap-5">`;

    guys.forEach(guy => {
      const isLinked = Boolean(guy.telegramId);
      const cardDomId = 'guy-card-' + String(guy.id).replace(/[^a-zA-Z0-9_-]/g, '_');

      html += `
        <div id="${cardDomId}" data-guy-id="${escapeHtml(guy.id)}" ondragover="handleKeyDragOver(event)" ondragleave="handleKeyDragLeave(event)" ondrop="handleKeyDrop(event, '${escapeHtml(guy.id)}')" class="bg-white rounded-xl shadow-sm border ${guy.isSettled ? 'paid-card-settled' : 'border-slate-200'} hover:border-indigo-400 transition-all overflow-hidden flex flex-col justify-between relative">
          ${guy.isSettled ? `
            <div class="bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest py-0.5 px-3 text-center flex items-center justify-center gap-1">
              <span>✓</span> PAYMENT COMPLETED & SETTLED (${guy.fraction})
            </div>
          ` : ''}
          <div class="p-5">
            <!-- Pending Payout Request Alert (from /withdraw or /reqforleftover in bot) -->
            ${guy.hasPendingPayoutRequest ? `
              <div class="bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-400 rounded-xl p-3 mb-4 flex items-center justify-between gap-2 shadow-xs cursor-pointer hover:border-amber-500 transition" onclick="openGuyProfileModal('${escapeHtml(guy.id)}')">
                <div class="flex items-center gap-2.5">
                  <span class="text-xl animate-pulse">🔔</span>
                  <div>
                    <div class="text-[11px] font-black uppercase tracking-wider text-amber-900">Withdrawal Requested!</div>
                    <div class="text-xs text-amber-800 font-medium">Worker requested: <strong class="font-extrabold text-slate-900 text-sm">${guy.requestedOrders} orders</strong> (${guy.fraction} settled)</div>
                  </div>
                </div>
                <button onclick="event.stopPropagation(); openGuyProfileModal('${escapeHtml(guy.id)}')" class="px-3.5 py-1.5 rounded-lg text-xs font-black bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition flex items-center gap-1 whitespace-nowrap">
                  <span>💳</span> Review & Pay
                </button>
              </div>
            ` : ''}

            <!-- Header: Guy Name & Telegram -->
            <div class="flex items-start justify-between gap-3 mb-4">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-xl bg-gradient-to-br ${guy.isSettled ? 'from-emerald-600 to-teal-600' : 'from-indigo-600 to-sky-600'} text-white flex items-center justify-center font-extrabold text-lg shadow-sm cursor-pointer hover:opacity-90 transition" onclick="openGuyProfileModal('${escapeHtml(guy.id)}')">
                  ${escapeHtml((guy.displayName || 'G').charAt(0).toUpperCase())}
                </div>
                <div>
                  <h3 class="font-extrabold text-slate-900 text-base leading-tight flex items-center gap-2">
                    <button onclick="openGuyProfileModal('${escapeHtml(guy.id)}')" class="text-left font-extrabold text-slate-900 text-base leading-tight hover:text-emerald-700 transition flex items-center gap-2">
                      <span class="${guy.isSettled ? 'paid-strike-bar' : ''}">${escapeHtml(guy.displayName)}</span>
                    </button>
                    <button onclick="openGuyKeysModal('${escapeHtml(guy.id)}')" title="Click to view & manage keys" class="text-[10px] px-2 py-0.5 rounded-full font-bold cursor-pointer transition ${guy.isSettled ? 'bg-emerald-100 text-emerald-800' : 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200'}">
                      ${guy.keys.length} ${guy.keys.length === 1 ? 'Key' : 'Keys'} 🔍
                    </button>
                  </h3>

                  <!-- Prominent Telegram Display -->
                  <div class="flex items-center gap-2 text-xs mt-1.5 flex-wrap">
                    ${guy.telegramUsername ? `
                      <a href="https://t.me/${guy.telegramUsername.replace('@', '')}" target="_blank" class="inline-flex items-center gap-1 text-sky-600 hover:underline font-mono font-bold bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                        <span>✈️</span> ${escapeHtml(guy.telegramUsername)}
                      </a>
                    ` : `
                      <button onclick="openSetTgModal('${escapeHtml(guy.id)}', '${escapeHtml(guy.displayName)}')" class="text-slate-400 hover:text-sky-600 text-[11px] font-medium border border-dashed border-slate-300 hover:border-sky-400 px-2 py-0.5 rounded transition">
                        + Add @telegram
                      </button>
                    `}
                    <span class="text-slate-300">•</span>
                    ${isLinked ? `
                      <span class="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-bold">
                        <span class="w-2 h-2 rounded-full bg-emerald-500"></span> Connected
                      </span>
                    ` : `
                      <button onclick="openQuickTgModal('${escapeHtml(guy.keys[0]?.key || '')}', '${escapeHtml(guy.displayName || '')}')" title="Worker hasn't started bot yet" class="inline-flex items-center gap-1 text-[11px] text-amber-700 font-medium hover:underline">
                        <span class="w-1.5 h-1.5 rounded-full bg-amber-400"></span> ⚪ Bot Not Started
                      </button>
                    `}
                  </div>
                </div>
              </div>

              <!-- Settlement Fraction & Success Rate Badge -->
              <div class="text-right flex flex-col items-end gap-1">
                <button onclick="openGuyProfileModal('${escapeHtml(guy.id)}')" title="View payout profile & settlement" class="font-mono text-xs font-black px-2.5 py-1 rounded-full border cursor-pointer hover:shadow-xs transition ${guy.isSettled ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : (guy.leftover > 0 ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-slate-100 text-slate-700 border-slate-200')}">
                  ${guy.fraction} ${guy.isSettled ? '✓' : (guy.leftover > 0 ? `(${guy.leftover} left)` : '')}
                </button>
                <span class="px-2 py-0.5 rounded-full text-[10px] font-black ${guy.rateColor} border border-current/20">
                  ${guy.successRate}% Success
                </span>
              </div>
            </div>

            <!-- Assigned Keys Chips List (Draggable between worker cards or to the left to reset) -->
            <div class="mb-4">
              <div class="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span onclick="openGuyKeysModal('${escapeHtml(guy.id)}')" class="cursor-pointer hover:text-indigo-600">Assigned Keys (${guy.keys.length})</span>
                <span class="text-[10px] text-indigo-600 font-normal">Drag to worker or throw left to reset</span>
              </div>
              <div class="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1.5 bg-slate-50 rounded-lg border border-slate-200">
                ${guy.keys.map(k => {
                  const keyPaid = (Number(k.completedOrders) || 0) > 0 && (k.paymentStatus === 'paid' || (Number(k.paidCount) || 0) >= (Number(k.completedOrders) || 0));
                  return `
                    <div draggable="true" ondragstart="handleKeyDragStart(event, '${escapeHtml(k.key)}')" ondragend="handleKeyDragEnd(event)" title="Drag to move to another worker, or throw left to reset to original form" class="inline-flex items-center gap-1 px-2 py-1 rounded ${keyPaid ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-slate-300'} border text-[11px] font-mono shadow-2xs hover:border-indigo-500 hover:shadow-xs cursor-grab active:cursor-grabbing transition">
                      <span class="text-slate-300 select-none text-[9px]">⋮⋮</span>
                      <span class="text-slate-800 font-semibold ${keyPaid ? 'line-through text-slate-400' : ''}">${escapeHtml(k.key)}</span>
                      <button onclick="copyToClipboard('${escapeHtml(k.key)}', 'Worker Key')" title="Copy Key" class="text-slate-400 hover:text-indigo-600 p-0.5">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                      </button>
                      <span class="text-[10px] ${keyPaid ? 'text-emerald-700 font-black' : 'text-emerald-600 font-bold'} ml-1">${k.completedOrders || 0}✓ ${keyPaid ? '(PAID)' : ''}</span>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>

            <!-- Aggregated Performance Metrics Grid (3 columns: Completed Orders, Today Done, 7-Day Performance) -->
            <div class="grid grid-cols-3 gap-2 bg-slate-50 border border-slate-100 p-3 rounded-lg text-center mb-3">
              <div>
                <div class="text-xs text-slate-400 font-medium">Completed Orders</div>
                <div class="text-base font-black text-emerald-700 ${guy.isSettled ? 'line-through' : ''}">${guy.completedOrders}</div>
              </div>
              <div>
                <div class="text-xs text-slate-400 font-medium">Today Done</div>
                <div class="text-base font-black text-sky-700">${guy.todayDone}</div>
              </div>
              <div>
                <div class="text-xs text-slate-400 font-medium">7-Day Done</div>
                <div class="text-base font-black text-indigo-700">${guy.d7Done}</div>
              </div>
            </div>

            <!-- Progress Bar -->
            <div>
              <div class="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span>Success Rate Progression</span>
                <span class="font-bold text-slate-800">${guy.successRate}%</span>
              </div>
              <div class="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                <div class="${guy.progressColor} h-2 rounded-full transition-all duration-500" style="width: ${Math.min(100, Math.max(0, guy.rateNum))}%"></div>
              </div>
            </div>
          </div>

          <!-- Card Actions Footer -->
          <div class="p-3 ${guy.isSettled ? 'bg-emerald-50/40 border-emerald-200' : 'bg-slate-50 border-slate-200'} border-t flex items-center justify-between gap-2 flex-wrap">
            <div class="flex items-center gap-2">
              <button onclick="openGuyProfileModal('${escapeHtml(guy.id)}')" title="View settlement profile & details" class="cursor-pointer text-left">
                ${guy.isSettled ? `
                  <span class="px-2.5 py-1 text-xs font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 rounded-md flex items-center gap-1">
                    <span>✓</span> ${guy.fraction} Fully Settled
                  </span>
                ` : `
                  <span class="px-2.5 py-1 text-xs font-bold text-amber-800 bg-amber-50 border border-amber-300 rounded-md flex items-center gap-1">
                    <span>⏳</span> ${guy.fraction} Paid (${guy.leftover} Leftover)
                  </span>
                `}
              </button>
            </div>

            <div class="flex items-center gap-1.5 flex-wrap">
              <button onclick="openGuyProfileModal('${escapeHtml(guy.id)}')" title="View profile, requested orders & log payments" class="px-2.5 py-1.5 rounded-lg text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 transition flex items-center gap-1">
                <span>💳</span> Profile & Pay
              </button>

              ${(!guy.isSettled && guy.completedOrders > 0) ? `
                <button onclick="markGuyPaid('${escapeHtml(guy.id)}')" title="Mark all completed orders as paid and notify via Telegram" class="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition flex items-center gap-1">
                  <span>✓</span> Settle All (${guy.completedOrders}/${guy.completedOrders}) ${isLinked ? '📲' : ''}
                </button>
              ` : ''}
              ${(guy.isSettled && guy.completedOrders > 0) ? `
                <button onclick="unmarkGuyPaid('${escapeHtml(guy.id)}')" title="Reset / Mark Unpaid" class="px-2.5 py-1.5 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-md transition flex items-center gap-1">
                  <span>↩</span> Mark Unpaid
                </button>
              ` : ''}

              <button onclick="openSendMsgModal('${escapeHtml(guy.keys[0]?.id || '')}', '${escapeHtml(guy.displayName || '')}', '${escapeHtml(guy.telegramUsername || '')}')" title="Send direct Telegram message to worker" class="px-2.5 py-1.5 rounded-lg text-xs font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 transition flex items-center gap-1">
                <span>💬</span> Msg
              </button>

              <button onclick="openGuyKeysModal('${escapeHtml(guy.id)}')" title="View and manage keys under this worker" class="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition flex items-center gap-1">
                <span>🔑</span> Keys
              </button>

              <button onclick="openSetTgModal('${escapeHtml(guy.id)}', '${escapeHtml(guy.displayName)}')" title="Set / Edit Telegram Username" class="px-2 py-1.5 rounded-lg text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition">
                ✈️ TG
              </button>
            </div>
          </div>
        </div>
      `;
    });

    html += `</div></div>`;
    container.innerHTML = html;
  }

// Settlement & Payouts Panel Module for 23 Sep (12 AM - 10 PM IST)
  const settlementData23Sep = {
    window: "23 Sep 2026, 12:00 AM – 10:00 PM IST (22h)",
    rates: [
      { range: "1 – 5 QR", rate: 25, emoji: "🪙" },
      { range: "6 – 10 QR", rate: 27, emoji: "💸" },
      { range: "11 – 20 QR", rate: 31, emoji: "💰" },
      { range: "20+ QR (21–30)", rate: 35, emoji: "👾" },
      { range: "30+ QR", rate: 40, emoji: "🧸" }
    ],
    penaltyRule: "If Success Rate < 60%, Max Rate is capped at ₹32/QR.",
    bossMasi: {
      totalCompleted: 219,
      at050: 82,
      at060: 137,
      grossUsd: 123.20,
      penaltiesCount: 164,
      penaltiesUsd: -10.65,
      netUsd: 112.55,
      approxInrNet: 9454
    },
    metrics: {
      totalPayout: 6983,
      totalCompleted: 219,
      totalFailed: 135,
      totalExpired: 33,
      totalOrders: 387,
      successRate: 56.6,
      activeWorkersCount: 24,
      totalKeysCount: 34
    },
    users: [
      {
        rank: 1,
        username: "@Bnzaalam",
        displayName: "Bnzaalam",
        keys: [{ name: "Hey123", key: "WORKER-21C3-59F9-EA3B-E26A", done: 32, fail: 1, total: 33 }],
        done: 32,
        fail: 1,
        total: 33,
        successRate: 97.0,
        rate: 40,
        tier: "30+ QR",
        payout: 1280
      },
      {
        rank: 2,
        username: "@fileworker_6700",
        displayName: "Fileworker",
        keys: [{ name: "Hellxieii", key: "WORKER-B25D-66C6-25F7-C418", done: 30, fail: 6, total: 36 }],
        done: 30,
        fail: 6,
        total: 36,
        successRate: 83.3,
        rate: 35,
        tier: "20+ QR",
        payout: 1050
      },
      {
        rank: 3,
        username: "@hashirmhd",
        displayName: "Hashir",
        keys: [{ name: "Hashirbhai", key: "WORKER-36F9-1F80-EA07-C8DA", done: 22, fail: 3, total: 25 }],
        done: 22,
        fail: 3,
        total: 25,
        successRate: 88.0,
        rate: 35,
        tier: "20+ QR",
        payout: 770
      },
      {
        rank: 4,
        username: "@AASHU_97",
        displayName: "Aashu",
        keys: [{ name: "Aashu", key: "WORKER-7F2C-BE14-84B5-EC3C", done: 15, fail: 6, total: 21 }],
        done: 15,
        fail: 6,
        total: 21,
        successRate: 71.4,
        rate: 31,
        tier: "11–20 QR",
        payout: 465
      },
      {
        rank: 5,
        username: "@Deep280109",
        displayName: "Deep",
        keys: [{ name: "Depubaby", key: "WORKER-7D0E-10BE-477F-0741", done: 15, fail: 3, total: 18 }],
        done: 15,
        fail: 3,
        total: 18,
        successRate: 83.3,
        rate: 31,
        tier: "11–20 QR",
        payout: 465
      },
      {
        rank: 6,
        username: "shub",
        displayName: "Shubhraj Singh",
        keys: [
          { name: "Paras43", key: "WORKER-06D9-A94C-E26D-C1B2", done: 6, fail: 8, total: 14 },
          { name: "Shub6", key: "WORKER-B1B5-38E0-D897-E5D7", done: 4, fail: 6, total: 10 },
          { name: "Paras19", key: "WORKER-037D-4846-737B-5143", done: 3, fail: 5, total: 8 },
          { name: "Paras42", key: "WORKER-07BB-01F6-7743-7BE8", done: 2, fail: 1, total: 3 }
        ],
        done: 15,
        fail: 20,
        total: 35,
        successRate: 42.9,
        rate: 31,
        tier: "11–20 QR (4 Keys)",
        payout: 465
      },
      {
        rank: 7,
        username: "@Tgrajout",
        displayName: "Tg Rajput",
        keys: [
          { name: "Paras41", key: "WORKER-B9CC-39EC-1C71-DDEC", done: 6, fail: 7, total: 13 },
          { name: "Shub1", key: "WORKER-48A6-E6A7-89C5-A8E7", done: 5, fail: 1, total: 6 },
          { name: "Paras46", key: "WORKER-7EDD-E24E-A7E0-8813", done: 1, fail: 5, total: 6 },
          { name: "Shub5", key: "WORKER-8CAF-E03B-19C1-E66F", done: 1, fail: 5, total: 6 },
          { name: "Shub3", key: "WORKER-D4A3-4AA1-5B5E-0060", done: 1, fail: 1, total: 2 },
          { name: "Shub9", key: "WORKER-82FF-EC9D-35F4-8648", done: 1, fail: 0, total: 1 }
        ],
        done: 15,
        fail: 19,
        total: 34,
        successRate: 44.1,
        rate: 31,
        tier: "11–20 QR (6 Keys)",
        payout: 465
      },
      {
        rank: 8,
        username: "@BCNAMI",
        displayName: "BC Nami",
        keys: [{ name: "LuffyD", key: "WORKER-BAF8-8A3C-3CA1-5604", done: 14, fail: 7, total: 21 }],
        done: 14,
        fail: 7,
        total: 21,
        successRate: 66.7,
        rate: 31,
        tier: "11–20 QR",
        payout: 434
      },
      {
        rank: 9,
        username: "@ntnatri",
        displayName: "Nitin Atri",
        keys: [{ name: "Nitin", key: "WORKER-2D3D-E8D5-B6A1-5CD1", done: 9, fail: 5, total: 14 }],
        done: 9,
        fail: 5,
        total: 14,
        successRate: 64.3,
        rate: 27,
        tier: "6–10 QR",
        payout: 243
      },
      {
        rank: 10,
        username: "@ROSALIE_ADMIN1",
        displayName: "Rosalie Admin",
        keys: [
          { name: "Fckme02", key: "WORKER-5C38-E9A2-3950-2DE3", done: 6, fail: 4, total: 10 },
          { name: "1webkeydedo", key: "WORKER-B110-7AFF-53AF-AA74", done: 3, fail: 2, total: 5 }
        ],
        done: 9,
        fail: 6,
        total: 15,
        successRate: 60.0,
        rate: 27,
        tier: "6–10 QR (2 Keys)",
        payout: 243
      },
      {
        rank: 11,
        username: "@pawan_naidu_24",
        displayName: "Pawan Naidu",
        keys: [{ name: "Givemeworkbro", key: "WORKER-D8DC-E408-F99E-B402", done: 8, fail: 5, total: 13 }],
        done: 8,
        fail: 5,
        total: 13,
        successRate: 61.5,
        rate: 27,
        tier: "6–10 QR",
        payout: 216
      },
      {
        rank: 12,
        username: "majid",
        displayName: "Majid",
        keys: [{ name: "Majido", key: "WORKER-90C8-CDB0-D93C-26B8", done: 6, fail: 3, total: 9 }],
        done: 6,
        fail: 3,
        total: 9,
        successRate: 66.7,
        rate: 27,
        tier: "6–10 QR",
        payout: 162
      },
      {
        rank: 13,
        username: "@shauryagharat4103",
        displayName: "Shaurya Gharat",
        keys: [{ name: "Shaurya", key: "WORKER-98D0-D03A-8138-F09A", done: 5, fail: 3, total: 8 }],
        done: 5,
        fail: 3,
        total: 8,
        successRate: 62.5,
        rate: 25,
        tier: "1–5 QR",
        payout: 125
      },
      {
        rank: 14,
        username: "loki",
        displayName: "Loki",
        keys: [
          { name: "Loki", key: "WORKER-1956-E7B7-7220-B03F", done: 3, fail: 1, total: 4 },
          { name: "W99w8", key: "WORKER-E0F5-49CA-9564-7425", done: 2, fail: 1, total: 3 }
        ],
        done: 5,
        fail: 2,
        total: 7,
        successRate: 71.4,
        rate: 25,
        tier: "1–5 QR (2 Keys)",
        payout: 125
      },
      {
        rank: 15,
        username: "@LaksheswarX",
        displayName: "Laksheswar",
        keys: [{ name: "Lokeshwaray", key: "WORKER-0452-3999-5B0F-FF48", done: 3, fail: 5, total: 8 }],
        done: 3,
        fail: 5,
        total: 8,
        successRate: 37.5,
        rate: 25,
        tier: "1–5 QR",
        payout: 75
      },
      {
        rank: 16,
        username: "@Rayyann30",
        displayName: "Rayyan",
        keys: [{ name: "Rayansheik", key: "WORKER-98EF-C719-3B23-A25A", done: 3, fail: 3, total: 6 }],
        done: 3,
        fail: 3,
        total: 6,
        successRate: 50.0,
        rate: 25,
        tier: "1–5 QR",
        payout: 75
      },
      {
        rank: 17,
        username: "@Terajaat012",
        displayName: "Tera Jaat",
        keys: [{ name: "Jaate", key: "WORKER-A13D-9071-CB21-EEAB", done: 2, fail: 6, total: 8 }],
        done: 2,
        fail: 6,
        total: 8,
        successRate: 25.0,
        rate: 25,
        tier: "1–5 QR",
        payout: 50
      },
      {
        rank: 18,
        username: "hyper",
        displayName: "Hyper",
        keys: [{ name: "HyperX", key: "WORKER-F4CC-5C42-85A9-617F", done: 2, fail: 5, total: 7 }],
        done: 2,
        fail: 5,
        total: 7,
        successRate: 28.6,
        rate: 25,
        tier: "1–5 QR",
        payout: 50
      },
      {
        rank: 19,
        username: "@Work4money_owner",
        displayName: "Work4Money Owner",
        keys: [{ name: "Aarvworzk", key: "WORKER-708B-BDA0-F8CC-FE52", done: 2, fail: 5, total: 7 }],
        done: 2,
        fail: 5,
        total: 7,
        successRate: 28.6,
        rate: 25,
        tier: "1–5 QR",
        payout: 50
      },
      {
        rank: 20,
        username: "idk",
        displayName: "Idk",
        keys: [{ name: "Woosidk", key: "WORKER-0872-8B7E-1BD4-17CC", done: 2, fail: 4, total: 6 }],
        done: 2,
        fail: 4,
        total: 6,
        successRate: 33.3,
        rate: 25,
        tier: "1–5 QR",
        payout: 50
      },
      {
        rank: 21,
        username: "sharmaji",
        displayName: "Sharmaji",
        keys: [{ name: "Sharmaji", key: "WORKER-9433-07AE-F0AF-26E2", done: 2, fail: 0, total: 2 }],
        done: 2,
        fail: 0,
        total: 2,
        successRate: 100.0,
        rate: 25,
        tier: "1–5 QR",
        payout: 50
      },
      {
        rank: 22,
        username: "@Kelifor",
        displayName: "Kelifor",
        keys: [{ name: "Kelifor", key: "WORKER-4A7A-EE26-47D4-9F9A", done: 1, fail: 7, total: 8 }],
        done: 1,
        fail: 7,
        total: 8,
        successRate: 12.5,
        rate: 25,
        tier: "1–5 QR",
        payout: 25
      },
      {
        rank: 23,
        username: "@PsychoAlex99",
        displayName: "Alex",
        keys: [{ name: "Alexy", key: "WORKER-957A-2D08-DCB6-118F", done: 1, fail: 1, total: 2 }],
        done: 1,
        fail: 1,
        total: 2,
        successRate: 50.0,
        rate: 25,
        tier: "1–5 QR",
        payout: 25
      },
      {
        rank: 24,
        username: "@Sonu2538",
        displayName: "Sonu Singh",
        keys: [{ name: "Sonusingh", key: "WORKER-79E7-D83D-0D37-C64B", done: 1, fail: 1, total: 2 }],
        done: 1,
        fail: 1,
        total: 2,
        successRate: 50.0,
        rate: 25,
        tier: "1–5 QR",
        payout: 25
      }
    ]
  };

  // State variables for settlement view
  state.payoutsView = state.payoutsView || 'grouped'; // 'grouped' | 'keys'
  state.payoutsSearch = state.payoutsSearch || '';

  window.setPayoutsView = function(view) {
    state.payoutsView = view;
    renderCurrentPanelQuietly();
  };

  window.setPayoutsSearch = function(query) {
    state.payoutsSearch = query || '';
    renderCurrentPanelQuietly();
  };

  window.copyAllTelegramPayouts = function() {
    let msg = `💰 PAYOUT LIST (23 Sep 12:00 AM - 10:00 PM IST):\n\n`;
    settlementData23Sep.users.forEach(u => {
      msg += `${u.rank}. ${u.username}: ${u.done} QR -> ₹${u.payout.toLocaleString('en-IN')}\n`;
    });
    msg += `\nTOTAL PAYOUT: ₹${settlementData23Sep.metrics.totalPayout.toLocaleString('en-IN')}`;
    copyToClipboard(msg, 'Full Telegram Payout Summary');
  };

  window.copyUserSummary = function(rank) {
    const user = settlementData23Sep.users.find(u => u.rank === rank);
    if (!user) return;
    const keyDetails = user.keys.map(k => `${k.name} (${k.key})`).join(', ');
    const msg = `💰 Settlement for ${user.username}:\n• Pass/Completed: ${user.done} QR\n• Failed/Expired: ${user.fail}\n• Success Rate: ${user.successRate}%\n• Rate: ₹${user.rate}/QR\n• Total Pay: ₹${user.payout}\n• Assigned Key(s): ${keyDetails}`;
    copyToClipboard(msg, `Settlement for ${user.username}`);
  };

  // ==========================================
  // PANEL: 23 SEP PAYOUTS & SETTLEMENT HUB
  // ==========================================
  function renderPayoutsPanel(container) {
    const search = (state.payoutsSearch || '').toLowerCase().trim();
    const isGrouped = state.payoutsView !== 'keys';

    // Filter users
    const filteredUsers = settlementData23Sep.users.filter(u => {
      if (!search) return true;
      const matchUser = u.username.toLowerCase().includes(search) || u.displayName.toLowerCase().includes(search);
      const matchKeys = u.keys.some(k => k.name.toLowerCase().includes(search) || k.key.toLowerCase().includes(search));
      return matchUser || matchKeys;
    });

    // Flatten all 34 individual keys
    const allKeysList = [];
    settlementData23Sep.users.forEach(u => {
      u.keys.forEach(k => {
        allKeysList.push({
          username: u.username,
          displayName: u.displayName,
          userRank: u.rank,
          userTierRate: u.rate,
          ...k,
          successRate: k.total > 0 ? ((k.done / k.total) * 100).toFixed(1) : 0,
          earned: k.done * u.rate
        });
      });
    });

    const filteredKeys = allKeysList.filter(k => {
      if (!search) return true;
      return k.name.toLowerCase().includes(search) || k.key.toLowerCase().includes(search) || k.username.toLowerCase().includes(search);
    });

    let html = `
      <div class="space-y-6">
        <!-- Header Banner -->
        <div class="bg-gradient-to-r from-emerald-600 via-teal-700 to-indigo-800 rounded-2xl shadow-lg p-5 sm:p-7 text-white relative overflow-hidden">
          <div class="absolute -right-8 -bottom-8 opacity-10 pointer-events-none">
            <svg class="w-64 h-64" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"></path></svg>
          </div>
          <div class="relative z-10 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div class="flex items-center gap-2 mb-1.5 flex-wrap">
                <span class="px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-400 text-slate-900 shadow-sm">Verified Settlement</span>
                <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur-xs">Window: 23 Sep (12:00 AM – 10:00 PM IST)</span>
                <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-400 text-slate-900">22 Hours</span>
              </div>
              <h2 class="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
                <span>💰</span> Worker Payouts & Settlement Hub
              </h2>
              <p class="text-sm text-emerald-100 max-w-2xl mt-1 leading-relaxed">
                Official calculated earnings based on completed QR orders, success rates, and tier rate chart. Multi-key workers are grouped under their verified Telegram usernames.
              </p>
            </div>

            <div class="flex flex-wrap items-center gap-2.5">
              <button onclick="copyAllTelegramPayouts()" class="px-4 py-2.5 rounded-xl text-xs font-extrabold bg-white text-emerald-900 hover:bg-emerald-50 active:scale-95 shadow-md transition flex items-center gap-2">
                <svg class="w-4 h-4 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
                <span>Copy Telegram Payout List</span>
              </button>
            </div>
          </div>
        </div>

        <!-- ⚡ HIGHLIGHT PROMINENT NOTICE: ONE-TAP TO COPY KEY -->
        <div class="bg-gradient-to-r from-amber-50 via-indigo-50 to-emerald-50 border-2 border-indigo-300/80 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-wrap items-center justify-between gap-4">
          <div class="flex items-start sm:items-center gap-3.5">
            <div class="w-11 h-11 rounded-xl bg-indigo-600 text-white flex-shrink-0 flex items-center justify-center font-black text-xl shadow-md">
              ⚡
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h3 class="text-sm sm:text-base font-black text-indigo-950 uppercase tracking-wide">
                  One-Tap to Copy Any Key
                </h3>
                <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-600 text-white shadow-2xs">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span> Instant Copy
                </span>
              </div>
              <p class="text-xs sm:text-sm text-slate-700 mt-0.5">
                Every worker key badge in the table is an <b>interactive 1-tap copy chip</b>. Simply <b>click or tap any key tag</b> (e.g. <code class="bg-white px-2 py-0.5 rounded border border-indigo-200 text-indigo-700 font-mono font-bold text-xs">WORKER-...</code>) to immediately copy it to your clipboard with toast confirmation!
              </p>
            </div>
          </div>
          <div class="text-xs text-indigo-900 font-bold bg-white/80 backdrop-blur-xs px-3.5 py-2 rounded-xl border border-indigo-200 shadow-2xs flex items-center gap-2">
            <span>🖱️ Desktop: Click key</span>
            <span class="text-slate-300">|</span>
            <span>📱 Mobile: Tap key</span>
          </div>
        </div>

        <!-- Metric Cards -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-xs">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Team Payout</span>
              <span class="p-2 rounded-lg bg-emerald-50 text-emerald-600 text-base">💰</span>
            </div>
            <div class="mt-2 text-2xl sm:text-3xl font-black text-slate-900">
              ₹${settlementData23Sep.metrics.totalPayout.toLocaleString('en-IN')}
            </div>
            <div class="mt-1 text-xs text-slate-500">
              Across <b>24 People</b> (34 Active Keys)
            </div>
          </div>

          <div class="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-xs">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Orders Completed</span>
              <span class="p-2 rounded-lg bg-indigo-50 text-indigo-600 text-base">📦</span>
            </div>
            <div class="mt-2 text-2xl sm:text-3xl font-black text-indigo-600">
              ${settlementData23Sep.metrics.totalCompleted} <span class="text-sm font-semibold text-slate-400">/ ${settlementData23Sep.metrics.totalOrders}</span>
            </div>
            <div class="mt-1 text-xs text-slate-500">
              ${settlementData23Sep.metrics.totalFailed} Failed • ${settlementData23Sep.metrics.totalExpired} Expired
            </div>
          </div>

          <div class="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-xs">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Team Success Rate</span>
              <span class="p-2 rounded-lg bg-sky-50 text-sky-600 text-base">📈</span>
            </div>
            <div class="mt-2 text-2xl sm:text-3xl font-black text-sky-600">
              ${settlementData23Sep.metrics.successRate}%
            </div>
            <div class="mt-1 text-xs text-slate-500">
              Top workers achieved <b>83% – 97%</b>
            </div>
          </div>

          <div class="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-xs">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Boss Net Credited</span>
              <span class="p-2 rounded-lg bg-teal-50 text-teal-600 text-base">💵</span>
            </div>
            <div class="mt-2 text-2xl sm:text-3xl font-black text-teal-700">
              ${settlementData23Sep.bossMasi.netUsd.toFixed(2)}
            </div>
            <div class="mt-1 text-xs text-slate-500">
              Gross ${settlementData23Sep.bossMasi.grossUsd} (Penalties -${Math.abs(settlementData23Sep.bossMasi.penaltiesUsd)})
            </div>
          </div>
        </div>

        <!-- Rate Chart & Rules Reference Box -->
        <div class="bg-white rounded-xl border border-slate-200 shadow-xs p-4 sm:p-5">
          <div class="flex flex-wrap items-center justify-between gap-2 mb-3">
            <h4 class="text-xs font-black uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <span>📋</span> Rate Chart Rules Applied for 23 Sep
            </h4>
            <span class="text-xs font-semibold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
              ⚠️ Success Rate &lt; 60% = Max Capped @ ₹32/QR
            </span>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            ${settlementData23Sep.rates.map(r => `
              <div class="bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-center">
                <div class="text-sm font-bold text-slate-700">${r.emoji} ${r.range}</div>
                <div class="text-lg font-black text-indigo-600 mt-0.5">₹${r.rate} <span class="text-[11px] font-normal text-slate-500">/ QR</span></div>
              </div>
            `).join('')}
          </div>
          <p class="text-[11px] text-slate-500 mt-2.5 italic">
            * Note: All high-volume workers (20+ completed) had success rates between 83.3% and 97.0%, comfortably above 60%, earning their top rates.
          </p>
        </div>

        <!-- Controls: Search & Toggle View -->
        <div class="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs flex flex-wrap items-center justify-between gap-3">
          <!-- View Toggle -->
          <div class="flex items-center p-1 bg-slate-100 rounded-lg border border-slate-200">
            <button onclick="setPayoutsView('grouped')" class="px-3 py-1.5 rounded-md text-xs font-bold transition flex items-center gap-1.5 ${isGrouped ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'}">
              <span>👥</span>
              <span>Grouped by Telegram User (24)</span>
            </button>
            <button onclick="setPayoutsView('keys')" class="px-3 py-1.5 rounded-md text-xs font-bold transition flex items-center gap-1.5 ${!isGrouped ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'}">
              <span>🔑</span>
              <span>All 34 Worker Keys</span>
            </button>
          </div>

          <!-- Search Filter -->
          <div class="relative w-full sm:w-72">
            <input 
              type="text" 
              placeholder="Search user, @handle, key..." 
              value="${escapeHtml(state.payoutsSearch || '')}"
              oninput="setPayoutsSearch(this.value)"
              class="w-full pl-8 pr-7 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            >
            <svg class="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            ${state.payoutsSearch ? `
              <button onclick="setPayoutsSearch('')" class="absolute right-2 top-2 text-slate-400 hover:text-slate-600 text-xs font-bold">&times;</button>
            ` : ''}
          </div>
        </div>

        <!-- TABLE SECTION -->
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          ${isGrouped ? `
            <!-- Grouped Table (24 Telegram Users) -->
            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th class="py-3 px-3 w-10 text-center">#</th>
                    <th class="py-3 px-3">Telegram User</th>
                    <th class="py-3 px-3">
                      <div class="flex items-center gap-1.5">
                        <span>Assigned Keys</span>
                        <span class="px-1.5 py-0.2 rounded text-[9px] bg-indigo-100 text-indigo-700 font-extrabold">⚡ 1-Tap Copy</span>
                      </div>
                    </th>
                    <th class="py-3 px-3 text-center">Pass (Done)</th>
                    <th class="py-3 px-3 text-center">Fail / Exp</th>
                    <th class="py-3 px-3 text-center">Total</th>
                    <th class="py-3 px-3 text-center">Success %</th>
                    <th class="py-3 px-3 text-center">Rate</th>
                    <th class="py-3 px-3 text-right">Total Payout</th>
                    <th class="py-3 px-3 text-center w-20">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 text-xs">
                  ${filteredUsers.map(u => {
                    const isTopEarner = u.rank <= 3;
                    const successOk = u.successRate >= 60;
                    return `
                      <tr class="hover:bg-indigo-50/30 transition">
                        <td class="py-3 px-3 text-center font-bold ${isTopEarner ? 'text-amber-600' : 'text-slate-400'}">
                          ${u.rank === 1 ? '🥇' : u.rank === 2 ? '🥈' : u.rank === 3 ? '🥉' : u.rank}
                        </td>
                        <td class="py-3 px-3 font-semibold text-slate-900">
                          <div class="flex items-center gap-1.5">
                            <span class="font-bold">${escapeHtml(u.username)}</span>
                            ${u.username.startsWith('@') ? `
                              <button onclick="copyToClipboard('${escapeHtml(u.username)}', 'Username')" title="Copy Telegram Handle" class="text-slate-300 hover:text-sky-600 transition p-0.5">
                                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                              </button>
                            ` : ''}
                          </div>
                          ${u.displayName && u.displayName !== u.username ? `<span class="text-[10px] text-slate-400 block">${escapeHtml(u.displayName)}</span>` : ''}
                        </td>
                        <td class="py-3 px-3">
                          <div class="flex flex-wrap gap-1.5 items-center">
                            ${u.keys.map(k => `
                              <span 
                                onclick="copyToClipboard('${escapeHtml(k.key)}', 'Worker Key: ${escapeHtml(k.name)}')" 
                                title="⚡ Click to copy key: ${escapeHtml(k.key)}"
                                class="group inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-mono font-medium bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-900 border border-slate-200 hover:border-indigo-400 cursor-pointer transition shadow-2xs active:scale-95 select-none"
                              >
                                <span class="font-sans font-bold text-indigo-700">${escapeHtml(k.name)}</span>
                                <span class="text-slate-300 group-hover:text-indigo-300 font-mono">|</span>
                                <span class="text-slate-600 group-hover:text-indigo-950">${escapeHtml(k.key)}</span>
                                <span class="text-[10px] px-1 py-0.2 rounded bg-emerald-100 text-emerald-800 font-sans font-bold">${k.done}✓</span>
                                <svg class="w-3 h-3 text-slate-400 group-hover:text-indigo-600 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                              </span>
                            `).join('')}
                          </div>
                        </td>
                        <td class="py-3 px-3 text-center font-extrabold text-emerald-600">
                          ${u.done}
                        </td>
                        <td class="py-3 px-3 text-center font-semibold text-rose-500">
                          ${u.fail}
                        </td>
                        <td class="py-3 px-3 text-center text-slate-600 font-bold">
                          ${u.total}
                        </td>
                        <td class="py-3 px-3 text-center">
                          <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold ${successOk ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}">
                            ${u.successRate}%
                          </span>
                        </td>
                        <td class="py-3 px-3 text-center font-bold text-slate-700">
                          ₹${u.rate}
                        </td>
                        <td class="py-3 px-3 text-right">
                          <span class="font-black text-sm text-slate-900 bg-emerald-50 text-emerald-900 border border-emerald-200 px-2 py-0.5 rounded-md">
                            ₹${u.payout.toLocaleString('en-IN')}
                          </span>
                        </td>
                        <td class="py-3 px-3 text-center">
                          <button onclick="copyUserSummary(${u.rank})" title="Copy User Settlement Summary" class="px-2 py-1 rounded bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 border border-slate-200 text-[10px] font-bold transition">
                            📋 Copy
                          </button>
                        </td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
                <tfoot>
                  <tr class="bg-slate-100/80 font-black text-slate-900 border-t-2 border-slate-300 text-xs">
                    <td colspan="3" class="py-3 px-4 uppercase tracking-wider text-slate-700">Total Settlement (24 Workers)</td>
                    <td class="py-3 px-3 text-center text-emerald-700 text-sm font-black">${settlementData23Sep.metrics.totalCompleted}</td>
                    <td class="py-3 px-3 text-center text-rose-700 font-black">${settlementData23Sep.metrics.totalFailed + settlementData23Sep.metrics.totalExpired}</td>
                    <td class="py-3 px-3 text-center text-slate-800 font-black">${settlementData23Sep.metrics.totalOrders}</td>
                    <td class="py-3 px-3 text-center text-indigo-700 font-black">${settlementData23Sep.metrics.successRate}%</td>
                    <td class="py-3 px-3 text-center text-slate-500">—</td>
                    <td class="py-3 px-3 text-right text-base text-emerald-700 font-black">₹${settlementData23Sep.metrics.totalPayout.toLocaleString('en-IN')}</td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          ` : `
            <!-- Individual 34 Keys Table -->
            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th class="py-3 px-3">Key Name</th>
                    <th class="py-3 px-3">
                      <div class="flex items-center gap-1.5">
                        <span>Worker Key Code</span>
                        <span class="px-1.5 py-0.2 rounded text-[9px] bg-indigo-100 text-indigo-700 font-extrabold">⚡ 1-Tap Copy</span>
                      </div>
                    </th>
                    <th class="py-3 px-3">Owner / Telegram</th>
                    <th class="py-3 px-3 text-center">Pass (Done)</th>
                    <th class="py-3 px-3 text-center">Fail / Exp</th>
                    <th class="py-3 px-3 text-center">Total</th>
                    <th class="py-3 px-3 text-center">Success %</th>
                    <th class="py-3 px-3 text-center">Tier Rate</th>
                    <th class="py-3 px-3 text-right">Key Earned</th>
                    <th class="py-3 px-3 text-center w-28">Copy Key</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 text-xs">
                  ${filteredKeys.map(k => `
                    <tr class="hover:bg-indigo-50/30 transition">
                      <td class="py-3 px-3 font-bold text-slate-900">
                        ${escapeHtml(k.name)}
                      </td>
                      <td class="py-3 px-3">
                        <span 
                          onclick="copyToClipboard('${escapeHtml(k.key)}', 'Worker Key')" 
                          title="⚡ Click to copy: ${escapeHtml(k.key)}"
                          class="group inline-flex items-center gap-1.5 px-2 py-1 rounded bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-900 border border-slate-200 hover:border-indigo-400 font-mono text-[11px] font-semibold cursor-pointer transition shadow-2xs active:scale-95"
                        >
                          <span>${escapeHtml(k.key)}</span>
                          <svg class="w-3 h-3 text-slate-400 group-hover:text-indigo-600 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                        </span>
                      </td>
                      <td class="py-3 px-3 font-semibold text-slate-700">
                        ${escapeHtml(k.username)}
                      </td>
                      <td class="py-3 px-3 text-center font-extrabold text-emerald-600">
                        ${k.done}
                      </td>
                      <td class="py-3 px-3 text-center font-semibold text-rose-500">
                        ${k.fail}
                      </td>
                      <td class="py-3 px-3 text-center text-slate-600 font-bold">
                        ${k.total}
                      </td>
                      <td class="py-3 px-3 text-center">
                        <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold ${Number(k.successRate) >= 60 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}">
                          ${k.successRate}%
                        </span>
                      </td>
                      <td class="py-3 px-3 text-center font-bold text-slate-700">
                        ₹${k.userTierRate}
                      </td>
                      <td class="py-3 px-3 text-right font-black text-slate-900">
                        ₹${k.earned.toLocaleString('en-IN')}
                      </td>
                      <td class="py-3 px-3 text-center">
                        <button onclick="copyToClipboard('${escapeHtml(k.key)}', 'Key ${escapeHtml(k.name)}')" title="One-Tap Copy" class="px-2.5 py-1 rounded-md bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white font-bold text-[10px] border border-indigo-200 hover:border-transparent transition flex items-center justify-center gap-1 mx-auto active:scale-95 shadow-2xs">
                          <span>⚡ Copy</span>
                        </button>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          `}
        </div>
      </div>
    `;

    container.innerHTML = html;
  }


  // ==========================================
  // PANEL 2: ALL WORKER KEYS (MASI TABLE)
  // ==========================================
  function renderKeysPanel(container) {
    const allWorkers = state.workers;
    const workers = filterWorkers(allWorkers);

    let html = `
      <div class="space-y-6">
        <!-- Header -->
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6 bg-gradient-to-r from-sky-50/50 via-indigo-50/30 to-white flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 class="text-xl font-extrabold text-slate-800 flex items-center gap-2">
              <svg class="w-6 h-6 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path></svg>
              All Worker Keys (${workers.length} of ${allWorkers.length})
            </h2>
            <p class="text-sm text-slate-500 mt-1">
              Extracted from <code>masi.cc.cd/boss</code>. Copy keys, customize success rates, or assign keys to guy profiles.
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <button onclick="openTeamAssignModal()" class="px-3.5 py-2 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition flex items-center gap-1.5">
              <span>👥</span> Group by Guy
            </button>
            <button onclick="openMasiModal()" class="px-3 py-2 rounded-lg text-xs font-bold bg-violet-600 hover:bg-violet-700 text-white shadow-sm transition flex items-center gap-1.5">
              <span>⚡</span> Sync Masi Boss
            </button>
            <button onclick="openAddWorkerModal()" class="px-3 py-2 rounded-lg text-xs font-bold bg-sky-600 hover:bg-sky-700 text-white shadow-sm transition flex items-center gap-1">
              <span>+</span> New Key
            </button>
          </div>
        </div>

        <!-- Keys Table Container -->
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead class="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th class="py-3.5 px-4 font-bold">Worker & Guy Name</th>
                  <th class="py-3.5 px-4 font-bold">Worker Key</th>
                  <th class="py-3.5 px-4 font-bold">Telegram (@...)</th>
                  <th class="py-3.5 px-4 font-bold text-center">Completed Orders</th>
                  <th class="py-3.5 px-4 font-bold text-center">Today Done</th>
                  <th class="py-3.5 px-4 font-bold text-center">Success Rate %</th>
                  <th class="py-3.5 px-4 font-bold text-center">Status</th>
                  <th class="py-3.5 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
    `;

    if (workers.length === 0) {
      html += `
        <tr>
          <td colspan="8" class="py-8 text-center text-slate-500 text-xs">
            No worker keys match your search query.
          </td>
        </tr>
      `;
    }

    workers.forEach(w => {
      const isCustomRate = w.customSuccessRate !== null && w.customSuccessRate !== undefined && w.customSuccessRate !== '';
      const displayRate = isCustomRate ? Number(w.customSuccessRate).toFixed(1) : (w.successRate !== undefined ? Number(w.successRate).toFixed(1) : '0.0');
      const rateNum = Number(displayRate) || 0;

      let badgeClass = 'text-slate-700 bg-slate-100';
      if (rateNum >= 80) badgeClass = 'text-emerald-800 bg-emerald-100';
      else if (rateNum >= 50) badgeClass = 'text-amber-800 bg-amber-100';
      else if (rateNum > 0) badgeClass = 'text-rose-800 bg-rose-100';

      const completed = Number(w.completedOrders) || 0;
      const todayDone = Number(w.todayDone) || 0;
      const paidCount = Math.min(completed, Number(w.paidCount) || (w.paymentStatus === 'paid' ? completed : 0));
      const leftover = Math.max(0, completed - paidCount);
      const isPaidKey = completed > 0 && paidCount >= completed;
      const hasPendingReq = w.payoutRequestStatus === 'pending';
      const requested = Number(w.payoutRequestedOrders) || 0;

      html += `
        <tr class="hover:bg-slate-50/80 transition group ${isPaidKey ? 'paid-row-settled' : ''}">
          <!-- Worker / Guy -->
          <td class="py-3 px-4">
            <div class="font-bold text-slate-900 ${isPaidKey ? 'paid-strike-bar' : ''}">${escapeHtml(w.name || 'Worker')}</div>
            ${w.personName && w.personName !== w.name ? `
              <div class="text-[11px] text-indigo-600 font-medium">👤 ${escapeHtml(w.personName)}</div>
            ` : ''}
          </td>

          <!-- Worker Key with Copy & Drag -->
          <td class="py-3 px-4 font-mono text-xs">
            <div draggable="true" ondragstart="handleKeyDragStart(event, '${escapeHtml(w.key)}')" ondragend="handleKeyDragEnd(event)" title="Drag onto another worker, or throw left to reset to original form" class="inline-flex items-center gap-1.5 px-2 py-1 rounded ${isPaidKey ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200'} border cursor-grab active:cursor-grabbing hover:border-indigo-400 transition">
              <span class="text-slate-300 select-none text-[9px]">⋮⋮</span>
              <span class="font-semibold ${isPaidKey ? 'line-through text-slate-400' : 'text-slate-800'}">${escapeHtml(w.key)}</span>
              <button onclick="copyToClipboard('${escapeHtml(w.key)}', 'Key')" title="Copy Key" class="text-slate-400 hover:text-indigo-600 p-0.5">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
              </button>
            </div>
          </td>

          <!-- Telegram Username -->
          <td class="py-3 px-4 text-xs font-mono">
            ${w.telegramUsername ? `
              <a href="https://t.me/${w.telegramUsername.replace('@', '')}" target="_blank" class="text-sky-600 hover:underline font-semibold flex items-center gap-1">
                <span>💬</span> ${escapeHtml(w.telegramUsername)}
              </a>
            ` : `
              <button onclick="openSetTgModal('worker:' + '${escapeHtml(w.key.toLowerCase())}', '${escapeHtml(w.name || w.key)}')" class="text-slate-400 hover:text-sky-600 text-[11px]">
                + Add @tg
              </button>
            `}
          </td>

          <!-- Completed Orders -->
          <td class="py-3 px-4 text-center font-bold text-emerald-700 font-mono">
            <span class="${isPaidKey ? 'line-through opacity-60' : ''}">${completed}</span>
          </td>

          <!-- Today Done -->
          <td class="py-3 px-4 text-center font-semibold text-sky-700 font-mono">
            ${todayDone}
          </td>

          <!-- Success Rate % -->
          <td class="py-3 px-4 text-center">
            <span class="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${badgeClass}">
              ${displayRate}%
            </span>
            ${isCustomRate ? `<span class="block text-[10px] text-indigo-600 font-medium mt-0.5">Admin Decided</span>` : ''}
          </td>

          <!-- Status -->
          <td class="py-3 px-4 text-center">
            ${isPaidKey ? `
              <span class="inline-flex items-center gap-1 text-[11px] font-black text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-full font-mono">
                <span>✓</span> ${paidCount}/${completed} Settled
              </span>
            ` : (paidCount > 0 ? `
              <span class="inline-flex items-center gap-1 text-[11px] font-bold text-sky-800 bg-sky-100 border border-sky-300 px-2 py-0.5 rounded-full font-mono" title="${leftover} leftover orders to settle">
                <span>⚡</span> ${paidCount}/${completed} (${leftover} left)
              </span>
            ` : (completed > 0 ? `
              <span class="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-full font-mono">
                <span>⏳</span> 0/${completed} Unpaid
              </span>
            ` : `
              <span class="text-[11px] text-slate-400 font-mono font-medium">0/0</span>
            `))}
            ${hasPendingReq ? `
              <div class="mt-1">
                <span class="inline-flex items-center gap-1 text-[10px] font-black text-amber-700 bg-amber-50 border border-amber-300 px-1.5 py-0.5 rounded animate-pulse">
                  <span>🔔</span> Req: ${requested > 0 ? requested : leftover}
                </span>
              </div>
            ` : ''}
          </td>

          <!-- Actions -->
          <td class="py-3 px-4 text-right whitespace-nowrap">
            <div class="flex items-center justify-end gap-1.5">
              ${(!isPaidKey && completed > 0) ? `
                <button onclick="markWorkerPaid('${w.id}')" title="Mark this key as paid / complete" class="px-2.5 py-1 text-xs font-bold rounded bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition flex items-center gap-1">
                  <span>✓</span> Mark Paid
                </button>
              ` : ''}
              ${(isPaidKey && completed > 0) ? `
                <button onclick="unmarkWorkerPaid('${w.id}')" title="Reset payment to unpaid" class="px-2 py-1 text-xs font-semibold rounded bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition flex items-center gap-1">
                  <span>↩</span> Unpay
                </button>
              ` : ''}
              <button onclick="openSendMsgModal('${w.id}', '${escapeHtml(w.name || '')}', '${escapeHtml(w.telegramUsername || '')}')" title="Send direct Telegram message" class="px-2 py-1 text-xs font-bold rounded bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 transition flex items-center gap-1">
                <span>💬</span> Msg
              </button>
              <button onclick="openQuickTgModal('${escapeHtml(w.key)}', '${escapeHtml(w.personName || w.name || '')}')" title="Quick Connect to Telegram" class="px-2 py-1 text-xs font-semibold rounded bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition flex items-center gap-1">
                <span>✈️</span> TG
              </button>
              <button onclick="openDecideRateModal('${w.id}')" title="Set Success Rate" class="px-2 py-1 text-xs font-semibold rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition">
                🎯 Rate
              </button>
              <button onclick="editWorkerKey('${w.id}')" title="Edit Worker Key" class="p-1 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100 transition">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
              </button>
              <button onclick="deleteWorkerKey('${w.id}')" title="Delete Key" class="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50 transition">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
              </button>
            </div>
          </td>
        </tr>
      `;
    });

    html += `
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;

    container.innerHTML = html;
  }

  // ==========================================
  // MULTI-KEY TEAM ASSIGNMENT MODAL
  // ==========================================
  window.openTeamAssignModal = function() {
    const modal = document.getElementById('team-assign-modal');
    if (!modal) return;
    modal.classList.remove('hidden');
    switchTeamAssignTab('paste');
  };

  window.closeTeamAssignModal = function() {
    const modal = document.getElementById('team-assign-modal');
    if (modal) modal.classList.add('hidden');
  };

  window.switchTeamAssignTab = function(tab) {
    state.teamAssignTab = tab;
    const btnPaste = document.getElementById('btn-tab-assign-paste');
    const btnSearch = document.getElementById('btn-tab-assign-search');
    const panelPaste = document.getElementById('panel-assign-paste');
    const panelSearch = document.getElementById('panel-assign-search');

    if (tab === 'paste') {
      if (btnPaste) btnPaste.className = 'px-4 py-2 text-xs font-bold border-b-2 border-indigo-600 text-indigo-700 transition';
      if (btnSearch) btnSearch.className = 'px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition';
      if (panelPaste) panelPaste.classList.remove('hidden');
      if (panelSearch) panelSearch.classList.add('hidden');
    } else {
      if (btnPaste) btnPaste.className = 'px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition';
      if (btnSearch) btnSearch.className = 'px-4 py-2 text-xs font-bold border-b-2 border-indigo-600 text-indigo-700 transition';
      if (panelPaste) panelPaste.classList.add('hidden');
      if (panelSearch) panelSearch.classList.remove('hidden');
      renderTeamAssignTable();
    }
  };

  window.parseTeamAssignText = function() {
    const textarea = document.getElementById('team-assign-textarea');
    const preview = document.getElementById('team-assign-preview');
    if (!textarea || !preview) return;

    const lines = textarea.value.split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length === 0) {
      preview.innerHTML = `<span class="text-slate-400">Preview will appear here as you type or paste...</span>`;
      return;
    }

    const mappings = parseLinesToMappings(lines);
    const guyGroups = new Map();
    mappings.forEach(m => {
      const gname = m.telegramUsername || m.personName || 'Unassigned';
      if (!guyGroups.has(gname)) guyGroups.set(gname, []);
      guyGroups.get(gname).push(m);
    });

    let html = `
      <div class="space-y-2">
        <div class="text-xs font-bold text-indigo-700 flex items-center justify-between">
          <span>Found ${mappings.length} key assignments (${guyGroups.size} Guys)</span>
          <span class="text-emerald-600 font-semibold">Ready to save</span>
        </div>
    `;

    guyGroups.forEach((keys, guyName) => {
      html += `
        <div class="bg-white p-2.5 rounded border border-slate-200 text-[11px] space-y-1">
          <div class="font-bold text-slate-800 flex items-center gap-1.5">
            <span>👤 ${escapeHtml(guyName)}</span>
            <span class="text-slate-400">(${keys.length} ${keys.length === 1 ? 'key' : 'keys'})</span>
          </div>
          <div class="font-mono text-slate-600 pl-4 space-y-0.5">
            ${keys.map(k => `<div>• <span class="text-indigo-600 font-semibold">${escapeHtml(k.key)}</span> ${k.personName ? `(${escapeHtml(k.personName)})` : ''}</div>`).join('')}
          </div>
        </div>
      `;
    });

    html += `</div>`;
    preview.innerHTML = html;
  };

  function parseLinesToMappings(lines) {
    const mappings = [];
    lines.forEach(line => {
      const tokens = line.split(/[\s,]+/).filter(Boolean);
      if (tokens.length === 0) return;

      let key = '';
      let tg = '';
      let personName = '';

      tokens.forEach(tok => {
        if (tok.toUpperCase().startsWith('WORKER-') || tok.toUpperCase().startsWith('KEY-') || tok.length >= 15) {
          key = tok.toUpperCase();
        } else if (tok.startsWith('@')) {
          tg = tok;
        } else if (!personName) {
          personName = tok;
        } else {
          personName += ' ' + tok;
        }
      });

      if (key) {
        mappings.push({ key, telegramUsername: tg, personName });
      }
    });
    return mappings;
  }

  window.saveTeamAssignments = async function() {
    const textarea = document.getElementById('team-assign-textarea');
    if (!textarea) return;

    const lines = textarea.value.split('\n').map(l => l.trim()).filter(Boolean);
    const mappings = parseLinesToMappings(lines);

    if (mappings.length === 0) {
      showToast('No valid keys found to assign', 'warning');
      return;
    }

    if (state.isApiOnline) {
      try {
        const res = await fetch(`${API_BASE}/workers/batch-assign-telegram`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mappings })
        });
        const result = await res.json();
        if (result.success) {
          await fetchServerState();
          closeTeamAssignModal();
          showToast(`Successfully grouped ${result.updated} keys under their guys!`, 'success');
          return;
        }
      } catch (e) {
        console.error(e);
      }
    }

    // LocalStorage fallback
    let updated = 0;
    mappings.forEach(m => {
      const w = state.workers.find(wk => wk.key.toUpperCase() === m.key.toUpperCase());
      if (w) {
        if (m.telegramUsername) w.telegramUsername = m.telegramUsername;
        if (m.personName) w.personName = m.personName;
        updated++;
      }
    });

    saveToLocalStorage();
    render();
    closeTeamAssignModal();
    showToast(`Assigned ${updated} keys!`, 'success');
  };

  window.renderTeamAssignTable = function() {
    const tbody = document.getElementById('team-assign-table-body');
    const filterInput = document.getElementById('team-assign-filter');
    if (!tbody) return;

    const q = (filterInput ? filterInput.value : '').toLowerCase().trim();
    const list = state.workers.filter(w =>
      !q || (w.name && w.name.toLowerCase().includes(q)) ||
      (w.key && w.key.toLowerCase().includes(q)) ||
      (w.telegramUsername && w.telegramUsername.toLowerCase().includes(q)) ||
      (w.personName && w.personName.toLowerCase().includes(q))
    ).slice(0, 60);

    tbody.innerHTML = list.map(w => `
      <tr class="hover:bg-slate-50">
        <td class="p-2.5">
          <div class="font-bold text-slate-800">${escapeHtml(w.name)}</div>
          <div class="font-mono text-[10px] text-slate-500">${escapeHtml(w.key)}</div>
        </td>
        <td class="p-2.5">
          <input type="text" value="${escapeHtml(w.telegramUsername || '')}" placeholder="@telegram" onchange="quickAssignSingleKey('${w.key}', this.value, null)" class="px-2 py-1 text-xs border border-slate-300 rounded font-mono w-32 focus:ring-1 focus:ring-indigo-500">
        </td>
        <td class="p-2.5">
          <input type="text" value="${escapeHtml(w.personName || w.name)}" placeholder="Guy Name" onchange="quickAssignSingleKey('${w.key}', null, this.value)" class="px-2 py-1 text-xs border border-slate-300 rounded w-28 focus:ring-1 focus:ring-indigo-500">
        </td>
      </tr>
    `).join('');
  };

  window.quickAssignSingleKey = async function(key, tg, personName) {
    const worker = state.workers.find(w => w.key.toUpperCase() === key.toUpperCase());
    if (!worker) return;

    if (tg !== null) worker.telegramUsername = tg ? (tg.startsWith('@') ? tg : '@' + tg) : null;
    if (personName !== null) worker.personName = personName ? personName.trim() : worker.name;

    if (state.isApiOnline) {
      try {
        await fetch(`${API_BASE}/workers/assign-telegram`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            key: worker.key,
            telegramUsername: worker.telegramUsername,
            personName: worker.personName
          })
        });
      } catch (e) {
        console.error(e);
      }
    }

    saveToLocalStorage();
    renderKPIs();
    showToast(`Updated assignment for ${worker.key}`, 'success');
  };

  // ==========================================
  // ADMIN DECIDES SUCCESS RATE MODAL
  // ==========================================
  window.openDecideRateModal = function(workerId) {
    const worker = state.workers.find(w => w.id === workerId);
    if (!worker) return;

    const modal = document.getElementById('decide-rate-modal');
    const inputId = document.getElementById('decide-rate-worker-id');
    const nameEl = document.getElementById('decide-rate-worker-name');
    const inputRate = document.getElementById('decide-rate-input');

    if (modal && inputId && nameEl && inputRate) {
      inputId.value = worker.id;
      nameEl.textContent = `${worker.personName || worker.name} (${worker.key})`;
      inputRate.value = worker.customSuccessRate !== undefined && worker.customSuccessRate !== null ? worker.customSuccessRate : (worker.successRate || '');
      modal.classList.remove('hidden');
    }
  };

  window.closeDecideRateModal = function() {
    const modal = document.getElementById('decide-rate-modal');
    if (modal) modal.classList.add('hidden');
  };

  window.saveDecidedRate = async function() {
    const id = document.getElementById('decide-rate-worker-id').value;
    const rateVal = document.getElementById('decide-rate-input').value;
    const worker = state.workers.find(w => w.id === id);
    if (!worker) return;

    const customRate = rateVal === '' ? null : Number(rateVal);
    worker.customSuccessRate = customRate;

    if (state.isApiOnline) {
      try {
        await fetch(`${API_BASE}/workers/${id}/set-rate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ customSuccessRate: customRate })
        });
      } catch (e) {
        console.error(e);
      }
    }

    saveToLocalStorage();
    render();
    closeDecideRateModal();
    showToast(`Success rate for ${worker.name} set to ${customRate !== null ? customRate + '%' : 'Auto calculated'}!`, 'success');
  };

  window.resetToAutoRate = function() {
    const inputRate = document.getElementById('decide-rate-input');
    if (inputRate) {
      inputRate.value = '';
      saveDecidedRate();
    }
  };

  // ==========================================
  // MASI BOSS EXTRACTOR MODAL
  // ==========================================
  window.openMasiModal = function() {
    const modal = document.getElementById('masi-modal');
    if (modal) modal.classList.remove('hidden');
  };

  window.closeMasiModal = function() {
    const modal = document.getElementById('masi-modal');
    if (modal) modal.classList.add('hidden');
  };

  window.extractFromMasi = async function() {
    const key = (document.getElementById('masi-boss-key').value || '').trim();
    const btn = document.getElementById('btn-masi-fetch');
    const syncBtn = document.getElementById('btn-masi-sync');
    const previewDiv = document.getElementById('masi-extract-preview');
    if (!key) {
      showToast('Please enter a Boss Key', 'warning');
      return;
    }

    btn.disabled = true;
    btn.innerHTML = `<span style="display:inline-block;animation:spin 1s linear infinite">↻</span> Extracting...`;
    if (previewDiv) previewDiv.innerHTML = `<span class="text-indigo-500 font-semibold">⏳ Connecting to masi.cc.cd...</span>`;

    try {
      const res = await fetch(`${API_BASE}/masi/extract`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bossKey: key })
      });
      const data = await res.json();
      btn.disabled = false;
      btn.innerHTML = 'Extract Data';

      if (data.success && data.workers) {
        window.__tempMasiWorkers = data.workers;
        window.__tempMasiOverview = data.overview;
        if (syncBtn) syncBtn.disabled = false;
        const withOrders = data.workers.filter(w => (Number(w.completedOrders) || Number(w.completedCount) || 0) > 0);
        const totalCompleted = data.workers.reduce((s, w) => s + (Number(w.completedOrders) || Number(w.completedCount) || 0), 0);
        if (previewDiv) {
          previewDiv.innerHTML = `
            <div class="flex gap-4 flex-wrap mb-3">
              <div class="bg-indigo-50 border border-indigo-200 rounded-lg px-3 py-2 text-center">
                <div class="text-lg font-black text-indigo-700">${data.workers.length}</div>
                <div class="text-[10px] text-indigo-500 uppercase font-bold">Total Workers</div>
              </div>
              <div class="bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 text-center">
                <div class="text-lg font-black text-emerald-700">${withOrders.length}</div>
                <div class="text-[10px] text-emerald-500 uppercase font-bold">With Orders</div>
              </div>
              <div class="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-center">
                <div class="text-lg font-black text-amber-700">${totalCompleted}</div>
                <div class="text-[10px] text-amber-500 uppercase font-bold">Total Completed</div>
              </div>
            </div>
            <div class="text-emerald-600 font-bold mb-1">✓ Ready to sync ${data.workers.length} workers! Click "Sync & Import" below.</div>
            <div class="max-h-32 overflow-y-auto text-[11px] text-slate-500">
              ${withOrders.slice(0, 10).map(w => `<div>• <b>${w.name}</b> — ${w.completedOrders || w.completedCount || 0} done (${(w.successRate || 0).toFixed(1)}%)</div>`).join('')}
              ${withOrders.length > 10 ? `<div class="text-slate-400">...and ${withOrders.length - 10} more</div>` : ''}
            </div>`;
        }
        showToast(`Extracted ${data.workers.length} workers from masi.cc.cd!`, 'success');
      } else {
        if (previewDiv) previewDiv.innerHTML = `<span class="text-red-500 font-semibold">❌ ${data.error || 'Failed to extract from Masi'}</span>`;
        showToast(data.error || 'Failed to extract from Masi', 'danger');
      }
    } catch (e) {
      btn.disabled = false;
      btn.innerHTML = 'Extract Data';
      if (previewDiv) previewDiv.innerHTML = `<span class="text-red-500 font-semibold">❌ Error connecting to server</span>`;
      showToast('Error connecting to Masi endpoint', 'danger');
    }
  };

  window.syncMasiToDashboard = async function() {
    if (!window.__tempMasiWorkers || window.__tempMasiWorkers.length === 0) {
      showToast('Extract workers first', 'warning');
      return;
    }

    const syncBtn = document.getElementById('btn-masi-sync');
    syncBtn.disabled = true;
    syncBtn.textContent = 'Syncing...';

    try {
      const res = await fetch(`${API_BASE}/masi/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          masiWorkers: window.__tempMasiWorkers,
          masiOverview: window.__tempMasiOverview
        })
      });
      const result = await res.json();
      syncBtn.disabled = false;
      syncBtn.textContent = 'Sync & Import to Dashboard';

      if (result.success) {
        await fetchServerState();
        closeMasiModal();
        showToast(`Synced ${result.totalWorkers} workers from Masi to Dashboard!`, 'success');
      }
    } catch (e) {
      syncBtn.disabled = false;
      syncBtn.textContent = 'Sync & Import to Dashboard';
      showToast('Error syncing Masi data', 'danger');
    }
  };

  // ==========================================
  // ADD / EDIT WORKER KEY MODAL
  // ==========================================
  window.openAddWorkerModal = function() {
    const modal = document.getElementById('worker-modal');
    if (!modal) return;
    document.getElementById('edit-worker-id').value = '';
    document.getElementById('input-new-worker-name').value = '';
    regenerateRandomKey();
    modal.classList.remove('hidden');
  };

  window.closeWorkerModal = function() {
    const modal = document.getElementById('worker-modal');
    if (modal) modal.classList.add('hidden');
  };

  window.autoGenerateKey = function(name) {
    const keyInput = document.getElementById('input-new-worker-key');
    if (!keyInput || keyInput.dataset.manual === 'true') return;
    const clean = (name || 'WORKER').replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 6) || 'WORKER';
    const rand = Math.floor(1000 + Math.random() * 9000);
    keyInput.value = `KEY-${clean}-${rand}`;
  };

  window.regenerateRandomKey = function() {
    const keyInput = document.getElementById('input-new-worker-key');
    const name = document.getElementById('input-new-worker-name').value || 'WORKER';
    const clean = name.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 6) || 'WORKER';
    const rand = Math.floor(1000 + Math.random() * 9000);
    keyInput.value = `KEY-${clean}-${rand}`;
    keyInput.dataset.manual = 'false';
  };

  window.saveWorkerKey = async function() {
    const id = document.getElementById('edit-worker-id').value;
    const name = (document.getElementById('input-new-worker-name').value || '').trim();
    const key = (document.getElementById('input-new-worker-key').value || '').trim().toUpperCase();
    const rate = Number(document.getElementById('input-new-worker-rate').value) || 15.00;
    const customRateVal = document.getElementById('input-new-worker-success-rate').value;
    const customSuccessRate = customRateVal === '' ? null : Number(customRateVal);

    if (!name || !key) {
      showToast('Worker Name and Key are required', 'warning');
      return;
    }

    if (id) {
      // Edit existing
      const w = state.workers.find(wk => wk.id === id);
      if (w) {
        w.name = name;
        w.key = key;
        w.rate = rate;
        w.customSuccessRate = customSuccessRate;
      }
    } else {
      // Add new
      state.workers.unshift({
        id: `w-${Date.now()}`,
        name,
        key,
        rate,
        customSuccessRate,
        completedOrders: 0,
        failCount: 0,
        successRate: 0,
        telegramId: null,
        telegramUsername: null,
        status: 'active'
      });
    }

    if (state.isApiOnline) {
      try {
        if (id) {
          await fetch(`${API_BASE}/workers/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, key, rate, customSuccessRate })
          });
        } else {
          await fetch(`${API_BASE}/workers`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, key, rate, customSuccessRate })
          });
        }
      } catch (e) {
        console.error(e);
      }
    }

    saveToLocalStorage();
    render();
    closeWorkerModal();
    showToast(`Worker key ${key} saved successfully!`, 'success');
  };

  window.editWorkerKey = function(workerId) {
    const w = state.workers.find(wk => wk.id === workerId);
    if (!w) return;
    openAddWorkerModal();
    document.getElementById('edit-worker-id').value = w.id;
    document.getElementById('input-new-worker-name').value = w.name;
    document.getElementById('input-new-worker-key').value = w.key;
    document.getElementById('input-new-worker-rate').value = w.rate || 15.00;
    document.getElementById('input-new-worker-success-rate').value = w.customSuccessRate !== undefined && w.customSuccessRate !== null ? w.customSuccessRate : '';
  };

  window.deleteWorkerKey = async function(workerId) {
    const w = state.workers.find(wk => wk.id === workerId);
    if (!w) return;
    if (!confirm(`Are you sure you want to delete worker key "${w.key}" (${w.name})?`)) return;

    state.workers = state.workers.filter(wk => wk.id !== workerId);

    if (state.isApiOnline) {
      try {
        await fetch(`${API_BASE}/workers/${workerId}`, { method: 'DELETE' });
      } catch (e) {
        console.error(e);
      }
    }

    saveToLocalStorage();
    render();
    showToast(`Deleted key ${w.key}`, 'info');
  };

  // ==========================================
  // BOT CONFIG MODAL
  // ==========================================

  // ==========================================
  // QUICK TELEGRAM CONNECT MODAL
  // ==========================================
  window.openQuickTgModal = function(prefillKey = '', prefillGuy = '') {
    const modal = document.getElementById('quick-tg-modal');
    if (!modal) return;

    // Populate Datalist with all workers for quick autocomplete
    const datalist = document.getElementById('quickTgWorkerList');
    if (datalist) {
      datalist.innerHTML = state.workers.map(w => {
        const guyLabel = w.personName && w.personName !== w.name ? ` (${w.personName})` : '';
        const tgLabel = w.telegramUsername ? ` [${w.telegramUsername}]` : '';
        return `<option value="${escapeHtml(w.key)}">${escapeHtml(w.name || 'Worker')}${guyLabel}${tgLabel}</option>`;
      }).join('');
    }

    const keyInput = document.getElementById('quick-tg-key-input');
    const guyInput = document.getElementById('quick-tg-guy-name');
    const tgInput = document.getElementById('quick-tg-username');
    const botTokenInput = document.getElementById('quick-tg-bot-token');

    if (keyInput) keyInput.value = prefillKey || '';
    if (guyInput) guyInput.value = prefillGuy || '';
    if (botTokenInput) botTokenInput.value = state.settings.botToken || '';

    // If prefillKey provided, look up existing worker data
    if (prefillKey) {
      const match = state.workers.find(w => w.key.toUpperCase() === prefillKey.toUpperCase());
      if (match) {
        if (tgInput && match.telegramUsername) tgInput.value = match.telegramUsername;
        if (guyInput && !prefillGuy && (match.personName || match.name)) {
          guyInput.value = match.personName || match.name;
        }
      }
    } else if (tgInput) {
      tgInput.value = '';
    }

    switchQuickTgTab('worker');
    updateQuickTgInvitePreview();
    modal.classList.remove('hidden');
  };

  window.closeQuickTgModal = function() {
    const modal = document.getElementById('quick-tg-modal');
    if (modal) modal.classList.add('hidden');
  };

  window.switchQuickTgTab = function(tab) {
    const workerPanel = document.getElementById('quick-tg-panel-worker');
    const botPanel = document.getElementById('quick-tg-panel-bot');
    const workerBtn = document.getElementById('btn-quick-tg-worker');
    const botBtn = document.getElementById('btn-quick-tg-bot');

    if (tab === 'worker') {
      if (workerPanel) workerPanel.classList.remove('hidden');
      if (botPanel) botPanel.classList.add('hidden');
      if (workerBtn) {
        workerBtn.className = 'pb-2.5 border-b-2 border-sky-600 text-sky-700 transition font-bold';
      }
      if (botBtn) {
        botBtn.className = 'pb-2.5 border-b-2 border-transparent text-slate-500 hover:text-slate-800 transition font-bold';
      }
    } else if (tab === 'bot') {
      if (workerPanel) workerPanel.classList.add('hidden');
      if (botPanel) botPanel.classList.remove('hidden');
      if (workerBtn) {
        workerBtn.className = 'pb-2.5 border-b-2 border-transparent text-slate-500 hover:text-slate-800 transition font-bold';
      }
      if (botBtn) {
        botBtn.className = 'pb-2.5 border-b-2 border-sky-600 text-sky-700 transition font-bold';
      }
    }
  };

  window.onQuickTgKeySelected = function(val) {
    val = (val || '').trim();
    if (!val) {
      updateQuickTgInvitePreview();
      return;
    }

    const match = state.workers.find(w => 
      w.key.toUpperCase() === val.toUpperCase() || 
      (w.name && w.name.toLowerCase() === val.toLowerCase()) ||
      (w.personName && w.personName.toLowerCase() === val.toLowerCase())
    );

    if (match) {
      const keyInput = document.getElementById('quick-tg-key-input');
      const guyInput = document.getElementById('quick-tg-guy-name');
      const tgInput = document.getElementById('quick-tg-username');

      if (keyInput && keyInput.value !== match.key) keyInput.value = match.key;
      if (guyInput && !guyInput.value) guyInput.value = match.personName || match.name || '';
      if (tgInput && match.telegramUsername) tgInput.value = match.telegramUsername;
    }

    updateQuickTgInvitePreview();
  };

  window.updateQuickTgInvitePreview = function() {
    const keyInput = document.getElementById('quick-tg-key-input');
    const inviteText = document.getElementById('quick-tg-invite-text');
    if (!inviteText) return;

    const rawKey = keyInput ? keyInput.value.trim() : '';
    const key = rawKey || 'YOUR_KEY';
    const botName = state.settings.botUsername || state.botStatus.botUsername || '';

    if (botName) {
      inviteText.textContent = `https://t.me/${botName.replace('@', '')}?start=link_${encodeURIComponent(key)}`;
    } else {
      inviteText.textContent = `https://t.me/share/url?text=/link%20${encodeURIComponent(key)}`;
    }
  };

  window.copyQuickTgInviteLink = function() {
    const inviteText = document.getElementById('quick-tg-invite-text');
    if (!inviteText) return;
    const url = inviteText.textContent.trim();
    const fullInvite = `📢 Step 1: Join our Official Channel 1st:\nhttps://t.me/madmax00711\n\n🤖 Step 2: Connect your key to the Bot:\n${url}`;
    copyToClipboard(fullInvite, 'Worker Invite & Channel Instructions');
  };

  window.saveQuickTgWorkerLink = async function() {
    const keyInput = document.getElementById('quick-tg-key-input');
    const tgInput = document.getElementById('quick-tg-username');
    const guyInput = document.getElementById('quick-tg-guy-name');

    const key = (keyInput ? keyInput.value : '').trim();
    let tg = (tgInput ? tgInput.value : '').trim();
    const guy = (guyInput ? guyInput.value : '').trim();

    if (!key) {
      showToast('Please specify a worker key', 'warning');
      return;
    }

    if (tg && !tg.startsWith('@')) {
      tg = '@' + tg;
    }

    const mapping = {
      key: key,
      telegramUsername: tg,
      personName: guy || undefined
    };

    // Save to API if online
    if (state.isApiOnline) {
      try {
        const res = await fetch(`${API_BASE}/workers/batch-assign-telegram`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mappings: [mapping] })
        });
        const result = await res.json();
        if (result.success) {
          await fetchServerState();
          closeQuickTgModal();
          showToast(`Linked key ${key} to ${tg || guy || 'profile'}!`, 'success');
          return;
        }
      } catch (err) {
        console.error('API batch-assign failed:', err);
      }
    }

    // LocalStorage fallback
    const target = state.workers.find(w => w.key.toUpperCase() === key.toUpperCase());
    if (target) {
      if (tg) target.telegramUsername = tg;
      if (guy) target.personName = guy;
    } else {
      state.workers.push({
        id: 'worker-' + Date.now(),
        name: guy || `Worker ${key.slice(0, 8)}`,
        key: key,
        telegramUsername: tg,
        personName: guy || 'Worker',
        completedOrders: 0,
        successRate: 0,
        rate: 15.00,
        createdAt: new Date().toISOString()
      });
    }

    saveToLocalStorage();
    render();
    closeQuickTgModal();
    showToast(`Linked key ${key} to ${tg || guy || 'profile'}!`, 'success');
  };

  window.saveQuickTgBotToken = async function() {
    const input = document.getElementById('quick-tg-bot-token');
    const token = (input ? input.value : '').trim();
    if (!token) {
      showToast('Please enter a Bot Token', 'warning');
      return;
    }

    await applyBotToken(token);
    closeQuickTgModal();
  };

  window.openBotConfigModal = function() {
    const modal = document.getElementById('bot-config-modal');
    if (modal) modal.classList.remove('hidden');
    const input = document.getElementById('input-bot-token');
    if (input) input.value = state.settings.botToken || '';
  };

  window.closeBotConfigModal = function() {
    const modal = document.getElementById('bot-config-modal');
    if (modal) modal.classList.add('hidden');
  };

  window.saveBotToken = async function() {
    const input = document.getElementById('input-bot-token');
    const token = (input ? input.value : '').trim();
    await applyBotToken(token);
    closeBotConfigModal();
  };

  window.saveBotTokenFromTab = async function() {
    const input = document.getElementById('tab-bot-token-input');
    const token = (input ? input.value : '').trim();
    await applyBotToken(token);
  };

  async function applyBotToken(token) {
    state.settings.botToken = token;
    saveToLocalStorage();

    if (state.isApiOnline) {
      try {
        const res = await fetch(`${API_BASE}/bot/config`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ botToken: token })
        });
        const data = await res.json();
        if (data.success) {
          state.botStatus = data.botStatus || {};
          showToast(`Telegram bot connected: @${data.botUsername}!`, 'success');
        } else {
          showToast(data.error || 'Failed to connect bot', 'danger');
        }
      } catch (e) {
        showToast('Error configuring bot', 'danger');
      }
    } else {
      showToast('Bot token saved locally', 'info');
    }
    updateBotStatusPill();
    render();
  }

  // ==========================================
  // EXPORTS (CSV / JSON)
  // ==========================================
  window.exportCSV = function() {
    const guys = getGroupedGuys();
    const rows = [
      ['Guy / Person Name', 'Telegram Username', 'Keys Count', 'Keys List', 'Completed Orders', 'Today Done', '7-Day Done', 'Success Rate %', 'Settlement Status']
    ];

    guys.forEach(g => {
      rows.push([
        g.displayName,
        g.telegramUsername || 'N/A',
        g.keys.length,
        g.keys.map(k => k.key).join('; '),
        g.completedOrders,
        g.todayDone,
        g.d7Done,
        g.successRate + '%',
        g.isSettled ? 'Paid & Settled' : (g.completedOrders > 0 ? 'Unpaid' : 'No Orders')
      ]);
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `masi-team-report-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported team performance report to CSV', 'success');
  };

  window.exportJSON = function() {
    const data = {
      workers: state.workers,
      settings: state.settings,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `masi-team-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a);
    showToast('Database backup downloaded as JSON', 'success');
  };

  // ==========================================
  // DIRECT LIVE SYNC FROM MASI.CC.CD
  // ==========================================
  window.syncMasiLiveDirect = async function() {
    const btn = document.getElementById('btn-sync-masi-direct');
    const originalHtml = btn ? btn.innerHTML : '';
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = `<span style="display:inline-block;animation:spin 1s linear infinite">↻</span> <span>Syncing...</span>`;
    }

    try {
      const res = await fetch(`${API_BASE}/masi/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bossKey: 'WORKER-B030-0827-9A88-4A04' })
      });
      const data = await res.json();
      if (data.success) {
        await fetchServerState();
        showToast(`⚡ Live sync complete! Updated ${data.updatedWorkers || 0} workers from masi.cc.cd`, 'success');
      } else {
        showToast(data.error || 'Live sync failed', 'danger');
      }
    } catch (e) {
      showToast('Error connecting to live sync server', 'danger');
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = originalHtml;
      }
    }
  };

  // ==========================================
  // DRAG AND DROP KEY REASSIGNMENT & LEFT-SIDE RESET ZONE
  // ==========================================
  window.showLeftDeleteZone = function() {
    const zone = document.getElementById('left-delete-zone');
    if (zone) {
      zone.classList.add('active-dragging');
    }
  };

  window.hideLeftDeleteZone = function() {
    const zone = document.getElementById('left-delete-zone');
    if (zone) {
      zone.classList.remove('active-dragging', 'drag-over-active');
      const title = document.getElementById('left-zone-title');
      const icon = document.getElementById('left-zone-icon');
      if (title) title.innerHTML = 'THROW KEY HERE';
      if (icon) icon.textContent = '🗑️';
    }
  };

  window.handleKeyDragStart = function(event, key) {
    window.__isDraggingKey = true;
    window.__draggedKey = key;
    if (event.dataTransfer) {
      event.dataTransfer.setData('text/plain', key);
      event.dataTransfer.effectAllowed = 'move';
    }
    showLeftDeleteZone();
  };

  window.handleKeyDragEnd = function(event) {
    window.__isDraggingKey = false;
    hideLeftDeleteZone();
  };

  window.handleLeftZoneDragOver = function(event) {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
    const zone = document.getElementById('left-delete-zone');
    if (zone && !zone.classList.contains('drag-over-active')) {
      zone.classList.add('drag-over-active');
      const title = document.getElementById('left-zone-title');
      const icon = document.getElementById('left-zone-icon');
      if (title) title.innerHTML = 'RELEASE TO RESET!';
      if (icon) icon.textContent = '✨';
    }
  };

  window.handleLeftZoneDragLeave = function(event) {
    const zone = document.getElementById('left-delete-zone');
    if (zone) {
      zone.classList.remove('drag-over-active');
      const title = document.getElementById('left-zone-title');
      const icon = document.getElementById('left-zone-icon');
      if (title) title.innerHTML = 'THROW KEY HERE';
      if (icon) icon.textContent = '🗑️';
    }
  };

  window.handleLeftZoneDrop = async function(event) {
    event.preventDefault();
    hideLeftDeleteZone();

    const key = (event.dataTransfer ? event.dataTransfer.getData('text/plain') : '') || window.__draggedKey;
    if (!key) return;

    await resetKeyToOriginalForm(key);
  };

  window.resetKeyToOriginalForm = async function(key) {
    if (!key) return;
    const cleanKey = key.trim().toUpperCase();
    const worker = state.workers.find(w => w.key && w.key.toUpperCase() === cleanKey);
    if (!worker) {
      showToast(`Worker key ${cleanKey} not found`, 'warning');
      return;
    }

    const previousGuy = worker.personName || worker.name || cleanKey;

    // Delete custom guy groupings
    delete worker.personName;
    worker.telegramUsername = null;
    worker.telegramId = null;

    if (state.isApiOnline) {
      try {
        const res = await fetch(`${API_BASE}/workers/reset-key`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key: cleanKey })
        });
        const result = await res.json();
        if (result.success) {
          await fetchServerState();
          if (window.__currentGuyId) {
            closeGuyKeysModal();
          }
          showToast(`✨ Detached ${cleanKey} from "${previousGuy}" — Reverted back to original form!`, 'success');
          return;
        }
      } catch (err) {
        console.warn('API reset failed, applying local fallback:', err);
      }
    }

    // Local fallback
    saveToLocalStorage();
    render();
    if (window.__currentGuyId) {
      closeGuyKeysModal();
    }
    showToast(`✨ Detached ${cleanKey} from "${previousGuy}" — Reverted back to original form!`, 'success');
  };

  window.handleKeyDragOver = function(event) {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
    const card = event.currentTarget;
    if (card && !card.classList.contains('drag-hover-active')) {
      card.classList.add('drag-hover-active', 'ring-2', 'ring-indigo-500', 'bg-indigo-50/20');
    }
  };

  window.handleKeyDragLeave = function(event) {
    const card = event.currentTarget;
    if (card) {
      card.classList.remove('drag-hover-active', 'ring-2', 'ring-indigo-500', 'bg-indigo-50/20');
    }
  };

  window.handleKeyDrop = async function(event, targetGuyId) {
    event.preventDefault();
    const card = event.currentTarget;
    if (card) {
      card.classList.remove('drag-hover-active', 'ring-2', 'ring-indigo-500', 'bg-indigo-50/20');
    }

    const key = (event.dataTransfer ? event.dataTransfer.getData('text/plain') : '') || window.__draggedKey;
    if (!key) return;

    const guys = getGroupedGuys();
    const targetGuy = guys.find(g => g.id === targetGuyId);
    if (!targetGuy) {
      showToast('Target worker not found', 'warning');
      return;
    }

    // Check if key is already under this guy
    if (targetGuy.keys.some(k => k.key.toUpperCase() === key.toUpperCase())) {
      showToast(`Key ${key} is already assigned to ${targetGuy.displayName}`, 'info');
      return;
    }

    const mapping = {
      key: key,
      personName: targetGuy.personName || targetGuy.displayName,
      telegramUsername: targetGuy.telegramUsername || undefined
    };

    if (state.isApiOnline) {
      try {
        const res = await fetch(`${API_BASE}/workers/batch-assign-telegram`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mappings: [mapping] })
        });
        const result = await res.json();
        if (result.success) {
          await fetchServerState();
          showToast(`✓ Assigned key ${key} to ${targetGuy.displayName}!`, 'success');
          return;
        }
      } catch (err) {
        console.error('API assign failed:', err);
      }
    }

    // Local fallback
    const targetWorker = state.workers.find(w => w.key.toUpperCase() === key.toUpperCase());
    if (targetWorker) {
      targetWorker.personName = targetGuy.personName || targetGuy.displayName;
      if (targetGuy.telegramUsername) targetWorker.telegramUsername = targetGuy.telegramUsername;
    }
    saveToLocalStorage();
    render();
    showToast(`✓ Assigned key ${key} to ${targetGuy.displayName}!`, 'success');
  };

  // ==========================================
  // GUY KEYS LIST & INSPECTION MODAL
  // ==========================================
  window.openGuyKeysModal = function(guyId) {
    const modal = document.getElementById('guy-keys-modal');
    if (!modal) return;

    const guys = getGroupedGuys();
    const guy = guys.find(g => g.id === guyId);
    if (!guy) return;

    window.__currentGuyId = guyId;

    const title = document.getElementById('guy-keys-modal-title');
    const subtitle = document.getElementById('guy-keys-modal-subtitle');
    const countEl = document.getElementById('guy-keys-count');
    const container = document.getElementById('guy-keys-list-container');
    const addInput = document.getElementById('add-key-to-guy-input');

    if (title) title.textContent = `Keys for ${guy.displayName}`;
    if (subtitle) {
      subtitle.textContent = `${guy.telegramUsername || 'No @telegram handle'} • Total Done: ${guy.completedOrders} orders • Today: ${guy.todayDone} • 7-Day: ${guy.d7Done}`;
    }
    if (countEl) countEl.textContent = guy.keys.length;
    if (addInput) addInput.value = '';

    if (container) {
      if (guy.keys.length === 0) {
        container.innerHTML = `<div class="text-xs text-slate-400 p-3 bg-slate-50 rounded-lg text-center">No keys assigned to this guy yet.</div>`;
      } else {
        container.innerHTML = guy.keys.map(k => {
          const completed = Number(k.completedOrders) || 0;
          const paid = (completed > 0) && (k.paymentStatus === 'paid' || (Number(k.paidCount) || 0) >= completed);

          return `
            <div draggable="true" ondragstart="handleKeyDragStart(event, '${escapeHtml(k.key)}')" ondragend="handleKeyDragEnd(event)" title="Drag onto another worker, or throw left to reset to original form" class="flex items-center justify-between gap-2 p-2.5 rounded-lg border ${paid ? 'bg-emerald-50/70 border-emerald-200' : 'bg-white border-slate-200'} shadow-2xs cursor-grab active:cursor-grabbing hover:border-indigo-400 transition">
              <div class="flex items-center gap-2 font-mono text-xs">
                <span class="text-slate-300 select-none text-[10px]">⋮⋮</span>
                <span class="font-bold ${paid ? 'line-through text-slate-400' : 'text-slate-800'}">${escapeHtml(k.key)}</span>
                <button onclick="copyToClipboard('${escapeHtml(k.key)}', 'Key')" title="Copy Key" class="text-slate-400 hover:text-indigo-600 p-0.5">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                </button>
              </div>

              <div class="flex items-center gap-3 text-xs">
                <span class="font-bold ${paid ? 'text-emerald-700' : 'text-slate-700'}">${completed} ✓</span>
                <span class="text-xs text-sky-600 font-semibold">${k.todayDone || 0} today</span>
                ${paid ? '<span class="text-[10px] font-black text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">PAID</span>' : ''}
                <button onclick="removeKeyFromGuy('${escapeHtml(k.key)}')" title="Detach key and revert to original worker form" class="text-rose-500 hover:text-rose-700 hover:bg-rose-50 p-1 rounded transition text-xs font-bold flex items-center gap-1">
                  <span>↩</span> Detach
                </button>
              </div>
            </div>
          `;
        }).join('');
      }
    }

    modal.classList.remove('hidden');
  };

  window.closeGuyKeysModal = function() {
    const modal = document.getElementById('guy-keys-modal');
    if (modal) modal.classList.add('hidden');
    window.__currentGuyId = null;
  };

  window.submitAddKeyToGuy = async function() {
    const guyId = window.__currentGuyId;
    if (!guyId) return;

    const input = document.getElementById('add-key-to-guy-input');
    const key = (input ? input.value : '').trim().toUpperCase();
    if (!key) {
      showToast('Please type or paste a worker key', 'warning');
      return;
    }

    const guys = getGroupedGuys();
    const targetGuy = guys.find(g => g.id === guyId);
    if (!targetGuy) return;

    const mapping = {
      key: key,
      personName: targetGuy.personName || targetGuy.displayName,
      telegramUsername: targetGuy.telegramUsername || undefined
    };

    if (state.isApiOnline) {
      try {
        const res = await fetch(`${API_BASE}/workers/batch-assign-telegram`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mappings: [mapping] })
        });
        const result = await res.json();
        if (result.success) {
          await fetchServerState();
          openGuyKeysModal(guyId);
          showToast(`Added key ${key} to ${targetGuy.displayName}!`, 'success');
          return;
        }
      } catch (err) {
        console.error(err);
      }
    }

    // Local fallback
    const targetWorker = state.workers.find(w => w.key.toUpperCase() === key.toUpperCase());
    if (targetWorker) {
      targetWorker.personName = targetGuy.personName || targetGuy.displayName;
      if (targetGuy.telegramUsername) targetWorker.telegramUsername = targetGuy.telegramUsername;
    } else {
      state.workers.push({
        id: 'w-' + Date.now(),
        name: key,
        key: key,
        personName: targetGuy.personName || targetGuy.displayName,
        telegramUsername: targetGuy.telegramUsername || undefined,
        completedOrders: 0,
        rate: 15.00
      });
    }
    saveToLocalStorage();
    render();
    openGuyKeysModal(guyId);
    showToast(`Added key ${key} to ${targetGuy.displayName}!`, 'success');
  };

  window.removeKeyFromGuy = async function(key) {
    if (!key) return;
    await resetKeyToOriginalForm(key);
  };

  // ==========================================
  // WEB-TO-BOT DIRECT MESSAGING
  // ==========================================
  window.openSendMsgModal = function(workerIdOrKey, name, tgUsername) {
    const modal = document.getElementById('send-msg-modal');
    if (!modal) return;

    window.__sendMsgTargetId = workerIdOrKey;
    const desc = document.getElementById('send-msg-target-desc');
    const warning = document.getElementById('send-msg-warning');
    const input = document.getElementById('send-msg-input');

    if (desc) desc.textContent = `To: ${name || 'Worker'} (${tgUsername || 'Worker'})`;
    if (input) input.value = '';

    // Check if worker is linked
    const worker = state.workers.find(w => w.id === workerIdOrKey || w.key === workerIdOrKey);
    let isLinked = Boolean(worker && worker.telegramId);
    if (!isLinked && tgUsername) {
      isLinked = state.workers.some(w => w.telegramUsername && w.telegramUsername.toLowerCase() === tgUsername.toLowerCase() && w.telegramId);
    }

    if (warning) {
      if (!isLinked) {
        warning.classList.remove('hidden');
        warning.textContent = `⚠️ ${name || 'This worker'} has not messaged the bot yet. They must start @${state.settings.botUsername || 'scantask_bot'} on Telegram to receive messages.`;
      } else {
        warning.classList.add('hidden');
      }
    }

    modal.classList.remove('hidden');
  };

  window.closeSendMsgModal = function() {
    const modal = document.getElementById('send-msg-modal');
    if (modal) modal.classList.add('hidden');
    window.__sendMsgTargetId = null;
  };

  window.submitSendMsg = async function() {
    const targetId = window.__sendMsgTargetId;
    const input = document.getElementById('send-msg-input');
    const text = (input ? input.value : '').trim();

    if (!text) {
      showToast('Please type a message to send', 'warning');
      return;
    }

    const btn = document.getElementById('btn-do-send-msg');
    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Sending...';
    }

    try {
      const res = await fetch(`${API_BASE}/workers/${targetId}/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, text: text })
      });
      const data = await res.json();

      if (data.success) {
        closeSendMsgModal();
        showToast('🚀 Message delivered directly to worker in Telegram!', 'success');
      } else {
        showToast(data.error || 'Failed to deliver message via Telegram', 'danger');
      }
    } catch (err) {
      showToast('Error connecting to message server', 'danger');
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = `<span>🚀</span> Send to Telegram`;
      }
    }
  };

  // ==========================================
  // PAYMENT STATUS ACTIONS (PAY, UNMARK, APPROVE)
  // ==========================================
  window.markGuyPaid = async function(guyId) {
    const guys = getGroupedGuys();
    const guy = guys.find(g => g.id === guyId);
    if (!guy) return;

    for (const k of guy.keys) {
      const completed = Number(k.completedOrders) || 0;
      if (state.isApiOnline) {
        try {
          await fetch(`${API_BASE}/workers/${k.id}/mark-paid`, { method: 'POST' });
        } catch (e) {
          console.error(e);
        }
      }
      k.paymentStatus = 'paid';
      k.paidCount = completed;
      k.payoutRequestStatus = 'approved';
    }

    if (state.isApiOnline) {
      await fetchServerState();
    } else {
      saveToLocalStorage();
      render();
    }

    showToast(`✓ Marked ${guy.displayName} as PAID & SETTLED! Alert sent via Telegram.`, 'success');
  };

  window.unmarkGuyPaid = async function(guyId) {
    const guys = getGroupedGuys();
    const guy = guys.find(g => g.id === guyId);
    if (!guy) return;

    if (!confirm(`Reset payment status for ${guy.displayName}? This will mark their completed tasks as UNPAID.`)) return;

    for (const k of guy.keys) {
      if (state.isApiOnline) {
        try {
          await fetch(`${API_BASE}/workers/${k.id}/mark-unpaid`, { method: 'POST' });
        } catch (e) {
          console.error(e);
        }
      }
      k.paymentStatus = 'unpaid';
      k.paidCount = 0;
    }

    if (state.isApiOnline) {
      await fetchServerState();
    } else {
      saveToLocalStorage();
      render();
    }

    showToast(`↩ Payment status reset to UNPAID for ${guy.displayName}`, 'info');
  };

  window.approveGuyPayout = async function(guyId) {
    const guys = getGroupedGuys();
    const guy = guys.find(g => g.id === guyId);
    if (!guy) return;

    for (const k of guy.keys) {
      if (k.payoutRequestStatus === 'pending') {
        if (state.isApiOnline) {
          try {
            await fetch(`${API_BASE}/workers/${k.id}/approve-payout`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({})
            });
          } catch (e) {
            console.error(e);
          }
        }
        k.paymentStatus = 'paid';
        k.paidCount = Number(k.completedOrders) || 0;
        k.payoutRequestStatus = 'approved';
      }
    }

    if (state.isApiOnline) {
      await fetchServerState();
    } else {
      saveToLocalStorage();
      render();
    }

    showToast(`🎉 Approved & settled payout for ${guy.displayName}! Alert sent to Telegram.`, 'success');
  };

  window.markWorkerPaid = async function(workerId) {
    const worker = state.workers.find(w => w.id === workerId || w.key === workerId);
    if (!worker) return;

    const completed = Number(worker.completedOrders) || 0;

    if (state.isApiOnline) {
      try {
        const res = await fetch(`${API_BASE}/workers/${worker.id}/mark-paid`, { method: 'POST' });
        const data = await res.json();
        await fetchServerState();
        if (data.telegramSent) {
          showToast(`✓ Marked ${worker.name} (${completed} orders) as PAID! Telegram notification delivered.`, 'success');
        } else {
          showToast(`✓ Marked ${worker.name} (${completed} orders) as PAID`, 'success');
        }
        return;
      } catch (e) {
        console.error(e);
      }
    }

    worker.paymentStatus = 'paid';
    worker.paidCount = completed;
    saveToLocalStorage();
    render();
    showToast(`✓ Marked ${worker.name} as PAID & SETTLED`, 'success');
  };

  window.unmarkWorkerPaid = async function(workerId) {
    const worker = state.workers.find(w => w.id === workerId || w.key === workerId);
    if (!worker) return;

    if (state.isApiOnline) {
      try {
        await fetch(`${API_BASE}/workers/${worker.id}/mark-unpaid`, { method: 'POST' });
        await fetchServerState();
      } catch (e) {
        console.error(e);
      }
    } else {
      worker.paymentStatus = 'unpaid';
      worker.paidCount = 0;
      saveToLocalStorage();
      render();
    }
    showToast(`↩ Payment status reset to UNPAID for ${worker.name}`, 'info');
  };

  // ==========================================
  // QUICK SET TELEGRAM USERNAME MODAL
  // ==========================================
  window.openSetTgModal = function(guyId, guyName) {
    const modal = document.getElementById('set-tg-modal');
    if (!modal) return;

    const guys = getGroupedGuys();
    const guy = guys.find(g => g.id === guyId);

    document.getElementById('set-tg-guy-id').value = guyId;
    const desc = document.getElementById('set-tg-modal-desc');
    if (desc) desc.textContent = `Attach Telegram username to "${guyName || guy?.displayName || 'Worker'}":`;

    const input = document.getElementById('set-tg-username-input');
    if (input) input.value = guy?.telegramUsername || '';

    modal.classList.remove('hidden');
  };

  window.closeSetTgModal = function() {
    const modal = document.getElementById('set-tg-modal');
    if (modal) modal.classList.add('hidden');
  };

  window.saveSetTgUsername = async function() {
    const guyId = document.getElementById('set-tg-guy-id').value;
    const input = document.getElementById('set-tg-username-input');
    let tg = (input ? input.value : '').trim();
    if (!tg) {
      showToast('Please enter a Telegram username', 'warning');
      return;
    }
    if (!tg.startsWith('@')) tg = '@' + tg;

    const guys = getGroupedGuys();
    const guy = guys.find(g => g.id === guyId);
    if (!guy) return;

    const mappings = guy.keys.map(k => ({
      key: k.key,
      telegramUsername: tg,
      personName: guy.personName || guy.displayName
    }));

    if (state.isApiOnline) {
      try {
        const res = await fetch(`${API_BASE}/workers/batch-assign-telegram`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mappings })
        });
        const result = await res.json();
        if (result.success) {
          await fetchServerState();
          closeSetTgModal();
          showToast(`Attached ${tg} to ${guy.displayName}!`, 'success');
          return;
        }
      } catch (e) {
        console.error(e);
      }
    }

    guy.keys.forEach(k => {
      const wk = state.workers.find(w => w.key === k.key);
      if (wk) wk.telegramUsername = tg;
    });
    saveToLocalStorage();
    render();
    closeSetTgModal();
    showToast(`Attached ${tg} to ${guy.displayName}!`, 'success');
  };

  // ==========================================
  // GUY PROFILE PAYOUT & WITHDRAWAL MODAL
  // ==========================================
  window.openGuyProfileModal = function(guyId) {
    const guys = getGroupedGuys();
    const guy = guys.find(g => g.id === guyId);
    if (!guy) return;

    window.__currentProfileGuyId = guyId;

    const modal = document.getElementById('guy-profile-modal');
    if (!modal) return;

    const avatar = document.getElementById('profile-modal-avatar');
    const nameEl = document.getElementById('profile-modal-name');
    const tgEl = document.getElementById('profile-modal-tg');
    const keysBadge = document.getElementById('profile-modal-keys-badge');

    if (avatar) avatar.textContent = (guy.displayName || 'W')[0].toUpperCase();
    if (nameEl) nameEl.textContent = guy.displayName;
    if (tgEl) {
      if (guy.telegramUsername) {
        tgEl.innerHTML = `<a href="https://t.me/${guy.telegramUsername.replace('@', '')}" target="_blank" class="hover:underline">${escapeHtml(guy.telegramUsername)}</a>`;
      } else {
        tgEl.innerHTML = `<span class="text-slate-400 font-normal italic">No @handle</span>`;
      }
    }
    if (keysBadge) {
      keysBadge.textContent = `${guy.keys.length} ${guy.keys.length === 1 ? 'Key' : 'Keys'}`;
    }

    // Settlement Progress (X/Y Fraction)
    const fracEl = document.getElementById('profile-settled-fraction');
    const badgeEl = document.getElementById('profile-settled-badge');
    const detailEl = document.getElementById('profile-settled-detail');
    const leftoverBig = document.getElementById('profile-leftover-big');

    if (fracEl) fracEl.textContent = `${guy.paidCount}/${guy.completedOrders}`;
    if (leftoverBig) leftoverBig.textContent = `${guy.leftover}`;
    if (detailEl) {
      detailEl.textContent = `${guy.completedOrders} completed • ${guy.paidCount} settled • ${guy.leftover} leftover`;
    }

    if (badgeEl) {
      if (guy.isSettled) {
        badgeEl.className = 'text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-200 text-emerald-900 border border-emerald-300';
        badgeEl.textContent = 'SETTLED ✓';
      } else if (guy.paidCount > 0 && guy.leftover > 0) {
        badgeEl.className = 'text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-sky-200 text-sky-900 border border-sky-300';
        badgeEl.textContent = `PARTIAL (${guy.leftover} left)`;
      } else if (guy.completedOrders > 0) {
        badgeEl.className = 'text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-900 border border-amber-300';
        badgeEl.textContent = 'UNPAID';
      } else {
        badgeEl.className = 'text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-600';
        badgeEl.textContent = 'NO ORDERS';
      }
    }

    // Pending Withdrawal Request Alert Box
    const reqBox = document.getElementById('profile-payout-request-box');
    const reqOrdersVal = document.getElementById('profile-requested-orders-val');
    const reqTime = document.getElementById('profile-requested-time');

    if (reqBox) {
      if (guy.hasPendingPayoutRequest) {
        reqBox.classList.remove('hidden');
        if (reqOrdersVal) reqOrdersVal.textContent = `${guy.requestedOrders} orders`;
        if (reqTime) {
          const pendingKey = guy.keys.find(k => k.payoutRequestStatus === 'pending');
          reqTime.textContent = pendingKey?.payoutRequestedAt
            ? new Date(pendingKey.payoutRequestedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : 'Pending';
        }
      } else {
        reqBox.classList.add('hidden');
      }
    }

    // Payment Form Inputs
    const payOrdersInput = document.getElementById('profile-pay-orders-input');
    const payNoteInput = document.getElementById('profile-pay-note-input');
    const markAllCheck = document.getElementById('profile-mark-all-check');
    const leftoverMarkText = document.getElementById('profile-leftover-mark-text');

    if (leftoverMarkText) leftoverMarkText.textContent = `${guy.leftover}`;

    if (payOrdersInput) {
      if (guy.hasPendingPayoutRequest && guy.requestedOrders > 0) {
        payOrdersInput.value = guy.requestedOrders;
      } else if (guy.leftover > 0) {
        payOrdersInput.value = guy.leftover;
      } else {
        payOrdersInput.value = '';
      }
      payOrdersInput.max = guy.leftover;
    }

    if (payNoteInput) {
      payNoteInput.value = '';
    }

    if (markAllCheck) {
      markAllCheck.checked = Boolean(guy.leftover > 0 && (!guy.requestedOrders || guy.requestedOrders >= guy.leftover));
    }

    // Payment History Log
    const historyList = document.getElementById('profile-payment-history-list');
    const paymentCount = document.getElementById('profile-payment-count');
    const history = guy.paymentHistory || [];

    if (paymentCount) paymentCount.textContent = `${history.length} record${history.length === 1 ? '' : 's'}`;

    if (historyList) {
      if (history.length === 0) {
        historyList.innerHTML = `
          <div class="text-xs text-slate-400 p-4 bg-slate-50 rounded-xl text-center border border-dashed border-slate-200">
            No payments or settlements recorded for this worker yet.
          </div>
        `;
      } else {
        historyList.innerHTML = history.map(h => {
          const dateStr = h.date ? new Date(h.date).toLocaleString('en-IN', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }) : 'Recently';

          return `
            <div class="bg-white border border-slate-200 rounded-lg p-2.5 shadow-2xs hover:border-emerald-300 transition">
              <div class="flex items-center justify-between gap-2">
                <div class="flex items-center gap-1.5">
                  <span class="text-emerald-600 font-bold text-xs">✓</span>
                  <span class="font-extrabold text-xs text-slate-900">+${h.ordersPaid || 0} orders settled</span>
                  ${(h.paidCountAfter !== undefined && h.totalCompleted !== undefined) ? `
                    <span class="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                      ${h.paidCountAfter}/${h.totalCompleted}
                    </span>
                  ` : ''}
                </div>
                <span class="text-[10px] text-slate-400 font-mono">${dateStr}</span>
              </div>
              ${h.note ? `
                <div class="text-xs text-slate-600 mt-1 pl-4 border-l-2 border-slate-200 italic">
                  "${escapeHtml(h.note)}"
                </div>
              ` : ''}
            </div>
          `;
        }).join('');
      }
    }

    modal.classList.remove('hidden');
  };

  window.closeGuyProfileModal = function() {
    const modal = document.getElementById('guy-profile-modal');
    if (modal) modal.classList.add('hidden');
    window.__currentProfileGuyId = null;
  };

  window.toggleProfileMarkAll = function(isChecked) {
    const guyId = window.__currentProfileGuyId;
    if (!guyId) return;
    const guys = getGroupedGuys();
    const guy = guys.find(g => g.id === guyId);
    if (!guy) return;

    const ordersInput = document.getElementById('profile-pay-orders-input');
    if (!ordersInput) return;

    if (isChecked) {
      ordersInput.value = guy.leftover > 0 ? guy.leftover : '';
    } else {
      if (Number(ordersInput.value) === guy.leftover) {
        ordersInput.value = '';
      }
    }
  };

  window.submitRecordProfilePayment = async function() {
    const guyId = window.__currentProfileGuyId;
    if (!guyId) return;
    const guys = getGroupedGuys();
    const guy = guys.find(g => g.id === guyId);
    if (!guy) return;

    const ordersInput = document.getElementById('profile-pay-orders-input');
    const noteInput = document.getElementById('profile-pay-note-input');
    const markAllCheck = document.getElementById('profile-mark-all-check');
    const btn = document.getElementById('btn-submit-record-payment');

    const markAllSettled = markAllCheck ? markAllCheck.checked : false;
    let ordersCount = ordersInput ? Number(ordersInput.value) : 0;
    const note = (noteInput ? noteInput.value : '').trim();

    if (!markAllSettled && (!ordersCount || ordersCount <= 0)) {
      showToast('Please specify the number of orders settled or check "Mark all leftover orders as fully paid"', 'warning');
      return;
    }

    if (btn) {
      btn.disabled = true;
      btn.innerHTML = `<span style="display:inline-block;animation:spin 1s linear infinite">↻</span> Saving...`;
    }

    // Find the worker key to record payment on (prefer pending request or primary key)
    const primaryWorker = guy.keys.find(k => k.payoutRequestStatus === 'pending') || guy.keys[0];
    if (!primaryWorker) {
      showToast('No worker key found for this guy', 'danger');
      if (btn) { btn.disabled = false; btn.innerHTML = `<span>💾</span> Save Payment & Notify Worker via Telegram`; }
      return;
    }

    if (state.isApiOnline) {
      try {
        const res = await fetch(`${API_BASE}/workers/${primaryWorker.id}/record-payment`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ordersCount: ordersCount,
            note: note,
            markAllSettled: markAllSettled
          })
        });
        const data = await res.json();
        if (data.success) {
          await fetchServerState();
          openGuyProfileModal(guyId);
          showToast(`✓ Settled ${data.ordersPaid !== undefined ? data.ordersPaid : ordersCount} orders for ${guy.displayName}! Telegram notification sent.`, 'success');
          return;
        } else {
          showToast(data.error || 'Failed to record payment', 'danger');
        }
      } catch (e) {
        console.error('Error recording payment:', e);
        showToast('Error recording payment', 'danger');
      } finally {
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = `<span>💾</span> Save Payment & Notify Worker via Telegram`;
        }
      }
    }

    // Local fallback
    const targetKey = state.workers.find(w => w.key === primaryWorker.key);
    if (targetKey) {
      const completed = Number(targetKey.completedOrders) || 0;
      const currentPaid = Number(targetKey.paidCount) || 0;
      let settled = ordersCount;
      if (markAllSettled || settled >= (completed - currentPaid)) {
        settled = Math.max(0, completed - currentPaid);
        targetKey.paidCount = completed;
      } else {
        targetKey.paidCount = Math.min(completed, currentPaid + settled);
      }
      targetKey.paymentStatus = (targetKey.paidCount >= completed && completed > 0) ? 'paid' : 'unpaid';
      targetKey.payoutRequestStatus = 'approved';
      targetKey.payoutRequestedOrders = 0;

      if (!Array.isArray(targetKey.paymentHistory)) targetKey.paymentHistory = [];
      targetKey.paymentHistory.unshift({
        id: `pay-${Date.now()}`,
        date: new Date().toISOString(),
        ordersPaid: settled,
        note: note || 'Settled by administrator',
        paidCountAfter: targetKey.paidCount,
        totalCompleted: completed
      });
    }

    saveToLocalStorage();
    render();
    openGuyProfileModal(guyId);
    showToast(`✓ Settled orders for ${guy.displayName}!`, 'success');
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = `<span>💾</span> Save Payment & Notify Worker via Telegram`;
    }
  };

  window.submitApproveProfileRequest = async function() {
    const guyId = window.__currentProfileGuyId;
    if (!guyId) return;
    await approveGuyPayout(guyId);
    openGuyProfileModal(guyId);
  };

  window.openProfileMsgModal = function() {
    const guyId = window.__currentProfileGuyId;
    if (!guyId) return;
    const guys = getGroupedGuys();
    const guy = guys.find(g => g.id === guyId);
    if (!guy) return;

    closeGuyProfileModal();
    const primaryKey = guy.keys[0];
    openSendMsgModal(primaryKey?.id || '', guy.displayName, guy.telegramUsername || '');
  };

  // Search input and global drag event listeners
  function setupEventListeners() {
    const searchInput = document.getElementById('global-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        state.searchQuery = e.target.value;
        render();
      });
    }

    // Safety net: ensure left-delete-zone hides whenever any drag ends or drops anywhere
    window.addEventListener('dragend', () => {
      window.__isDraggingKey = false;
      if (typeof window.hideLeftDeleteZone === 'function') {
        window.hideLeftDeleteZone();
      }
    });

    window.addEventListener('drop', () => {
      window.__isDraggingKey = false;
      if (typeof window.hideLeftDeleteZone === 'function') {
        window.hideLeftDeleteZone();
      }
    });
  }

  window.clearSearch = function() {
    state.searchQuery = '';
    const searchInput = document.getElementById('global-search');
    if (searchInput) searchInput.value = '';
    render();
  };

  function escapeHtml(str) {
    if (!str && str !== 0) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Start app on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
