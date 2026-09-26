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
    selectedDay: '26sep',
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
  function showToast(message, type = 'info') {
    window.showToast = showToast;
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
        const isUnnamed = !worker.name || worker.name.trim() === '' || worker.name.startsWith('WORKER-') || worker.name.toLowerCase() === 'unnamed';
        if (isUnnamed) {
          if (!window.__idkMap) window.__idkMap = new Map();
          const cleanKey = (worker.key || '').toUpperCase();
          if (!window.__idkMap.has(cleanKey)) {
            const nextIdx = window.__idkMap.size + 1;
            window.__idkMap.set(cleanKey, 'idk ' + nextIdx);
          }
          const assignedIdk = window.__idkMap.get(cleanKey);
          groupKey = 'idk:' + assignedIdk.replace(/\s+/g, '_');
          displayName = assignedIdk;
        } else {
          groupKey = 'worker:' + (worker.key || worker.name).toLowerCase();
          displayName = worker.name || worker.key;
        }
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

    // Day-Scoped LocalStorage Helpers
  function getActiveDay() {
    return (state && state.selectedDay) || '26sep';
  }

  function getPaidStatusMap(day) {
    const d = day || getActiveDay();
    try {
      return JSON.parse(localStorage.getItem('orderflow_paid_' + d) || '{}');
    } catch (e) {
      return {};
    }
  }

  function getAdjustments(day) {
    const d = day || getActiveDay();
    try {
      return JSON.parse(localStorage.getItem('orderflow_adj_' + d) || '{}');
    } catch (e) {
      return {};
    }
  }

  function getCustomPayMap(day) {
    const d = day || getActiveDay();
    try {
      return JSON.parse(localStorage.getItem('orderflow_custom_pay_' + d) || '{}');
    } catch (e) {
      return {};
    }
  }

  function getCustomNotesMap(day) {
    const d = day || getActiveDay();
    try {
      return JSON.parse(localStorage.getItem('orderflow_custom_notes_' + d) || '{}');
    } catch (e) {
      return {};
    }
  }

  window.toggleWorkerPaid = function(workerId, workerName, payAmount) {
    const d = getActiveDay();
    const paid = getPaidStatusMap(d);
    paid[workerId] = !paid[workerId];
    localStorage.setItem('orderflow_paid_' + d, JSON.stringify(paid));
    render();
    showToast(`${workerName} marked as ${paid[workerId] ? 'PAID (₹' + payAmount + ')' : 'UNPAID'} for ${d}`, 'info');
  };

  window.setWorkerAdjustment = function(workerId, amount) {
    const d = getActiveDay();
    const adj = getAdjustments(d);
    const current = Number(adj[workerId] || 0);
    adj[workerId] = current + Number(amount);
    localStorage.setItem('orderflow_adj_' + d, JSON.stringify(adj));
    render();
    showToast(`Adjustment for ${d}: ₹${adj[workerId] >= 0 ? '+' : ''}${adj[workerId]}`, 'info');
  };

  window.promptCustomAdjustment = function(workerId, workerName) {
    const d = getActiveDay();
    const adj = getAdjustments(d);
    const current = Number(adj[workerId] || 0);
    const input = prompt(`Enter bonus (+) or deduction (-) for ${workerName} in ₹ (${d}):`, current);
    if (input === null) return;
    const val = Number(input);
    if (isNaN(val)) return;
    adj[workerId] = val;
    localStorage.setItem('orderflow_adj_' + d, JSON.stringify(adj));
    render();
    showToast(`Set adjustment for ${workerName} (${d}): ₹${val >= 0 ? '+' : ''}${val}`, 'success');
  };

  window.resetWorkerAdjustment = function(workerId, workerName) {
    const d = getActiveDay();
    const adj = getAdjustments(d);
    delete adj[workerId];
    localStorage.setItem('orderflow_adj_' + d, JSON.stringify(adj));
    render();
    showToast(`Reset adjustments for ${workerName} (${d}) to ₹0`, 'info');
  };

  window.promptCustomPayAndNote = function(workerId, workerName, currentPay) {
    const d = getActiveDay();
    const customPayMap = getCustomPayMap(d);
    const customNotesMap = getCustomNotesMap(d);

    const curVal = customPayMap[workerId] !== undefined ? customPayMap[workerId] : currentPay;
    const inputPay = prompt(`Enter custom total payout for ${workerName} in ₹ (${d}):`, curVal);
    if (inputPay === null) return;

    const curNote = customNotesMap[workerId] || '';
    const inputNote = prompt(`Enter detail / custom note for ${workerName} (${d}):`, curNote);

    if (inputPay.trim() !== '') {
      customPayMap[workerId] = Number(inputPay);
      localStorage.setItem('orderflow_custom_pay_' + d, JSON.stringify(customPayMap));
    }
    if (inputNote !== null && inputNote.trim() !== '') {
      customNotesMap[workerId] = inputNote.trim();
      localStorage.setItem('orderflow_custom_notes_' + d, JSON.stringify(customNotesMap));
    }
    render();
    showToast(`Updated custom details for ${workerName} (${d})`, 'success');
  };

  function getUsdInrRate() {
    return Number(localStorage.getItem('orderflow_usdinr_rate') || 84);
  }
  window.getUsdInrRate = getUsdInrRate;

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
    "window": "23 Sep 2026, 02:00 AM – 24 Sep 2026, 12:01 AM IST (22h 1m)",
    "generatedAt": "2026-09-23T22:06:39.195Z",
    "bossMasi": {
        "totalCompleted": 217,
        "ratePerSuccess": 0.60,
        "lossPerFailure": 0.10,
        "grossUsd": 130.20,
        "penaltiesCount": 172,
        "penaltiesUsd": -17.20,
        "netUsd": 113.00,
        "approxInrNet": 9492
    },
    "users": [
        {
            "id": "tg:@bnzaalam",
            "username": "@Bnzaalam",
            "displayName": "Bnzaalam",
            "fixedRateUsd": null,
            "fixedRateInr": null,
            "phone": null,
            "registeredKeys": [
                "WORKER-21C3-59F9-EA3B-E26A"
            ],
            "keys": [
                {
                    "name": "Hey123",
                    "key": "WORKER-21C3-59F9-EA3B-E26A",
                    "done": 32,
                    "fail": 1,
                    "total": 33,
                    "successRate": 97
                }
            ],
            "done": 32,
            "fail": 1,
            "total": 33,
            "successRate": 97
        },
        {
            "id": "tg:@fileworker_6700",
            "username": "@fileworker_6700",
            "displayName": "Fileworker",
            "fixedRateUsd": null,
            "fixedRateInr": null,
            "phone": null,
            "registeredKeys": [
                "WORKER-B25D-66C6-25F7-C418"
            ],
            "keys": [
                {
                    "name": "Hellxieii",
                    "key": "WORKER-B25D-66C6-25F7-C418",
                    "done": 30,
                    "fail": 6,
                    "total": 36,
                    "successRate": 83.3
                }
            ],
            "done": 30,
            "fail": 6,
            "total": 36,
            "successRate": 83.3
        },
        {
            "id": "tg:@tgrajout",
            "username": "@Tgrajout",
            "displayName": "Tg Rajput (Shubhraj)",
            "fixedRateUsd": null,
            "fixedRateInr": null,
            "phone": "+91 98756 12220",
            "registeredKeys": [
                "WORKER-B9CC-39EC-1C71-DDEC",
                "WORKER-06D9-A94C-E26D-C1B2",
                "WORKER-48A6-E6A7-89C5-A8E7",
                "WORKER-B1B5-38E0-D897-E5D7",
                "WORKER-037D-4846-737B-5143",
                "WORKER-07BB-01F6-7743-7BE8",
                "WORKER-7EDD-E24E-A7E0-8813",
                "WORKER-8CAF-E03B-19C1-E66F",
                "WORKER-D4A3-4AA1-5B5E-0060",
                "WORKER-82FF-EC9D-35F4-8648",
                "WORKER-02EA-50EC-1F51-B508",
                "WORKER-13A1-13E1-B4B9-8CBE"
            ],
            "keys": [
                {
                    "name": "Paras41",
                    "key": "WORKER-B9CC-39EC-1C71-DDEC",
                    "done": 6,
                    "fail": 6,
                    "total": 12,
                    "successRate": 50
                },
                {
                    "name": "Paras43",
                    "key": "WORKER-06D9-A94C-E26D-C1B2",
                    "done": 6,
                    "fail": 8,
                    "total": 14,
                    "successRate": 42.9
                },
                {
                    "name": "Shub6",
                    "key": "WORKER-B1B5-38E0-D897-E5D7",
                    "done": 5,
                    "fail": 6,
                    "total": 11,
                    "successRate": 45.5
                },
                {
                    "name": "Shub1",
                    "key": "WORKER-48A6-E6A7-89C5-A8E7",
                    "done": 5,
                    "fail": 2,
                    "total": 7,
                    "successRate": 71.4
                },
                {
                    "name": "Paras19",
                    "key": "WORKER-037D-4846-737B-5143",
                    "done": 3,
                    "fail": 5,
                    "total": 8,
                    "successRate": 37.5
                },
                {
                    "name": "Paras42",
                    "key": "WORKER-07BB-01F6-7743-7BE8",
                    "done": 2,
                    "fail": 1,
                    "total": 3,
                    "successRate": 66.7
                },
                {
                    "name": "Paras46",
                    "key": "WORKER-7EDD-E24E-A7E0-8813",
                    "done": 1,
                    "fail": 5,
                    "total": 6,
                    "successRate": 16.7
                },
                {
                    "name": "Shub3",
                    "key": "WORKER-D4A3-4AA1-5B5E-0060",
                    "done": 1,
                    "fail": 1,
                    "total": 2,
                    "successRate": 50
                },
                {
                    "name": "Shub5",
                    "key": "WORKER-8CAF-E03B-19C1-E66F",
                    "done": 1,
                    "fail": 5,
                    "total": 6,
                    "successRate": 16.7
                }
            ],
            "done": 30,
            "fail": 39,
            "total": 69,
            "successRate": 43.5
        },
        {
            "id": "tg:@hashirmhd",
            "username": "@hashirmhd",
            "displayName": "Hashir",
            "fixedRateUsd": null,
            "fixedRateInr": null,
            "phone": null,
            "registeredKeys": [
                "WORKER-36F9-1F80-EA07-C8DA"
            ],
            "keys": [
                {
                    "name": "Hashirbhai",
                    "key": "WORKER-36F9-1F80-EA07-C8DA",
                    "done": 20,
                    "fail": 4,
                    "total": 24,
                    "successRate": 83.3
                }
            ],
            "done": 20,
            "fail": 4,
            "total": 24,
            "successRate": 83.3
        },
        {
            "id": "tg:@aashu_97",
            "username": "@AASHU_97",
            "displayName": "Aashu",
            "fixedRateUsd": null,
            "fixedRateInr": null,
            "phone": null,
            "registeredKeys": [
                "WORKER-7F2C-BE14-84B5-EC3C"
            ],
            "keys": [
                {
                    "name": "Aashu",
                    "key": "WORKER-7F2C-BE14-84B5-EC3C",
                    "done": 15,
                    "fail": 8,
                    "total": 23,
                    "successRate": 65.2
                }
            ],
            "done": 15,
            "fail": 8,
            "total": 23,
            "successRate": 65.2
        },
        {
            "id": "tg:@deep280109",
            "username": "@Deep280109",
            "displayName": "Deep",
            "fixedRateUsd": null,
            "fixedRateInr": null,
            "phone": null,
            "registeredKeys": [
                "WORKER-7D0E-10BE-477F-0741"
            ],
            "keys": [
                {
                    "name": "Depubaby",
                    "key": "WORKER-7D0E-10BE-477F-0741",
                    "done": 15,
                    "fail": 3,
                    "total": 18,
                    "successRate": 83.3
                }
            ],
            "done": 15,
            "fail": 3,
            "total": 18,
            "successRate": 83.3
        },
        {
            "id": "tg:@bcnami",
            "username": "@BCNAMI",
            "displayName": "BC Nami",
            "fixedRateUsd": null,
            "fixedRateInr": null,
            "phone": null,
            "registeredKeys": [
                "WORKER-BAF8-8A3C-3CA1-5604"
            ],
            "keys": [
                {
                    "name": "LuffyD",
                    "key": "WORKER-BAF8-8A3C-3CA1-5604",
                    "done": 14,
                    "fail": 7,
                    "total": 21,
                    "successRate": 66.7
                }
            ],
            "done": 14,
            "fail": 7,
            "total": 21,
            "successRate": 66.7
        },
        {
            "id": "tg:@ntnatri",
            "username": "@ntnatri",
            "displayName": "Nitin Atri",
            "fixedRateUsd": null,
            "fixedRateInr": null,
            "phone": null,
            "registeredKeys": [
                "WORKER-2D3D-E8D5-B6A1-5CD1"
            ],
            "keys": [
                {
                    "name": "Nitin",
                    "key": "WORKER-2D3D-E8D5-B6A1-5CD1",
                    "done": 9,
                    "fail": 5,
                    "total": 14,
                    "successRate": 64.3
                }
            ],
            "done": 9,
            "fail": 5,
            "total": 14,
            "successRate": 64.3
        },
        {
            "id": "tg:@rosalie_admin1",
            "username": "@ROSALIE_ADMIN1",
            "displayName": "Rosalie Admin",
            "fixedRateUsd": null,
            "fixedRateInr": null,
            "phone": null,
            "registeredKeys": [
                "WORKER-5C38-E9A2-3950-2DE3",
                "WORKER-B110-7AFF-53AF-AA74"
            ],
            "keys": [
                {
                    "name": "Fckme02",
                    "key": "WORKER-5C38-E9A2-3950-2DE3",
                    "done": 6,
                    "fail": 6,
                    "total": 12,
                    "successRate": 50
                },
                {
                    "name": "1webkeydedo",
                    "key": "WORKER-B110-7AFF-53AF-AA74",
                    "done": 3,
                    "fail": 1,
                    "total": 4,
                    "successRate": 75
                }
            ],
            "done": 9,
            "fail": 7,
            "total": 16,
            "successRate": 56.3
        },
        {
            "id": "tg:@pawan_naidu_24",
            "username": "@pawan_naidu_24",
            "displayName": "Pawan Naidu",
            "fixedRateUsd": null,
            "fixedRateInr": null,
            "phone": null,
            "registeredKeys": [
                "WORKER-D8DC-E408-F99E-B402"
            ],
            "keys": [
                {
                    "name": "Givemeworkbro",
                    "key": "WORKER-D8DC-E408-F99E-B402",
                    "done": 8,
                    "fail": 5,
                    "total": 13,
                    "successRate": 61.5
                }
            ],
            "done": 8,
            "fail": 5,
            "total": 13,
            "successRate": 61.5
        },
        {
            "id": "person:majid",
            "username": "majid",
            "displayName": "Majid",
            "fixedRateUsd": null,
            "fixedRateInr": null,
            "phone": null,
            "registeredKeys": [
                "WORKER-90C8-CDB0-D93C-26B8"
            ],
            "keys": [
                {
                    "name": "Majido",
                    "key": "WORKER-90C8-CDB0-D93C-26B8",
                    "done": 6,
                    "fail": 3,
                    "total": 9,
                    "successRate": 66.7
                }
            ],
            "done": 6,
            "fail": 3,
            "total": 9,
            "successRate": 66.7
        },
        {
            "id": "tg:@shauryagharat4103",
            "username": "@shauryagharat4103",
            "displayName": "Shaurya Gharat",
            "fixedRateUsd": null,
            "fixedRateInr": null,
            "phone": null,
            "registeredKeys": [
                "WORKER-98D0-D03A-8138-F09A"
            ],
            "keys": [
                {
                    "name": "Shaurya",
                    "key": "WORKER-98D0-D03A-8138-F09A",
                    "done": 5,
                    "fail": 3,
                    "total": 8,
                    "successRate": 62.5
                }
            ],
            "done": 5,
            "fail": 3,
            "total": 8,
            "successRate": 62.5
        },
        {
            "id": "person:loki",
            "username": "loki",
            "displayName": "Loki",
            "fixedRateUsd": 0.5,
            "fixedRateInr": 42,
            "phone": null,
            "registeredKeys": [
                "WORKER-1956-E7B7-7220-B03F",
                "WORKER-E0F5-49CA-9564-7425"
            ],
            "keys": [
                {
                    "name": "Loki",
                    "key": "WORKER-1956-E7B7-7220-B03F",
                    "done": 3,
                    "fail": 1,
                    "total": 4,
                    "successRate": 75
                },
                {
                    "name": "W99w8",
                    "key": "WORKER-E0F5-49CA-9564-7425",
                    "done": 2,
                    "fail": 1,
                    "total": 3,
                    "successRate": 66.7
                }
            ],
            "done": 5,
            "fail": 2,
            "total": 7,
            "successRate": 71.4
        },
        {
            "id": "tg:@laksheswarx",
            "username": "@LaksheswarX",
            "displayName": "Laksheswar",
            "fixedRateUsd": null,
            "fixedRateInr": null,
            "phone": null,
            "registeredKeys": [
                "WORKER-0452-3999-5B0F-FF48"
            ],
            "keys": [
                {
                    "name": "Lokeshwaray",
                    "key": "WORKER-0452-3999-5B0F-FF48",
                    "done": 3,
                    "fail": 5,
                    "total": 8,
                    "successRate": 37.5
                }
            ],
            "done": 3,
            "fail": 5,
            "total": 8,
            "successRate": 37.5
        },
        {
            "id": "tg:@rayyann30",
            "username": "@Rayyann30",
            "displayName": "Rayyan",
            "fixedRateUsd": null,
            "fixedRateInr": null,
            "phone": null,
            "registeredKeys": [
                "WORKER-98EF-C719-3B23-A25A"
            ],
            "keys": [
                {
                    "name": "Rayansheik",
                    "key": "WORKER-98EF-C719-3B23-A25A",
                    "done": 3,
                    "fail": 3,
                    "total": 6,
                    "successRate": 50
                }
            ],
            "done": 3,
            "fail": 3,
            "total": 6,
            "successRate": 50
        },
        {
            "id": "tg:@terajaat012",
            "username": "@Terajaat012",
            "displayName": "Tera Jaat",
            "fixedRateUsd": null,
            "fixedRateInr": null,
            "phone": null,
            "registeredKeys": [
                "WORKER-A13D-9071-CB21-EEAB"
            ],
            "keys": [
                {
                    "name": "Jaate",
                    "key": "WORKER-A13D-9071-CB21-EEAB",
                    "done": 2,
                    "fail": 6,
                    "total": 8,
                    "successRate": 25
                }
            ],
            "done": 2,
            "fail": 6,
            "total": 8,
            "successRate": 25
        },
        {
            "id": "person:hyper",
            "username": "hyper",
            "displayName": "Hyper",
            "fixedRateUsd": null,
            "fixedRateInr": null,
            "phone": null,
            "registeredKeys": [
                "WORKER-F4CC-5C42-85A9-617F"
            ],
            "keys": [
                {
                    "name": "HyperX",
                    "key": "WORKER-F4CC-5C42-85A9-617F",
                    "done": 2,
                    "fail": 5,
                    "total": 7,
                    "successRate": 28.6
                }
            ],
            "done": 2,
            "fail": 5,
            "total": 7,
            "successRate": 28.6
        },
        {
            "id": "tg:@work4money_owner",
            "username": "@Work4money_owner",
            "displayName": "Work4Money Owner",
            "fixedRateUsd": null,
            "fixedRateInr": null,
            "phone": null,
            "registeredKeys": [
                "WORKER-708B-BDA0-F8CC-FE52"
            ],
            "keys": [
                {
                    "name": "Aarvworzk",
                    "key": "WORKER-708B-BDA0-F8CC-FE52",
                    "done": 2,
                    "fail": 5,
                    "total": 7,
                    "successRate": 28.6
                }
            ],
            "done": 2,
            "fail": 5,
            "total": 7,
            "successRate": 28.6
        },
        {
            "id": "person:idk_1",
            "username": "idk 1",
            "displayName": "idk 1",
            "fixedRateUsd": null,
            "fixedRateInr": null,
            "phone": null,
            "registeredKeys": [
                "WORKER-0872-8B7E-1BD4-17CC"
            ],
            "keys": [
                {
                    "name": "Woosidk",
                    "key": "WORKER-0872-8B7E-1BD4-17CC",
                    "done": 2,
                    "fail": 4,
                    "total": 6,
                    "successRate": 33.3
                }
            ],
            "done": 2,
            "fail": 4,
            "total": 6,
            "successRate": 33.3
        },
        {
            "id": "person:sharmaji",
            "username": "sharmaji",
            "displayName": "Sharmaji",
            "fixedRateUsd": null,
            "fixedRateInr": null,
            "phone": null,
            "registeredKeys": [
                "WORKER-9433-07AE-F0AF-26E2"
            ],
            "keys": [
                {
                    "name": "Sharmaji",
                    "key": "WORKER-9433-07AE-F0AF-26E2",
                    "done": 2,
                    "fail": 0,
                    "total": 2,
                    "successRate": 100
                }
            ],
            "done": 2,
            "fail": 0,
            "total": 2,
            "successRate": 100
        },
        {
            "id": "tg:@kelifor",
            "username": "@Kelifor",
            "displayName": "Kelifor",
            "fixedRateUsd": null,
            "fixedRateInr": null,
            "phone": null,
            "registeredKeys": [
                "WORKER-4A7A-EE26-47D4-9F9A"
            ],
            "keys": [
                {
                    "name": "Kelifor",
                    "key": "WORKER-4A7A-EE26-47D4-9F9A",
                    "done": 1,
                    "fail": 7,
                    "total": 8,
                    "successRate": 12.5
                }
            ],
            "done": 1,
            "fail": 7,
            "total": 8,
            "successRate": 12.5
        },
        {
            "id": "tg:@psychoalex99",
            "username": "@PsychoAlex99",
            "displayName": "Alex",
            "fixedRateUsd": null,
            "fixedRateInr": null,
            "phone": null,
            "registeredKeys": [
                "WORKER-957A-2D08-DCB6-118F"
            ],
            "keys": [
                {
                    "name": "Alexy",
                    "key": "WORKER-957A-2D08-DCB6-118F",
                    "done": 1,
                    "fail": 1,
                    "total": 2,
                    "successRate": 50
                }
            ],
            "done": 1,
            "fail": 1,
            "total": 2,
            "successRate": 50
        },
        {
            "id": "tg:@sonu2538",
            "username": "@Sonu2538",
            "displayName": "Sonu Singh",
            "fixedRateUsd": null,
            "fixedRateInr": null,
            "phone": null,
            "registeredKeys": [
                "WORKER-79E7-D83D-0D37-C64B"
            ],
            "keys": [
                {
                    "name": "Sonusingh",
                    "key": "WORKER-79E7-D83D-0D37-C64B",
                    "done": 1,
                    "fail": 1,
                    "total": 2,
                    "successRate": 50
                }
            ],
            "done": 1,
            "fail": 1,
            "total": 2,
            "successRate": 50
        },
        {
            "id": "idk:@Dudesinsand",
            "username": "@Dudesinsand",
            "displayName": "@Dudesinsand",
            "fixedRateUsd": null,
            "fixedRateInr": null,
            "keys": [
                {
                    "name": "Dudesinsand",
                    "key": "WORKER-7B72-8D94-674C-9BD6",
                    "done": 0,
                    "fail": 1,
                    "total": 1,
                    "successRate": 0
                }
            ],
            "done": 0,
            "fail": 1,
            "total": 1,
            "successRate": 0
        },
        {
            "id": "idk:@Boddjrje",
            "username": "@Boddjrje",
            "displayName": "@Boddjrje",
            "fixedRateUsd": null,
            "fixedRateInr": null,
            "keys": [
                {
                    "name": "Boddjrje",
                    "key": "WORKER-5759-DF31-E926-193B",
                    "done": 0,
                    "fail": 1,
                    "total": 1,
                    "successRate": 0
                }
            ],
            "done": 0,
            "fail": 1,
            "total": 1,
            "successRate": 0
        },
        {
            "id": "idk:@D10",
            "username": "@D10",
            "displayName": "@D10",
            "fixedRateUsd": null,
            "fixedRateInr": null,
            "keys": [
                {
                    "name": "D10",
                    "key": "WORKER-EB89-186B-D312-4CB7",
                    "done": 0,
                    "fail": 1,
                    "total": 1,
                    "successRate": 0
                }
            ],
            "done": 0,
            "fail": 1,
            "total": 1,
            "successRate": 0
        },
        {
            "id": "idk:@¥¥",
            "username": "@¥¥",
            "displayName": "@¥¥",
            "fixedRateUsd": null,
            "fixedRateInr": null,
            "keys": [
                {
                    "name": "¥¥",
                    "key": "WORKER-C210-CEC2-1E10-53A0",
                    "done": 0,
                    "fail": 1,
                    "total": 1,
                    "successRate": 0
                }
            ],
            "done": 0,
            "fail": 1,
            "total": 1,
            "successRate": 0
        },
        {
            "id": "idk:@Gudu",
            "username": "@Gudu",
            "displayName": "@Gudu",
            "fixedRateUsd": null,
            "fixedRateInr": null,
            "keys": [
                {
                    "name": "Gudu",
                    "key": "WORKER-C7FC-4778-5612-D883",
                    "done": 0,
                    "fail": 1,
                    "total": 1,
                    "successRate": 0
                }
            ],
            "done": 0,
            "fail": 1,
            "total": 1,
            "successRate": 0
        },
        {
            "id": "idk:@Crypto",
            "username": "@Crypto",
            "displayName": "@Crypto",
            "fixedRateUsd": null,
            "fixedRateInr": null,
            "keys": [
                {
                    "name": "Crypto",
                    "key": "WORKER-157B-E175-66B3-09AA",
                    "done": 0,
                    "fail": 5,
                    "total": 5,
                    "successRate": 0
                }
            ],
            "done": 0,
            "fail": 5,
            "total": 5,
            "successRate": 0
        },
        {
            "id": "idk:@Mochi",
            "username": "@Mochi",
            "displayName": "@Mochi",
            "fixedRateUsd": null,
            "fixedRateInr": null,
            "keys": [
                {
                    "name": "Mochi",
                    "key": "WORKER-D616-9D08-12CC-54E1",
                    "done": 0,
                    "fail": 3,
                    "total": 3,
                    "successRate": 0
                }
            ],
            "done": 0,
            "fail": 3,
            "total": 3,
            "successRate": 0
        },
        {
            "id": "idk:@Helloz",
            "username": "@Helloz",
            "displayName": "@Helloz",
            "fixedRateUsd": null,
            "fixedRateInr": null,
            "keys": [
                {
                    "name": "Helloz",
                    "key": "WORKER-F1DB-01CD-1E57-6DCB",
                    "done": 0,
                    "fail": 1,
                    "total": 1,
                    "successRate": 0
                }
            ],
            "done": 0,
            "fail": 1,
            "total": 1,
            "successRate": 0
        },
        {
            "id": "idk:@Paras_20",
            "username": "@Paras 20",
            "displayName": "@Paras 20",
            "fixedRateUsd": null,
            "fixedRateInr": null,
            "keys": [
                {
                    "name": "Paras 20",
                    "key": "WORKER-4C5F-A5A3-0E98-5624",
                    "done": 0,
                    "fail": 1,
                    "total": 1,
                    "successRate": 0
                }
            ],
            "done": 0,
            "fail": 1,
            "total": 1,
            "successRate": 0
        },
        {
            "id": "idk:@Zeya",
            "username": "@Zeya",
            "displayName": "@Zeya",
            "fixedRateUsd": null,
            "fixedRateInr": null,
            "keys": [
                {
                    "name": "Zeya",
                    "key": "WORKER-58DA-DBDA-01A2-3EAB",
                    "done": 0,
                    "fail": 3,
                    "total": 3,
                    "successRate": 0
                }
            ],
            "done": 0,
            "fail": 3,
            "total": 3,
            "successRate": 0
        },
        {
            "id": "idk:@Teliyash",
            "username": "@Teliyash",
            "displayName": "@Teliyash",
            "fixedRateUsd": null,
            "fixedRateInr": null,
            "keys": [
                {
                    "name": "Teliyash",
                    "key": "WORKER-1DDE-7ACC-3F5A-CB6B",
                    "done": 0,
                    "fail": 1,
                    "total": 1,
                    "successRate": 0
                }
            ],
            "done": 0,
            "fail": 1,
            "total": 1,
            "successRate": 0
        },
        {
            "id": "idk:@Mantu",
            "username": "@Mantu",
            "displayName": "@Mantu",
            "fixedRateUsd": null,
            "fixedRateInr": null,
            "keys": [
                {
                    "name": "Mantu",
                    "key": "WORKER-0D6C-77D9-567F-1101",
                    "done": 0,
                    "fail": 1,
                    "total": 1,
                    "successRate": 0
                }
            ],
            "done": 0,
            "fail": 1,
            "total": 1,
            "successRate": 0
        },
        {
            "id": "idk:@Gulam",
            "username": "@Gulam",
            "displayName": "@Gulam",
            "fixedRateUsd": null,
            "fixedRateInr": null,
            "keys": [
                {
                    "name": "Gulam",
                    "key": "",
                    "done": 0,
                    "fail": 2,
                    "total": 2,
                    "successRate": 0
                }
            ],
            "done": 0,
            "fail": 2,
            "total": 2,
            "successRate": 0
        },
        {
            "id": "idk:@Ritik5",
            "username": "@Ritik5",
            "displayName": "@Ritik5",
            "fixedRateUsd": null,
            "fixedRateInr": null,
            "keys": [
                {
                    "name": "Ritik5",
                    "key": "WORKER-C4F9-D0EC-4C25-348F",
                    "done": 0,
                    "fail": 1,
                    "total": 1,
                    "successRate": 0
                }
            ],
            "done": 0,
            "fail": 1,
            "total": 1,
            "successRate": 0
        },
        {
            "id": "idk:@Advik",
            "username": "@Advik",
            "displayName": "@Advik",
            "fixedRateUsd": null,
            "fixedRateInr": null,
            "keys": [
                {
                    "name": "Advik",
                    "key": "WORKER-CC75-C8CC-75B4-A6C1",
                    "done": 0,
                    "fail": 1,
                    "total": 1,
                    "successRate": 0
                }
            ],
            "done": 0,
            "fail": 1,
            "total": 1,
            "successRate": 0
        },
        {
            "id": "idk:@Sexworkwr",
            "username": "@Sexworkwr",
            "displayName": "@Sexworkwr",
            "fixedRateUsd": null,
            "fixedRateInr": null,
            "keys": [
                {
                    "name": "Sexworkwr",
                    "key": "WORKER-9A18-3C53-A627-B328",
                    "done": 0,
                    "fail": 1,
                    "total": 1,
                    "successRate": 0
                }
            ],
            "done": 0,
            "fail": 1,
            "total": 1,
            "successRate": 0
        },
        {
            "id": "idk:@Lodalasn",
            "username": "@Lodalasn",
            "displayName": "@Lodalasn",
            "fixedRateUsd": null,
            "fixedRateInr": null,
            "keys": [
                {
                    "name": "Lodalasn",
                    "key": "WORKER-8154-5DF2-4F51-FEE0",
                    "done": 0,
                    "fail": 1,
                    "total": 1,
                    "successRate": 0
                }
            ],
            "done": 0,
            "fail": 1,
            "total": 1,
            "successRate": 0
        },
        {
            "id": "idk:@Djx",
            "username": "@Djx",
            "displayName": "@Djx",
            "fixedRateUsd": null,
            "fixedRateInr": null,
            "keys": [
                {
                    "name": "Djx",
                    "key": "WORKER-EB4F-8A1A-F266-66C3",
                    "done": 0,
                    "fail": 2,
                    "total": 2,
                    "successRate": 0
                }
            ],
            "done": 0,
            "fail": 2,
            "total": 2,
            "successRate": 0
        },
        {
            "id": "idk:@Dududu",
            "username": "@Dududu",
            "displayName": "@Dududu",
            "fixedRateUsd": null,
            "fixedRateInr": null,
            "keys": [
                {
                    "name": "Dududu",
                    "key": "WORKER-3747-6321-8CE8-C541",
                    "done": 0,
                    "fail": 2,
                    "total": 2,
                    "successRate": 0
                }
            ],
            "done": 0,
            "fail": 2,
            "total": 2,
            "successRate": 0
        },
        {
            "id": "idk:@Lodi",
            "username": "@Lodi",
            "displayName": "@Lodi",
            "fixedRateUsd": null,
            "fixedRateInr": null,
            "keys": [
                {
                    "name": "Lodi",
                    "key": "WORKER-EB2E-DF5D-1674-6B52",
                    "done": 0,
                    "fail": 1,
                    "total": 1,
                    "successRate": 0
                }
            ],
            "done": 0,
            "fail": 1,
            "total": 1,
            "successRate": 0
        },
        {
            "id": "idk:@Eren",
            "username": "@Eren",
            "displayName": "@Eren",
            "fixedRateUsd": null,
            "fixedRateInr": null,
            "keys": [
                {
                    "name": "Eren",
                    "key": "WORKER-7E6C-E820-D297-9AD5",
                    "done": 0,
                    "fail": 2,
                    "total": 2,
                    "successRate": 0
                }
            ],
            "done": 0,
            "fail": 2,
            "total": 2,
            "successRate": 0
        },
        {
            "id": "idk:@Worker03",
            "username": "@Worker03",
            "displayName": "@Worker03",
            "fixedRateUsd": null,
            "fixedRateInr": null,
            "keys": [
                {
                    "name": "Worker03",
                    "key": "WORKER-09CC-6F82-3224-BF0C",
                    "done": 0,
                    "fail": 1,
                    "total": 1,
                    "successRate": 0
                }
            ],
            "done": 0,
            "fail": 1,
            "total": 1,
            "successRate": 0
        },
        {
            "id": "idk:@Gulamgosh",
            "username": "@Gulamgosh",
            "displayName": "@Gulamgosh",
            "fixedRateUsd": null,
            "fixedRateInr": null,
            "keys": [
                {
                    "name": "Gulamgosh",
                    "key": "",
                    "done": 0,
                    "fail": 1,
                    "total": 1,
                    "successRate": 0
                }
            ],
            "done": 0,
            "fail": 1,
            "total": 1,
            "successRate": 0
        },
        {
            "id": "idk:@Mayank",
            "username": "@Mayank",
            "displayName": "@Mayank",
            "fixedRateUsd": null,
            "fixedRateInr": null,
            "keys": [
                {
                    "name": "Mayank",
                    "key": "WORKER-7D72-484C-D0D4-3A24",
                    "done": 0,
                    "fail": 2,
                    "total": 2,
                    "successRate": 0
                }
            ],
            "done": 0,
            "fail": 2,
            "total": 2,
            "successRate": 0
        },
        {
            "id": "idk:@Ho02",
            "username": "@Ho02",
            "displayName": "@Ho02",
            "fixedRateUsd": null,
            "fixedRateInr": null,
            "keys": [
                {
                    "name": "Ho02",
                    "key": "WORKER-94C8-CA14-4C16-D4AE",
                    "done": 0,
                    "fail": 1,
                    "total": 1,
                    "successRate": 0
                }
            ],
            "done": 0,
            "fail": 1,
            "total": 1,
            "successRate": 0
        },
        {
            "id": "idk:@Kitnelegabhai",
            "username": "@Kitnelegabhai",
            "displayName": "@Kitnelegabhai",
            "fixedRateUsd": null,
            "fixedRateInr": null,
            "keys": [
                {
                    "name": "Kitnelegabhai",
                    "key": "WORKER-1D61-1FB8-A428-2391",
                    "done": 0,
                    "fail": 2,
                    "total": 2,
                    "successRate": 0
                }
            ],
            "done": 0,
            "fail": 2,
            "total": 2,
            "successRate": 0
        },
        {
            "id": "idk:@Paras_12",
            "username": "@Paras 12",
            "displayName": "@Paras 12",
            "fixedRateUsd": null,
            "fixedRateInr": null,
            "keys": [
                {
                    "name": "Paras 12",
                    "key": "WORKER-756F-FC00-19CD-E235",
                    "done": 0,
                    "fail": 1,
                    "total": 1,
                    "successRate": 0
                }
            ],
            "done": 0,
            "fail": 1,
            "total": 1,
            "successRate": 0
        },
        {
            "id": "idk:@@Noob_001",
            "username": "@@Noob_001",
            "displayName": "@@Noob_001",
            "fixedRateUsd": null,
            "fixedRateInr": null,
            "keys": [
                {
                    "name": "@Noob_001",
                    "key": "WORKER-2E2B-0002-1C3A-6661",
                    "done": 0,
                    "fail": 1,
                    "total": 1,
                    "successRate": 0
                }
            ],
            "done": 0,
            "fail": 1,
            "total": 1,
            "successRate": 0
        }
    ]
};

// ==========================================
  // EXACT PANEL PDF EXPORT
  // Renders the exact dashboard panel with all cards, metrics, and keys
  // ==========================================
  

  const settlementData24Sep = {
  "window": "24 Sep 2026 (12:00 AM – 12:00 AM Midnight Full Day Settlement)",
  "bossMasi": {
    "totalCompleted": 250,
    "ratePerSuccess": 0.6,
    "lossPerFailure": 0.1,
    "grossUsd": 150,
    "penaltiesCount": 133,
    "penaltiesUsd": -13.3,
    "netUsd": 136.7,
    "approxInrNet": 11482.8,
    "balanceCents": 9810
  },
  "redBanKeys": [
    {
      "name": "Hey123",
      "key": "WORKER-21C3-59F9-EA3B-E26A",
      "tg": "@Bnzaalam",
      "ownerName": "Bnzaalam",
      "completed": 61,
      "failed": 14,
      "total": 75,
      "successRate": 81.3,
      "reason": "High Failures (14 fail)"
    },
    {
      "name": "Hashirbhai",
      "key": "WORKER-36F9-1F80-EA07-C8DA",
      "tg": "@hashirmhd",
      "ownerName": "Hashir",
      "completed": 52,
      "failed": 10,
      "total": 63,
      "successRate": 82.5,
      "reason": "High Failures (10 fail)"
    },
    {
      "name": "Hellxieii",
      "key": "WORKER-B25D-66C6-25F7-C418",
      "tg": "@fileworker_6700",
      "ownerName": "Fileworker",
      "completed": 20,
      "failed": 18,
      "total": 39,
      "successRate": 51.3,
      "reason": "High Failures (18 fail)"
    },
    {
      "name": "@fileworker_6700",
      "key": "WORKER-5B31-CA3F-B7C1-2C22",
      "tg": "@fileworker_6700",
      "ownerName": "Fileworker",
      "completed": 13,
      "failed": 6,
      "total": 21,
      "successRate": 61.9,
      "reason": "High Failures (6 fail)"
    },
    {
      "name": "1webkeydedo",
      "key": "WORKER-B110-7AFF-53AF-AA74",
      "tg": "@ROSALIE_ADMIN1",
      "ownerName": "Rosalie Admin",
      "completed": 21,
      "failed": 14,
      "total": 35,
      "successRate": 60,
      "reason": "High Failures (14 fail)"
    },
    {
      "name": "Fckme02",
      "key": "WORKER-5C38-E9A2-3950-2DE3",
      "tg": "@ROSALIE_ADMIN1",
      "ownerName": "Rosalie Admin",
      "completed": 1,
      "failed": 6,
      "total": 7,
      "successRate": 14.3,
      "reason": "Low Output (1 QR) with high fails (6 fail)"
    },
    {
      "name": "Mayank",
      "key": "WORKER-7D72-484C-D0D4-3A24",
      "tg": "Unassigned (Assign TG)",
      "ownerName": "Worker 7 (Mayank)",
      "completed": 16,
      "failed": 4,
      "total": 27,
      "successRate": 59.3,
      "reason": "High Failures (4 fail)"
    },
    {
      "name": "LuffyD",
      "key": "WORKER-BAF8-8A3C-3CA1-5604",
      "tg": "@BCNAMI",
      "ownerName": "BCNAMI",
      "completed": 12,
      "failed": 4,
      "total": 17,
      "successRate": 70.6,
      "reason": "High Failures (4 fail)"
    },
    {
      "name": "Shaurya",
      "key": "WORKER-98D0-D03A-8138-F09A",
      "tg": "@shauryagharat4103",
      "ownerName": "Shaurya",
      "completed": 6,
      "failed": 4,
      "total": 10,
      "successRate": 60,
      "reason": "High Failures (4 fail)"
    },
    {
      "name": "Nitinji",
      "key": "WORKER-4119-5DB9-C755-2C6C",
      "tg": "Unassigned (Assign TG)",
      "ownerName": "Worker 1 (Nitinji)",
      "completed": 6,
      "failed": 3,
      "total": 9,
      "successRate": 66.7,
      "reason": "High Failures (3 fail)"
    },
    {
      "name": "@Davidprivate22",
      "key": "WORKER-21A1-3852-4B33-B1EB",
      "tg": "Unassigned (Assign TG)",
      "ownerName": "Worker 9 (@Davidprivate22)",
      "completed": 4,
      "failed": 3,
      "total": 7,
      "successRate": 57.1,
      "reason": "High Failures (3 fail)"
    },
    {
      "name": "Paras41",
      "key": "WORKER-B9CC-39EC-1C71-DDEC",
      "tg": "@Tgrajout",
      "ownerName": "Tg Rajput",
      "completed": 2,
      "failed": 14,
      "total": 19,
      "successRate": 10.5,
      "reason": "Low Output (2 QR) with high fails (14 fail)"
    },
    {
      "name": "Shub10",
      "key": "WORKER-13A1-13E1-B4B9-8CBE",
      "tg": "@Tgrajout",
      "ownerName": "Tg Rajput",
      "completed": 0,
      "failed": 1,
      "total": 1,
      "successRate": 0,
      "reason": "Low Output (0 QR) with high fails (1 fail)"
    },
    {
      "name": "Shub5",
      "key": "WORKER-8CAF-E03B-19C1-E66F",
      "tg": "@Tgrajout",
      "ownerName": "Tg Rajput",
      "completed": 0,
      "failed": 0,
      "total": 1,
      "successRate": 0,
      "reason": "Low Output (0 QR) with high fails (0 fail)"
    },
    {
      "name": "Paras46",
      "key": "WORKER-7EDD-E24E-A7E0-8813",
      "tg": "@Tgrajout",
      "ownerName": "Tg Rajput",
      "completed": 0,
      "failed": 1,
      "total": 1,
      "successRate": 0,
      "reason": "Low Output (0 QR) with high fails (1 fail)"
    },
    {
      "name": "Hugguno1",
      "key": "WORKER-B5F3-B889-02AF-2A5C",
      "tg": "Unassigned (Assign TG)",
      "ownerName": "Worker 5 (Hugguno1)",
      "completed": 1,
      "failed": 2,
      "total": 3,
      "successRate": 33.3,
      "reason": "Low Output (1 QR) with high fails (2 fail)"
    },
    {
      "name": "@Raju6789uu",
      "key": "WORKER-E184-4C9B-3C7F-CB67",
      "tg": "Unassigned (Assign TG)",
      "ownerName": "Worker 12 (@Raju6789uu)",
      "completed": 1,
      "failed": 2,
      "total": 3,
      "successRate": 33.3,
      "reason": "Low Output (1 QR) with high fails (2 fail)"
    },
    {
      "name": "W99w8",
      "key": "WORKER-E0F5-49CA-9564-7425",
      "tg": "loki",
      "ownerName": "Loki",
      "completed": 0,
      "failed": 1,
      "total": 1,
      "successRate": 0,
      "reason": "Low Output (0 QR) with high fails (1 fail)"
    },
    {
      "name": "¥¥",
      "key": "WORKER-C210-CEC2-1E10-53A0",
      "tg": "Unassigned (Assign TG)",
      "ownerName": "Worker 8 (¥¥)",
      "completed": 0,
      "failed": 1,
      "total": 1,
      "successRate": 0,
      "reason": "Low Output (0 QR) with high fails (1 fail)"
    },
    {
      "name": "robertjr",
      "key": "WORKER-A179-7E17-F5F3-2DB9",
      "tg": "Unassigned (Assign TG)",
      "ownerName": "Worker 10 (robertjr)",
      "completed": 0,
      "failed": 2,
      "total": 2,
      "successRate": 0,
      "reason": "Low Output (0 QR) with high fails (2 fail)"
    },
    {
      "name": "Paras45",
      "key": "WORKER-1BF4-E852-B5B3-34CC",
      "tg": "Unassigned (Assign TG)",
      "ownerName": "Worker 13 (Paras45)",
      "completed": 0,
      "failed": 1,
      "total": 5,
      "successRate": 0,
      "reason": "Low Output (0 QR) with high fails (1 fail)"
    },
    {
      "name": "Fastest",
      "key": "WORKER-66E6-3DEE-3014-C7F8",
      "tg": "Unassigned (Assign TG)",
      "ownerName": "Worker 14 (Fastest)",
      "completed": 0,
      "failed": 1,
      "total": 1,
      "successRate": 0,
      "reason": "Low Output (0 QR) with high fails (1 fail)"
    },
    {
      "name": "Aashu",
      "key": "WORKER-7F2C-BE14-84B5-EC3C",
      "tg": "@AASHU_97",
      "ownerName": "Aashu",
      "completed": 0,
      "failed": 5,
      "total": 5,
      "successRate": 0,
      "reason": "Low Output (0 QR) with high fails (5 fail)"
    },
    {
      "name": "@indianagent10",
      "key": "WORKER-8C94-F3F9-58D8-7E76",
      "tg": "Unassigned (Assign TG)",
      "ownerName": "Worker 16 (@indianagent10)",
      "completed": 0,
      "failed": 2,
      "total": 2,
      "successRate": 0,
      "reason": "Low Output (0 QR) with high fails (2 fail)"
    },
    {
      "name": "Helloz",
      "key": "WORKER-F1DB-01CD-1E57-6DCB",
      "tg": "Unassigned (Assign TG)",
      "ownerName": "Worker 21 (Helloz)",
      "completed": 0,
      "failed": 3,
      "total": 3,
      "successRate": 0,
      "reason": "Low Output (0 QR) with high fails (3 fail)"
    },
    {
      "name": "Unkown",
      "key": "WORKER-9D8E-6C9B-BBB9-085A",
      "tg": "Unassigned (Assign TG)",
      "ownerName": "Worker 22 (Unkown)",
      "completed": 0,
      "failed": 1,
      "total": 1,
      "successRate": 0,
      "reason": "Low Output (0 QR) with high fails (1 fail)"
    },
    {
      "name": "Hey1239",
      "key": "WORKER-B6D3-6301-0EB4-9B2C",
      "tg": "Unassigned (Assign TG)",
      "ownerName": "Worker 24 (Hey1239)",
      "completed": 0,
      "failed": 1,
      "total": 1,
      "successRate": 0,
      "reason": "Low Output (0 QR) with high fails (1 fail)"
    },
    {
      "name": "4bankhe",
      "key": "WORKER-100A-8FA5-F2F6-5892",
      "tg": "Unassigned (Assign TG)",
      "ownerName": "Worker 25 (4bankhe)",
      "completed": 0,
      "failed": 1,
      "total": 1,
      "successRate": 0,
      "reason": "Low Output (0 QR) with high fails (1 fail)"
    }
  ],
  "users": [
    {
      "id": "tg:@bnzaalam",
      "username": "@Bnzaalam",
      "displayName": "Bnzaalam",
      "telegramUsername": "@Bnzaalam",
      "isNewKey": false,
      "done": 61,
      "fail": 14,
      "expired": 0,
      "total": 75,
      "successRate": 81.3,
      "completedOrders": 61,
      "totalOrders": 75,
      "failCount": 14,
      "payCalc": {
        "tierRate": 40,
        "basePay": 2440,
        "isCapped": false,
        "tierLabel": "30+ QR (₹40)"
      },
      "keys": [
        {
          "name": "Hey123",
          "key": "WORKER-21C3-59F9-EA3B-E26A",
          "completedOrders": 61,
          "done": 61,
          "failCount": 14,
          "fail": 14,
          "expired": 0,
          "totalOrders": 75,
          "total": 75,
          "successRate": 81.3
        }
      ]
    },
    {
      "id": "tg:@hashirmhd",
      "username": "@hashirmhd",
      "displayName": "Hashir",
      "telegramUsername": "@hashirmhd",
      "isNewKey": false,
      "done": 52,
      "fail": 10,
      "expired": 1,
      "total": 63,
      "successRate": 82.5,
      "completedOrders": 52,
      "totalOrders": 63,
      "failCount": 10,
      "payCalc": {
        "tierRate": 40,
        "basePay": 2080,
        "isCapped": false,
        "tierLabel": "30+ QR (₹40)"
      },
      "keys": [
        {
          "name": "Hashirbhai",
          "key": "WORKER-36F9-1F80-EA07-C8DA",
          "completedOrders": 52,
          "done": 52,
          "failCount": 10,
          "fail": 10,
          "expired": 1,
          "totalOrders": 63,
          "total": 63,
          "successRate": 82.5
        }
      ]
    },
    {
      "id": "tg:@fileworker_6700",
      "username": "@fileworker_6700",
      "displayName": "Fileworker",
      "telegramUsername": "@fileworker_6700",
      "isNewKey": false,
      "done": 33,
      "fail": 24,
      "expired": 3,
      "total": 60,
      "successRate": 55,
      "completedOrders": 33,
      "totalOrders": 60,
      "failCount": 24,
      "payCalc": {
        "tierRate": 32,
        "basePay": 1056,
        "isCapped": true,
        "tierLabel": "30+ QR (₹40) [Capped @ ₹32 (<60% success)]"
      },
      "keys": [
        {
          "name": "Hellxieii",
          "key": "WORKER-B25D-66C6-25F7-C418",
          "completedOrders": 20,
          "done": 20,
          "failCount": 18,
          "fail": 18,
          "expired": 1,
          "totalOrders": 39,
          "total": 39,
          "successRate": 51.3
        },
        {
          "name": "@fileworker_6700",
          "key": "WORKER-5B31-CA3F-B7C1-2C22",
          "completedOrders": 13,
          "done": 13,
          "failCount": 6,
          "fail": 6,
          "expired": 2,
          "totalOrders": 21,
          "total": 21,
          "successRate": 61.9
        }
      ]
    },
    {
      "id": "tg:@rosalie_admin1",
      "username": "@ROSALIE_ADMIN1",
      "displayName": "Rosalie Admin",
      "telegramUsername": "@ROSALIE_ADMIN1",
      "isNewKey": false,
      "done": 22,
      "fail": 20,
      "expired": 0,
      "total": 42,
      "successRate": 52.4,
      "completedOrders": 22,
      "totalOrders": 42,
      "failCount": 20,
      "payCalc": {
        "tierRate": 32,
        "basePay": 704,
        "isCapped": true,
        "tierLabel": "20+ QR (₹35) [Capped @ ₹32 (<60% success)]"
      },
      "keys": [
        {
          "name": "1webkeydedo",
          "key": "WORKER-B110-7AFF-53AF-AA74",
          "completedOrders": 21,
          "done": 21,
          "failCount": 14,
          "fail": 14,
          "expired": 0,
          "totalOrders": 35,
          "total": 35,
          "successRate": 60
        },
        {
          "name": "Fckme02",
          "key": "WORKER-5C38-E9A2-3950-2DE3",
          "completedOrders": 1,
          "done": 1,
          "failCount": 6,
          "fail": 6,
          "expired": 0,
          "totalOrders": 7,
          "total": 7,
          "successRate": 14.3
        }
      ]
    },
    {
      "id": "unassigned:WORKER-7D72-484C-D0D4-3A24",
      "username": null,
      "displayName": "Worker 7 (Mayank)",
      "telegramUsername": null,
      "isNewKey": true,
      "done": 16,
      "fail": 4,
      "expired": 7,
      "total": 27,
      "successRate": 59.3,
      "completedOrders": 16,
      "totalOrders": 27,
      "failCount": 4,
      "payCalc": {
        "tierRate": 31,
        "basePay": 496,
        "isCapped": false,
        "tierLabel": "11–20 QR (₹31)"
      },
      "keys": [
        {
          "name": "Mayank",
          "key": "WORKER-7D72-484C-D0D4-3A24",
          "completedOrders": 16,
          "done": 16,
          "failCount": 4,
          "fail": 4,
          "expired": 7,
          "totalOrders": 27,
          "total": 27,
          "successRate": 59.3
        }
      ]
    },
    {
      "id": "tg:@bcnami",
      "username": "@BCNAMI",
      "displayName": "BCNAMI",
      "telegramUsername": "@BCNAMI",
      "isNewKey": false,
      "done": 12,
      "fail": 4,
      "expired": 1,
      "total": 17,
      "successRate": 70.6,
      "completedOrders": 12,
      "totalOrders": 17,
      "failCount": 4,
      "payCalc": {
        "tierRate": 31,
        "basePay": 372,
        "isCapped": false,
        "tierLabel": "11–20 QR (₹31)"
      },
      "keys": [
        {
          "name": "LuffyD",
          "key": "WORKER-BAF8-8A3C-3CA1-5604",
          "completedOrders": 12,
          "done": 12,
          "failCount": 4,
          "fail": 4,
          "expired": 1,
          "totalOrders": 17,
          "total": 17,
          "successRate": 70.6
        }
      ]
    },
    {
      "id": "unassigned:WORKER-3733-5E4E-39BD-A862",
      "username": null,
      "displayName": "Worker 20 (Mazid)",
      "telegramUsername": null,
      "isNewKey": true,
      "done": 8,
      "fail": 0,
      "expired": 3,
      "total": 11,
      "successRate": 72.7,
      "completedOrders": 8,
      "totalOrders": 11,
      "failCount": 0,
      "payCalc": {
        "tierRate": 27,
        "basePay": 216,
        "isCapped": false,
        "tierLabel": "6–10 QR (₹27)"
      },
      "keys": [
        {
          "name": "Mazid",
          "key": "WORKER-3733-5E4E-39BD-A862",
          "completedOrders": 8,
          "done": 8,
          "failCount": 0,
          "fail": 0,
          "expired": 3,
          "totalOrders": 11,
          "total": 11,
          "successRate": 72.7
        }
      ]
    },
    {
      "id": "unassigned:WORKER-2E2B-0002-1C3A-6661",
      "username": null,
      "displayName": "Worker 15 (@Noob_001)",
      "telegramUsername": null,
      "isNewKey": true,
      "done": 7,
      "fail": 2,
      "expired": 0,
      "total": 9,
      "successRate": 77.8,
      "completedOrders": 7,
      "totalOrders": 9,
      "failCount": 2,
      "payCalc": {
        "tierRate": 27,
        "basePay": 189,
        "isCapped": false,
        "tierLabel": "6–10 QR (₹27)"
      },
      "keys": [
        {
          "name": "@Noob_001",
          "key": "WORKER-2E2B-0002-1C3A-6661",
          "completedOrders": 7,
          "done": 7,
          "failCount": 2,
          "fail": 2,
          "expired": 0,
          "totalOrders": 9,
          "total": 9,
          "successRate": 77.8
        }
      ]
    },
    {
      "id": "tg:@shauryagharat4103",
      "username": "@shauryagharat4103",
      "displayName": "Shaurya",
      "telegramUsername": "@shauryagharat4103",
      "isNewKey": false,
      "done": 6,
      "fail": 4,
      "expired": 0,
      "total": 10,
      "successRate": 60,
      "completedOrders": 6,
      "totalOrders": 10,
      "failCount": 4,
      "payCalc": {
        "tierRate": 27,
        "basePay": 162,
        "isCapped": false,
        "tierLabel": "6–10 QR (₹27)"
      },
      "keys": [
        {
          "name": "Shaurya",
          "key": "WORKER-98D0-D03A-8138-F09A",
          "completedOrders": 6,
          "done": 6,
          "failCount": 4,
          "fail": 4,
          "expired": 0,
          "totalOrders": 10,
          "total": 10,
          "successRate": 60
        }
      ]
    },
    {
      "id": "unassigned:WORKER-4119-5DB9-C755-2C6C",
      "username": null,
      "displayName": "Worker 1 (Nitinji)",
      "telegramUsername": null,
      "isNewKey": true,
      "done": 6,
      "fail": 3,
      "expired": 0,
      "total": 9,
      "successRate": 66.7,
      "completedOrders": 6,
      "totalOrders": 9,
      "failCount": 3,
      "payCalc": {
        "tierRate": 27,
        "basePay": 162,
        "isCapped": false,
        "tierLabel": "6–10 QR (₹27)"
      },
      "keys": [
        {
          "name": "Nitinji",
          "key": "WORKER-4119-5DB9-C755-2C6C",
          "completedOrders": 6,
          "done": 6,
          "failCount": 3,
          "fail": 3,
          "expired": 0,
          "totalOrders": 9,
          "total": 9,
          "successRate": 66.7
        }
      ]
    },
    {
      "id": "unassigned:WORKER-33D3-D5B1-2681-E1AA",
      "username": null,
      "displayName": "Worker 3 (Blaster)",
      "telegramUsername": null,
      "isNewKey": true,
      "done": 4,
      "fail": 1,
      "expired": 0,
      "total": 5,
      "successRate": 80,
      "completedOrders": 4,
      "totalOrders": 5,
      "failCount": 1,
      "payCalc": {
        "tierRate": 25,
        "basePay": 100,
        "isCapped": false,
        "tierLabel": "1–5 QR (₹25)"
      },
      "keys": [
        {
          "name": "Blaster",
          "key": "WORKER-33D3-D5B1-2681-E1AA",
          "completedOrders": 4,
          "done": 4,
          "failCount": 1,
          "fail": 1,
          "expired": 0,
          "totalOrders": 5,
          "total": 5,
          "successRate": 80
        }
      ]
    },
    {
      "id": "unassigned:WORKER-21A1-3852-4B33-B1EB",
      "username": null,
      "displayName": "Worker 9 (@Davidprivate22)",
      "telegramUsername": null,
      "isNewKey": true,
      "done": 4,
      "fail": 3,
      "expired": 0,
      "total": 7,
      "successRate": 57.1,
      "completedOrders": 4,
      "totalOrders": 7,
      "failCount": 3,
      "payCalc": {
        "tierRate": 25,
        "basePay": 100,
        "isCapped": false,
        "tierLabel": "1–5 QR (₹25)"
      },
      "keys": [
        {
          "name": "@Davidprivate22",
          "key": "WORKER-21A1-3852-4B33-B1EB",
          "completedOrders": 4,
          "done": 4,
          "failCount": 3,
          "fail": 3,
          "expired": 0,
          "totalOrders": 7,
          "total": 7,
          "successRate": 57.1
        }
      ]
    },
    {
      "id": "unassigned:WORKER-8249-BBAF-83E8-8414",
      "username": null,
      "displayName": "Worker 2 (Mayanke)",
      "telegramUsername": null,
      "isNewKey": true,
      "done": 3,
      "fail": 0,
      "expired": 1,
      "total": 4,
      "successRate": 75,
      "completedOrders": 3,
      "totalOrders": 4,
      "failCount": 0,
      "payCalc": {
        "tierRate": 25,
        "basePay": 75,
        "isCapped": false,
        "tierLabel": "1–5 QR (₹25)"
      },
      "keys": [
        {
          "name": "Mayanke",
          "key": "WORKER-8249-BBAF-83E8-8414",
          "completedOrders": 3,
          "done": 3,
          "failCount": 0,
          "fail": 0,
          "expired": 1,
          "totalOrders": 4,
          "total": 4,
          "successRate": 75
        }
      ]
    },
    {
      "id": "unassigned:WORKER-EC38-FDD9-D04A-EA07",
      "username": null,
      "displayName": "Worker 6 (Jaatue)",
      "telegramUsername": null,
      "isNewKey": true,
      "done": 2,
      "fail": 1,
      "expired": 1,
      "total": 4,
      "successRate": 50,
      "completedOrders": 2,
      "totalOrders": 4,
      "failCount": 1,
      "payCalc": {
        "tierRate": 25,
        "basePay": 50,
        "isCapped": false,
        "tierLabel": "1–5 QR (₹25)"
      },
      "keys": [
        {
          "name": "Jaatue",
          "key": "WORKER-EC38-FDD9-D04A-EA07",
          "completedOrders": 2,
          "done": 2,
          "failCount": 1,
          "fail": 1,
          "expired": 1,
          "totalOrders": 4,
          "total": 4,
          "successRate": 50
        }
      ]
    },
    {
      "id": "tg:@sonu2538",
      "username": "@Sonu2538",
      "displayName": "Sonu Singh",
      "telegramUsername": "@Sonu2538",
      "isNewKey": false,
      "done": 2,
      "fail": 1,
      "expired": 1,
      "total": 4,
      "successRate": 50,
      "completedOrders": 2,
      "totalOrders": 4,
      "failCount": 1,
      "payCalc": {
        "tierRate": 25,
        "basePay": 50,
        "isCapped": false,
        "tierLabel": "1–5 QR (₹25)"
      },
      "keys": [
        {
          "name": "Sonusingh",
          "key": "WORKER-79E7-D83D-0D37-C64B",
          "completedOrders": 2,
          "done": 2,
          "failCount": 1,
          "fail": 1,
          "expired": 1,
          "totalOrders": 4,
          "total": 4,
          "successRate": 50
        }
      ]
    },
    {
      "id": "tg:@tgrajout",
      "username": "@Tgrajout",
      "displayName": "Tg Rajput",
      "telegramUsername": "@Tgrajout",
      "isNewKey": false,
      "done": 2,
      "fail": 16,
      "expired": 4,
      "total": 22,
      "successRate": 9.1,
      "completedOrders": 2,
      "totalOrders": 22,
      "failCount": 16,
      "payCalc": {
        "tierRate": 25,
        "basePay": 50,
        "isCapped": false,
        "tierLabel": "1–5 QR (₹25)"
      },
      "keys": [
        {
          "name": "Paras41",
          "key": "WORKER-B9CC-39EC-1C71-DDEC",
          "completedOrders": 2,
          "done": 2,
          "failCount": 14,
          "fail": 14,
          "expired": 3,
          "totalOrders": 19,
          "total": 19,
          "successRate": 10.5
        },
        {
          "name": "Shub10",
          "key": "WORKER-13A1-13E1-B4B9-8CBE",
          "completedOrders": 0,
          "done": 0,
          "failCount": 1,
          "fail": 1,
          "expired": 0,
          "totalOrders": 1,
          "total": 1,
          "successRate": 0
        },
        {
          "name": "Shub5",
          "key": "WORKER-8CAF-E03B-19C1-E66F",
          "completedOrders": 0,
          "done": 0,
          "failCount": 0,
          "fail": 0,
          "expired": 1,
          "totalOrders": 1,
          "total": 1,
          "successRate": 0
        },
        {
          "name": "Paras46",
          "key": "WORKER-7EDD-E24E-A7E0-8813",
          "completedOrders": 0,
          "done": 0,
          "failCount": 1,
          "fail": 1,
          "expired": 0,
          "totalOrders": 1,
          "total": 1,
          "successRate": 0
        }
      ]
    },
    {
      "id": "unassigned:WORKER-7717-41E9-19D6-9C1B",
      "username": null,
      "displayName": "Worker 4 (mohitsingh)",
      "telegramUsername": null,
      "isNewKey": true,
      "done": 1,
      "fail": 0,
      "expired": 0,
      "total": 1,
      "successRate": 100,
      "completedOrders": 1,
      "totalOrders": 1,
      "failCount": 0,
      "payCalc": {
        "tierRate": 25,
        "basePay": 25,
        "isCapped": false,
        "tierLabel": "1–5 QR (₹25)"
      },
      "keys": [
        {
          "name": "mohitsingh",
          "key": "WORKER-7717-41E9-19D6-9C1B",
          "completedOrders": 1,
          "done": 1,
          "failCount": 0,
          "fail": 0,
          "expired": 0,
          "totalOrders": 1,
          "total": 1,
          "successRate": 100
        }
      ]
    },
    {
      "id": "unassigned:WORKER-B5F3-B889-02AF-2A5C",
      "username": null,
      "displayName": "Worker 5 (Hugguno1)",
      "telegramUsername": null,
      "isNewKey": true,
      "done": 1,
      "fail": 2,
      "expired": 0,
      "total": 3,
      "successRate": 33.3,
      "completedOrders": 1,
      "totalOrders": 3,
      "failCount": 2,
      "payCalc": {
        "tierRate": 25,
        "basePay": 25,
        "isCapped": false,
        "tierLabel": "1–5 QR (₹25)"
      },
      "keys": [
        {
          "name": "Hugguno1",
          "key": "WORKER-B5F3-B889-02AF-2A5C",
          "completedOrders": 1,
          "done": 1,
          "failCount": 2,
          "fail": 2,
          "expired": 0,
          "totalOrders": 3,
          "total": 3,
          "successRate": 33.3
        }
      ]
    },
    {
      "id": "unassigned:WORKER-CCB2-8079-028A-FC37",
      "username": null,
      "displayName": "Worker 11 (Cixiid)",
      "telegramUsername": null,
      "isNewKey": true,
      "done": 1,
      "fail": 0,
      "expired": 0,
      "total": 1,
      "successRate": 100,
      "completedOrders": 1,
      "totalOrders": 1,
      "failCount": 0,
      "payCalc": {
        "tierRate": 25,
        "basePay": 25,
        "isCapped": false,
        "tierLabel": "1–5 QR (₹25)"
      },
      "keys": [
        {
          "name": "Cixiid",
          "key": "WORKER-CCB2-8079-028A-FC37",
          "completedOrders": 1,
          "done": 1,
          "failCount": 0,
          "fail": 0,
          "expired": 0,
          "totalOrders": 1,
          "total": 1,
          "successRate": 100
        }
      ]
    },
    {
      "id": "unassigned:WORKER-E184-4C9B-3C7F-CB67",
      "username": null,
      "displayName": "Worker 12 (@Raju6789uu)",
      "telegramUsername": null,
      "isNewKey": true,
      "done": 1,
      "fail": 2,
      "expired": 0,
      "total": 3,
      "successRate": 33.3,
      "completedOrders": 1,
      "totalOrders": 3,
      "failCount": 2,
      "payCalc": {
        "tierRate": 25,
        "basePay": 25,
        "isCapped": false,
        "tierLabel": "1–5 QR (₹25)"
      },
      "keys": [
        {
          "name": "@Raju6789uu",
          "key": "WORKER-E184-4C9B-3C7F-CB67",
          "completedOrders": 1,
          "done": 1,
          "failCount": 2,
          "fail": 2,
          "expired": 0,
          "totalOrders": 3,
          "total": 3,
          "successRate": 33.3
        }
      ]
    },
    {
      "id": "tg:@kelifor",
      "username": "@Kelifor",
      "displayName": "Kelifor",
      "telegramUsername": "@Kelifor",
      "isNewKey": false,
      "done": 1,
      "fail": 1,
      "expired": 0,
      "total": 2,
      "successRate": 50,
      "completedOrders": 1,
      "totalOrders": 2,
      "failCount": 1,
      "payCalc": {
        "tierRate": 25,
        "basePay": 25,
        "isCapped": false,
        "tierLabel": "1–5 QR (₹25)"
      },
      "keys": [
        {
          "name": "Kelifor",
          "key": "WORKER-4A7A-EE26-47D4-9F9A",
          "completedOrders": 1,
          "done": 1,
          "failCount": 1,
          "fail": 1,
          "expired": 0,
          "totalOrders": 2,
          "total": 2,
          "successRate": 50
        }
      ]
    },
    {
      "id": "tg:@pawan_naidu_24",
      "username": "@pawan_naidu_24",
      "displayName": "Pawan Naidu",
      "telegramUsername": "@pawan_naidu_24",
      "isNewKey": false,
      "done": 1,
      "fail": 0,
      "expired": 0,
      "total": 1,
      "successRate": 100,
      "completedOrders": 1,
      "totalOrders": 1,
      "failCount": 0,
      "payCalc": {
        "tierRate": 25,
        "basePay": 25,
        "isCapped": false,
        "tierLabel": "1–5 QR (₹25)"
      },
      "keys": [
        {
          "name": "Givemeworkbro",
          "key": "WORKER-D8DC-E408-F99E-B402",
          "completedOrders": 1,
          "done": 1,
          "failCount": 0,
          "fail": 0,
          "expired": 0,
          "totalOrders": 1,
          "total": 1,
          "successRate": 100
        }
      ]
    },
    {
      "id": "unassigned:WORKER-275C-AFF1-0964-B7D3",
      "username": null,
      "displayName": "Worker 17 (Sahileix)",
      "telegramUsername": null,
      "isNewKey": true,
      "done": 1,
      "fail": 0,
      "expired": 0,
      "total": 1,
      "successRate": 100,
      "completedOrders": 1,
      "totalOrders": 1,
      "failCount": 0,
      "payCalc": {
        "tierRate": 25,
        "basePay": 25,
        "isCapped": false,
        "tierLabel": "1–5 QR (₹25)"
      },
      "keys": [
        {
          "name": "Sahileix",
          "key": "WORKER-275C-AFF1-0964-B7D3",
          "completedOrders": 1,
          "done": 1,
          "failCount": 0,
          "fail": 0,
          "expired": 0,
          "totalOrders": 1,
          "total": 1,
          "successRate": 100
        }
      ]
    },
    {
      "id": "unassigned:WORKER-E93D-1B0D-B982-1F58",
      "username": null,
      "displayName": "Worker 18 (Rohitshrma)",
      "telegramUsername": null,
      "isNewKey": true,
      "done": 1,
      "fail": 1,
      "expired": 0,
      "total": 2,
      "successRate": 50,
      "completedOrders": 1,
      "totalOrders": 2,
      "failCount": 1,
      "payCalc": {
        "tierRate": 25,
        "basePay": 25,
        "isCapped": false,
        "tierLabel": "1–5 QR (₹25)"
      },
      "keys": [
        {
          "name": "Rohitshrma",
          "key": "WORKER-E93D-1B0D-B982-1F58",
          "completedOrders": 1,
          "done": 1,
          "failCount": 1,
          "fail": 1,
          "expired": 0,
          "totalOrders": 2,
          "total": 2,
          "successRate": 50
        }
      ]
    },
    {
      "id": "unassigned:WORKER-1DDE-7ACC-3F5A-CB6B",
      "username": null,
      "displayName": "Worker 19 (Teliyash)",
      "telegramUsername": null,
      "isNewKey": true,
      "done": 1,
      "fail": 1,
      "expired": 0,
      "total": 2,
      "successRate": 50,
      "completedOrders": 1,
      "totalOrders": 2,
      "failCount": 1,
      "payCalc": {
        "tierRate": 25,
        "basePay": 25,
        "isCapped": false,
        "tierLabel": "1–5 QR (₹25)"
      },
      "keys": [
        {
          "name": "Teliyash",
          "key": "WORKER-1DDE-7ACC-3F5A-CB6B",
          "completedOrders": 1,
          "done": 1,
          "failCount": 1,
          "fail": 1,
          "expired": 0,
          "totalOrders": 2,
          "total": 2,
          "successRate": 50
        }
      ]
    },
    {
      "id": "unassigned:WORKER-8154-5DF2-4F51-FEE0",
      "username": null,
      "displayName": "Worker 23 (Lodalasn)",
      "telegramUsername": null,
      "isNewKey": true,
      "done": 1,
      "fail": 0,
      "expired": 0,
      "total": 1,
      "successRate": 100,
      "completedOrders": 1,
      "totalOrders": 1,
      "failCount": 0,
      "payCalc": {
        "tierRate": 25,
        "basePay": 25,
        "isCapped": false,
        "tierLabel": "1–5 QR (₹25)"
      },
      "keys": [
        {
          "name": "Lodalasn",
          "key": "WORKER-8154-5DF2-4F51-FEE0",
          "completedOrders": 1,
          "done": 1,
          "failCount": 0,
          "fail": 0,
          "expired": 0,
          "totalOrders": 1,
          "total": 1,
          "successRate": 100
        }
      ]
    },
    {
      "id": "tg:loki",
      "username": "loki",
      "displayName": "Loki",
      "telegramUsername": "loki",
      "isNewKey": false,
      "done": 0,
      "fail": 1,
      "expired": 0,
      "total": 1,
      "successRate": 0,
      "completedOrders": 0,
      "totalOrders": 1,
      "failCount": 1,
      "payCalc": {
        "tierRate": 0,
        "basePay": 0,
        "isCapped": false,
        "tierLabel": "0 QR"
      },
      "keys": [
        {
          "name": "W99w8",
          "key": "WORKER-E0F5-49CA-9564-7425",
          "completedOrders": 0,
          "done": 0,
          "failCount": 1,
          "fail": 1,
          "expired": 0,
          "totalOrders": 1,
          "total": 1,
          "successRate": 0
        }
      ]
    },
    {
      "id": "unassigned:WORKER-C210-CEC2-1E10-53A0",
      "username": null,
      "displayName": "Worker 8 (¥¥)",
      "telegramUsername": null,
      "isNewKey": true,
      "done": 0,
      "fail": 1,
      "expired": 0,
      "total": 1,
      "successRate": 0,
      "completedOrders": 0,
      "totalOrders": 1,
      "failCount": 1,
      "payCalc": {
        "tierRate": 0,
        "basePay": 0,
        "isCapped": false,
        "tierLabel": "0 QR"
      },
      "keys": [
        {
          "name": "¥¥",
          "key": "WORKER-C210-CEC2-1E10-53A0",
          "completedOrders": 0,
          "done": 0,
          "failCount": 1,
          "fail": 1,
          "expired": 0,
          "totalOrders": 1,
          "total": 1,
          "successRate": 0
        }
      ]
    },
    {
      "id": "unassigned:WORKER-A179-7E17-F5F3-2DB9",
      "username": null,
      "displayName": "Worker 10 (robertjr)",
      "telegramUsername": null,
      "isNewKey": true,
      "done": 0,
      "fail": 2,
      "expired": 0,
      "total": 2,
      "successRate": 0,
      "completedOrders": 0,
      "totalOrders": 2,
      "failCount": 2,
      "payCalc": {
        "tierRate": 0,
        "basePay": 0,
        "isCapped": false,
        "tierLabel": "0 QR"
      },
      "keys": [
        {
          "name": "robertjr",
          "key": "WORKER-A179-7E17-F5F3-2DB9",
          "completedOrders": 0,
          "done": 0,
          "failCount": 2,
          "fail": 2,
          "expired": 0,
          "totalOrders": 2,
          "total": 2,
          "successRate": 0
        }
      ]
    },
    {
      "id": "unassigned:WORKER-1BF4-E852-B5B3-34CC",
      "username": null,
      "displayName": "Worker 13 (Paras45)",
      "telegramUsername": null,
      "isNewKey": true,
      "done": 0,
      "fail": 1,
      "expired": 4,
      "total": 5,
      "successRate": 0,
      "completedOrders": 0,
      "totalOrders": 5,
      "failCount": 1,
      "payCalc": {
        "tierRate": 0,
        "basePay": 0,
        "isCapped": false,
        "tierLabel": "0 QR"
      },
      "keys": [
        {
          "name": "Paras45",
          "key": "WORKER-1BF4-E852-B5B3-34CC",
          "completedOrders": 0,
          "done": 0,
          "failCount": 1,
          "fail": 1,
          "expired": 4,
          "totalOrders": 5,
          "total": 5,
          "successRate": 0
        }
      ]
    },
    {
      "id": "unassigned:WORKER-66E6-3DEE-3014-C7F8",
      "username": null,
      "displayName": "Worker 14 (Fastest)",
      "telegramUsername": null,
      "isNewKey": true,
      "done": 0,
      "fail": 1,
      "expired": 0,
      "total": 1,
      "successRate": 0,
      "completedOrders": 0,
      "totalOrders": 1,
      "failCount": 1,
      "payCalc": {
        "tierRate": 0,
        "basePay": 0,
        "isCapped": false,
        "tierLabel": "0 QR"
      },
      "keys": [
        {
          "name": "Fastest",
          "key": "WORKER-66E6-3DEE-3014-C7F8",
          "completedOrders": 0,
          "done": 0,
          "failCount": 1,
          "fail": 1,
          "expired": 0,
          "totalOrders": 1,
          "total": 1,
          "successRate": 0
        }
      ]
    },
    {
      "id": "tg:@aashu_97",
      "username": "@AASHU_97",
      "displayName": "Aashu",
      "telegramUsername": "@AASHU_97",
      "isNewKey": false,
      "done": 0,
      "fail": 5,
      "expired": 0,
      "total": 5,
      "successRate": 0,
      "completedOrders": 0,
      "totalOrders": 5,
      "failCount": 5,
      "payCalc": {
        "tierRate": 0,
        "basePay": 0,
        "isCapped": false,
        "tierLabel": "0 QR"
      },
      "keys": [
        {
          "name": "Aashu",
          "key": "WORKER-7F2C-BE14-84B5-EC3C",
          "completedOrders": 0,
          "done": 0,
          "failCount": 5,
          "fail": 5,
          "expired": 0,
          "totalOrders": 5,
          "total": 5,
          "successRate": 0
        }
      ]
    },
    {
      "id": "unassigned:WORKER-8C94-F3F9-58D8-7E76",
      "username": null,
      "displayName": "Worker 16 (@indianagent10)",
      "telegramUsername": null,
      "isNewKey": true,
      "done": 0,
      "fail": 2,
      "expired": 0,
      "total": 2,
      "successRate": 0,
      "completedOrders": 0,
      "totalOrders": 2,
      "failCount": 2,
      "payCalc": {
        "tierRate": 0,
        "basePay": 0,
        "isCapped": false,
        "tierLabel": "0 QR"
      },
      "keys": [
        {
          "name": "@indianagent10",
          "key": "WORKER-8C94-F3F9-58D8-7E76",
          "completedOrders": 0,
          "done": 0,
          "failCount": 2,
          "fail": 2,
          "expired": 0,
          "totalOrders": 2,
          "total": 2,
          "successRate": 0
        }
      ]
    },
    {
      "id": "unassigned:WORKER-F1DB-01CD-1E57-6DCB",
      "username": null,
      "displayName": "Worker 21 (Helloz)",
      "telegramUsername": null,
      "isNewKey": true,
      "done": 0,
      "fail": 3,
      "expired": 0,
      "total": 3,
      "successRate": 0,
      "completedOrders": 0,
      "totalOrders": 3,
      "failCount": 3,
      "payCalc": {
        "tierRate": 0,
        "basePay": 0,
        "isCapped": false,
        "tierLabel": "0 QR"
      },
      "keys": [
        {
          "name": "Helloz",
          "key": "WORKER-F1DB-01CD-1E57-6DCB",
          "completedOrders": 0,
          "done": 0,
          "failCount": 3,
          "fail": 3,
          "expired": 0,
          "totalOrders": 3,
          "total": 3,
          "successRate": 0
        }
      ]
    },
    {
      "id": "unassigned:WORKER-9D8E-6C9B-BBB9-085A",
      "username": null,
      "displayName": "Worker 22 (Unkown)",
      "telegramUsername": null,
      "isNewKey": true,
      "done": 0,
      "fail": 1,
      "expired": 0,
      "total": 1,
      "successRate": 0,
      "completedOrders": 0,
      "totalOrders": 1,
      "failCount": 1,
      "payCalc": {
        "tierRate": 0,
        "basePay": 0,
        "isCapped": false,
        "tierLabel": "0 QR"
      },
      "keys": [
        {
          "name": "Unkown",
          "key": "WORKER-9D8E-6C9B-BBB9-085A",
          "completedOrders": 0,
          "done": 0,
          "failCount": 1,
          "fail": 1,
          "expired": 0,
          "totalOrders": 1,
          "total": 1,
          "successRate": 0
        }
      ]
    },
    {
      "id": "unassigned:WORKER-B6D3-6301-0EB4-9B2C",
      "username": null,
      "displayName": "Worker 24 (Hey1239)",
      "telegramUsername": null,
      "isNewKey": true,
      "done": 0,
      "fail": 1,
      "expired": 0,
      "total": 1,
      "successRate": 0,
      "completedOrders": 0,
      "totalOrders": 1,
      "failCount": 1,
      "payCalc": {
        "tierRate": 0,
        "basePay": 0,
        "isCapped": false,
        "tierLabel": "0 QR"
      },
      "keys": [
        {
          "name": "Hey1239",
          "key": "WORKER-B6D3-6301-0EB4-9B2C",
          "completedOrders": 0,
          "done": 0,
          "failCount": 1,
          "fail": 1,
          "expired": 0,
          "totalOrders": 1,
          "total": 1,
          "successRate": 0
        }
      ]
    },
    {
      "id": "unassigned:WORKER-100A-8FA5-F2F6-5892",
      "username": null,
      "displayName": "Worker 25 (4bankhe)",
      "telegramUsername": null,
      "isNewKey": true,
      "done": 0,
      "fail": 1,
      "expired": 0,
      "total": 1,
      "successRate": 0,
      "completedOrders": 0,
      "totalOrders": 1,
      "failCount": 1,
      "payCalc": {
        "tierRate": 0,
        "basePay": 0,
        "isCapped": false,
        "tierLabel": "0 QR"
      },
      "keys": [
        {
          "name": "4bankhe",
          "key": "WORKER-100A-8FA5-F2F6-5892",
          "completedOrders": 0,
          "done": 0,
          "failCount": 1,
          "fail": 1,
          "expired": 0,
          "totalOrders": 1,
          "total": 1,
          "successRate": 0
        }
      ]
    }
  ]
};

  const settlementData25Sep = {
  "window": "25 Sep 2026 (12:00 AM – 12:00 AM Midnight Full Day Settlement)",
  "bossMasi": {
    "totalCompleted": 177,
    "ratePerSuccess": 0.6,
    "lossPerFailure": 0.1,
    "grossUsd": 106.2,
    "penaltiesCount": 67,
    "penaltiesUsd": -6.7,
    "netUsd": 99.5,
    "approxInrNet": 8358,
    "balanceCents": 0
  },
  "redBanKeys": [
    {
      "name": "Hashirbhai",
      "key": "WORKER-36F9-1F80-EA07-C8DA",
      "tg": "@hashirmhd",
      "ownerName": "Hashir",
      "completed": 65,
      "failed": 5,
      "total": 71,
      "successRate": 91.5,
      "reason": "High Failures (5 fail)"
    },
    {
      "name": "Alam00",
      "key": "WORKER-0BE2-72E7-D72A-E15F",
      "tg": "Unassigned (Assign TG)",
      "ownerName": "Worker 7 (Alam00)",
      "completed": 55,
      "failed": 12,
      "total": 67,
      "successRate": 82.1,
      "reason": "High Failures (12 fail)"
    },
    {
      "name": "Hellxieii",
      "key": "WORKER-B25D-66C6-25F7-C418",
      "tg": "@fileworker_6700",
      "ownerName": "Fileworker",
      "completed": 15,
      "failed": 7,
      "total": 23,
      "successRate": 65.2,
      "reason": "High Failures (7 fail)"
    },
    {
      "name": "Duds",
      "key": "WORKER-DUDS",
      "tg": "Unassigned (Assign TG)",
      "ownerName": "Worker 4 (Duds)",
      "completed": 3,
      "failed": 3,
      "total": 6,
      "successRate": 50,
      "reason": "Low Output (3 QR) with high fails (3 fail)"
    },
    {
      "name": "Shaurya",
      "key": "WORKER-98D0-D03A-8138-F09A",
      "tg": "@shauryagharat4103",
      "ownerName": "Shaurya",
      "completed": 2,
      "failed": 6,
      "total": 8,
      "successRate": 25,
      "reason": "Low Output (2 QR) with high fails (6 fail)"
    },
    {
      "name": "mohitsingh",
      "key": "WORKER-7717-41E9-19D6-9C1B",
      "tg": "Unassigned (Assign TG)",
      "ownerName": "Worker 8 (mohitsingh)",
      "completed": 1,
      "failed": 2,
      "total": 4,
      "successRate": 25,
      "reason": "Low Output (1 QR) with high fails (2 fail)"
    },
    {
      "name": "Adibhai",
      "key": "WORKER-ADIBHAI",
      "tg": "Unassigned (Assign TG)",
      "ownerName": "Worker 14 (Adibhai)",
      "completed": 1,
      "failed": 2,
      "total": 3,
      "successRate": 33.3,
      "reason": "Low Output (1 QR) with high fails (2 fail)"
    },
    {
      "name": "@Dudeinsaneee",
      "key": "WORKER-@DUDEINSANEEE",
      "tg": "Unassigned (Assign TG)",
      "ownerName": "Worker 3 (@Dudeinsaneee)",
      "completed": 0,
      "failed": 1,
      "total": 2,
      "successRate": 0,
      "reason": "Low Output (0 QR) with high fails (1 fail)"
    },
    {
      "name": "Unknown",
      "key": "WORKER-UNKNOWN",
      "tg": "Unassigned (Assign TG)",
      "ownerName": "Worker 5 (Unknown)",
      "completed": 0,
      "failed": 3,
      "total": 3,
      "successRate": 0,
      "reason": "Low Output (0 QR) with high fails (3 fail)"
    },
    {
      "name": "Adityasingh",
      "key": "WORKER-A49B-FD25-122A-244D",
      "tg": "Unassigned (Assign TG)",
      "ownerName": "Worker 6 (Adityasingh)",
      "completed": 0,
      "failed": 1,
      "total": 1,
      "successRate": 0,
      "reason": "Low Output (0 QR) with high fails (1 fail)"
    },
    {
      "name": "hi",
      "key": "WORKER-HI",
      "tg": "Unassigned (Assign TG)",
      "ownerName": "Worker 9 (hi)",
      "completed": 0,
      "failed": 1,
      "total": 1,
      "successRate": 0,
      "reason": "Low Output (0 QR) with high fails (1 fail)"
    },
    {
      "name": "Sharmaji",
      "key": "WORKER-9433-07AE-F0AF-26E2",
      "tg": "Unassigned (Assign TG)",
      "ownerName": "Worker 11 (Sharmaji)",
      "completed": 0,
      "failed": 2,
      "total": 2,
      "successRate": 0,
      "reason": "Low Output (0 QR) with high fails (2 fail)"
    },
    {
      "name": "Lokesh",
      "key": "WORKER-ABC7-A12B-7A80-E0C4",
      "tg": "Unassigned (Assign TG)",
      "ownerName": "Worker 12 (Lokesh)",
      "completed": 0,
      "failed": 4,
      "total": 4,
      "successRate": 0,
      "reason": "Low Output (0 QR) with high fails (4 fail)"
    },
    {
      "name": "@Adarsh443",
      "key": "WORKER-@ADARSH443",
      "tg": "Unassigned (Assign TG)",
      "ownerName": "Worker 15 (@Adarsh443)",
      "completed": 0,
      "failed": 2,
      "total": 2,
      "successRate": 0,
      "reason": "Low Output (0 QR) with high fails (2 fail)"
    },
    {
      "name": "Paras48",
      "key": "WORKER-PARAS48",
      "tg": "Unassigned (Assign TG)",
      "ownerName": "Worker 16 (Paras48)",
      "completed": 0,
      "failed": 1,
      "total": 1,
      "successRate": 0,
      "reason": "Low Output (0 QR) with high fails (1 fail)"
    },
    {
      "name": "¥¥",
      "key": "WORKER-C210-CEC2-1E10-53A0",
      "tg": "Unassigned (Assign TG)",
      "ownerName": "Worker 17 (¥¥)",
      "completed": 0,
      "failed": 1,
      "total": 2,
      "successRate": 0,
      "reason": "Low Output (0 QR) with high fails (1 fail)"
    },
    {
      "name": "Givemeworkbro",
      "key": "WORKER-D8DC-E408-F99E-B402",
      "tg": "@pawan_naidu_24",
      "ownerName": "Pawan Naidu",
      "completed": 0,
      "failed": 1,
      "total": 1,
      "successRate": 0,
      "reason": "Low Output (0 QR) with high fails (1 fail)"
    },
    {
      "name": "Teliyash",
      "key": "WORKER-1DDE-7ACC-3F5A-CB6B",
      "tg": "Unassigned (Assign TG)",
      "ownerName": "Worker 18 (Teliyash)",
      "completed": 0,
      "failed": 1,
      "total": 1,
      "successRate": 0,
      "reason": "Low Output (0 QR) with high fails (1 fail)"
    },
    {
      "name": "Sonusingh",
      "key": "WORKER-79E7-D83D-0D37-C64B",
      "tg": "@Sonu2538",
      "ownerName": "Sonu Singh",
      "completed": 0,
      "failed": 1,
      "total": 1,
      "successRate": 0,
      "reason": "Low Output (0 QR) with high fails (1 fail)"
    },
    {
      "name": "Cixiid",
      "key": "WORKER-CCB2-8079-028A-FC37",
      "tg": "Unassigned (Assign TG)",
      "ownerName": "Worker 21 (Cixiid)",
      "completed": 0,
      "failed": 2,
      "total": 2,
      "successRate": 0,
      "reason": "Low Output (0 QR) with high fails (2 fail)"
    },
    {
      "name": "Hugguno1",
      "key": "WORKER-B5F3-B889-02AF-2A5C",
      "tg": "Unassigned (Assign TG)",
      "ownerName": "Worker 22 (Hugguno1)",
      "completed": 0,
      "failed": 1,
      "total": 1,
      "successRate": 0,
      "reason": "Low Output (0 QR) with high fails (1 fail)"
    }
  ],
  "users": [
    {
      "id": "tg:@hashirmhd",
      "username": "@hashirmhd",
      "displayName": "Hashir",
      "telegramUsername": "@hashirmhd",
      "isNewKey": false,
      "done": 65,
      "fail": 5,
      "expired": 1,
      "total": 71,
      "successRate": 91.5,
      "completedOrders": 65,
      "totalOrders": 71,
      "failCount": 5,
      "payCalc": {
        "tierRate": 40,
        "basePay": 2600,
        "isCapped": false,
        "tierLabel": "30+ QR (₹40)"
      },
      "keys": [
        {
          "name": "Hashirbhai",
          "key": "WORKER-36F9-1F80-EA07-C8DA",
          "completedOrders": 65,
          "done": 65,
          "failCount": 5,
          "fail": 5,
          "expired": 1,
          "totalOrders": 71,
          "total": 71,
          "successRate": 91.5
        }
      ]
    },
    {
      "id": "unassigned:WORKER-0BE2-72E7-D72A-E15F",
      "username": null,
      "displayName": "Worker 7 (Alam00)",
      "telegramUsername": null,
      "isNewKey": true,
      "done": 55,
      "fail": 12,
      "expired": 0,
      "total": 67,
      "successRate": 82.1,
      "completedOrders": 55,
      "totalOrders": 67,
      "failCount": 12,
      "payCalc": {
        "tierRate": 40,
        "basePay": 2200,
        "isCapped": false,
        "tierLabel": "30+ QR (₹40)"
      },
      "keys": [
        {
          "name": "Alam00",
          "key": "WORKER-0BE2-72E7-D72A-E15F",
          "completedOrders": 55,
          "done": 55,
          "failCount": 12,
          "fail": 12,
          "expired": 0,
          "totalOrders": 67,
          "total": 67,
          "successRate": 82.1
        }
      ]
    },
    {
      "id": "tg:@fileworker_6700",
      "username": "@fileworker_6700",
      "displayName": "Fileworker",
      "telegramUsername": "@fileworker_6700",
      "isNewKey": false,
      "done": 25,
      "fail": 8,
      "expired": 1,
      "total": 34,
      "successRate": 73.5,
      "completedOrders": 25,
      "totalOrders": 34,
      "failCount": 8,
      "payCalc": {
        "tierRate": 35,
        "basePay": 875,
        "isCapped": false,
        "tierLabel": "20+ QR (₹35)"
      },
      "keys": [
        {
          "name": "Hellxieii",
          "key": "WORKER-B25D-66C6-25F7-C418",
          "completedOrders": 15,
          "done": 15,
          "failCount": 7,
          "fail": 7,
          "expired": 1,
          "totalOrders": 23,
          "total": 23,
          "successRate": 65.2
        },
        {
          "name": "@fileworker_6700",
          "key": "WORKER-B25D-66C6-25F7-C418",
          "completedOrders": 10,
          "done": 10,
          "failCount": 1,
          "fail": 1,
          "expired": 0,
          "totalOrders": 11,
          "total": 11,
          "successRate": 90.9
        }
      ]
    },
    {
      "id": "unassigned:WORKER-DEPUBABY",
      "username": null,
      "displayName": "Worker 10 (Depubaby)",
      "telegramUsername": null,
      "isNewKey": true,
      "done": 5,
      "fail": 1,
      "expired": 1,
      "total": 7,
      "successRate": 71.4,
      "completedOrders": 5,
      "totalOrders": 7,
      "failCount": 1,
      "payCalc": {
        "tierRate": 25,
        "basePay": 125,
        "isCapped": false,
        "tierLabel": "1–5 QR (₹25)"
      },
      "keys": [
        {
          "name": "Depubaby",
          "key": "WORKER-DEPUBABY",
          "completedOrders": 5,
          "done": 5,
          "failCount": 1,
          "fail": 1,
          "expired": 1,
          "totalOrders": 7,
          "total": 7,
          "successRate": 71.4
        }
      ]
    },
    {
      "id": "unassigned:WORKER-4119-5DB9-C755-2C6C",
      "username": null,
      "displayName": "Worker 2 (Nitinji)",
      "telegramUsername": null,
      "isNewKey": true,
      "done": 4,
      "fail": 0,
      "expired": 0,
      "total": 4,
      "successRate": 100,
      "completedOrders": 4,
      "totalOrders": 4,
      "failCount": 0,
      "payCalc": {
        "tierRate": 25,
        "basePay": 100,
        "isCapped": false,
        "tierLabel": "1–5 QR (₹25)"
      },
      "keys": [
        {
          "name": "Nitinji",
          "key": "WORKER-4119-5DB9-C755-2C6C",
          "completedOrders": 4,
          "done": 4,
          "failCount": 0,
          "fail": 0,
          "expired": 0,
          "totalOrders": 4,
          "total": 4,
          "successRate": 100
        }
      ]
    },
    {
      "id": "tg:@bcnami",
      "username": "@BCNAMI",
      "displayName": "BCNAMI",
      "telegramUsername": "@BCNAMI",
      "isNewKey": false,
      "done": 4,
      "fail": 2,
      "expired": 1,
      "total": 7,
      "successRate": 57.1,
      "completedOrders": 4,
      "totalOrders": 7,
      "failCount": 2,
      "payCalc": {
        "tierRate": 25,
        "basePay": 100,
        "isCapped": false,
        "tierLabel": "1–5 QR (₹25)"
      },
      "keys": [
        {
          "name": "LuffyD",
          "key": "WORKER-BAF8-8A3C-3CA1-5604",
          "completedOrders": 4,
          "done": 4,
          "failCount": 2,
          "fail": 2,
          "expired": 1,
          "totalOrders": 7,
          "total": 7,
          "successRate": 57.1
        }
      ]
    },
    {
      "id": "unassigned:WORKER-@WS_SOURAV69",
      "username": null,
      "displayName": "Worker 13 (@Ws_sourav69)",
      "telegramUsername": null,
      "isNewKey": true,
      "done": 4,
      "fail": 1,
      "expired": 0,
      "total": 5,
      "successRate": 80,
      "completedOrders": 4,
      "totalOrders": 5,
      "failCount": 1,
      "payCalc": {
        "tierRate": 25,
        "basePay": 100,
        "isCapped": false,
        "tierLabel": "1–5 QR (₹25)"
      },
      "keys": [
        {
          "name": "@Ws_sourav69",
          "key": "WORKER-@WS_SOURAV69",
          "completedOrders": 4,
          "done": 4,
          "failCount": 1,
          "fail": 1,
          "expired": 0,
          "totalOrders": 5,
          "total": 5,
          "successRate": 80
        }
      ]
    },
    {
      "id": "unassigned:WORKER-DUDS",
      "username": null,
      "displayName": "Worker 4 (Duds)",
      "telegramUsername": null,
      "isNewKey": true,
      "done": 3,
      "fail": 3,
      "expired": 0,
      "total": 6,
      "successRate": 50,
      "completedOrders": 3,
      "totalOrders": 6,
      "failCount": 3,
      "payCalc": {
        "tierRate": 25,
        "basePay": 75,
        "isCapped": false,
        "tierLabel": "1–5 QR (₹25)"
      },
      "keys": [
        {
          "name": "Duds",
          "key": "WORKER-DUDS",
          "completedOrders": 3,
          "done": 3,
          "failCount": 3,
          "fail": 3,
          "expired": 0,
          "totalOrders": 6,
          "total": 6,
          "successRate": 50
        }
      ]
    },
    {
      "id": "unassigned:WORKER-66E6-3DEE-3014-C7F8",
      "username": null,
      "displayName": "Worker 1 (Fastest)",
      "telegramUsername": null,
      "isNewKey": true,
      "done": 2,
      "fail": 0,
      "expired": 0,
      "total": 2,
      "successRate": 100,
      "completedOrders": 2,
      "totalOrders": 2,
      "failCount": 0,
      "payCalc": {
        "tierRate": 25,
        "basePay": 50,
        "isCapped": false,
        "tierLabel": "1–5 QR (₹25)"
      },
      "keys": [
        {
          "name": "Fastest",
          "key": "WORKER-66E6-3DEE-3014-C7F8",
          "completedOrders": 2,
          "done": 2,
          "failCount": 0,
          "fail": 0,
          "expired": 0,
          "totalOrders": 2,
          "total": 2,
          "successRate": 100
        }
      ]
    },
    {
      "id": "tg:@rosalie_admin1",
      "username": "@ROSALIE_ADMIN1",
      "displayName": "Rosalie Admin",
      "telegramUsername": "@ROSALIE_ADMIN1",
      "isNewKey": false,
      "done": 2,
      "fail": 1,
      "expired": 1,
      "total": 4,
      "successRate": 50,
      "completedOrders": 2,
      "totalOrders": 4,
      "failCount": 1,
      "payCalc": {
        "tierRate": 25,
        "basePay": 50,
        "isCapped": false,
        "tierLabel": "1–5 QR (₹25)"
      },
      "keys": [
        {
          "name": "1webkeydedo",
          "key": "WORKER-B110-7AFF-53AF-AA74",
          "completedOrders": 2,
          "done": 2,
          "failCount": 1,
          "fail": 1,
          "expired": 1,
          "totalOrders": 4,
          "total": 4,
          "successRate": 50
        }
      ]
    },
    {
      "id": "tg:@shauryagharat4103",
      "username": "@shauryagharat4103",
      "displayName": "Shaurya",
      "telegramUsername": "@shauryagharat4103",
      "isNewKey": false,
      "done": 2,
      "fail": 6,
      "expired": 0,
      "total": 8,
      "successRate": 25,
      "completedOrders": 2,
      "totalOrders": 8,
      "failCount": 6,
      "payCalc": {
        "tierRate": 25,
        "basePay": 50,
        "isCapped": false,
        "tierLabel": "1–5 QR (₹25)"
      },
      "keys": [
        {
          "name": "Shaurya",
          "key": "WORKER-98D0-D03A-8138-F09A",
          "completedOrders": 2,
          "done": 2,
          "failCount": 6,
          "fail": 6,
          "expired": 0,
          "totalOrders": 8,
          "total": 8,
          "successRate": 25
        }
      ]
    },
    {
      "id": "unassigned:WORKER-BLASTER09",
      "username": null,
      "displayName": "Worker 19 (Blaster09)",
      "telegramUsername": null,
      "isNewKey": true,
      "done": 2,
      "fail": 1,
      "expired": 0,
      "total": 3,
      "successRate": 66.7,
      "completedOrders": 2,
      "totalOrders": 3,
      "failCount": 1,
      "payCalc": {
        "tierRate": 25,
        "basePay": 50,
        "isCapped": false,
        "tierLabel": "1–5 QR (₹25)"
      },
      "keys": [
        {
          "name": "Blaster09",
          "key": "WORKER-BLASTER09",
          "completedOrders": 2,
          "done": 2,
          "failCount": 1,
          "fail": 1,
          "expired": 0,
          "totalOrders": 3,
          "total": 3,
          "successRate": 66.7
        }
      ]
    },
    {
      "id": "unassigned:WORKER-7717-41E9-19D6-9C1B",
      "username": null,
      "displayName": "Worker 8 (mohitsingh)",
      "telegramUsername": null,
      "isNewKey": true,
      "done": 1,
      "fail": 2,
      "expired": 1,
      "total": 4,
      "successRate": 25,
      "completedOrders": 1,
      "totalOrders": 4,
      "failCount": 2,
      "payCalc": {
        "tierRate": 25,
        "basePay": 25,
        "isCapped": false,
        "tierLabel": "1–5 QR (₹25)"
      },
      "keys": [
        {
          "name": "mohitsingh",
          "key": "WORKER-7717-41E9-19D6-9C1B",
          "completedOrders": 1,
          "done": 1,
          "failCount": 2,
          "fail": 2,
          "expired": 1,
          "totalOrders": 4,
          "total": 4,
          "successRate": 25
        }
      ]
    },
    {
      "id": "unassigned:WORKER-ADIBHAI",
      "username": null,
      "displayName": "Worker 14 (Adibhai)",
      "telegramUsername": null,
      "isNewKey": true,
      "done": 1,
      "fail": 2,
      "expired": 0,
      "total": 3,
      "successRate": 33.3,
      "completedOrders": 1,
      "totalOrders": 3,
      "failCount": 2,
      "payCalc": {
        "tierRate": 25,
        "basePay": 25,
        "isCapped": false,
        "tierLabel": "1–5 QR (₹25)"
      },
      "keys": [
        {
          "name": "Adibhai",
          "key": "WORKER-ADIBHAI",
          "completedOrders": 1,
          "done": 1,
          "failCount": 2,
          "fail": 2,
          "expired": 0,
          "totalOrders": 3,
          "total": 3,
          "successRate": 33.3
        }
      ]
    },
    {
      "id": "tg:@tgrajout",
      "username": "@Tgrajout",
      "displayName": "Tg Rajput",
      "telegramUsername": "@Tgrajout",
      "isNewKey": false,
      "done": 1,
      "fail": 1,
      "expired": 0,
      "total": 2,
      "successRate": 50,
      "completedOrders": 1,
      "totalOrders": 2,
      "failCount": 1,
      "payCalc": {
        "tierRate": 25,
        "basePay": 25,
        "isCapped": false,
        "tierLabel": "1–5 QR (₹25)"
      },
      "keys": [
        {
          "name": "Shub5",
          "key": "WORKER-8CAF-E03B-19C1-E66F",
          "completedOrders": 1,
          "done": 1,
          "failCount": 1,
          "fail": 1,
          "expired": 0,
          "totalOrders": 2,
          "total": 2,
          "successRate": 50
        }
      ]
    },
    {
      "id": "unassigned:WORKER-EB89-186B-D312-4CB7",
      "username": null,
      "displayName": "Worker 20 (D10)",
      "telegramUsername": null,
      "isNewKey": true,
      "done": 1,
      "fail": 0,
      "expired": 0,
      "total": 1,
      "successRate": 100,
      "completedOrders": 1,
      "totalOrders": 1,
      "failCount": 0,
      "payCalc": {
        "tierRate": 25,
        "basePay": 25,
        "isCapped": false,
        "tierLabel": "1–5 QR (₹25)"
      },
      "keys": [
        {
          "name": "D10",
          "key": "WORKER-EB89-186B-D312-4CB7",
          "completedOrders": 1,
          "done": 1,
          "failCount": 0,
          "fail": 0,
          "expired": 0,
          "totalOrders": 1,
          "total": 1,
          "successRate": 100
        }
      ]
    },
    {
      "id": "unassigned:WORKER-@DUDEINSANEEE",
      "username": null,
      "displayName": "Worker 3 (@Dudeinsaneee)",
      "telegramUsername": null,
      "isNewKey": true,
      "done": 0,
      "fail": 1,
      "expired": 1,
      "total": 2,
      "successRate": 0,
      "completedOrders": 0,
      "totalOrders": 2,
      "failCount": 1,
      "payCalc": {
        "tierRate": 0,
        "basePay": 0,
        "isCapped": false,
        "tierLabel": "0 QR"
      },
      "keys": [
        {
          "name": "@Dudeinsaneee",
          "key": "WORKER-@DUDEINSANEEE",
          "completedOrders": 0,
          "done": 0,
          "failCount": 1,
          "fail": 1,
          "expired": 1,
          "totalOrders": 2,
          "total": 2,
          "successRate": 0
        }
      ]
    },
    {
      "id": "unassigned:WORKER-UNKNOWN",
      "username": null,
      "displayName": "Worker 5 (Unknown)",
      "telegramUsername": null,
      "isNewKey": true,
      "done": 0,
      "fail": 3,
      "expired": 0,
      "total": 3,
      "successRate": 0,
      "completedOrders": 0,
      "totalOrders": 3,
      "failCount": 3,
      "payCalc": {
        "tierRate": 0,
        "basePay": 0,
        "isCapped": false,
        "tierLabel": "0 QR"
      },
      "keys": [
        {
          "name": "Unknown",
          "key": "WORKER-UNKNOWN",
          "completedOrders": 0,
          "done": 0,
          "failCount": 3,
          "fail": 3,
          "expired": 0,
          "totalOrders": 3,
          "total": 3,
          "successRate": 0
        }
      ]
    },
    {
      "id": "unassigned:WORKER-A49B-FD25-122A-244D",
      "username": null,
      "displayName": "Worker 6 (Adityasingh)",
      "telegramUsername": null,
      "isNewKey": true,
      "done": 0,
      "fail": 1,
      "expired": 0,
      "total": 1,
      "successRate": 0,
      "completedOrders": 0,
      "totalOrders": 1,
      "failCount": 1,
      "payCalc": {
        "tierRate": 0,
        "basePay": 0,
        "isCapped": false,
        "tierLabel": "0 QR"
      },
      "keys": [
        {
          "name": "Adityasingh",
          "key": "WORKER-A49B-FD25-122A-244D",
          "completedOrders": 0,
          "done": 0,
          "failCount": 1,
          "fail": 1,
          "expired": 0,
          "totalOrders": 1,
          "total": 1,
          "successRate": 0
        }
      ]
    },
    {
      "id": "unassigned:WORKER-HI",
      "username": null,
      "displayName": "Worker 9 (hi)",
      "telegramUsername": null,
      "isNewKey": true,
      "done": 0,
      "fail": 1,
      "expired": 0,
      "total": 1,
      "successRate": 0,
      "completedOrders": 0,
      "totalOrders": 1,
      "failCount": 1,
      "payCalc": {
        "tierRate": 0,
        "basePay": 0,
        "isCapped": false,
        "tierLabel": "0 QR"
      },
      "keys": [
        {
          "name": "hi",
          "key": "WORKER-HI",
          "completedOrders": 0,
          "done": 0,
          "failCount": 1,
          "fail": 1,
          "expired": 0,
          "totalOrders": 1,
          "total": 1,
          "successRate": 0
        }
      ]
    },
    {
      "id": "unassigned:WORKER-9433-07AE-F0AF-26E2",
      "username": null,
      "displayName": "Worker 11 (Sharmaji)",
      "telegramUsername": null,
      "isNewKey": true,
      "done": 0,
      "fail": 2,
      "expired": 0,
      "total": 2,
      "successRate": 0,
      "completedOrders": 0,
      "totalOrders": 2,
      "failCount": 2,
      "payCalc": {
        "tierRate": 0,
        "basePay": 0,
        "isCapped": false,
        "tierLabel": "0 QR"
      },
      "keys": [
        {
          "name": "Sharmaji",
          "key": "WORKER-9433-07AE-F0AF-26E2",
          "completedOrders": 0,
          "done": 0,
          "failCount": 2,
          "fail": 2,
          "expired": 0,
          "totalOrders": 2,
          "total": 2,
          "successRate": 0
        }
      ]
    },
    {
      "id": "unassigned:WORKER-ABC7-A12B-7A80-E0C4",
      "username": null,
      "displayName": "Worker 12 (Lokesh)",
      "telegramUsername": null,
      "isNewKey": true,
      "done": 0,
      "fail": 4,
      "expired": 0,
      "total": 4,
      "successRate": 0,
      "completedOrders": 0,
      "totalOrders": 4,
      "failCount": 4,
      "payCalc": {
        "tierRate": 0,
        "basePay": 0,
        "isCapped": false,
        "tierLabel": "0 QR"
      },
      "keys": [
        {
          "name": "Lokesh",
          "key": "WORKER-ABC7-A12B-7A80-E0C4",
          "completedOrders": 0,
          "done": 0,
          "failCount": 4,
          "fail": 4,
          "expired": 0,
          "totalOrders": 4,
          "total": 4,
          "successRate": 0
        }
      ]
    },
    {
      "id": "unassigned:WORKER-@ADARSH443",
      "username": null,
      "displayName": "Worker 15 (@Adarsh443)",
      "telegramUsername": null,
      "isNewKey": true,
      "done": 0,
      "fail": 2,
      "expired": 0,
      "total": 2,
      "successRate": 0,
      "completedOrders": 0,
      "totalOrders": 2,
      "failCount": 2,
      "payCalc": {
        "tierRate": 0,
        "basePay": 0,
        "isCapped": false,
        "tierLabel": "0 QR"
      },
      "keys": [
        {
          "name": "@Adarsh443",
          "key": "WORKER-@ADARSH443",
          "completedOrders": 0,
          "done": 0,
          "failCount": 2,
          "fail": 2,
          "expired": 0,
          "totalOrders": 2,
          "total": 2,
          "successRate": 0
        }
      ]
    },
    {
      "id": "unassigned:WORKER-PARAS48",
      "username": null,
      "displayName": "Worker 16 (Paras48)",
      "telegramUsername": null,
      "isNewKey": true,
      "done": 0,
      "fail": 1,
      "expired": 0,
      "total": 1,
      "successRate": 0,
      "completedOrders": 0,
      "totalOrders": 1,
      "failCount": 1,
      "payCalc": {
        "tierRate": 0,
        "basePay": 0,
        "isCapped": false,
        "tierLabel": "0 QR"
      },
      "keys": [
        {
          "name": "Paras48",
          "key": "WORKER-PARAS48",
          "completedOrders": 0,
          "done": 0,
          "failCount": 1,
          "fail": 1,
          "expired": 0,
          "totalOrders": 1,
          "total": 1,
          "successRate": 0
        }
      ]
    },
    {
      "id": "unassigned:WORKER-C210-CEC2-1E10-53A0",
      "username": null,
      "displayName": "Worker 17 (¥¥)",
      "telegramUsername": null,
      "isNewKey": true,
      "done": 0,
      "fail": 1,
      "expired": 1,
      "total": 2,
      "successRate": 0,
      "completedOrders": 0,
      "totalOrders": 2,
      "failCount": 1,
      "payCalc": {
        "tierRate": 0,
        "basePay": 0,
        "isCapped": false,
        "tierLabel": "0 QR"
      },
      "keys": [
        {
          "name": "¥¥",
          "key": "WORKER-C210-CEC2-1E10-53A0",
          "completedOrders": 0,
          "done": 0,
          "failCount": 1,
          "fail": 1,
          "expired": 1,
          "totalOrders": 2,
          "total": 2,
          "successRate": 0
        }
      ]
    },
    {
      "id": "tg:@pawan_naidu_24",
      "username": "@pawan_naidu_24",
      "displayName": "Pawan Naidu",
      "telegramUsername": "@pawan_naidu_24",
      "isNewKey": false,
      "done": 0,
      "fail": 1,
      "expired": 0,
      "total": 1,
      "successRate": 0,
      "completedOrders": 0,
      "totalOrders": 1,
      "failCount": 1,
      "payCalc": {
        "tierRate": 0,
        "basePay": 0,
        "isCapped": false,
        "tierLabel": "0 QR"
      },
      "keys": [
        {
          "name": "Givemeworkbro",
          "key": "WORKER-D8DC-E408-F99E-B402",
          "completedOrders": 0,
          "done": 0,
          "failCount": 1,
          "fail": 1,
          "expired": 0,
          "totalOrders": 1,
          "total": 1,
          "successRate": 0
        }
      ]
    },
    {
      "id": "unassigned:WORKER-1DDE-7ACC-3F5A-CB6B",
      "username": null,
      "displayName": "Worker 18 (Teliyash)",
      "telegramUsername": null,
      "isNewKey": true,
      "done": 0,
      "fail": 1,
      "expired": 0,
      "total": 1,
      "successRate": 0,
      "completedOrders": 0,
      "totalOrders": 1,
      "failCount": 1,
      "payCalc": {
        "tierRate": 0,
        "basePay": 0,
        "isCapped": false,
        "tierLabel": "0 QR"
      },
      "keys": [
        {
          "name": "Teliyash",
          "key": "WORKER-1DDE-7ACC-3F5A-CB6B",
          "completedOrders": 0,
          "done": 0,
          "failCount": 1,
          "fail": 1,
          "expired": 0,
          "totalOrders": 1,
          "total": 1,
          "successRate": 0
        }
      ]
    },
    {
      "id": "tg:@sonu2538",
      "username": "@Sonu2538",
      "displayName": "Sonu Singh",
      "telegramUsername": "@Sonu2538",
      "isNewKey": false,
      "done": 0,
      "fail": 1,
      "expired": 0,
      "total": 1,
      "successRate": 0,
      "completedOrders": 0,
      "totalOrders": 1,
      "failCount": 1,
      "payCalc": {
        "tierRate": 0,
        "basePay": 0,
        "isCapped": false,
        "tierLabel": "0 QR"
      },
      "keys": [
        {
          "name": "Sonusingh",
          "key": "WORKER-79E7-D83D-0D37-C64B",
          "completedOrders": 0,
          "done": 0,
          "failCount": 1,
          "fail": 1,
          "expired": 0,
          "totalOrders": 1,
          "total": 1,
          "successRate": 0
        }
      ]
    },
    {
      "id": "unassigned:WORKER-CCB2-8079-028A-FC37",
      "username": null,
      "displayName": "Worker 21 (Cixiid)",
      "telegramUsername": null,
      "isNewKey": true,
      "done": 0,
      "fail": 2,
      "expired": 0,
      "total": 2,
      "successRate": 0,
      "completedOrders": 0,
      "totalOrders": 2,
      "failCount": 2,
      "payCalc": {
        "tierRate": 0,
        "basePay": 0,
        "isCapped": false,
        "tierLabel": "0 QR"
      },
      "keys": [
        {
          "name": "Cixiid",
          "key": "WORKER-CCB2-8079-028A-FC37",
          "completedOrders": 0,
          "done": 0,
          "failCount": 2,
          "fail": 2,
          "expired": 0,
          "totalOrders": 2,
          "total": 2,
          "successRate": 0
        }
      ]
    },
    {
      "id": "unassigned:WORKER-B5F3-B889-02AF-2A5C",
      "username": null,
      "displayName": "Worker 22 (Hugguno1)",
      "telegramUsername": null,
      "isNewKey": true,
      "done": 0,
      "fail": 1,
      "expired": 0,
      "total": 1,
      "successRate": 0,
      "completedOrders": 0,
      "totalOrders": 1,
      "failCount": 1,
      "payCalc": {
        "tierRate": 0,
        "basePay": 0,
        "isCapped": false,
        "tierLabel": "0 QR"
      },
      "keys": [
        {
          "name": "Hugguno1",
          "key": "WORKER-B5F3-B889-02AF-2A5C",
          "completedOrders": 0,
          "done": 0,
          "failCount": 1,
          "fail": 1,
          "expired": 0,
          "totalOrders": 1,
          "total": 1,
          "successRate": 0
        }
      ]
    }
  ]
};

  const settlementData26Sep = {
  "window": "26 Sep 2026 (12:00 AM – 01:00 PM Today Live)",
  "bossMasi": {
    "totalCompleted": 108,
    "ratePerSuccess": 0.6,
    "lossPerFailure": 0.1,
    "grossUsd": 64.8,
    "penaltiesCount": 58,
    "penaltiesUsd": -5.8,
    "netUsd": 59,
    "approxInrNet": 4956,
    "balanceCents": 0
  },
  "redBanKeys": [
    {
      "name": "Hashirbhai",
      "key": "WORKER-36F9-1F80-EA07-C8DA",
      "tg": "@hashirmhd",
      "ownerName": "Hashir",
      "completed": 24,
      "failed": 6,
      "total": 30,
      "successRate": 80,
      "reason": "High Failures (6 fail)"
    },
    {
      "name": "LuffyD",
      "key": "WORKER-BAF8-8A3C-3CA1-5604",
      "tg": "@BCNAMI",
      "ownerName": "BCNAMI",
      "completed": 19,
      "failed": 3,
      "total": 30,
      "successRate": 63.3,
      "reason": "High Failures (3 fail)"
    },
    {
      "name": "Nitinji",
      "key": "WORKER-4119-5DB9-C755-2C6C",
      "tg": "@ntnatri",
      "ownerName": "Nitin",
      "completed": 13,
      "failed": 4,
      "total": 17,
      "successRate": 76.5,
      "reason": "High Failures (4 fail)"
    },
    {
      "name": "Majid0",
      "key": "WORKER-0132F3EB849B",
      "tg": "@majid",
      "ownerName": "Majid",
      "completed": 8,
      "failed": 4,
      "total": 14,
      "successRate": 57.1,
      "reason": "High Failures (4 fail)"
    },
    {
      "name": "Fastest",
      "key": "WORKER-66E6-3DEE-3014-C7F8",
      "tg": "@FastestWorker",
      "ownerName": "Fastest",
      "completed": 7,
      "failed": 5,
      "total": 13,
      "successRate": 53.8,
      "reason": "High Failures (5 fail)"
    },
    {
      "name": "Hellxieii",
      "key": "WORKER-B25D-66C6-25F7-C418",
      "tg": "@fileworker_6700",
      "ownerName": "Fileworker",
      "completed": 2,
      "failed": 3,
      "total": 5,
      "successRate": 40,
      "reason": "Low Output (2 QR) with high fails (3 fail)"
    },
    {
      "name": "@fileworker_6700",
      "key": "WORKER-B25D-66C6-25F7-C418",
      "tg": "@fileworker_6700",
      "ownerName": "Fileworker",
      "completed": 2,
      "failed": 9,
      "total": 11,
      "successRate": 18.2,
      "reason": "Low Output (2 QR) with high fails (9 fail)"
    },
    {
      "name": "mohitsingh",
      "key": "WORKER-7717-41E9-19D6-9C1B",
      "tg": "Unassigned (Assign TG)",
      "ownerName": "Worker 4 (mohitsingh)",
      "completed": 2,
      "failed": 0,
      "total": 7,
      "successRate": 28.6,
      "reason": "Low Output (2 QR) with high fails (0 fail)"
    },
    {
      "name": "Mayank",
      "key": "WORKER-7D72-484C-D0D4-3A24",
      "tg": "Unassigned (Assign TG)",
      "ownerName": "Worker 11 (Mayank)",
      "completed": 2,
      "failed": 1,
      "total": 9,
      "successRate": 22.2,
      "reason": "Low Output (2 QR) with high fails (1 fail)"
    },
    {
      "name": "1webkeydedo",
      "key": "WORKER-B110-7AFF-53AF-AA74",
      "tg": "@ROSALIE_ADMIN1",
      "ownerName": "Rosalie Admin",
      "completed": 1,
      "failed": 2,
      "total": 3,
      "successRate": 33.3,
      "reason": "Low Output (1 QR) with high fails (2 fail)"
    },
    {
      "name": "@Gmail99999989",
      "key": "WORKER-DDB662E42D59",
      "tg": "Unassigned (Assign TG)",
      "ownerName": "Worker 9 (@Gmail99999989)",
      "completed": 1,
      "failed": 3,
      "total": 5,
      "successRate": 20,
      "reason": "Low Output (1 QR) with high fails (3 fail)"
    },
    {
      "name": "Mayanke",
      "key": "WORKER-8249-BBAF-83E8-8414",
      "tg": "Unassigned (Assign TG)",
      "ownerName": "Worker 14 (Mayanke)",
      "completed": 1,
      "failed": 2,
      "total": 3,
      "successRate": 33.3,
      "reason": "Low Output (1 QR) with high fails (2 fail)"
    },
    {
      "name": "agyanewbna",
      "key": "WORKER-9232F0C75A13",
      "tg": "Unassigned (Assign TG)",
      "ownerName": "Worker 2 (agyanewbna)",
      "completed": 0,
      "failed": 0,
      "total": 1,
      "successRate": 0,
      "reason": "Low Output (0 QR) with high fails (0 fail)"
    },
    {
      "name": "Gudu",
      "key": "WORKER-C7FC-4778-5612-D883",
      "tg": "Unassigned (Assign TG)",
      "ownerName": "Worker 7 (Gudu)",
      "completed": 0,
      "failed": 0,
      "total": 1,
      "successRate": 0,
      "reason": "Low Output (0 QR) with high fails (0 fail)"
    },
    {
      "name": "Rayansheik",
      "key": "WORKER-4B522AD25C43",
      "tg": "Unassigned (Assign TG)",
      "ownerName": "Worker 8 (Rayansheik)",
      "completed": 0,
      "failed": 1,
      "total": 2,
      "successRate": 0,
      "reason": "Low Output (0 QR) with high fails (1 fail)"
    },
    {
      "name": "Givemeworkbro",
      "key": "WORKER-D8DC-E408-F99E-B402",
      "tg": "@pawan_naidu_24",
      "ownerName": "Pawan Naidu",
      "completed": 0,
      "failed": 2,
      "total": 2,
      "successRate": 0,
      "reason": "Low Output (0 QR) with high fails (2 fail)"
    },
    {
      "name": "@raj18vk",
      "key": "WORKER-3E647FECD149",
      "tg": "Unassigned (Assign TG)",
      "ownerName": "Worker 10 (@raj18vk)",
      "completed": 0,
      "failed": 2,
      "total": 2,
      "successRate": 0,
      "reason": "Low Output (0 QR) with high fails (2 fail)"
    },
    {
      "name": "indianagent",
      "key": "WORKER-88707666F255",
      "tg": "Unassigned (Assign TG)",
      "ownerName": "Worker 13 (indianagent)",
      "completed": 0,
      "failed": 1,
      "total": 1,
      "successRate": 0,
      "reason": "Low Output (0 QR) with high fails (1 fail)"
    },
    {
      "name": "addy w1",
      "key": "WORKER-8541-C1F7-7407-CE6E",
      "tg": "Unassigned (Assign TG)",
      "ownerName": "Worker 15 (addy w1)",
      "completed": 0,
      "failed": 0,
      "total": 2,
      "successRate": 0,
      "reason": "Low Output (0 QR) with high fails (0 fail)"
    },
    {
      "name": "Gapplayz",
      "key": "WORKER-4543-C819-5692-1BB1",
      "tg": "Unassigned (Assign TG)",
      "ownerName": "Worker 16 (Gapplayz)",
      "completed": 0,
      "failed": 2,
      "total": 2,
      "successRate": 0,
      "reason": "Low Output (0 QR) with high fails (2 fail)"
    },
    {
      "name": "Ethereal",
      "key": "WORKER-5550AF43E200",
      "tg": "Unassigned (Assign TG)",
      "ownerName": "Worker 17 (Ethereal)",
      "completed": 0,
      "failed": 1,
      "total": 1,
      "successRate": 0,
      "reason": "Low Output (0 QR) with high fails (1 fail)"
    },
    {
      "name": "Checkkros",
      "key": "WORKER-4F195B1A746E",
      "tg": "Unassigned (Assign TG)",
      "ownerName": "Worker 19 (Checkkros)",
      "completed": 0,
      "failed": 1,
      "total": 1,
      "successRate": 0,
      "reason": "Low Output (0 QR) with high fails (1 fail)"
    },
    {
      "name": "hi",
      "key": "WORKER-HI",
      "tg": "Unassigned (Assign TG)",
      "ownerName": "Worker 20 (hi)",
      "completed": 0,
      "failed": 2,
      "total": 2,
      "successRate": 0,
      "reason": "Low Output (0 QR) with high fails (2 fail)"
    }
  ],
  "users": [
    {
      "id": "tg:@hashirmhd",
      "username": "@hashirmhd",
      "displayName": "Hashir",
      "telegramUsername": "@hashirmhd",
      "isNewKey": false,
      "done": 24,
      "fail": 6,
      "expired": 0,
      "claimed": 0,
      "total": 30,
      "successRate": 80,
      "completedOrders": 24,
      "totalOrders": 30,
      "failCount": 6,
      "payCalc": {
        "tierRate": 35,
        "basePay": 840,
        "isCapped": false,
        "tierLabel": "20+ QR (₹35)"
      },
      "keys": [
        {
          "name": "Hashirbhai",
          "key": "WORKER-36F9-1F80-EA07-C8DA",
          "completedOrders": 24,
          "done": 24,
          "failCount": 6,
          "fail": 6,
          "expired": 0,
          "claimed": 0,
          "totalOrders": 30,
          "total": 30,
          "successRate": 80
        }
      ]
    },
    {
      "id": "tg:@bcnami",
      "username": "@BCNAMI",
      "displayName": "BCNAMI",
      "telegramUsername": "@BCNAMI",
      "isNewKey": false,
      "done": 19,
      "fail": 3,
      "expired": 8,
      "claimed": 0,
      "total": 30,
      "successRate": 63.3,
      "completedOrders": 19,
      "totalOrders": 30,
      "failCount": 3,
      "payCalc": {
        "tierRate": 31,
        "basePay": 589,
        "isCapped": false,
        "tierLabel": "11–20 QR (₹31)"
      },
      "keys": [
        {
          "name": "LuffyD",
          "key": "WORKER-BAF8-8A3C-3CA1-5604",
          "completedOrders": 19,
          "done": 19,
          "failCount": 3,
          "fail": 3,
          "expired": 8,
          "claimed": 0,
          "totalOrders": 30,
          "total": 30,
          "successRate": 63.3
        }
      ]
    },
    {
      "id": "tg:@ntnatri",
      "username": "@ntnatri",
      "displayName": "Nitin",
      "telegramUsername": "@ntnatri",
      "isNewKey": false,
      "done": 13,
      "fail": 4,
      "expired": 0,
      "claimed": 0,
      "total": 17,
      "successRate": 76.5,
      "completedOrders": 13,
      "totalOrders": 17,
      "failCount": 4,
      "payCalc": {
        "tierRate": 31,
        "basePay": 403,
        "isCapped": false,
        "tierLabel": "11–20 QR (₹31)"
      },
      "keys": [
        {
          "name": "Nitinji",
          "key": "WORKER-4119-5DB9-C755-2C6C",
          "completedOrders": 13,
          "done": 13,
          "failCount": 4,
          "fail": 4,
          "expired": 0,
          "claimed": 0,
          "totalOrders": 17,
          "total": 17,
          "successRate": 76.5
        }
      ]
    },
    {
      "id": "tg:@majid",
      "username": "@majid",
      "displayName": "Majid",
      "telegramUsername": "@majid",
      "isNewKey": false,
      "done": 8,
      "fail": 4,
      "expired": 2,
      "claimed": 0,
      "total": 14,
      "successRate": 57.1,
      "completedOrders": 8,
      "totalOrders": 14,
      "failCount": 4,
      "payCalc": {
        "tierRate": 27,
        "basePay": 216,
        "isCapped": false,
        "tierLabel": "6–10 QR (₹27)"
      },
      "keys": [
        {
          "name": "Majid0",
          "key": "WORKER-0132F3EB849B",
          "completedOrders": 8,
          "done": 8,
          "failCount": 4,
          "fail": 4,
          "expired": 2,
          "claimed": 0,
          "totalOrders": 14,
          "total": 14,
          "successRate": 57.1
        }
      ]
    },
    {
      "id": "tg:@fastestworker",
      "username": "@FastestWorker",
      "displayName": "Fastest",
      "telegramUsername": "@FastestWorker",
      "isNewKey": false,
      "done": 7,
      "fail": 5,
      "expired": 1,
      "claimed": 0,
      "total": 13,
      "successRate": 53.8,
      "completedOrders": 7,
      "totalOrders": 13,
      "failCount": 5,
      "payCalc": {
        "tierRate": 27,
        "basePay": 189,
        "isCapped": false,
        "tierLabel": "6–10 QR (₹27)"
      },
      "keys": [
        {
          "name": "Fastest",
          "key": "WORKER-66E6-3DEE-3014-C7F8",
          "completedOrders": 7,
          "done": 7,
          "failCount": 5,
          "fail": 5,
          "expired": 1,
          "claimed": 0,
          "totalOrders": 13,
          "total": 13,
          "successRate": 53.8
        }
      ]
    },
    {
      "id": "tg:@alam_tg",
      "username": "@alam_tg",
      "displayName": "Alam",
      "telegramUsername": "@alam_tg",
      "isNewKey": false,
      "done": 6,
      "fail": 0,
      "expired": 0,
      "claimed": 0,
      "total": 6,
      "successRate": 100,
      "completedOrders": 6,
      "totalOrders": 6,
      "failCount": 0,
      "payCalc": {
        "tierRate": 27,
        "basePay": 162,
        "isCapped": false,
        "tierLabel": "6–10 QR (₹27)"
      },
      "keys": [
        {
          "name": "Alam00",
          "key": "WORKER-0BE2-72E7-D72A-E15F",
          "completedOrders": 6,
          "done": 6,
          "failCount": 0,
          "fail": 0,
          "expired": 0,
          "claimed": 0,
          "totalOrders": 6,
          "total": 6,
          "successRate": 100
        }
      ]
    },
    {
      "id": "unassigned:WORKER-40315136C03A",
      "username": null,
      "displayName": "Worker 1 (Heloxi)",
      "telegramUsername": null,
      "isNewKey": true,
      "done": 5,
      "fail": 1,
      "expired": 0,
      "claimed": 1,
      "total": 7,
      "successRate": 71.4,
      "completedOrders": 5,
      "totalOrders": 7,
      "failCount": 1,
      "payCalc": {
        "tierRate": 25,
        "basePay": 125,
        "isCapped": false,
        "tierLabel": "1–5 QR (₹25)"
      },
      "keys": [
        {
          "name": "Heloxi",
          "key": "WORKER-40315136C03A",
          "completedOrders": 5,
          "done": 5,
          "failCount": 1,
          "fail": 1,
          "expired": 0,
          "claimed": 1,
          "totalOrders": 7,
          "total": 7,
          "successRate": 71.4
        }
      ]
    },
    {
      "id": "tg:@shauryagharat4103",
      "username": "@shauryagharat4103",
      "displayName": "Shaurya",
      "telegramUsername": "@shauryagharat4103",
      "isNewKey": false,
      "done": 5,
      "fail": 2,
      "expired": 0,
      "claimed": 0,
      "total": 7,
      "successRate": 71.4,
      "completedOrders": 5,
      "totalOrders": 7,
      "failCount": 2,
      "payCalc": {
        "tierRate": 25,
        "basePay": 125,
        "isCapped": false,
        "tierLabel": "1–5 QR (₹25)"
      },
      "keys": [
        {
          "name": "Shaurya",
          "key": "WORKER-98D0-D03A-8138-F09A",
          "completedOrders": 5,
          "done": 5,
          "failCount": 2,
          "fail": 2,
          "expired": 0,
          "claimed": 0,
          "totalOrders": 7,
          "total": 7,
          "successRate": 71.4
        }
      ]
    },
    {
      "id": "tg:@fileworker_6700",
      "username": "@fileworker_6700",
      "displayName": "Fileworker",
      "telegramUsername": "@fileworker_6700",
      "isNewKey": false,
      "done": 4,
      "fail": 12,
      "expired": 0,
      "claimed": 0,
      "total": 16,
      "successRate": 25,
      "completedOrders": 4,
      "totalOrders": 16,
      "failCount": 12,
      "payCalc": {
        "tierRate": 25,
        "basePay": 100,
        "isCapped": false,
        "tierLabel": "1–5 QR (₹25)"
      },
      "keys": [
        {
          "name": "Hellxieii",
          "key": "WORKER-B25D-66C6-25F7-C418",
          "completedOrders": 2,
          "done": 2,
          "failCount": 3,
          "fail": 3,
          "expired": 0,
          "claimed": 0,
          "totalOrders": 5,
          "total": 5,
          "successRate": 40
        },
        {
          "name": "@fileworker_6700",
          "key": "WORKER-B25D-66C6-25F7-C418",
          "completedOrders": 2,
          "done": 2,
          "failCount": 9,
          "fail": 9,
          "expired": 0,
          "claimed": 0,
          "totalOrders": 11,
          "total": 11,
          "successRate": 18.2
        }
      ]
    },
    {
      "id": "unassigned:WORKER-B1D33092F315",
      "username": null,
      "displayName": "Worker 3 (Tgdosti)",
      "telegramUsername": null,
      "isNewKey": true,
      "done": 3,
      "fail": 0,
      "expired": 0,
      "claimed": 0,
      "total": 3,
      "successRate": 100,
      "completedOrders": 3,
      "totalOrders": 3,
      "failCount": 0,
      "payCalc": {
        "tierRate": 25,
        "basePay": 75,
        "isCapped": false,
        "tierLabel": "1–5 QR (₹25)"
      },
      "keys": [
        {
          "name": "Tgdosti",
          "key": "WORKER-B1D33092F315",
          "completedOrders": 3,
          "done": 3,
          "failCount": 0,
          "fail": 0,
          "expired": 0,
          "claimed": 0,
          "totalOrders": 3,
          "total": 3,
          "successRate": 100
        }
      ]
    },
    {
      "id": "unassigned:WORKER-F1DB-01CD-1E57-6DCB",
      "username": null,
      "displayName": "Worker 6 (Helloz)",
      "telegramUsername": null,
      "isNewKey": true,
      "done": 3,
      "fail": 0,
      "expired": 1,
      "claimed": 0,
      "total": 4,
      "successRate": 75,
      "completedOrders": 3,
      "totalOrders": 4,
      "failCount": 0,
      "payCalc": {
        "tierRate": 25,
        "basePay": 75,
        "isCapped": false,
        "tierLabel": "1–5 QR (₹25)"
      },
      "keys": [
        {
          "name": "Helloz",
          "key": "WORKER-F1DB-01CD-1E57-6DCB",
          "completedOrders": 3,
          "done": 3,
          "failCount": 0,
          "fail": 0,
          "expired": 1,
          "claimed": 0,
          "totalOrders": 4,
          "total": 4,
          "successRate": 75
        }
      ]
    },
    {
      "id": "unassigned:WORKER-7717-41E9-19D6-9C1B",
      "username": null,
      "displayName": "Worker 4 (mohitsingh)",
      "telegramUsername": null,
      "isNewKey": true,
      "done": 2,
      "fail": 0,
      "expired": 5,
      "claimed": 0,
      "total": 7,
      "successRate": 28.6,
      "completedOrders": 2,
      "totalOrders": 7,
      "failCount": 0,
      "payCalc": {
        "tierRate": 25,
        "basePay": 50,
        "isCapped": false,
        "tierLabel": "1–5 QR (₹25)"
      },
      "keys": [
        {
          "name": "mohitsingh",
          "key": "WORKER-7717-41E9-19D6-9C1B",
          "completedOrders": 2,
          "done": 2,
          "failCount": 0,
          "fail": 0,
          "expired": 5,
          "claimed": 0,
          "totalOrders": 7,
          "total": 7,
          "successRate": 28.6
        }
      ]
    },
    {
      "id": "unassigned:WORKER-7D72-484C-D0D4-3A24",
      "username": null,
      "displayName": "Worker 11 (Mayank)",
      "telegramUsername": null,
      "isNewKey": true,
      "done": 2,
      "fail": 1,
      "expired": 6,
      "claimed": 0,
      "total": 9,
      "successRate": 22.2,
      "completedOrders": 2,
      "totalOrders": 9,
      "failCount": 1,
      "payCalc": {
        "tierRate": 25,
        "basePay": 50,
        "isCapped": false,
        "tierLabel": "1–5 QR (₹25)"
      },
      "keys": [
        {
          "name": "Mayank",
          "key": "WORKER-7D72-484C-D0D4-3A24",
          "completedOrders": 2,
          "done": 2,
          "failCount": 1,
          "fail": 1,
          "expired": 6,
          "claimed": 0,
          "totalOrders": 9,
          "total": 9,
          "successRate": 22.2
        }
      ]
    },
    {
      "id": "unassigned:WORKER-@WS_SOURAV69",
      "username": null,
      "displayName": "Worker 18 (@Ws_sourav69)",
      "telegramUsername": null,
      "isNewKey": true,
      "done": 2,
      "fail": 0,
      "expired": 0,
      "claimed": 0,
      "total": 2,
      "successRate": 100,
      "completedOrders": 2,
      "totalOrders": 2,
      "failCount": 0,
      "payCalc": {
        "tierRate": 25,
        "basePay": 50,
        "isCapped": false,
        "tierLabel": "1–5 QR (₹25)"
      },
      "keys": [
        {
          "name": "@Ws_sourav69",
          "key": "WORKER-@WS_SOURAV69",
          "completedOrders": 2,
          "done": 2,
          "failCount": 0,
          "fail": 0,
          "expired": 0,
          "claimed": 0,
          "totalOrders": 2,
          "total": 2,
          "successRate": 100
        }
      ]
    },
    {
      "id": "unassigned:WORKER-B5F3-B889-02AF-2A5C",
      "username": null,
      "displayName": "Worker 5 (Hugguno1)",
      "telegramUsername": null,
      "isNewKey": true,
      "done": 1,
      "fail": 1,
      "expired": 0,
      "claimed": 0,
      "total": 2,
      "successRate": 50,
      "completedOrders": 1,
      "totalOrders": 2,
      "failCount": 1,
      "payCalc": {
        "tierRate": 25,
        "basePay": 25,
        "isCapped": false,
        "tierLabel": "1–5 QR (₹25)"
      },
      "keys": [
        {
          "name": "Hugguno1",
          "key": "WORKER-B5F3-B889-02AF-2A5C",
          "completedOrders": 1,
          "done": 1,
          "failCount": 1,
          "fail": 1,
          "expired": 0,
          "claimed": 0,
          "totalOrders": 2,
          "total": 2,
          "successRate": 50
        }
      ]
    },
    {
      "id": "tg:@rosalie_admin1",
      "username": "@ROSALIE_ADMIN1",
      "displayName": "Rosalie Admin",
      "telegramUsername": "@ROSALIE_ADMIN1",
      "isNewKey": false,
      "done": 1,
      "fail": 2,
      "expired": 0,
      "claimed": 0,
      "total": 3,
      "successRate": 33.3,
      "completedOrders": 1,
      "totalOrders": 3,
      "failCount": 2,
      "payCalc": {
        "tierRate": 25,
        "basePay": 25,
        "isCapped": false,
        "tierLabel": "1–5 QR (₹25)"
      },
      "keys": [
        {
          "name": "1webkeydedo",
          "key": "WORKER-B110-7AFF-53AF-AA74",
          "completedOrders": 1,
          "done": 1,
          "failCount": 2,
          "fail": 2,
          "expired": 0,
          "claimed": 0,
          "totalOrders": 3,
          "total": 3,
          "successRate": 33.3
        }
      ]
    },
    {
      "id": "unassigned:WORKER-DDB662E42D59",
      "username": null,
      "displayName": "Worker 9 (@Gmail99999989)",
      "telegramUsername": null,
      "isNewKey": true,
      "done": 1,
      "fail": 3,
      "expired": 1,
      "claimed": 0,
      "total": 5,
      "successRate": 20,
      "completedOrders": 1,
      "totalOrders": 5,
      "failCount": 3,
      "payCalc": {
        "tierRate": 25,
        "basePay": 25,
        "isCapped": false,
        "tierLabel": "1–5 QR (₹25)"
      },
      "keys": [
        {
          "name": "@Gmail99999989",
          "key": "WORKER-DDB662E42D59",
          "completedOrders": 1,
          "done": 1,
          "failCount": 3,
          "fail": 3,
          "expired": 1,
          "claimed": 0,
          "totalOrders": 5,
          "total": 5,
          "successRate": 20
        }
      ]
    },
    {
      "id": "unassigned:WORKER-EB89-186B-D312-4CB7",
      "username": null,
      "displayName": "Worker 12 (D10)",
      "telegramUsername": null,
      "isNewKey": true,
      "done": 1,
      "fail": 0,
      "expired": 0,
      "claimed": 0,
      "total": 1,
      "successRate": 100,
      "completedOrders": 1,
      "totalOrders": 1,
      "failCount": 0,
      "payCalc": {
        "tierRate": 25,
        "basePay": 25,
        "isCapped": false,
        "tierLabel": "1–5 QR (₹25)"
      },
      "keys": [
        {
          "name": "D10",
          "key": "WORKER-EB89-186B-D312-4CB7",
          "completedOrders": 1,
          "done": 1,
          "failCount": 0,
          "fail": 0,
          "expired": 0,
          "claimed": 0,
          "totalOrders": 1,
          "total": 1,
          "successRate": 100
        }
      ]
    },
    {
      "id": "unassigned:WORKER-8249-BBAF-83E8-8414",
      "username": null,
      "displayName": "Worker 14 (Mayanke)",
      "telegramUsername": null,
      "isNewKey": true,
      "done": 1,
      "fail": 2,
      "expired": 0,
      "claimed": 0,
      "total": 3,
      "successRate": 33.3,
      "completedOrders": 1,
      "totalOrders": 3,
      "failCount": 2,
      "payCalc": {
        "tierRate": 25,
        "basePay": 25,
        "isCapped": false,
        "tierLabel": "1–5 QR (₹25)"
      },
      "keys": [
        {
          "name": "Mayanke",
          "key": "WORKER-8249-BBAF-83E8-8414",
          "completedOrders": 1,
          "done": 1,
          "failCount": 2,
          "fail": 2,
          "expired": 0,
          "claimed": 0,
          "totalOrders": 3,
          "total": 3,
          "successRate": 33.3
        }
      ]
    },
    {
      "id": "unassigned:WORKER-9232F0C75A13",
      "username": null,
      "displayName": "Worker 2 (agyanewbna)",
      "telegramUsername": null,
      "isNewKey": true,
      "done": 0,
      "fail": 0,
      "expired": 0,
      "claimed": 1,
      "total": 1,
      "successRate": 0,
      "completedOrders": 0,
      "totalOrders": 1,
      "failCount": 0,
      "payCalc": {
        "tierRate": 0,
        "basePay": 0,
        "isCapped": false,
        "tierLabel": "0 QR"
      },
      "keys": [
        {
          "name": "agyanewbna",
          "key": "WORKER-9232F0C75A13",
          "completedOrders": 0,
          "done": 0,
          "failCount": 0,
          "fail": 0,
          "expired": 0,
          "claimed": 1,
          "totalOrders": 1,
          "total": 1,
          "successRate": 0
        }
      ]
    },
    {
      "id": "unassigned:WORKER-C7FC-4778-5612-D883",
      "username": null,
      "displayName": "Worker 7 (Gudu)",
      "telegramUsername": null,
      "isNewKey": true,
      "done": 0,
      "fail": 0,
      "expired": 1,
      "claimed": 0,
      "total": 1,
      "successRate": 0,
      "completedOrders": 0,
      "totalOrders": 1,
      "failCount": 0,
      "payCalc": {
        "tierRate": 0,
        "basePay": 0,
        "isCapped": false,
        "tierLabel": "0 QR"
      },
      "keys": [
        {
          "name": "Gudu",
          "key": "WORKER-C7FC-4778-5612-D883",
          "completedOrders": 0,
          "done": 0,
          "failCount": 0,
          "fail": 0,
          "expired": 1,
          "claimed": 0,
          "totalOrders": 1,
          "total": 1,
          "successRate": 0
        }
      ]
    },
    {
      "id": "unassigned:WORKER-4B522AD25C43",
      "username": null,
      "displayName": "Worker 8 (Rayansheik)",
      "telegramUsername": null,
      "isNewKey": true,
      "done": 0,
      "fail": 1,
      "expired": 1,
      "claimed": 0,
      "total": 2,
      "successRate": 0,
      "completedOrders": 0,
      "totalOrders": 2,
      "failCount": 1,
      "payCalc": {
        "tierRate": 0,
        "basePay": 0,
        "isCapped": false,
        "tierLabel": "0 QR"
      },
      "keys": [
        {
          "name": "Rayansheik",
          "key": "WORKER-4B522AD25C43",
          "completedOrders": 0,
          "done": 0,
          "failCount": 1,
          "fail": 1,
          "expired": 1,
          "claimed": 0,
          "totalOrders": 2,
          "total": 2,
          "successRate": 0
        }
      ]
    },
    {
      "id": "tg:@pawan_naidu_24",
      "username": "@pawan_naidu_24",
      "displayName": "Pawan Naidu",
      "telegramUsername": "@pawan_naidu_24",
      "isNewKey": false,
      "done": 0,
      "fail": 2,
      "expired": 0,
      "claimed": 0,
      "total": 2,
      "successRate": 0,
      "completedOrders": 0,
      "totalOrders": 2,
      "failCount": 2,
      "payCalc": {
        "tierRate": 0,
        "basePay": 0,
        "isCapped": false,
        "tierLabel": "0 QR"
      },
      "keys": [
        {
          "name": "Givemeworkbro",
          "key": "WORKER-D8DC-E408-F99E-B402",
          "completedOrders": 0,
          "done": 0,
          "failCount": 2,
          "fail": 2,
          "expired": 0,
          "claimed": 0,
          "totalOrders": 2,
          "total": 2,
          "successRate": 0
        }
      ]
    },
    {
      "id": "unassigned:WORKER-3E647FECD149",
      "username": null,
      "displayName": "Worker 10 (@raj18vk)",
      "telegramUsername": null,
      "isNewKey": true,
      "done": 0,
      "fail": 2,
      "expired": 0,
      "claimed": 0,
      "total": 2,
      "successRate": 0,
      "completedOrders": 0,
      "totalOrders": 2,
      "failCount": 2,
      "payCalc": {
        "tierRate": 0,
        "basePay": 0,
        "isCapped": false,
        "tierLabel": "0 QR"
      },
      "keys": [
        {
          "name": "@raj18vk",
          "key": "WORKER-3E647FECD149",
          "completedOrders": 0,
          "done": 0,
          "failCount": 2,
          "fail": 2,
          "expired": 0,
          "claimed": 0,
          "totalOrders": 2,
          "total": 2,
          "successRate": 0
        }
      ]
    },
    {
      "id": "unassigned:WORKER-88707666F255",
      "username": null,
      "displayName": "Worker 13 (indianagent)",
      "telegramUsername": null,
      "isNewKey": true,
      "done": 0,
      "fail": 1,
      "expired": 0,
      "claimed": 0,
      "total": 1,
      "successRate": 0,
      "completedOrders": 0,
      "totalOrders": 1,
      "failCount": 1,
      "payCalc": {
        "tierRate": 0,
        "basePay": 0,
        "isCapped": false,
        "tierLabel": "0 QR"
      },
      "keys": [
        {
          "name": "indianagent",
          "key": "WORKER-88707666F255",
          "completedOrders": 0,
          "done": 0,
          "failCount": 1,
          "fail": 1,
          "expired": 0,
          "claimed": 0,
          "totalOrders": 1,
          "total": 1,
          "successRate": 0
        }
      ]
    },
    {
      "id": "unassigned:WORKER-8541-C1F7-7407-CE6E",
      "username": null,
      "displayName": "Worker 15 (addy w1)",
      "telegramUsername": null,
      "isNewKey": true,
      "done": 0,
      "fail": 0,
      "expired": 2,
      "claimed": 0,
      "total": 2,
      "successRate": 0,
      "completedOrders": 0,
      "totalOrders": 2,
      "failCount": 0,
      "payCalc": {
        "tierRate": 0,
        "basePay": 0,
        "isCapped": false,
        "tierLabel": "0 QR"
      },
      "keys": [
        {
          "name": "addy w1",
          "key": "WORKER-8541-C1F7-7407-CE6E",
          "completedOrders": 0,
          "done": 0,
          "failCount": 0,
          "fail": 0,
          "expired": 2,
          "claimed": 0,
          "totalOrders": 2,
          "total": 2,
          "successRate": 0
        }
      ]
    },
    {
      "id": "unassigned:WORKER-4543-C819-5692-1BB1",
      "username": null,
      "displayName": "Worker 16 (Gapplayz)",
      "telegramUsername": null,
      "isNewKey": true,
      "done": 0,
      "fail": 2,
      "expired": 0,
      "claimed": 0,
      "total": 2,
      "successRate": 0,
      "completedOrders": 0,
      "totalOrders": 2,
      "failCount": 2,
      "payCalc": {
        "tierRate": 0,
        "basePay": 0,
        "isCapped": false,
        "tierLabel": "0 QR"
      },
      "keys": [
        {
          "name": "Gapplayz",
          "key": "WORKER-4543-C819-5692-1BB1",
          "completedOrders": 0,
          "done": 0,
          "failCount": 2,
          "fail": 2,
          "expired": 0,
          "claimed": 0,
          "totalOrders": 2,
          "total": 2,
          "successRate": 0
        }
      ]
    },
    {
      "id": "unassigned:WORKER-5550AF43E200",
      "username": null,
      "displayName": "Worker 17 (Ethereal)",
      "telegramUsername": null,
      "isNewKey": true,
      "done": 0,
      "fail": 1,
      "expired": 0,
      "claimed": 0,
      "total": 1,
      "successRate": 0,
      "completedOrders": 0,
      "totalOrders": 1,
      "failCount": 1,
      "payCalc": {
        "tierRate": 0,
        "basePay": 0,
        "isCapped": false,
        "tierLabel": "0 QR"
      },
      "keys": [
        {
          "name": "Ethereal",
          "key": "WORKER-5550AF43E200",
          "completedOrders": 0,
          "done": 0,
          "failCount": 1,
          "fail": 1,
          "expired": 0,
          "claimed": 0,
          "totalOrders": 1,
          "total": 1,
          "successRate": 0
        }
      ]
    },
    {
      "id": "unassigned:WORKER-4F195B1A746E",
      "username": null,
      "displayName": "Worker 19 (Checkkros)",
      "telegramUsername": null,
      "isNewKey": true,
      "done": 0,
      "fail": 1,
      "expired": 0,
      "claimed": 0,
      "total": 1,
      "successRate": 0,
      "completedOrders": 0,
      "totalOrders": 1,
      "failCount": 1,
      "payCalc": {
        "tierRate": 0,
        "basePay": 0,
        "isCapped": false,
        "tierLabel": "0 QR"
      },
      "keys": [
        {
          "name": "Checkkros",
          "key": "WORKER-4F195B1A746E",
          "completedOrders": 0,
          "done": 0,
          "failCount": 1,
          "fail": 1,
          "expired": 0,
          "claimed": 0,
          "totalOrders": 1,
          "total": 1,
          "successRate": 0
        }
      ]
    },
    {
      "id": "unassigned:WORKER-HI",
      "username": null,
      "displayName": "Worker 20 (hi)",
      "telegramUsername": null,
      "isNewKey": true,
      "done": 0,
      "fail": 2,
      "expired": 0,
      "claimed": 0,
      "total": 2,
      "successRate": 0,
      "completedOrders": 0,
      "totalOrders": 2,
      "failCount": 2,
      "payCalc": {
        "tierRate": 0,
        "basePay": 0,
        "isCapped": false,
        "tierLabel": "0 QR"
      },
      "keys": [
        {
          "name": "hi",
          "key": "WORKER-HI",
          "completedOrders": 0,
          "done": 0,
          "failCount": 2,
          "fail": 2,
          "expired": 0,
          "claimed": 0,
          "totalOrders": 2,
          "total": 2,
          "successRate": 0
        }
      ]
    }
  ]
};
  window.downloadFullReport = function() {
    const panel = document.getElementById('panel-content');
    if (!panel) return;

    const fullDoc = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Daily Profit & Worker Payouts - 24 Sep 2026 (Full Day till 12:00 AM Midnight)</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    @media print {
      @page { size: A4 portrait; margin: 8mm 6mm; }
      * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
      body { background: white !important; font-size: 12px; }
      .no-print-in-doc { display: none !important; }
      .bg-white { break-inside: avoid !important; }
    }
  </style>
</head>
<body class="bg-slate-50 text-slate-800 p-4 sm:p-8 font-sans antialiased">
  <div class="max-w-5xl mx-auto space-y-4">
    <!-- Standalone Report Header -->
    <div class="bg-slate-900 text-white p-5 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-lg">
      <div>
        <h1 class="text-xl font-black tracking-tight">Daily Profit &amp; Worker Payouts Statement</h1>
        <p class="text-xs text-emerald-400 font-bold mt-1">🕒 Last Updated: 24 Sep 2026, 12:00 AM Midnight IST (Full Day)</p>
      </div>
      <div class="no-print-in-doc flex items-center gap-2">
        <button onclick="window.print()" class="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-extrabold shadow transition cursor-pointer">
          🖨️ Print / Save as PDF
        </button>
      </div>
    </div>

    <!-- Exact Dashboard Panel Content -->
    ${panel.innerHTML}
  </div>
</body>
</html>`;

    const blob = new Blob([fullDoc], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Daily_Profit_Payouts_24Sep_FullDay.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('📥 Report downloaded: Daily_Profit_Payouts_24Sep_FullDay.html', 'success');
  };

  window.exportWorkersPdf = function() {
    showToast('📄 Opening Print to PDF dialog...', 'info');
    setTimeout(() => {
      window.print();
    }, 150);
  };

  window.setDayFilter = function(day) {
    state.selectedDay = day;
    render();
    const dayLabel = day === '26sep' ? '🔥 26 Sep (Today Live 12 AM – 01:00 PM)' : (day === '25sep' ? '25 Sep (Full Day)' : (day === '24sep' ? '24 Sep (Full Day)' : (day === '23sep' ? '23 Sep (Full Day)' : '👑 4-Day Grand Combined Statement')));
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
    const selectedDay = state.selectedDay || '25sep';
    const adjustments = getAdjustments(selectedDay);
    const paidStatusMap = getPaidStatusMap(selectedDay);
    const customPayMap = getCustomPayMap(selectedDay);
    const customNotesMap = getCustomNotesMap(selectedDay);
    const usdInrRate = getUsdInrRate();
    const search = (state.searchQuery || '').toLowerCase().trim();
    const sortBy = state.sortBy || 'pay-desc';

    // Retrieve workers list based on selected Day
    let rawGuysList = [];
    let grossCreditUsd = 0;
    let penaltyDeductionsUsd = 0;
    let netCreditUsd = 0;
    let dayWindowLabel = '';

    if (selectedDay === 'combined') {
      // 4-Days Grand Combined (23, 24, 25 & 26 Sep)
      const c23 = settlementData23Sep.bossMasi.totalCompleted;
      const f23 = settlementData23Sep.bossMasi.penaltiesCount;
      const c24 = settlementData24Sep.bossMasi.totalCompleted;
      const f24 = settlementData24Sep.bossMasi.penaltiesCount;
      const c25 = settlementData25Sep.bossMasi.totalCompleted;
      const f25 = settlementData25Sep.bossMasi.penaltiesCount;
      const c26 = settlementData26Sep.bossMasi.totalCompleted;
      const f26 = settlementData26Sep.bossMasi.penaltiesCount;

      const totalDoneAll = c23 + c24 + c25 + c26;
      const totalFailAll = f23 + f24 + f25 + f26;
      grossCreditUsd = Number((totalDoneAll * 0.60).toFixed(2));
      penaltyDeductionsUsd = Number((totalFailAll * 0.10).toFixed(2));
      netCreditUsd = Number((grossCreditUsd - penaltyDeductionsUsd).toFixed(2));
      dayWindowLabel = '👑 4-Day Grand Combined Statement (23, 24, 25 & 26 Sep)';

      const cMap = new Map();
      const combineList = (list) => {
        (list || []).forEach(u => {
          const kId = u.id || u.username || u.displayName;
          if (!cMap.has(kId)) {
            cMap.set(kId, {
              id: u.id,
              displayName: u.displayName,
              telegramUsername: u.username || u.telegramUsername,
              completedOrders: 0,
              totalOrders: 0,
              failCount: 0,
              keys: []
            });
          }
          const item = cMap.get(kId);
          item.completedOrders += Number(u.done || u.completedOrders || 0);
          item.failCount += Number(u.fail || u.failCount || 0);
          item.totalOrders += Number(u.total || u.totalOrders || 0);
          (u.keys || []).forEach(k => {
            const exKey = item.keys.find(ek => ek.name === k.name || ek.key === k.key);
            if (exKey) {
              exKey.completedOrders = (exKey.completedOrders || 0) + (k.done || k.completedOrders || 0);
              exKey.failCount = (exKey.failCount || 0) + (k.fail || k.failCount || 0);
              exKey.totalOrders = (exKey.totalOrders || 0) + (k.total || k.totalOrders || 0);
            } else {
              item.keys.push({ ...k });
            }
          });
        });
      };
      combineList(settlementData23Sep.users);
      combineList(settlementData24Sep.users);
      combineList(settlementData25Sep.users);
      combineList(settlementData26Sep.users);

      rawGuysList = Array.from(cMap.values())
        .filter(u => u.completedOrders > 0)
        .map(u => {
          const rate = u.totalOrders > 0 ? Number(((u.completedOrders / u.totalOrders) * 100).toFixed(1)) : 0;
          return {
            ...u,
            successRate: rate,
            keys: u.keys.map(k => {
              const kRate = k.totalOrders > 0 ? Number(((k.completedOrders / k.totalOrders) * 100).toFixed(1)) : 0;
              return { ...k, successRate: kRate };
            })
          };
        });
    } else if (selectedDay === '23sep') {
      grossCreditUsd = Number((settlementData23Sep.bossMasi.totalCompleted * 0.60).toFixed(2));
      penaltyDeductionsUsd = Number((settlementData23Sep.bossMasi.penaltiesCount * 0.10).toFixed(2));
      netCreditUsd = Number((grossCreditUsd - penaltyDeductionsUsd).toFixed(2));
      dayWindowLabel = settlementData23Sep.window;

      rawGuysList = settlementData23Sep.users
        .filter(u => Number(u.done || u.completedOrders || 0) > 0)
        .map(u => ({
          id: u.id,
          displayName: u.displayName,
          telegramUsername: u.username || u.telegramUsername,
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
    } else if (selectedDay === '24sep') {
      grossCreditUsd = Number((settlementData24Sep.bossMasi.totalCompleted * 0.60).toFixed(2));
      penaltyDeductionsUsd = Number((settlementData24Sep.bossMasi.penaltiesCount * 0.10).toFixed(2));
      netCreditUsd = Number((grossCreditUsd - penaltyDeductionsUsd).toFixed(2));
      dayWindowLabel = settlementData24Sep.window;

      rawGuysList = settlementData24Sep.users
        .filter(u => Number(u.done || u.completedOrders || 0) > 0)
        .map(u => ({
          id: u.id,
          displayName: u.displayName,
          telegramUsername: u.username || u.telegramUsername,
          completedOrders: u.done,
          totalOrders: u.total,
          failCount: u.fail,
          successRate: u.successRate,
          isNewKey: u.isNewKey,
          keys: u.keys.map(k => ({
            name: k.name,
            key: k.key,
            completedOrders: k.done,
            failCount: k.fail,
            totalOrders: k.total,
            successRate: k.successRate
          }))
        }));
    } else if (selectedDay === '25sep') {
      grossCreditUsd = Number((settlementData25Sep.bossMasi.totalCompleted * 0.60).toFixed(2));
      penaltyDeductionsUsd = Number((settlementData25Sep.bossMasi.penaltiesCount * 0.10).toFixed(2));
      netCreditUsd = Number((grossCreditUsd - penaltyDeductionsUsd).toFixed(2));
      dayWindowLabel = settlementData25Sep.window;

      rawGuysList = settlementData25Sep.users
        .filter(u => Number(u.done || u.completedOrders || 0) > 0)
        .map(u => ({
          id: u.id,
          displayName: u.displayName,
          telegramUsername: u.username || u.telegramUsername,
          completedOrders: u.done,
          totalOrders: u.total,
          failCount: u.fail,
          successRate: u.successRate,
          isNewKey: u.isNewKey,
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
      // 26 Sep (Today Live Settlement)
      grossCreditUsd = Number((settlementData26Sep.bossMasi.totalCompleted * 0.60).toFixed(2));
      penaltyDeductionsUsd = Number((settlementData26Sep.bossMasi.penaltiesCount * 0.10).toFixed(2));
      netCreditUsd = Number((grossCreditUsd - penaltyDeductionsUsd).toFixed(2));
      dayWindowLabel = settlementData26Sep.window;

      rawGuysList = settlementData26Sep.users
        .filter(u => Number(u.done || u.completedOrders || 0) > 0)
        .map(u => ({
          id: u.id,
          displayName: u.displayName,
          telegramUsername: u.username || u.telegramUsername,
          completedOrders: u.done,
          totalOrders: u.total,
          failCount: u.fail,
          successRate: u.successRate,
          isNewKey: u.isNewKey,
          keys: u.keys.map(k => ({
            name: k.name,
            key: k.key,
            completedOrders: k.done,
            failCount: k.fail,
            totalOrders: k.total,
            successRate: k.successRate
          }))
        }));
    }

    // Apply Search Filter if any
    let filteredGuys = rawGuysList.filter(g => {
      if (!search) return true;
      const matchName = g.displayName && g.displayName.toLowerCase().includes(search);
      const matchTg = g.telegramUsername && g.telegramUsername.toLowerCase().includes(search);
      const matchKey = g.keys.some(k => (k.name && k.name.toLowerCase().includes(search)) || (k.key && k.key.toLowerCase().includes(search)));
      return matchName || matchTg || matchKey;
    });

    let totalTeamBasePay = 0;
    let totalTeamAdjustments = 0;
    let totalTeamCompletedOrders = 0;
    let totalPaidAmount = 0;
    let totalPaidCount = 0;

    // Collect all red ban items (profiles + keys)
    const redBanItems = [];

    let enrichedGuys = filteredGuys.map(guy => {
      const done = Number(guy.completedOrders) || 0;
      const rate = Number(guy.successRate) || 0;
      const usdRate = 84;
      const fixedRateInr = guy.fixedRateInr || (guy.fixedRateUsd ? guy.fixedRateUsd * usdRate : (guy.id === 'person:loki' || guy.displayName === 'Loki' ? 0.5 * usdRate : null));
      const payCalc = calculateWorkerPay(done, rate, fixedRateInr);
      const adjustment = Number(adjustments[guy.id] || 0);

      // Check custom pay override
      const hasCustomPay = customPayMap[guy.id] !== undefined;
      const customPayVal = Number(customPayMap[guy.id]);
      const finalPay = hasCustomPay ? customPayVal : Math.max(0, payCalc.basePay + adjustment);
      const customNote = customNotesMap[guy.id] || '';
      const isPaid = Boolean(paidStatusMap[guy.id]);

      if (isPaid) {
        totalPaidAmount += finalPay;
        totalPaidCount++;
      }

      // Underperforming Rule (< 4 QR & < 40% success rate)
      const isUnderperforming = (done < 4 && rate < 40);

      totalTeamBasePay += payCalc.basePay;
      totalTeamAdjustments += adjustment;
      totalTeamCompletedOrders += done;

      // Process keys inside team
      const processedKeys = (guy.keys || []).map(k => {
        const kDone = Number(k.completedOrders !== undefined ? k.completedOrders : (k.completedCount || 0));
        let kRate = Number(k.successRate || 0);
        const kFail = Number(k.failCount || 0);
        const kTotal = kDone + kFail;
        if (!kRate && kTotal > 0) {
          kRate = Number(((kDone / kTotal) * 100).toFixed(1));
        }
        const isKeyUnderperforming = (kDone < 4 && kRate < 40);

        // If team key is red, add to ban center
        if (guy.keys.length > 1 && isKeyUnderperforming) {
          redBanItems.push({
            type: 'Team Key',
            ownerName: guy.displayName,
            telegramUsername: guy.telegramUsername,
            keyName: k.name || k.key,
            keyString: k.key,
            done: kDone,
            fail: kFail,
            total: kTotal,
            rate: kRate,
            reason: `Low output (${kDone} QR) & high fail rate (${kRate}% success)`,
            recommendation: '✂️ Detach from team & Ban Key'
          });
        }

        return {
          ...k,
          kDone,
          kFail,
          kTotal,
          kRate,
          isKeyUnderperforming
        };
      });

      // If individual profile is red, add to ban center
      if (guy.keys.length <= 1 && isUnderperforming) {
        const singleKey = processedKeys[0] || {};
        redBanItems.push({
          type: 'Individual Worker',
          ownerName: guy.displayName,
          telegramUsername: guy.telegramUsername,
          keyName: singleKey.name || singleKey.key || guy.displayName,
          keyString: singleKey.key || '—',
          done: done,
          fail: Number(guy.failCount || (guy.totalOrders - done) || 0),
          total: Number(guy.totalOrders || done),
          rate: rate,
          reason: `Critical low volume (${done} QR) with heavy fail rate (${rate}% success)`,
          recommendation: '⛔ Ban Profile & Key'
        });
      }

      return {
        ...guy,
        done,
        rate,
        payCalc,
        adjustment,
        finalPay,
        hasCustomPay,
        customPayVal,
        customNote,
        isPaid,
        isUnderperforming,
        processedKeys
      };
    });

    // Sort workers
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

    // Calculations
    const totalWorkerPayout = enrichedGuys.reduce((sum, g) => sum + g.finalPay, 0);
    const totalPendingPayout = Math.max(0, totalWorkerPayout - totalPaidAmount);
    const masiNetInr = netCreditUsd * usdInrRate;
    const bossDailyProfit = masiNetInr - totalWorkerPayout;
    const profitMarginPct = masiNetInr > 0 ? ((bossDailyProfit / masiNetInr) * 100).toFixed(1) : '0';

    let html = `
      <div class="space-y-4">
        <!-- 👑 3-DAY GRAND TOTAL BOSS PROFIT STATEMENT BANNER -->
        ${(() => {
          const c23 = settlementData23Sep.bossMasi.totalCompleted;
          const f23 = settlementData23Sep.bossMasi.penaltiesCount;
          const netUsd23 = (c23 * 0.60) - (f23 * 0.10);
          const netInr23 = netUsd23 * usdInrRate;
          const p23 = 6948;
          const profit23 = netInr23 - p23;

          const c24 = settlementData24Sep.bossMasi.totalCompleted;
          const f24 = settlementData24Sep.bossMasi.penaltiesCount;
          const netUsd24 = (c24 * 0.60) - (f24 * 0.10);
          const netInr24 = netUsd24 * usdInrRate;
          const p24 = 8552;
          const profit24 = netInr24 - p24;

          const c25 = settlementData25Sep.bossMasi.totalCompleted;
          const f25 = settlementData25Sep.bossMasi.penaltiesCount;
          const netUsd25 = (c25 * 0.60) - (f25 * 0.10);
          const netInr25 = netUsd25 * usdInrRate;
          const p25 = 6475;
          const profit25 = netInr25 - p25;

          const cAll = c23 + c24 + c25;
          const fAll = f23 + f24 + f25;
          const grossAll = (cAll * 0.60);
          const penAll = (fAll * 0.10);
          const netUsdAll = grossAll - penAll;
          const netInrAll = netUsdAll * usdInrRate;
          const pAll = p23 + p24 + p25;
          const profitAll = netInrAll - pAll;
          const marginAll = netInrAll > 0 ? ((profitAll / netInrAll) * 100).toFixed(1) : 0;

          return `
          <div class="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white rounded-2xl p-4 sm:p-5 border border-indigo-900/40 shadow-sm flex flex-wrap items-center justify-between gap-4">
            <div>
              <div class="flex items-center gap-2 flex-wrap">
                <span class="px-2.5 py-0.5 rounded text-[11px] font-black bg-emerald-500 text-slate-950 uppercase tracking-wider">
                  👑 3-DAY COMBINED TAKE-HOME PROFIT
                </span>
                <span class="text-xs text-indigo-300 font-bold">23, 24 &amp; 25 Sep Total</span>
              </div>
              <div class="text-3xl sm:text-4xl font-black text-emerald-400 mt-1">
                +₹${profitAll.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div class="text-xs text-slate-300 mt-1 flex items-center gap-2 flex-wrap">
                <span>📅 23 Sep: <strong class="text-emerald-400">+₹${profit23.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></span>
                <span>•</span>
                <span>📅 24 Sep: <strong class="text-emerald-400">+₹${profit24.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></span>
                <span>•</span>
                <span>📅 25 Sep: <strong class="text-emerald-400">+₹${profit25.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></span>
                <span>•</span>
                <span class="text-indigo-300 font-extrabold">${marginAll}% Net Margin</span>
              </div>
            </div>

            <div class="grid grid-cols-3 gap-2 sm:gap-3 text-center w-full sm:w-auto">
              <div class="bg-white/10 rounded-xl px-3 py-2 border border-white/10">
                <div class="text-[10px] text-slate-400 uppercase font-bold tracking-tight">3-Day Net Inflow</div>
                <div class="text-sm sm:text-base font-black text-white mt-0.5">₹${netInrAll.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                <div class="text-[10px] text-emerald-400 font-mono">$${netUsdAll.toFixed(2)} USD</div>
              </div>
              <div class="bg-white/10 rounded-xl px-3 py-2 border border-white/10">
                <div class="text-[10px] text-slate-400 uppercase font-bold tracking-tight">Worker Payouts</div>
                <div class="text-sm sm:text-base font-black text-rose-300 mt-0.5">₹${pAll.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                <div class="text-[10px] text-slate-400">Total 3 Days</div>
              </div>
              <div class="bg-white/10 rounded-xl px-3 py-2 border border-white/10">
                <div class="text-[10px] text-slate-400 uppercase font-bold tracking-tight">Completed QRs</div>
                <div class="text-sm sm:text-base font-black text-amber-300 mt-0.5">${cAll} QRs</div>
                <div class="text-[10px] text-slate-400">3-Day Volume</div>
              </div>
            </div>
          </div>
          `;
        })()}
        <!-- 1. DAY FILTER & SORT CONTROLS BAR -->
        <div class="bg-white rounded-xl border border-slate-200 p-3 sm:p-4 shadow-2xs flex flex-wrap items-center justify-between gap-3">
          <!-- Day Switcher -->
          <div class="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-bold flex-wrap">
            <button 
              onclick="setDayFilter('26sep')" 
              class="px-2.5 py-1.5 rounded-md transition ${selectedDay === '26sep' ? 'bg-emerald-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'}"
            >
              🔥 Today (26 Sep Live)
            </button>
            <button 
              onclick="setDayFilter('25sep')" 
              class="px-2.5 py-1.5 rounded-md transition ${selectedDay === '25sep' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'}"
            >
              📅 25 Sep
            </button>
            <button 
              onclick="setDayFilter('24sep')" 
              class="px-2.5 py-1.5 rounded-md transition ${selectedDay === '24sep' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'}"
            >
              📅 24 Sep
            </button>
            <button 
              onclick="setDayFilter('23sep')" 
              class="px-2.5 py-1.5 rounded-md transition ${selectedDay === '23sep' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'}"
            >
              📅 23 Sep
            </button>
            <button 
              onclick="setDayFilter('combined')" 
              class="px-2.5 py-1.5 rounded-md transition ${selectedDay === 'combined' ? 'bg-indigo-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'}"
            >
              👑 4-Days Combined
            </button>
          </div>
          <!-- Actions & Sort Selector -->
          <div class="flex items-center gap-2 text-xs flex-wrap">
            <button 
              onclick="downloadFullReport()" 
              title="Download complete report file directly" 
              class="px-2.5 py-1.5 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-2xs transition flex items-center gap-1 active:scale-95 cursor-pointer"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
              <span>📥 Download</span>
            </button>

            <button 
              onclick="exportWorkersPdf()" 
              title="Print or Save as PDF" 
              class="px-2.5 py-1.5 rounded-lg text-xs font-bold text-slate-800 bg-white hover:bg-slate-100 border border-slate-300 shadow-2xs transition flex items-center gap-1 active:scale-95 cursor-pointer"
            >
              <svg class="w-3.5 h-3.5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
              <span>🖨️ Save PDF</span>
            </button>

            <span class="text-slate-400 font-medium">|</span>

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
                  ${selectedDay === '23sep' ? '23 Sep Net Take-Home' : (selectedDay === '24sep' ? '24 Sep Net Take-Home' : (selectedDay === '25sep' ? '25 Sep (Full Day 12 AM – 12 AM) Net Profit' : '3-Day Combined Take-Home'))} • <span class="text-emerald-600 font-extrabold">Last Updated: 25 Sep 2026, 12:00 AM Midnight IST (Full Day)</span>
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
              <div class="text-[10px] text-slate-500 mt-0.5">${totalPaidCount} / ${enrichedGuys.length} Paid</div>
            </div>

            <div class="bg-slate-50 border border-slate-200 rounded-lg p-3 text-center">
              <div class="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Paid vs Pending</div>
              <div class="text-base sm:text-lg font-black text-emerald-600 mt-0.5">₹${totalPaidAmount.toLocaleString('en-IN')}</div>
              <div class="text-[10px] text-amber-600 font-bold mt-0.5">Pending: ₹${totalPendingPayout.toLocaleString('en-IN')}</div>
            </div>

            <div class="bg-slate-50 border border-slate-200 rounded-lg p-3 text-center">
              <div class="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Completed QRs</div>
              <div class="text-base sm:text-lg font-black text-slate-900 mt-0.5">${totalTeamCompletedOrders}</div>
              <div class="text-[10px] text-slate-500 mt-0.5">Fulfilled Orders</div>
            </div>
          </div>
        </div>

        <!-- 3. RATE CHART BAR WITH EXACT USER EMOJIS -->
        <div class="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-2">
          <div class="flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
            <span class="text-xs font-extrabold uppercase text-slate-900 tracking-wider flex items-center gap-1.5">
              <span>📊 Rate Chart &amp; Success Rule</span>
            </span>
            <span class="text-[11px] text-slate-400">
              ⚡ Tap key to copy • Drag key to merge • Drop left to separate
            </span>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
            <div class="bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-center">
              <div class="font-extrabold text-slate-800">1–5 QR</div>
              <div class="text-sm font-black text-slate-900 mt-0.5">₹25</div>
              <div class="text-xs mt-0.5 select-none">🪙🪙🪙</div>
            </div>

            <div class="bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-center">
              <div class="font-extrabold text-slate-800">6–10 QR</div>
              <div class="text-sm font-black text-slate-900 mt-0.5">₹27</div>
              <div class="text-xs mt-0.5 select-none">💸👻💸</div>
            </div>

            <div class="bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-center">
              <div class="font-extrabold text-slate-800">11–20 QR</div>
              <div class="text-sm font-black text-slate-900 mt-0.5">₹31</div>
              <div class="text-xs mt-0.5 select-none">💰💰💰</div>
            </div>

            <div class="bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-center">
              <div class="font-extrabold text-slate-800">20+ QR</div>
              <div class="text-sm font-black text-slate-900 mt-0.5">₹35</div>
              <div class="text-xs mt-0.5 select-none">👾💣💥</div>
            </div>

            <div class="bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-center">
              <div class="font-extrabold text-slate-800">30+ QR</div>
              <div class="text-sm font-black text-slate-900 mt-0.5">₹40</div>
              <div class="text-xs mt-0.5 select-none">🧸🧸🧸</div>
            </div>
          </div>

          <div class="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
            <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-50 text-amber-800 border border-amber-200 font-bold">
              <span>⚠️ Success Rule:</span>
              <span class="font-medium">If success rate is below 60%, Max rate is capped at ₹32/QR.</span>
            </div>

            <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-rose-50 text-rose-800 border border-rose-200 font-bold">
              <span>🚨 Low Perf Flag:</span>
              <span class="font-medium">&lt; 4 QR &amp; &lt; 40% Success Rate marks profile/key RED</span>
            </div>
          </div>
        </div>

                <!-- 4. FLAGGED BURNER KEYS DROPDOWN MENU -->
        <div class="bg-white rounded-xl border border-rose-200 shadow-2xs overflow-hidden">
          <details class="group">
            <summary class="p-3.5 sm:p-4 bg-rose-50/70 hover:bg-rose-50 cursor-pointer flex items-center justify-between transition list-none select-none">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="text-rose-700 font-extrabold text-sm sm:text-base flex items-center gap-1.5">
                  <span>⚠️</span>
                  <span>Flagged Burner Keys to Ban</span>
                </span>
                <span class="px-2 py-0.5 rounded-full text-xs font-black bg-rose-100 text-rose-800 border border-rose-300">
                  ${redBanItems.length} Flagged Keys
                </span>
                <span class="text-[11px] text-rose-600 font-medium hidden sm:inline">
                  (Tap to open dropdown menu &amp; review burner keys)
                </span>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-xs font-bold text-rose-700 bg-white px-2.5 py-1 rounded-lg border border-rose-200 shadow-2xs group-open:bg-rose-100 transition">
                  Flagged Keys Dropdown ▾
                </span>
              </div>
            </summary>

            <div class="p-4 border-t border-rose-100 bg-white space-y-3">
              <div class="flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-100 flex-wrap gap-2">
                <span>Applied deduction: <strong>$0.10 loss per fail</strong>. Tap any key string to copy it directly.</span>
                <button onclick="copyBanKeysToClipboard()" class="text-xs font-bold text-rose-600 hover:text-rose-800 cursor-pointer">
                  📋 Copy All ${redBanItems.length} Keys
                </button>
              </div>

              <div class="max-h-80 overflow-y-auto space-y-2 pr-1">
                ${redBanItems.map(item => `
                  <div class="flex flex-col sm:flex-row sm:items-center justify-between p-2.5 rounded-lg border border-rose-100 bg-rose-50/40 hover:bg-rose-50 transition text-xs gap-2">
                    <div class="flex items-center gap-2 flex-wrap">
                      <span class="font-black text-rose-900">${escapeHtml(item.keyName)}</span>
                      <button onclick="copyToClipboard('${escapeHtml(item.keyString)}', 'Worker Key')" title="Click to copy exact key" class="font-mono text-[11px] bg-white border border-rose-200 hover:border-rose-400 px-2 py-0.5 rounded text-rose-700 hover:text-rose-950 font-bold cursor-pointer transition active:scale-95">
                        ${escapeHtml(item.keyString)}
                      </button>
                      <span class="text-slate-500">Owner: <strong class="text-slate-800">${escapeHtml(item.ownerName)}</strong> (${escapeHtml(item.telegramUsername || 'Unassigned')})</span>
                    </div>
                    <div class="flex items-center gap-2 self-end sm:self-center whitespace-nowrap">
                      <span class="px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-black">
                        ${item.fail} Fails / ${item.done} Done (${item.rate}%)
                      </span>
                      <span class="text-[11px] text-rose-600 font-extrabold font-mono">
                        -$0.10/fail (-$${(item.fail * 0.10).toFixed(2)})
                      </span>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          </details>
        </div>

        <!-- 5. WORKERS LIST (WITH TICK PAID CHECKBOX, CUSTOM OVERRIDES & EMOJIS) -->
        <div class="space-y-2.5">
          ${enrichedGuys.map((guy, idx) => {
            const hasMultipleKeys = (guy.processedKeys || []).length > 1;
            const isIndividual = !hasMultipleKeys;
            const isRedProfit = isIndividual && guy.isUnderperforming;

            return `
              <div 
                ondragover="handleKeyDragOver(event)"
                ondragleave="handleKeyDragLeave(event)"
                ondrop="handleKeyDrop(event, '${guy.id}')"
                class="bg-white rounded-xl border ${guy.isPaid ? 'border-emerald-300 bg-emerald-50/10' : (isRedProfit ? 'border-rose-300 ring-1 ring-rose-100' : 'border-slate-200 hover:border-slate-300')} p-4 shadow-2xs transition"
              >
                <!-- Worker Row Header -->
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div class="flex items-center gap-3">
                    <!-- Paid Tick Checkbox -->
                    <label class="cursor-pointer flex items-center" title="${guy.isPaid ? 'Paid - Click to unmark' : 'Click to mark as PAID'}">
                      <input 
                        type="checkbox" 
                        ${guy.isPaid ? 'checked' : ''} 
                        onchange="toggleWorkerPaid('${guy.id}', '${escapeHtml(guy.displayName)}', ${guy.finalPay})" 
                        class="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                      >
                    </label>

                    <!-- Rank Badge -->
                    <span class="w-6 h-6 rounded-full ${idx === 0 ? 'bg-amber-100 text-amber-800 font-black' : (idx === 1 ? 'bg-slate-200 text-slate-800 font-black' : (idx === 2 ? 'bg-amber-50 text-amber-700 font-bold' : 'bg-slate-100 text-slate-600 font-semibold'))} flex items-center justify-center text-xs select-none">
                      #${idx + 1}
                    </span>

                    <div>
                      <div class="flex items-center gap-2 flex-wrap">
                        <span class="text-sm font-extrabold text-slate-900">${escapeHtml(guy.displayName || guy.personName || guy.id)} ${guy.isNewKey ? '<span class="px-2 py-0.5 rounded-md text-[10px] font-black bg-amber-100 text-amber-900 border border-amber-300 ml-1.5">🆕 New Key (Assign TG)</span>' : ''}</span>
                        
                        ${guy.telegramUsername ? `
                          <button onclick="copyToClipboard('${escapeHtml(guy.telegramUsername)}', 'Telegram Handle')" title="1-Tap Copy Handle" class="text-xs text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded font-mono transition">
                            ${escapeHtml(guy.telegramUsername)}
                          </button>
                        ` : ''}

                        <!-- Rate Badge with Emojis -->
                        <span class="px-2 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
                          Rate: ₹${guy.payCalc.tierRate}/QR ${guy.payCalc.emoji}
                        </span>

                        <!-- Success Rate Badge -->
                        <span class="px-2 py-0.5 rounded-md text-[11px] font-bold ${guy.rate >= 80 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : (guy.rate >= 50 ? 'bg-slate-100 text-slate-700 border border-slate-200' : 'bg-rose-50 text-rose-700 border border-rose-200')}">
                          ${guy.rate}% Success
                        </span>

                        <!-- Paid Status Badge -->
                        ${guy.isPaid ? `
                          <span class="px-2 py-0.5 rounded-md text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                            ✅ PAID
                          </span>
                        ` : ''}

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
                        ${guy.hasCustomPay ? `<span class="text-indigo-600 font-bold ml-1">(Custom Override Applied)</span>` : ''}
                      </div>

                      <!-- Custom Details Note if present -->
                      ${guy.customNote ? `
                        <div class="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-[11px] font-mono text-slate-700">
                          <span>📝</span>
                          <span>${escapeHtml(guy.customNote)}</span>
                        </div>
                      ` : ''}
                    </div>
                  </div>

                  <!-- Right Side: Custom Details, Bonus Controls & Final Pay Badge -->
                  <div class="flex items-center gap-3 sm:justify-end flex-wrap">
                    <!-- Direct Message on Telegram Button -->
                    <button 
                      onclick="promptSendTelegramMessage('${guy.id}', '${escapeHtml(guy.displayName)}', '${escapeHtml(guy.telegramUsername || '')}')" 
                      title="Send direct Telegram message to bot" 
                      class="px-2 py-1 rounded bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 text-xs font-bold transition flex items-center gap-1 active:scale-95"
                    >
                      <span>💬 Msg TG</span>
                    </button>

                    <!-- Custom Details & Custom Pay Button -->
                    <button 
                      onclick="promptCustomPayAndNote('${guy.id}', '${escapeHtml(guy.displayName)}', ${guy.payCalc.basePay + guy.adjustment})" 
                      title="Set custom pay or add custom note/details" 
                      class="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1 active:scale-95"
                    >
                      <span>✏️ Custom Pay / Note</span>
                    </button>

                    <!-- Bonus / Adjustment Controls -->
                    <div class="flex items-center gap-1 text-[11px]">
                      <button onclick="setWorkerAdjustment('${guy.id}', 50)" title="+₹50 Bonus" class="px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold active:scale-95 transition">
                        +50
                      </button>
                      <button onclick="setWorkerAdjustment('${guy.id}', -50)" title="-₹50 Deduction" class="px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold active:scale-95 transition">
                        -50
                      </button>
                      ${guy.adjustment !== 0 ? `
                        <span class="font-bold ${guy.adjustment > 0 ? 'text-emerald-600' : 'text-rose-600'}">
                          (${guy.adjustment > 0 ? '+' : ''}₹${guy.adjustment})
                        </span>
                      ` : ''}
                    </div>

                    <!-- Final Pay / Profit Badge (RED if Individual and Underperforming) -->
                    <div class="text-right">
                      ${isRedProfit ? `
                        <div class="px-3 py-1 rounded-lg bg-rose-100 border border-rose-300 text-rose-800 font-black text-base shadow-2xs inline-block">
                          ₹${guy.finalPay.toLocaleString('en-IN')}
                        </div>
                      ` : (guy.isPaid ? `
                        <div class="px-3 py-1 rounded-lg bg-emerald-100 border border-emerald-300 text-emerald-800 font-black text-base shadow-2xs inline-block">
                          ₹${guy.finalPay.toLocaleString('en-IN')}
                        </div>
                      ` : `
                        <div class="px-3 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 font-black text-base inline-block">
                          ₹${guy.finalPay.toLocaleString('en-IN')}
                        </div>
                      `)}
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

  // ==========================================
  // AUTHENTICATION & LOGIN GATE SYSTEM
  // ==========================================
  const AUTH_STORAGE_KEY = 'orderflow_boss_auth';
  const VALID_PASSCODES = ['7788', '1234', 'admin', 'admin88', 'boss2026', 'WORKER-B030-0827-9A88-4A04'];

  function isAuthenticated() {
    try {
      const data = JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY) || 'null');
      return Boolean(data && data.authenticated);
    } catch(e) {
      return false;
    }
  }

  function setAuthenticated(user = 'Boss Admin') {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({
      authenticated: true,
      user: user,
      loginAt: new Date().toISOString()
    }));
    updateAuthUi();
  }

  window.logoutUser = function() {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    updateAuthUi();
    showToast('🔒 Logged out successfully', 'info');
  };

  window.quickUnlock = function() {
    const input = document.getElementById('auth-password-input');
    if (input) input.value = '7788';
    loginWithPasscode('7788');
  };

  window.togglePasswordVisibility = function() {
    const input = document.getElementById('auth-password-input');
    const btn = document.getElementById('btn-toggle-eye');
    if (!input) return;
    if (input.type === 'password') {
      input.type = 'text';
      if (btn) btn.textContent = '🙈';
    } else {
      input.type = 'password';
      if (btn) btn.textContent = '👁️';
    }
  };

  window.handleAuthSubmit = function(e) {
    if (e) e.preventDefault();
    const input = document.getElementById('auth-password-input');
    const val = input ? input.value.trim() : '';
    loginWithPasscode(val);
  };

  function loginWithPasscode(code) {
    const clean = (code || '').trim();
    const errorBox = document.getElementById('auth-error-msg');
    const errorText = document.getElementById('auth-error-text');

    if (!clean) {
      if (errorBox) errorBox.classList.remove('hidden');
      if (errorText) errorText.textContent = 'Please enter a passcode or PIN';
      return;
    }

    const isValid = VALID_PASSCODES.some(c => c.toLowerCase() === clean.toLowerCase());
    if (isValid) {
      if (errorBox) errorBox.classList.add('hidden');
      setAuthenticated('Boss Admin');
      showToast('🎉 Welcome back, Boss! Portal unlocked.', 'success');
    } else {
      if (errorBox) errorBox.classList.remove('hidden');
      if (errorText) errorText.textContent = 'Invalid passcode! Try master PIN: 7788';
      const input = document.getElementById('auth-password-input');
      if (input) {
        input.classList.add('border-rose-500', 'ring-2', 'ring-rose-200');
        setTimeout(() => input.classList.remove('border-rose-500', 'ring-2', 'ring-rose-200'), 1500);
      }
    }
  }

  function updateAuthUi() {
    const modal = document.getElementById('auth-gate-modal');
    const userBadge = document.getElementById('auth-user-badge');
    const isAuth = isAuthenticated();

    if (modal) {
      if (isAuth) {
        modal.classList.add('hidden');
      } else {
        modal.classList.remove('hidden');
        const input = document.getElementById('auth-password-input');
        if (input) {
          input.value = '';
          setTimeout(() => input.focus(), 100);
        }
      }
    }

    if (userBadge) {
      if (isAuth) {
        userBadge.classList.remove('hidden');
        userBadge.classList.add('flex');
      } else {
        userBadge.classList.add('hidden');
        userBadge.classList.remove('flex');
      }
    }
  }

  // Hook into initialization
  document.addEventListener('DOMContentLoaded', () => {
    updateAuthUi();
  });
  // Also run immediately if script executes after DOMContentLoaded
  updateAuthUi();

})();


  // ==========================================
  // TELEGRAM BOT INTERACTION & MESSAGING
  // ==========================================
  window.promptSendTelegramMessage = async function(guyId, displayName, telegramUsername) {
    const cleanUname = (telegramUsername || '').replace(/^@/, '');
    const defaultMsg = "⚠️ Please check your failing keys and maintain >60% success rate to keep your max tier rate!";
    const userMsg = prompt(
      `💬 Send Telegram Message to ${displayName} (${telegramUsername || 'Worker'}):\n\nType your message below:`,
      defaultMsg
    );
    if (!userMsg || !userMsg.trim()) return;

    try {
      if (typeof showToast === 'function') showToast(`Sending message to ${displayName} on Telegram...`, 'info');
      const res = await fetch('/api/workers/' + encodeURIComponent(guyId) + '/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg.trim(), telegramUsername: telegramUsername })
      });
      const data = await res.json();
      if (data.success) {
        if (typeof showToast === 'function') showToast(`✅ Message delivered to ${displayName} on Telegram!`, 'success');
        else alert(`✅ Message delivered to ${displayName} on Telegram!`);
      } else {
        alert(`❌ Telegram Delivery Notice:\n\n${data.error || 'Worker has not started the bot yet.'}\n\n👉 Ask ${displayName} to send /start to your Telegram bot so they can receive direct messages!`);
      }
    } catch (e) {
      alert(`Could not connect to local server: ${e.message}\nMake sure node server.js is running.`);
    }
  };

  window.approvePendingKey = async function(requestId, key, username) {
    try {
      const res = await fetch('/api/bot/verify-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId, action: 'approve' })
      });
      const data = await res.json();
      if (data.success) {
        if (typeof showToast === 'function') showToast(`✅ Key ${key} approved for ${username}!`, 'success');
        if (typeof render === 'function') render();
      } else {
        alert('Error: ' + data.error);
      }
    } catch(e) {
      alert('Error approving key: ' + e.message);
    }
  };

  window.rejectPendingKey = async function(requestId, key) {
    if (!confirm(`Reject submission for key ${key}?`)) return;
    try {
      const res = await fetch('/api/bot/verify-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId, action: 'reject' })
      });
      const data = await res.json();
      if (data.success) {
        if (typeof showToast === 'function') showToast(`Key ${key} rejected`, 'info');
        if (typeof render === 'function') render();
      }
    } catch(e) {
      alert('Error: ' + e.message);
    }
  };


  // Notify Team Leader about underperforming keys in their team
  window.notifyTeamUnderperformers = function(teamHandle) {
    if (typeof settlementData24Sep === 'undefined' || !settlementData24Sep.teamAlerts) {
      alert('No team alerts available for today.');
      return;
    }

    const alertItem = settlementData24Sep.teamAlerts.find(a => a.teamHandle.toLowerCase() === teamHandle.toLowerCase());
    if (!alertItem) {
      alert(`No underperforming keys found for team ${teamHandle}!`);
      return;
    }

    const confirmSend = confirm(
      `📢 SEND TEAM PERFORMANCE ALERT TO ${teamHandle}:\n\n` +
      alertItem.notificationMessage +
      `\n\nClick OK to deliver this warning directly to ${teamHandle} on Telegram.`
    );

    if (confirmSend) {
      promptSendTelegramMessage(teamHandle, teamHandle, teamHandle);
    }
  };
