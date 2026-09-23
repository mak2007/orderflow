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
    currentTab: 'guys',
    selectedDay: '23sep',
    sortBy: 'pay-desc', // 'guys', 'keys', 'bot'
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
    const container = document.getElementById('panel-content');
    if (!container) return;
    renderGuysPanel(container);
  }

  function renderCurrentPanelQuietly() {
    render();
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

  // Verified Telegram Workers with their Assigned Keys
  const telegramWorkersMapping = [
    { username: '@Bnzaalam', displayName: 'Bnzaalam', keys: [{ name: 'Hey123', key: 'WORKER-21C3-59F9-EA3B-E26A' }] },
    { username: '@fileworker_6700', displayName: 'Fileworker', keys: [{ name: 'Hellxieii', key: 'WORKER-B25D-66C6-25F7-C418' }] },
    { username: '@hashirmhd', displayName: 'Hashir', keys: [{ name: 'Hashirbhai', key: 'WORKER-36F9-1F80-EA07-C8DA' }] },
    { username: '@AASHU_97', displayName: 'Aashu', keys: [{ name: 'Aashu', key: 'WORKER-7F2C-BE14-84B5-EC3C' }] },
    { username: '@Deep280109', displayName: 'Deep', keys: [{ name: 'Depubaby', key: 'WORKER-7D0E-10BE-477F-0741' }] },
    { username: '@BCNAMI', displayName: 'BC Nami', keys: [{ name: 'LuffyD', key: 'WORKER-BAF8-8A3C-3CA1-5604' }] },
    { username: '@ntnatri', displayName: 'Nitin Atri', keys: [{ name: 'Nitin', key: 'WORKER-2D3D-E8D5-B6A1-5CD1' }] },
    { username: '@pawan_naidu_24', displayName: 'Pawan Naidu', keys: [{ name: 'Givemeworkbro', key: 'WORKER-D8DC-E408-F99E-B402' }] },
    { username: 'shub', displayName: 'Shubhraj Singh', keys: [
      { name: 'Paras43', key: 'WORKER-06D9-A94C-E26D-C1B2' },
      { name: 'Shub6', key: 'WORKER-B1B5-38E0-D897-E5D7' },
      { name: 'Paras19', key: 'WORKER-037D-4846-737B-5143' },
      { name: 'Paras42', key: 'WORKER-07BB-01F6-7743-7BE8' }
    ]},
    { username: '@Tgrajout', displayName: 'Tg Rajput', keys: [
      { name: 'Paras41', key: 'WORKER-B9CC-39EC-1C71-DDEC' },
      { name: 'Shub1', key: 'WORKER-48A6-E6A7-89C5-A8E7' },
      { name: 'Paras46', key: 'WORKER-7EDD-E24E-A7E0-8813' },
      { name: 'Shub5', key: 'WORKER-8CAF-E03B-19C1-E66F' },
      { name: 'Shub3', key: 'WORKER-D4A3-4AA1-5B5E-0060' },
      { name: 'Shub9', key: 'WORKER-82FF-EC9D-35F4-8648' }
    ]},
    { username: '@ROSALIE_ADMIN1', displayName: 'Rosalie Admin', keys: [
      { name: 'Fckme02', key: 'WORKER-5C38-E9A2-3950-2DE3' },
      { name: '1webkeydedo', key: 'WORKER-B110-7AFF-53AF-AA74' }
    ]},
    { username: 'majid', displayName: 'Majid', keys: [{ name: 'Majido', key: 'WORKER-90C8-CDB0-D93C-26B8' }] },
    { username: '@shauryagharat4103', displayName: 'Shaurya Gharat', keys: [{ name: 'Shaurya', key: 'WORKER-98D0-D03A-8138-F09A' }] },
    { username: 'loki', displayName: 'Loki', keys: [
      { name: 'Loki', key: 'WORKER-1956-E7B7-7220-B03F' },
      { name: 'W99w8', key: 'WORKER-E0F5-49CA-9564-7425' }
    ]},
    { username: '@LaksheswarX', displayName: 'Laksheswar', keys: [{ name: 'Lokeshwaray', key: 'WORKER-0452-3999-5B0F-FF48' }] },
    { username: '@Rayyann30', displayName: 'Rayyan', keys: [{ name: 'Rayansheik', key: 'WORKER-98EF-C719-3B23-A25A' }] },
    { username: '@Terajaat012', displayName: 'Tera Jaat', keys: [{ name: 'Jaate', key: 'WORKER-A13D-9071-CB21-EEAB' }] },
    { username: 'hyper', displayName: 'Hyper', keys: [{ name: 'HyperX', key: 'WORKER-F4CC-5C42-85A9-617F' }] },
    { username: '@Work4money_owner', displayName: 'Work4Money Owner', keys: [{ name: 'Aarvworzk', key: 'WORKER-708B-BDA0-F8CC-FE52' }] },
    { username: 'idk', displayName: 'Idk', keys: [{ name: 'Woosidk', key: 'WORKER-0872-8B7E-1BD4-17CC' }] },
    { username: 'sharmaji', displayName: 'Sharmaji', keys: [{ name: 'Sharmaji', key: 'WORKER-9433-07AE-F0AF-26E2' }] },
    { username: '@Kelifor', displayName: 'Kelifor', keys: [{ name: 'Kelifor', key: 'WORKER-4A7A-EE26-47D4-9F9A' }] },
    { username: '@PsychoAlex99', displayName: 'Alex', keys: [{ name: 'Alexy', key: 'WORKER-957A-2D08-DCB6-118F' }] },
    { username: '@Sonu2538', displayName: 'Sonu Singh', keys: [{ name: 'Sonusingh', key: 'WORKER-79E7-D83D-0D37-C64B' }] }
  ];

  window.fetchLiveMasiData = async function(manual = false) {
    const label = document.getElementById('sync-btn-label');
    const spinner = document.getElementById('sync-spinner-icon');
    if (label) label.textContent = 'Syncing Live masi.cc.cd...';
    if (spinner) spinner.classList.add('animate-spin');

    try {
      const res = await fetch('/api/masi/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bossKey: (state.settings && state.settings.bossKey) || 'WORKER-B030-0827-9A88-4A04' })
      });
      const data = await res.json();
      if (data.success) {
        state.lastMasiSync = new Date();
        await loadInitialData();
    // Auto-fetch live data from masi.cc.cd on startup
    setTimeout(() => { if (typeof fetchLiveMasiData === "function") fetchLiveMasiData().catch(e => console.warn(e)); }, 600);
        showToast('🟢 Live data fetched successfully from masi.cc.cd!', 'success');
      } else {
        if (manual) showToast('Could not sync masi data: ' + (data.error || 'Unknown error'), 'danger');
      }
    } catch (e) {
      console.warn('Sync failed:', e);
      if (manual) showToast('Sync error: ' + e.message, 'danger');
    } finally {
      if (label) label.textContent = '🔄 Fetch Live Data from masi.cc.cd';
      if (spinner) spinner.classList.remove('animate-spin');
      renderCurrentPanelQuietly();
    }
  };

  // Helper to build a map of live worker stats from state.workers
  function getLiveWorkerKeyMap() {
    const map = new Map();
    (state.workers || []).forEach(w => {
      if (w.key) map.set(w.key.toUpperCase(), w);
      if (w.name) map.set(w.name.toLowerCase(), w);
    });
    return map;
  }

  // ==========================================

  // ==========================================
  // RATE CHART & PAY CALCULATION UTILITIES
  // ==========================================
  // Rates:
  // 1-5 QR: ₹25 / QR
  // 6-10 QR: ₹27 / QR
  // 11-20 QR: ₹31 / QR
  // 20+ QR (21-30): ₹35 / QR
  // 30+ QR: ₹40 / QR
  // Penalty: Success rate < 60% caps tier rate at ₹32/QR max.
  function calculateWorkerPay(completedCount, successRate) {
    const done = Number(completedCount) || 0;
    const rateNum = Number(successRate) || 0;
    if (done <= 0) {
      return { tierRate: 0, basePay: 0, isCapped: false, tierLabel: '0 QR' };
    }

    let tierRate = 25;
    let tierLabel = '1–5 QR (₹25)';
    if (done > 30) {
      tierRate = 40;
      tierLabel = '30+ QR (₹40)';
    } else if (done > 20) {
      tierRate = 35;
      tierLabel = '20+ QR (₹35)';
    } else if (done > 10) {
      tierRate = 31;
      tierLabel = '11–20 QR (₹31)';
    } else if (done > 5) {
      tierRate = 27;
      tierLabel = '6–10 QR (₹27)';
    }

    let isCapped = false;
    if (rateNum > 0 && rateNum < 60 && tierRate > 32) {
      tierRate = 32;
      isCapped = true;
      tierLabel += ' [Capped @ ₹32 (<60% success)]';
    }

    return {
      tierRate,
      basePay: done * tierRate,
      isCapped,
      tierLabel
    };
  }

  // Adjustments & Bonus Pay State
  function getAdjustments() {
    try {
      return JSON.parse(localStorage.getItem('orderflow_adjustments') || '{}');
    } catch (e) {
      return {};
    }
  }

  window.setWorkerAdjustment = function(workerId, amount) {
    const adj = getAdjustments();
    const current = Number(adj[workerId] || 0);
    adj[workerId] = current + Number(amount);
    localStorage.setItem('orderflow_adjustments', JSON.stringify(adj));
    render();
    showToast(`Adjustment updated: ₹${adj[workerId] >= 0 ? '+' : ''}${adj[workerId]}`, 'info');
  };

  window.promptCustomAdjustment = function(workerId, workerName) {
    const adj = getAdjustments();
    const current = Number(adj[workerId] || 0);
    const input = prompt(`Enter bonus (+) or deduction (-) for ${workerName} in ₹:\n(e.g. 50 or -30)`, current);
    if (input === null) return;
    const val = Number(input);
    if (isNaN(val)) {
      showToast('Please enter a valid number', 'warning');
      return;
    }
    adj[workerId] = val;
    localStorage.setItem('orderflow_adjustments', JSON.stringify(adj));
    render();
    showToast(`Set adjustment for ${workerName}: ₹${val >= 0 ? '+' : ''}${val}`, 'success');
  };

  window.resetWorkerAdjustment = function(workerId, workerName) {
    const adj = getAdjustments();
    delete adj[workerId];
    localStorage.setItem('orderflow_adjustments', JSON.stringify(adj));
    render();
    showToast(`Reset adjustments for ${workerName} to ₹0`, 'info');
  };

  // Live Masi Data Fetcher
  window.fetchLiveMasiData = async function(manual = false) {
    const label = document.getElementById('sync-btn-label');
    const spinner = document.getElementById('sync-spinner-icon');
    if (label) label.textContent = 'Syncing Live masi.cc.cd...';
    if (spinner) spinner.classList.add('animate-spin');

    try {
      const res = await fetch('/api/masi/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bossKey: (state.settings && state.settings.bossKey) || 'WORKER-B030-0827-9A88-4A04' })
      });
      const data = await res.json();
      if (data.success) {
        state.lastMasiSync = new Date();
        await loadInitialData();
        showToast('🟢 Live data fetched successfully from masi.cc.cd!', 'success');
      } else {
        if (manual) showToast('Could not sync masi data: ' + (data.error || 'Unknown error'), 'danger');
      }
    } catch (e) {
      console.warn('Sync failed:', e);
      if (manual) showToast('Sync error: ' + e.message, 'danger');
    } finally {
      if (label) label.textContent = '🔄 Fetch Live Data from masi.cc.cd';
      if (spinner) spinner.classList.remove('animate-spin');
      renderCurrentPanelQuietly();
    }
  };

  // Editable USD/INR rate for Boss Profit
  window.getUsdInrRate = function() {
    return Number(localStorage.getItem('orderflow_usdinr_rate') || 84);
  };

  window.promptUsdInrRate = function() {
    const current = getUsdInrRate();
    const input = prompt('Enter USD to INR conversion rate for calculating Boss Profit:', current);
    if (input === null) return;
    const rate = Number(input);
    if (!rate || rate <= 0) {
      showToast('Please enter a valid rate', 'warning');
      return;
    }
    localStorage.setItem('orderflow_usdinr_rate', rate);
    render();
    showToast(`Conversion rate set to ₹${rate} / USD`, 'success');
  };

  // ==========================================

  // Rate Chart: 1-5: ₹25, 6-10: ₹27, 11-20: ₹31, 20+: ₹35, 30+: ₹40. (<60% max ₹32)
  function calculateWorkerPay(completedCount, successRate) {
    const done = Number(completedCount) || 0;
    const rateNum = Number(successRate) || 0;
    if (done <= 0) return { tierRate: 0, basePay: 0, isCapped: false, tierLabel: '0 QR' };

    let tierRate = 25;
    let tierLabel = '1–5 QR (₹25)';
    if (done > 30) {
      tierRate = 40;
      tierLabel = '30+ QR (₹40)';
    } else if (done > 20) {
      tierRate = 35;
      tierLabel = '20+ QR (₹35)';
    } else if (done > 10) {
      tierRate = 31;
      tierLabel = '11–20 QR (₹31)';
    } else if (done > 5) {
      tierRate = 27;
      tierLabel = '6–10 QR (₹27)';
    }

    let isCapped = false;
    if (rateNum > 0 && rateNum < 60 && tierRate > 32) {
      tierRate = 32;
      isCapped = true;
      tierLabel += ' (Capped @ ₹32)';
    }

    return { tierRate, basePay: done * tierRate, isCapped, tierLabel };
  }

  function getAdjustments() {
    try {
      return JSON.parse(localStorage.getItem('orderflow_adjustments') || '{}');
    } catch (e) {
      return {};
    }
  }

  window.setWorkerAdjustment = function(workerId, amount) {
    const adj = getAdjustments();
    const current = Number(adj[workerId] || 0);
    adj[workerId] = current + Number(amount);
    localStorage.setItem('orderflow_adjustments', JSON.stringify(adj));
    render();
    showToast(`Adjustment: ₹${adj[workerId] >= 0 ? '+' : ''}${adj[workerId]}`, 'info');
  };

  window.promptCustomAdjustment = function(workerId, workerName) {
    const adj = getAdjustments();
    const current = Number(adj[workerId] || 0);
    const input = prompt(`Enter bonus (+) or deduction (-) for ${workerName} in ₹:`, current);
    if (input === null) return;
    const val = Number(input);
    if (isNaN(val)) return;
    adj[workerId] = val;
    localStorage.setItem('orderflow_adjustments', JSON.stringify(adj));
    render();
    showToast(`Set adjustment for ${workerName}: ₹${val >= 0 ? '+' : ''}${val}`, 'success');
  };

  window.resetWorkerAdjustment = function(workerId, workerName) {
    const adj = getAdjustments();
    delete adj[workerId];
    localStorage.setItem('orderflow_adjustments', JSON.stringify(adj));
    render();
    showToast(`Reset adjustments for ${workerName} to ₹0`, 'info');
  };

  window.getUsdInrRate = function() {
    return Number(localStorage.getItem('orderflow_usdinr_rate') || 84);
  };

  window.promptUsdInrRate = function() {
    const current = getUsdInrRate();
    const input = prompt('Enter USD to INR conversion rate:', current);
    if (!input) return;
    const rate = Number(input);
    if (!rate || rate <= 0) return;
    localStorage.setItem('orderflow_usdinr_rate', rate);
    render();
    showToast(`Conversion rate set to ₹${rate} / USD`, 'success');
  };

  window.fetchLiveMasiData = async function(manual = false) {
    const label = document.getElementById('sync-btn-label');
    const spinner = document.getElementById('sync-spinner-icon');
    if (label) label.textContent = 'Syncing...';
    if (spinner) spinner.classList.add('animate-spin');

    try {
      const res = await fetch('/api/masi/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bossKey: (state.settings && state.settings.bossKey) || 'WORKER-B030-0827-9A88-4A04' })
      });
      const data = await res.json();
      if (data.success) {
        state.lastMasiSync = new Date();
        await loadInitialData();
        showToast('Live data synced from masi.cc.cd', 'success');
      } else {
        if (manual) showToast('Sync error: ' + (data.error || 'Failed'), 'danger');
      }
    } catch (e) {
      if (manual) showToast('Sync error: ' + e.message, 'danger');
    } finally {
      if (label) label.textContent = 'Sync Masi';
      if (spinner) spinner.classList.remove('animate-spin');
      render();
    }
  };



  const settlementData23Sep = {
    window: "23 Sep 2026, 12:00 AM – 10:00 PM IST (22h)",
    bossMasi: {
      totalCompleted: 219,
      at050: 82,
      at060: 137,
      grossUsd: 123.20,
      penaltiesCount: 164,
      penaltiesUsd: -10.65,
      netUsd: 112.55,
      approxInrNet: 9454.20
    },
    users: [
      {
        id: "tg:@bnzaalam",
        username: "@Bnzaalam",
        displayName: "Bnzaalam",
        keys: [{ name: "Hey123", key: "WORKER-21C3-59F9-EA3B-E26A", done: 32, fail: 1, total: 33, successRate: 97.0 }],
        done: 32,
        fail: 1,
        total: 33,
        successRate: 97.0
      },
      {
        id: "tg:@fileworker_6700",
        username: "@fileworker_6700",
        displayName: "Fileworker",
        keys: [{ name: "Hellxieii", key: "WORKER-B25D-66C6-25F7-C418", done: 30, fail: 6, total: 36, successRate: 83.3 }],
        done: 30,
        fail: 6,
        total: 36,
        successRate: 83.3
      },
      {
        id: "tg:@hashirmhd",
        username: "@hashirmhd",
        displayName: "Hashir",
        keys: [{ name: "Hashirbhai", key: "WORKER-36F9-1F80-EA07-C8DA", done: 22, fail: 3, total: 25, successRate: 88.0 }],
        done: 22,
        fail: 3,
        total: 25,
        successRate: 88.0
      },
      {
        id: "tg:@aashu_97",
        username: "@AASHU_97",
        displayName: "Aashu",
        keys: [{ name: "Aashu", key: "WORKER-7F2C-BE14-84B5-EC3C", done: 15, fail: 6, total: 21, successRate: 71.4 }],
        done: 15,
        fail: 6,
        total: 21,
        successRate: 71.4
      },
      {
        id: "tg:@deep280109",
        username: "@Deep280109",
        displayName: "Deep",
        keys: [{ name: "Depubaby", key: "WORKER-7D0E-10BE-477F-0741", done: 15, fail: 3, total: 18, successRate: 83.3 }],
        done: 15,
        fail: 3,
        total: 18,
        successRate: 83.3
      },
      {
        id: "person:shub",
        username: "shub",
        displayName: "Shubhraj Singh",
        keys: [
          { name: "Paras43", key: "WORKER-06D9-A94C-E26D-C1B2", done: 6, fail: 8, total: 14, successRate: 42.9 },
          { name: "Shub6", key: "WORKER-B1B5-38E0-D897-E5D7", done: 4, fail: 6, total: 10, successRate: 40.0 },
          { name: "Paras19", key: "WORKER-037D-4846-737B-5143", done: 3, fail: 5, total: 8, successRate: 37.5 },
          { name: "Paras42", key: "WORKER-07BB-01F6-7743-7BE8", done: 2, fail: 1, total: 3, successRate: 66.7 }
        ],
        done: 15,
        fail: 20,
        total: 35,
        successRate: 42.9
      },
      {
        id: "tg:@tgrajout",
        username: "@Tgrajout",
        displayName: "Tg Rajput",
        keys: [
          { name: "Paras41", key: "WORKER-B9CC-39EC-1C71-DDEC", done: 6, fail: 7, total: 13, successRate: 46.2 },
          { name: "Shub1", key: "WORKER-48A6-E6A7-89C5-A8E7", done: 5, fail: 1, total: 6, successRate: 83.3 },
          { name: "Paras46", key: "WORKER-7EDD-E24E-A7E0-8813", done: 1, fail: 5, total: 6, successRate: 16.7 },
          { name: "Shub5", key: "WORKER-8CAF-E03B-19C1-E66F", done: 1, fail: 5, total: 6, successRate: 16.7 },
          { name: "Shub3", key: "WORKER-D4A3-4AA1-5B5E-0060", done: 1, fail: 1, total: 2, successRate: 50.0 },
          { name: "Shub9", key: "WORKER-82FF-EC9D-35F4-8648", done: 1, fail: 0, total: 1, successRate: 100.0 }
        ],
        done: 15,
        fail: 19,
        total: 34,
        successRate: 44.1
      },
      {
        id: "tg:@bcnami",
        username: "@BCNAMI",
        displayName: "BC Nami",
        keys: [{ name: "LuffyD", key: "WORKER-BAF8-8A3C-3CA1-5604", done: 14, fail: 7, total: 21, successRate: 66.7 }],
        done: 14,
        fail: 7,
        total: 21,
        successRate: 66.7
      },
      {
        id: "tg:@ntnatri",
        username: "@ntnatri",
        displayName: "Nitin Atri",
        keys: [{ name: "Nitin", key: "WORKER-2D3D-E8D5-B6A1-5CD1", done: 9, fail: 5, total: 14, successRate: 64.3 }],
        done: 9,
        fail: 5,
        total: 14,
        successRate: 64.3
      },
      {
        id: "tg:@rosalie_admin1",
        username: "@ROSALIE_ADMIN1",
        displayName: "Rosalie Admin",
        keys: [
          { name: "Fckme02", key: "WORKER-5C38-E9A2-3950-2DE3", done: 6, fail: 4, total: 10, successRate: 60.0 },
          { name: "1webkeydedo", key: "WORKER-B110-7AFF-53AF-AA74", done: 3, fail: 2, total: 5, successRate: 60.0 }
        ],
        done: 9,
        fail: 6,
        total: 15,
        successRate: 60.0
      },
      {
        id: "tg:@pawan_naidu_24",
        username: "@pawan_naidu_24",
        displayName: "Pawan Naidu",
        keys: [{ name: "Givemeworkbro", key: "WORKER-D8DC-E408-F99E-B402", done: 8, fail: 5, total: 13, successRate: 61.5 }],
        done: 8,
        fail: 5,
        total: 13,
        successRate: 61.5
      },
      {
        id: "person:majid",
        username: "majid",
        displayName: "Majid",
        keys: [{ name: "Majido", key: "WORKER-90C8-CDB0-D93C-26B8", done: 6, fail: 3, total: 9, successRate: 66.7 }],
        done: 6,
        fail: 3,
        total: 9,
        successRate: 66.7
      },
      {
        id: "tg:@shauryagharat4103",
        username: "@shauryagharat4103",
        displayName: "Shaurya Gharat",
        keys: [{ name: "Shaurya", key: "WORKER-98D0-D03A-8138-F09A", done: 5, fail: 3, total: 8, successRate: 62.5 }],
        done: 5,
        fail: 3,
        total: 8,
        successRate: 62.5
      },
      {
        id: "person:loki",
        username: "loki",
        displayName: "Loki",
        keys: [
          { name: "Loki", key: "WORKER-1956-E7B7-7220-B03F", done: 3, fail: 1, total: 4, successRate: 75.0 },
          { name: "W99w8", key: "WORKER-E0F5-49CA-9564-7425", done: 2, fail: 1, total: 3, successRate: 66.7 }
        ],
        done: 5,
        fail: 2,
        total: 7,
        successRate: 71.4
      },
      {
        id: "tg:@laksheswarx",
        username: "@LaksheswarX",
        displayName: "Laksheswar",
        keys: [{ name: "Lokeshwaray", key: "WORKER-0452-3999-5B0F-FF48", done: 3, fail: 5, total: 8, successRate: 37.5 }],
        done: 3,
        fail: 5,
        total: 8,
        successRate: 37.5
      },
      {
        id: "tg:@rayyann30",
        username: "@Rayyann30",
        displayName: "Rayyan",
        keys: [{ name: "Rayansheik", key: "WORKER-98EF-C719-3B23-A25A", done: 3, fail: 3, total: 6, successRate: 50.0 }],
        done: 3,
        fail: 3,
        total: 6,
        successRate: 50.0
      },
      {
        id: "tg:@terajaat012",
        username: "@Terajaat012",
        displayName: "Tera Jaat",
        keys: [{ name: "Jaate", key: "WORKER-A13D-9071-CB21-EEAB", done: 2, fail: 6, total: 8, successRate: 25.0 }],
        done: 2,
        fail: 6,
        total: 8,
        successRate: 25.0
      },
      {
        id: "person:hyper",
        username: "hyper",
        displayName: "Hyper",
        keys: [{ name: "HyperX", key: "WORKER-F4CC-5C42-85A9-617F", done: 2, fail: 5, total: 7, successRate: 28.6 }],
        done: 2,
        fail: 5,
        total: 7,
        successRate: 28.6
      },
      {
        id: "tg:@work4money_owner",
        username: "@Work4money_owner",
        displayName: "Work4Money Owner",
        keys: [{ name: "Aarvworzk", key: "WORKER-708B-BDA0-F8CC-FE52", done: 2, fail: 5, total: 7, successRate: 28.6 }],
        done: 2,
        fail: 5,
        total: 7,
        successRate: 28.6
      },
      {
        id: "person:idk",
        username: "idk",
        displayName: "Idk",
        keys: [{ name: "Woosidk", key: "WORKER-0872-8B7E-1BD4-17CC", done: 2, fail: 4, total: 6, successRate: 33.3 }],
        done: 2,
        fail: 4,
        total: 6,
        successRate: 33.3
      },
      {
        id: "person:sharmaji",
        username: "sharmaji",
        displayName: "Sharmaji",
        keys: [{ name: "Sharmaji", key: "WORKER-9433-07AE-F0AF-26E2", done: 2, fail: 0, total: 2, successRate: 100.0 }],
        done: 2,
        fail: 0,
        total: 2,
        successRate: 100.0
      },
      {
        id: "tg:@kelifor",
        username: "@Kelifor",
        displayName: "Kelifor",
        keys: [{ name: "Kelifor", key: "WORKER-4A7A-EE26-47D4-9F9A", done: 1, fail: 7, total: 8, successRate: 12.5 }],
        done: 1,
        fail: 7,
        total: 8,
        successRate: 12.5
      },
      {
        id: "tg:@psychoalex99",
        username: "@PsychoAlex99",
        displayName: "Alex",
        keys: [{ name: "Alexy", key: "WORKER-957A-2D08-DCB6-118F", done: 1, fail: 1, total: 2, successRate: 50.0 }],
        done: 1,
        fail: 1,
        total: 2,
        successRate: 50.0
      },
      {
        id: "tg:@sonu2538",
        username: "@Sonu2538",
        displayName: "Sonu Singh",
        keys: [{ name: "Sonusingh", key: "WORKER-79E7-D83D-0D37-C64B", done: 1, fail: 1, total: 2, successRate: 50.0 }],
        done: 1,
        fail: 1,
        total: 2,
        successRate: 50.0
      }
    ]
  };


  
  // ==========================================
  // SECURE PDF EXPORT FOR WORKERS PAYOUT
  // HIDES ALL KEYS, PRIVATE IDS, AND BOSS MARGINS
  // Shows ONLY: Telegram Username, Orders Completed, Success Rate, Rate, and Pay
  // ==========================================
  window.exportWorkersPdf = function() {
    const selectedDay = state.selectedDay || '23sep';
    const adjustments = getAdjustments();
    const search = (state.searchQuery || '').toLowerCase().trim();

    let rawGuysList = [];
    let dateTitle = '';

    if (selectedDay === '23sep') {
      dateTitle = '23 Sep 2026 (Daily Payout Settlement)';
      rawGuysList = settlementData23Sep.users.map(u => ({
        id: u.id,
        displayName: u.displayName,
        telegramUsername: u.username,
        completedOrders: u.done,
        totalOrders: u.total,
        failCount: u.fail,
        successRate: u.successRate
      }));
    } else {
      dateTitle = '24 Sep 2026 (Live Ongoing Orders)';
      const allGuys = getGroupedGuys();
      rawGuysList = allGuys.filter(g => {
        if (!g.keys || g.keys.length === 0) return false;
        return (Number(g.completedOrders) > 0) || Boolean(g.telegramUsername) || g.keys.length > 1;
      });
    }

    // Filter by search if any
    let filteredGuys = rawGuysList.filter(g => {
      if (!search) return true;
      const matchName = g.displayName && g.displayName.toLowerCase().includes(search);
      const matchTg = g.telegramUsername && g.telegramUsername.toLowerCase().includes(search);
      return matchName || matchTg;
    });

    // Compute payout and sort highest to lowest pay
    let totalOrders = 0;
    let totalPayout = 0;

    let enrichedGuys = filteredGuys.map(guy => {
      const done = Number(guy.completedOrders) || 0;
      const rate = Number(guy.successRate) || 0;
      const payCalc = calculateWorkerPay(done, rate);
      const adj = Number(adjustments[guy.id] || 0);
      const finalPay = Math.max(0, payCalc.basePay + adj);

      totalOrders += done;
      totalPayout += finalPay;

      return {
        ...guy,
        done,
        rate,
        payCalc,
        adj,
        finalPay
      };
    });

    // Sort strictly from highest pay to lowest pay
    enrichedGuys.sort((a, b) => b.finalPay - a.finalPay || b.done - a.done);

    const generatedAt = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' });

    // Build standalone printable HTML document with ZERO keys and ZERO sensitive credentials
    const printDocHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Worker Payout Settlement - ${escapeHtml(dateTitle)}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 12mm 14mm;
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #0f172a;
      background: #ffffff;
      margin: 0;
      padding: 24px;
      font-size: 13px;
      line-height: 1.45;
    }
    /* Controls banner (hidden in print/PDF) */
    .no-print-banner {
      background: #0f172a;
      color: #ffffff;
      padding: 12px 18px;
      border-radius: 8px;
      margin-bottom: 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 4px 12px rgba(15, 23, 42, 0.15);
    }
    .no-print-banner .desc {
      font-size: 12px;
      color: #94a3b8;
    }
    .btn-print {
      background: #10b981;
      color: #ffffff;
      border: none;
      padding: 8px 16px;
      border-radius: 6px;
      font-weight: 700;
      font-size: 13px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: background 0.15s;
    }
    .btn-print:hover {
      background: #059669;
    }
    .btn-close {
      background: #334155;
      color: #ffffff;
      border: none;
      padding: 8px 14px;
      border-radius: 6px;
      font-weight: 600;
      font-size: 13px;
      cursor: pointer;
      margin-left: 8px;
    }
    /* Document Header */
    .doc-header {
      border-bottom: 2px solid #0f172a;
      padding-bottom: 14px;
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    .doc-title {
      font-size: 22px;
      font-weight: 800;
      color: #0f172a;
      margin: 0;
      letter-spacing: -0.5px;
    }
    .doc-subtitle {
      font-size: 13px;
      color: #475569;
      margin-top: 4px;
      font-weight: 500;
    }
    .doc-meta {
      text-align: right;
      font-size: 11px;
      color: #64748b;
    }
    .doc-meta strong {
      color: #0f172a;
    }
    /* Summary KPI Bar */
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      margin-bottom: 20px;
    }
    .kpi-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 10px 14px;
      text-align: center;
    }
    .kpi-label {
      font-size: 10px;
      text-transform: uppercase;
      font-weight: 700;
      letter-spacing: 0.5px;
      color: #64748b;
    }
    .kpi-value {
      font-size: 18px;
      font-weight: 800;
      color: #0f172a;
      margin-top: 2px;
    }
    /* Clean Table */
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }
    th {
      background: #f1f5f9;
      color: #1e293b;
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding: 10px 12px;
      border-bottom: 2px solid #cbd5e1;
      text-align: left;
    }
    td {
      padding: 9px 12px;
      border-bottom: 1px solid #e2e8f0;
      font-size: 12px;
      color: #334155;
    }
    tr:nth-child(even) td {
      background: #fcfdfe;
    }
    .col-rank {
      width: 45px;
      font-weight: 700;
      color: #64748b;
      text-align: center;
    }
    .col-worker {
      font-weight: 700;
      color: #0f172a;
      font-size: 13px;
    }
    .col-tg {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-weight: 600;
      color: #2563eb;
      font-size: 12px;
    }
    .col-num {
      text-align: center;
      font-weight: 600;
    }
    .col-rate {
      text-align: center;
      font-weight: 700;
      color: #0f172a;
    }
    .col-pay {
      text-align: right;
      font-weight: 800;
      font-size: 13px;
      color: #0f172a;
    }
    /* Total Row */
    .row-total td {
      background: #f8fafc !important;
      font-weight: 800 !important;
      font-size: 13px !important;
      color: #0f172a !important;
      border-top: 2px solid #0f172a !important;
      border-bottom: 2px solid #0f172a !important;
      padding: 12px;
    }
    /* Document Footer */
    .doc-footer {
      border-top: 1px solid #e2e8f0;
      padding-top: 14px;
      margin-top: 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 11px;
      color: #94a3b8;
    }
    .doc-footer .privacy-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      color: #059669;
      font-weight: 600;
    }
    @media print {
      .no-print-banner {
        display: none !important;
      }
      body {
        padding: 0 !important;
      }
      table {
        page-break-inside: auto;
      }
      tr {
        page-break-inside: avoid;
        page-break-after: auto;
      }
      thead {
        display: table-header-group;
      }
    }
  </style>
</head>
<body>

  <!-- Controls Bar for Preview (Excluded from PDF Print) -->
  <div class="no-print-banner">
    <div>
      <div style="font-weight: 800; font-size: 14px;">📄 Worker Payout Statement Ready for PDF</div>
      <div class="desc">All worker keys, internal IDs, and private details are automatically hidden. Click below to save as PDF.</div>
    </div>
    <div>
      <button onclick="window.print()" class="btn-print">
        🖨️ Save as PDF / Print
      </button>
      <button onclick="window.close()" class="btn-close">
        ✕ Close
      </button>
    </div>
  </div>

  <!-- Statement Header -->
  <div class="doc-header">
    <div>
      <h1 class="doc-title">Worker Payout Settlement Statement</h1>
      <div class="doc-subtitle">${escapeHtml(dateTitle)}</div>
    </div>
    <div class="doc-meta">
      <div>Generated: <strong>${escapeHtml(generatedAt)}</strong></div>
      <div>Status: <strong style="color: #059669;">Verified & Approved</strong></div>
    </div>
  </div>

  <!-- Summary KPI Bar -->
  <div class="kpi-grid">
    <div class="kpi-card">
      <div class="kpi-label">Total Workers</div>
      <div class="kpi-value">${enrichedGuys.length}</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">Completed Orders</div>
      <div class="kpi-value">${totalOrders} QRs</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">Average Rate</div>
      <div class="kpi-value">₹${totalOrders > 0 ? (totalPayout / totalOrders).toFixed(1) : 0}/QR</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label" style="color: #059669;">Total Payout</div>
      <div class="kpi-value" style="color: #059669;">₹${totalPayout.toLocaleString('en-IN')}</div>
    </div>
  </div>

  <!-- Payout Table (Zero Keys, Zero Credentials) -->
  <table>
    <thead>
      <tr>
        <th class="col-rank">#</th>
        <th>Worker / Name</th>
        <th>Telegram Handle</th>
        <th class="col-num">Completed QRs</th>
        <th class="col-num">Success Rate</th>
        <th class="col-rate">Applied Rate</th>
        <th class="col-pay">Pay to Receive</th>
      </tr>
    </thead>
    <tbody>
      ${enrichedGuys.map((guy, idx) => {
        return `
          <tr>
            <td class="col-rank">#${idx + 1}</td>
            <td class="col-worker">${escapeHtml(guy.displayName || guy.personName || guy.id)}</td>
            <td class="col-tg">${guy.telegramUsername ? escapeHtml(guy.telegramUsername) : '—'}</td>
            <td class="col-num">${guy.done}</td>
            <td class="col-num">${guy.rate}%</td>
            <td class="col-rate">₹${guy.payCalc.tierRate}/QR</td>
            <td class="col-pay">₹${guy.finalPay.toLocaleString('en-IN')}</td>
          </tr>
        `;
      }).join('')}
      <!-- Total Summary Row -->
      <tr class="row-total">
        <td colspan="3" style="text-align: left;">TOTAL SUMMARY (${enrichedGuys.length} WORKERS)</td>
        <td class="col-num">${totalOrders} QRs</td>
        <td class="col-num">—</td>
        <td class="col-rate">—</td>
        <td class="col-pay">₹${totalPayout.toLocaleString('en-IN')}</td>
      </tr>
    </tbody>
  </table>

  <!-- Document Footer -->
  <div class="doc-footer">
    <div class="privacy-badge">
      🔒 Privacy Protected: Worker keys, internal credentials, and private metrics have been omitted.
    </div>
    <div>
      Official Payout Statement • Page 1 of 1
    </div>
  </div>

  <script>
    // Automatically trigger print dialog on preview load
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 350);
    };
  </script>
</body>
</html>`;

    // Open print window
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(printDocHtml);
      printWindow.document.close();
      showToast('📄 PDF Export window opened — Print or Save as PDF', 'success');
    } else {
      // If popup blocker intervened, provide in-page print fallback
      const printFrame = document.createElement('iframe');
      printFrame.style.position = 'fixed';
      printFrame.style.right = '0';
      printFrame.style.bottom = '0';
      printFrame.style.width = '0';
      printFrame.style.height = '0';
      printFrame.style.border = '0';
      document.body.appendChild(printFrame);
      printFrame.contentDocument.open();
      printFrame.contentDocument.write(printDocHtml);
      printFrame.contentDocument.close();
      setTimeout(() => {
        printFrame.contentWindow.focus();
        printFrame.contentWindow.print();
        setTimeout(() => document.body.removeChild(printFrame), 5000);
      }, 500);
      showToast('📄 Opened print dialog', 'info');
    }
  };

  window.setDayFilter = function(day) {
    state.selectedDay = day;
    render();
    const dayLabel = day === '23sep' ? '23 Sep (Full Settlement)' : '24 Sep (Today Live)';
    showToast('Switched to ' + dayLabel, 'info');
  };

  window.setSortBy = function(sortKey) {
    state.sortBy = sortKey;
    render();
  };


  // Rate Chart: 1-5: ₹25, 6-10: ₹27, 11-20: ₹31, 20+: ₹35, 30+: ₹40. (<60% max ₹32)
  function calculateWorkerPay(completedCount, successRate) {
    const done = Number(completedCount) || 0;
    const rateNum = Number(successRate) || 0;
    if (done <= 0) return { tierRate: 0, basePay: 0, isCapped: false, tierLabel: '0 QR' };

    let tierRate = 25;
    let tierLabel = '1–5 QR (₹25)';
    if (done > 30) {
      tierRate = 40;
      tierLabel = '30+ QR (₹40)';
    } else if (done > 20) {
      tierRate = 35;
      tierLabel = '20+ QR (₹35)';
    } else if (done > 10) {
      tierRate = 31;
      tierLabel = '11–20 QR (₹31)';
    } else if (done > 5) {
      tierRate = 27;
      tierLabel = '6–10 QR (₹27)';
    }

    let isCapped = false;
    if (rateNum > 0 && rateNum < 60 && tierRate > 32) {
      tierRate = 32;
      isCapped = true;
      tierLabel += ' [Capped @ ₹32 (<60% success)]';
    }

    return { tierRate, basePay: done * tierRate, isCapped, tierLabel };
  }

  function getAdjustments() {
    try {
      return JSON.parse(localStorage.getItem('orderflow_adjustments') || '{}');
    } catch (e) {
      return {};
    }
  }

  window.setWorkerAdjustment = function(workerId, amount) {
    const adj = getAdjustments();
    const current = Number(adj[workerId] || 0);
    adj[workerId] = current + Number(amount);
    localStorage.setItem('orderflow_adjustments', JSON.stringify(adj));
    render();
    showToast(`Adjustment: ₹${adj[workerId] >= 0 ? '+' : ''}${adj[workerId]}`, 'info');
  };

  window.promptCustomAdjustment = function(workerId, workerName) {
    const adj = getAdjustments();
    const current = Number(adj[workerId] || 0);
    const input = prompt(`Enter bonus (+) or deduction (-) for ${workerName} in ₹:`, current);
    if (input === null) return;
    const val = Number(input);
    if (isNaN(val)) return;
    adj[workerId] = val;
    localStorage.setItem('orderflow_adjustments', JSON.stringify(adj));
    render();
    showToast(`Set adjustment for ${workerName}: ₹${val >= 0 ? '+' : ''}${val}`, 'success');
  };

  window.resetWorkerAdjustment = function(workerId, workerName) {
    const adj = getAdjustments();
    delete adj[workerId];
    localStorage.setItem('orderflow_adjustments', JSON.stringify(adj));
    render();
    showToast(`Reset adjustments for ${workerName} to ₹0`, 'info');
  };

  window.getUsdInrRate = function() {
    return Number(localStorage.getItem('orderflow_usdinr_rate') || 84);
  };

  window.promptUsdInrRate = function() {
    const current = getUsdInrRate();
    const input = prompt('Enter USD to INR conversion rate:', current);
    if (!input) return;
    const rate = Number(input);
    if (!rate || rate <= 0) return;
    localStorage.setItem('orderflow_usdinr_rate', rate);
    render();
    showToast(`Conversion rate set to ₹${rate} / USD`, 'success');
  };

  window.fetchLiveMasiData = async function(manual = false) {
    const label = document.getElementById('sync-btn-label');
    const spinner = document.getElementById('sync-spinner-icon');
    if (label) label.textContent = 'Syncing...';
    if (spinner) spinner.classList.add('animate-spin');

    try {
      const res = await fetch('/api/masi/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bossKey: (state.settings && state.settings.bossKey) || 'WORKER-B030-0827-9A88-4A04' })
      });
      const data = await res.json();
      if (data.success) {
        state.lastMasiSync = new Date();
        await loadInitialData();
        showToast('Live data synced from masi.cc.cd', 'success');
      } else {
        if (manual) showToast('Sync error: ' + (data.error || 'Failed'), 'danger');
      }
    } catch (e) {
      if (manual) showToast('Sync error: ' + e.message, 'danger');
    } finally {
      if (label) label.textContent = 'Sync Masi';
      if (spinner) spinner.classList.remove('animate-spin');
      render();
    }
  };

  // ==========================================
  // PANEL: CLEAN MINIMAL LIGHT DASHBOARD
  // ==========================================
  function renderGuysPanel(container) {
    const adjustments = getAdjustments();
    const usdInrRate = getUsdInrRate();
    const search = (state.searchQuery || '').toLowerCase().trim();
    const selectedDay = state.selectedDay || '23sep';
    const sortBy = state.sortBy || 'pay-desc';

    // Retrieve workers list based on selected Day
    let rawGuysList = [];
    let grossCreditUsd = 0;
    let penaltyDeductionsUsd = 0;
    let netCreditUsd = 0;
    let dayWindowLabel = '';

    if (selectedDay === '23sep') {
      grossCreditUsd = settlementData23Sep.bossMasi.grossUsd;
      penaltyDeductionsUsd = settlementData23Sep.bossMasi.penaltiesUsd;
      netCreditUsd = settlementData23Sep.bossMasi.netUsd;
      dayWindowLabel = settlementData23Sep.window;

      // Base 23 Sep dataset with live drag-and-drop merge overrides
      rawGuysList = settlementData23Sep.users.map(u => ({
        id: u.id,
        displayName: u.displayName,
        telegramUsername: u.username,
        completedOrders: u.done,
        totalOrders: u.total,
        failCount: u.fail,
        successRate: u.successRate,
        keys: u.keys.map(k => ({
          name: k.name,
          key: k.key,
          completedOrders: k.done,
          failCount: k.fail,
          totalOrders: k.total,
          successRate: k.successRate
        }))
      }));
    } else {
      // Today / 24 Sep live data from state.workers
      const allGuys = getGroupedGuys();
      grossCreditUsd = 0;
      penaltyDeductionsUsd = 0;
      dayWindowLabel = '24 Sep 2026 (Live Ongoing)';

      rawGuysList = allGuys.filter(g => {
        if (!g.keys || g.keys.length === 0) return false;
        if (search) {
          const matchName = g.displayName && g.displayName.toLowerCase().includes(search);
          const matchTg = g.telegramUsername && g.telegramUsername.toLowerCase().includes(search);
          const matchKey = g.keys.some(k => (k.name && k.name.toLowerCase().includes(search)) || (k.key && k.key.toLowerCase().includes(search)));
          return matchName || matchTg || matchKey;
        }
        return (Number(g.completedOrders) > 0) || Boolean(g.telegramUsername) || g.keys.length > 1;
      });

      const todayCompleted = rawGuysList.reduce((sum, g) => sum + (Number(g.completedOrders) || 0), 0);
      grossCreditUsd = Number((todayCompleted * 0.55).toFixed(2));
      penaltyDeductionsUsd = 0;
      netCreditUsd = grossCreditUsd;
    }

    // Apply Search Filter if any
    let filteredGuys = rawGuysList.filter(g => {
      if (!search) return true;
      const matchName = g.displayName && g.displayName.toLowerCase().includes(search);
      const matchTg = g.telegramUsername && g.telegramUsername.toLowerCase().includes(search);
      const matchKey = g.keys.some(k => (k.name && k.name.toLowerCase().includes(search)) || (k.key && k.key.toLowerCase().includes(search)));
      return matchName || matchTg || matchKey;
    });

    // Compute payouts and flag underperforming status (< 4 QR and < 40% success rate)
    let totalTeamBasePay = 0;
    let totalTeamAdjustments = 0;
    let totalTeamCompletedOrders = 0;

    let enrichedGuys = filteredGuys.map(guy => {
      const done = Number(guy.completedOrders) || 0;
      const rate = Number(guy.successRate) || 0;
      const payCalc = calculateWorkerPay(done, rate);
      const adjustment = Number(adjustments[guy.id] || 0);
      const finalPay = Math.max(0, payCalc.basePay + adjustment);

      // Underperforming Rule (< 4 QR & < 40% success rate)
      const isUnderperforming = (done < 4 && rate < 40);

      totalTeamBasePay += payCalc.basePay;
      totalTeamAdjustments += adjustment;
      totalTeamCompletedOrders += done;

      // Check keys inside team for underperforming (< 4 QR & < 40%)
      const processedKeys = (guy.keys || []).map(k => {
        const kDone = Number(k.completedOrders !== undefined ? k.completedOrders : (k.completedCount || 0));
        let kRate = Number(k.successRate || 0);
        if (!kRate && (kDone + Number(k.failCount || 0)) > 0) {
          kRate = Number(((kDone / (kDone + Number(k.failCount || 0))) * 100).toFixed(1));
        }
        const isKeyUnderperforming = (kDone < 4 && kRate < 40);
        return {
          ...k,
          kDone,
          kRate,
          isKeyUnderperforming
        };
      });

      return {
        ...guy,
        done,
        rate,
        payCalc,
        adjustment,
        finalPay,
        isUnderperforming,
        processedKeys
      };
    });

    // Sort workers strictly (Default: Pay Highest to Lowest)
    if (sortBy === 'pay-desc') {
      enrichedGuys.sort((a, b) => b.finalPay - a.finalPay || b.done - a.done);
    } else if (sortBy === 'pay-asc') {
      enrichedGuys.sort((a, b) => a.finalPay - b.finalPay || a.done - b.done);
    } else if (sortBy === 'orders-desc') {
      enrichedGuys.sort((a, b) => b.done - a.done || b.finalPay - a.finalPay);
    } else if (sortBy === 'rate-desc') {
      enrichedGuys.sort((a, b) => b.rate - a.rate || b.done - a.done);
    } else if (sortBy === 'name-asc') {
      enrichedGuys.sort((a, b) => (a.displayName || '').localeCompare(b.displayName || ''));
    }

    // Boss Net Profit & Credit Inflow Calculations
    const totalWorkerPayout = totalTeamBasePay + totalTeamAdjustments;
    const masiNetInr = netCreditUsd * usdInrRate;
    const bossDailyProfit = masiNetInr - totalWorkerPayout;
    const profitMarginPct = masiNetInr > 0 ? ((bossDailyProfit / masiNetInr) * 100).toFixed(1) : '0';

    let html = `
      <div class="space-y-4">
        <!-- 1. DAY FILTER & SORT CONTROLS BAR -->
        <div class="bg-white rounded-xl border border-slate-200 p-3 sm:p-4 shadow-2xs flex flex-wrap items-center justify-between gap-3">
          <!-- Day Switcher -->
          <div class="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-bold">
            <button 
              onclick="setDayFilter('23sep')" 
              class="px-3 py-1.5 rounded-md transition ${selectedDay === '23sep' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'}"
            >
              📅 23 Sep (Full Settlement)
            </button>
            <button 
              onclick="setDayFilter('24sep')" 
              class="px-3 py-1.5 rounded-md transition ${selectedDay === '24sep' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'}"
            >
              📅 24 Sep (Today Live)
            </button>
          </div>

          <!-- Sort Selector -->
          <div class="flex items-center gap-2 text-xs">
            <!-- Export PDF Button -->
            <button 
              onclick="exportWorkersPdf()" 
              title="Export clean worker payout summary as PDF (hides all keys and private credentials)" 
              class="px-2.5 py-1.5 rounded-lg text-xs font-bold text-slate-800 bg-white hover:bg-slate-100 border border-slate-300 shadow-2xs transition flex items-center gap-1 active:scale-95"
            >
              <svg class="w-3.5 h-3.5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              <span>Export PDF</span>
            </button>

            <span class="text-slate-500 font-medium">Sort by:</span>
            <select 
              onchange="setSortBy(this.value)" 
              class="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-slate-400"
            >
              <option value="pay-desc" ${sortBy === 'pay-desc' ? 'selected' : ''}>💰 Pay: Highest → Lowest</option>
              <option value="pay-asc" ${sortBy === 'pay-asc' ? 'selected' : ''}>💰 Pay: Lowest → Highest</option>
              <option value="orders-desc" ${sortBy === 'orders-desc' ? 'selected' : ''}>📦 Completed QRs: Highest</option>
              <option value="rate-desc" ${sortBy === 'rate-desc' ? 'selected' : ''}>🎯 Success Rate: Highest</option>
              <option value="name-asc" ${sortBy === 'name-asc' ? 'selected' : ''}>👤 Worker Name: A–Z</option>
            </select>
          </div>
        </div>

        <!-- 2. BOSS NET PROFIT & CREDIT RECEIVED SETTLEMENT CARD -->
        <div class="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
          <div class="flex flex-wrap items-center justify-between gap-3 pb-3.5 border-b border-slate-100">
            <div>
              <div class="flex items-center gap-2">
                <span class="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                  ${selectedDay === '23sep' ? '23 Sep Net Take-Home (Credit Received)' : 'Today\'s Estimated Net Profit'}
                </span>
                <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                  ${dayWindowLabel}
                </span>
              </div>
              <div class="text-3xl sm:text-4xl font-black ${bossDailyProfit >= 0 ? 'text-emerald-600' : 'text-rose-600'} mt-1">
                ${bossDailyProfit >= 0 ? '+₹' + bossDailyProfit.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '-₹' + Math.abs(bossDailyProfit).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>

            <div class="text-right">
              <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${bossDailyProfit >= 0 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}">
                ${profitMarginPct}% Net Margin
              </span>
              <div class="text-[11px] text-slate-400 mt-1 flex items-center justify-end gap-1">
                <span>1 USD = ₹${usdInrRate}</span>
                <button onclick="promptUsdInrRate()" title="Edit conversion rate" class="text-slate-600 hover:text-slate-900 font-bold">✏️</button>
              </div>
            </div>
          </div>

          <!-- 4 Detailed Metric Blocks -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
            <div class="bg-slate-50 border border-slate-200 rounded-lg p-3 text-center">
              <div class="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Net Credit Inflow</div>
              <div class="text-base sm:text-lg font-black text-slate-900 mt-0.5">₹${masiNetInr.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
              <div class="text-[10px] text-slate-500 mt-0.5">$${netCreditUsd.toFixed(2)} USD</div>
            </div>

            <div class="bg-slate-50 border border-slate-200 rounded-lg p-3 text-center">
              <div class="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Total Workers Outflow</div>
              <div class="text-base sm:text-lg font-black text-slate-900 mt-0.5">₹${totalWorkerPayout.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
              <div class="text-[10px] text-slate-500 mt-0.5">${totalTeamAdjustments !== 0 ? 'Base ₹' + totalTeamBasePay + ' + Adj ₹' + totalTeamAdjustments : '24 Workers Total'}</div>
            </div>

            <div class="bg-slate-50 border border-slate-200 rounded-lg p-3 text-center">
              <div class="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Completed QRs</div>
              <div class="text-base sm:text-lg font-black text-slate-900 mt-0.5">${totalTeamCompletedOrders}</div>
              <div class="text-[10px] text-slate-500 mt-0.5">Fulfilled Orders</div>
            </div>

            <div class="bg-slate-50 border border-slate-200 rounded-lg p-3 text-center">
              <div class="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Active Profiles</div>
              <div class="text-base sm:text-lg font-black text-slate-900 mt-0.5">${enrichedGuys.length}</div>
              <div class="text-[10px] text-slate-500 mt-0.5">Sorted Highest to Lowest</div>
            </div>
          </div>

          <!-- Credit Received Breakdown Formula -->
          <div class="mt-3.5 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-600 bg-slate-50/60 px-3 py-2 rounded-lg">
            <div class="flex items-center gap-3 flex-wrap">
              <span><strong>Gross Credit:</strong> $${grossCreditUsd.toFixed(2)}</span>
              <span><strong>Penalties:</strong> $${penaltyDeductionsUsd.toFixed(2)}</span>
              <span><strong>Net Credit:</strong> $${netCreditUsd.toFixed(2)} (= ₹${masiNetInr.toFixed(2)})</span>
              <span><strong>Workers:</strong> -₹${totalWorkerPayout.toFixed(2)}</span>
            </div>
            <div class="font-extrabold text-emerald-700">
              Take-Home: +₹${bossDailyProfit.toFixed(2)}
            </div>
          </div>
        </div>

        <!-- 3. RATES & UNDERPERFORMING RULE REFERENCE BAR -->
        <div class="bg-white rounded-lg border border-slate-200 px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 shadow-2xs">
          <div class="flex items-center gap-1.5 flex-wrap">
            <span class="font-bold text-slate-800">Tiers:</span>
            <span class="px-2 py-0.5 rounded bg-slate-100 font-medium">1–5: ₹25</span>
            <span class="px-2 py-0.5 rounded bg-slate-100 font-medium">6–10: ₹27</span>
            <span class="px-2 py-0.5 rounded bg-slate-100 font-medium">11–20: ₹31</span>
            <span class="px-2 py-0.5 rounded bg-slate-100 font-medium">20+: ₹35</span>
            <span class="px-2 py-0.5 rounded bg-slate-100 font-medium">30+: ₹40</span>
            <span class="px-2 py-0.5 rounded bg-amber-50 text-amber-700 font-semibold">&lt;60% max ₹32</span>
            <span class="px-2 py-0.5 rounded bg-rose-50 text-rose-700 font-bold border border-rose-200">
              ⚠️ &lt;4 QR &amp; &lt;40%: Red Flag
            </span>
          </div>

          <div class="text-[11px] text-slate-400">
            ⚡ 1-Tap Copy Key • Drag to Merge • Drop Left to Separate
          </div>
        </div>

        <!-- 4. WORKERS LIST (SORTED STRICTLY HIGHEST TO LOWEST PAY) -->
        <div class="space-y-2.5">
          ${enrichedGuys.map((guy, idx) => {
            const hasMultipleKeys = (guy.processedKeys || []).length > 1;
            const isIndividual = !hasMultipleKeys;

            // Individual underperforming (< 4 QR & < 40% success rate)
            const isRedProfit = isIndividual && guy.isUnderperforming;

            return `
              <div 
                ondragover="handleKeyDragOver(event)"
                ondragleave="handleKeyDragLeave(event)"
                ondrop="handleKeyDrop(event, '${guy.id}')"
                class="bg-white rounded-xl border ${isRedProfit ? 'border-rose-300 ring-1 ring-rose-100' : 'border-slate-200 hover:border-slate-300'} p-4 shadow-2xs transition"
              >
                <!-- Worker Row Header -->
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div class="flex items-center gap-3">
                    <!-- Rank Badge -->
                    <span class="w-6 h-6 rounded-full ${idx === 0 ? 'bg-amber-100 text-amber-800 font-black' : (idx === 1 ? 'bg-slate-200 text-slate-800 font-black' : (idx === 2 ? 'bg-amber-50 text-amber-700 font-bold' : 'bg-slate-100 text-slate-600 font-semibold'))} flex items-center justify-center text-xs select-none">
                      #${idx + 1}
                    </span>

                    <div>
                      <div class="flex items-center gap-2 flex-wrap">
                        <span class="text-sm font-extrabold text-slate-900">${escapeHtml(guy.displayName || guy.personName || guy.id)}</span>
                        
                        ${guy.telegramUsername ? `
                          <button onclick="copyToClipboard('${escapeHtml(guy.telegramUsername)}', 'Telegram Handle')" title="1-Tap Copy Handle" class="text-xs text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded font-mono transition">
                            ${escapeHtml(guy.telegramUsername)}
                          </button>
                        ` : ''}

                        <!-- Rate Badge -->
                        <span class="px-2 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
                          Rate: ₹${guy.payCalc.tierRate}/QR
                        </span>

                        <!-- Success Rate Badge -->
                        <span class="px-2 py-0.5 rounded-md text-[11px] font-bold ${guy.rate >= 80 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : (guy.rate >= 50 ? 'bg-slate-100 text-slate-700 border border-slate-200' : 'bg-rose-50 text-rose-700 border border-rose-200')}">
                          ${guy.rate}% Success
                        </span>

                        <!-- Individual Underperforming Warning Tag -->
                        ${isRedProfit ? `
                          <span class="px-2 py-0.5 rounded-md text-[10px] font-black bg-rose-100 text-rose-800 border border-rose-300">
                            ⚠️ &lt;4 QR &amp; &lt;40% Low Perf
                          </span>
                        ` : ''}

                        ${guy.payCalc.isCapped ? `
                          <span class="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            Capped @ ₹32
                          </span>
                        ` : ''}
                      </div>

                      <div class="text-[11px] text-slate-400 mt-0.5">
                        ${guy.done} Completed QRs • Formula: ${guy.done} × ₹${guy.payCalc.tierRate} = ₹${guy.payCalc.basePay}
                      </div>
                    </div>
                  </div>

                  <!-- Right Side: Bonus Adjustments & Final Pay Badge -->
                  <div class="flex items-center gap-3 sm:justify-end">
                    <!-- Bonus / Adjustment Controls -->
                    <div class="flex items-center gap-1 text-[11px]">
                      <span class="text-slate-400 mr-0.5">Bonus:</span>
                      <button onclick="setWorkerAdjustment('${guy.id}', 50)" title="+₹50 Bonus" class="px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold active:scale-95 transition">
                        +50
                      </button>
                      <button onclick="setWorkerAdjustment('${guy.id}', -50)" title="-₹50 Deduction" class="px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold active:scale-95 transition">
                        -50
                      </button>
                      <button onclick="promptCustomAdjustment('${guy.id}', '${escapeHtml(guy.displayName)}')" title="Custom Bonus/Deduction" class="px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold active:scale-95 transition">
                        ✏️
                      </button>
                      ${guy.adjustment !== 0 ? `
                        <span class="font-bold ${guy.adjustment > 0 ? 'text-emerald-600' : 'text-rose-600'}">
                          (${guy.adjustment > 0 ? '+' : ''}₹${guy.adjustment})
                        </span>
                        <button onclick="resetWorkerAdjustment('${guy.id}', '${escapeHtml(guy.displayName)}')" title="Reset to ₹0" class="text-slate-400 hover:text-rose-600">⟲</button>
                      ` : ''}
                    </div>

                    <!-- Final Pay / Profit Badge (RED if Individual and Underperforming) -->
                    <div class="text-right">
                      ${isRedProfit ? `
                        <div class="px-3 py-1 rounded-lg bg-rose-100 border border-rose-300 text-rose-800 font-black text-base shadow-2xs inline-block">
                          ₹${guy.finalPay.toLocaleString('en-IN')}
                        </div>
                      ` : `
                        <div class="px-3 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 font-black text-base inline-block">
                          ₹${guy.finalPay.toLocaleString('en-IN')}
                        </div>
                      `}
                    </div>
                  </div>
                </div>

                <!-- Keys Row -->
                <div class="mt-2.5 flex flex-wrap gap-2 items-center">
                  ${(guy.processedKeys || []).map(k => {
                    const isRedKeyInTeam = hasMultipleKeys && k.isKeyUnderperforming;

                    return `
                      <div 
                        draggable="true" 
                        ondragstart="handleKeyDragStart(event, '${escapeHtml(k.key)}')" 
                        ondragend="handleKeyDragEnd(event)"
                        title="${isRedKeyInTeam ? '⚠️ Underperforming key (<4 QR & <40%) - Drag to reassign or drop left to separate' : 'Drag to merge onto another worker, or drop on left to separate'}"
                        class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono cursor-grab active:cursor-grabbing transition ${isRedKeyInTeam ? 'bg-rose-50 border-2 border-rose-400 text-rose-800 shadow-2xs font-bold' : 'bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800'}"
                      >
                        <span class="${isRedKeyInTeam ? 'text-rose-400' : 'text-slate-300'} font-sans select-none text-[10px]">⋮⋮</span>
                        <span class="font-sans font-bold ${isRedKeyInTeam ? 'text-rose-900' : 'text-slate-800'}">${escapeHtml(k.name || k.key)}</span>
                        <span class="${isRedKeyInTeam ? 'text-rose-300' : 'text-slate-300'}">|</span>
                        <span 
                          onclick="copyToClipboard('${escapeHtml(k.key)}', 'Key')" 
                          title="⚡ 1-Tap Copy: ${escapeHtml(k.key)}" 
                          class="${isRedKeyInTeam ? 'text-rose-800 hover:text-rose-950 font-bold' : 'text-slate-600 hover:text-slate-900 font-medium'} cursor-pointer"
                        >
                          ${escapeHtml(k.key)}
                        </span>
                        
                        <span class="text-[10px] px-1.5 py-0.2 rounded ${isRedKeyInTeam ? 'bg-rose-200 text-rose-900 font-black' : 'bg-slate-200 text-slate-700 font-bold'} font-sans">
                          ${k.kDone}✓ (${k.kRate}%)
                        </span>

                        <!-- Red Warning Flag for team key -->
                        ${isRedKeyInTeam ? `
                          <span class="text-[10px] text-rose-700 font-bold font-sans">
                            ⚠️ &lt;4 QR &amp; &lt;40%
                          </span>
                        ` : ''}

                        <!-- Separate Button for multi-key teams -->
                        ${hasMultipleKeys ? `
                          <button 
                            onclick="resetKeyToOriginalForm('${escapeHtml(k.key)}')" 
                            title="Separate ${escapeHtml(k.name || k.key)} from team" 
                            class="ml-1 text-[10px] text-rose-500 hover:text-rose-700 font-sans font-bold"
                          >
                            ↩
                          </button>
                        ` : ''}
                      </div>
                    `;
                  }).join('')}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;

    container.innerHTML = html;
  }


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
    if (searchInput) { searchInput.oninput = (e) => { state.searchQuery = e.target.value; render(); }; }
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
