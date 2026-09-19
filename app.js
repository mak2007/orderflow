// Masi Team & Worker Performance Hub Logic
// Multi-Key Grouping, Telegram Bot Integration & Masi Boss Sync
(function() {
  'use strict';

  const STORAGE_KEY = 'masi_team_hub_v2';
  const API_BASE = '/api';

  // Application State (Task 2 Focused)
  let state = {
    workers: [],
    settings: {
      botToken: '',
      botUsername: '',
      defaultRate: 15.00
    },
    botStatus: {
      isConfigured: false,
      isPolling: false,
      botUsername: '',
      lastError: null
    },
    currentTab: 'guys', // 'guys', 'keys', 'workers', 'bot'
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

  // Fetch state from server with localStorage fallback
  async function fetchServerState(isBackground = false) {
    try {
      const res = await fetch(`${API_BASE}/state`);
      if (res.ok) {
        const data = await res.json();
        state.isApiOnline = true;
        state.workers = data.workers || [];
        state.settings = data.settings || {};
        state.botStatus = data.botStatus || {};

        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          workers: state.workers,
          settings: state.settings
        }));

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

    if (!isBackground) {
      loadFromLocalStorage();
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
          rate: Number(worker.rate) || 15.00,
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

    // Compute metrics for each guy
    return Array.from(groups.values()).map(guy => {
      const completedOrders = guy.keys.reduce((sum, k) => sum + (Number(k.completedOrders) || 0), 0);
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

      const baseRate = guy.rate || 15.00;
      const totalEarned = completedOrders * baseRate;

      // Calculate paid and unpaid
      const paidAmount = guy.keys.reduce((sum, k) => sum + (Number(k.paidAmount) || 0), 0);
      const unpaidAmount = Math.max(0, totalEarned - paidAmount);

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
        totalOrders,
        isCustomRate,
        rateNum,
        successRate,
        rateColor,
        progressColor,
        totalEarned,
        paidAmount,
        unpaidAmount
      };
    });
  }

  // Render application
  function render() {
    renderKPIs();

    const container = document.getElementById('panel-content');
    if (!container) return;

    if (state.currentTab === 'guys') {
      renderGuysPanel(container);
    } else if (state.currentTab === 'keys') {
      renderKeysPanel(container);
    } else if (state.currentTab === 'workers') {
      renderWorkersPanel(container);
    } else if (state.currentTab === 'bot') {
      renderBotPanel(container);
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

  // Update top KPI cards
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
    
    const totalPay = guys.reduce((sum, g) => sum + (Number(g.totalEarned) || 0), 0);
    const totalGuys = guys.length;

    const elKeys = document.getElementById('kpi-total-keys');
    const elCompleted = document.getElementById('kpi-completed-orders');
    const elSuccess = document.getElementById('kpi-team-success');
    const elPay = document.getElementById('kpi-total-pay');
    const elGuys = document.getElementById('kpi-team-guys');

    if (elKeys) elKeys.textContent = totalKeys;
    if (elCompleted) elCompleted.textContent = totalCompletedOrders.toLocaleString();
    if (elSuccess) elSuccess.textContent = teamSuccessRate;
    if (elPay) elPay.textContent = `$${totalPay.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    if (elGuys) elGuys.textContent = totalGuys;

    // Badges
    const badgeGuys = document.getElementById('tab-badge-guys');
    const badgeKeys = document.getElementById('tab-badge-keys');
    const badgeWorkers = document.getElementById('tab-badge-workers');

    if (badgeGuys) badgeGuys.textContent = totalGuys;
    if (badgeKeys) badgeKeys.textContent = totalKeys;
    if (badgeWorkers) badgeWorkers.textContent = `$${totalPay.toFixed(0)}`;
  }

  // Filter guys or workers by global search
  function filterGuys(guys) {
    if (!state.searchQuery.trim()) return guys;
    const q = state.searchQuery.trim().toLowerCase();
    return guys.filter(g => 
      (g.displayName && g.displayName.toLowerCase().includes(q)) ||
      (g.personName && g.personName.toLowerCase().includes(q)) ||
      (g.telegramUsername && g.telegramUsername.toLowerCase().includes(q)) ||
      g.keys.some(k => (k.key && k.key.toLowerCase().includes(q)) || (k.name && k.name.toLowerCase().includes(q)))
    );
  }

  function filterWorkers(workers) {
    if (!state.searchQuery.trim()) return workers;
    const q = state.searchQuery.trim().toLowerCase();
    return workers.filter(w =>
      (w.name && w.name.toLowerCase().includes(q)) ||
      (w.key && w.key.toLowerCase().includes(q)) ||
      (w.personName && w.personName.toLowerCase().includes(q)) ||
      (w.telegramUsername && w.telegramUsername.toLowerCase().includes(q))
    );
  }

  // ==========================================
  // PANEL 1: TEAM & GUYS (GROUPED VIEW)
  // ==========================================
  function renderGuysPanel(container) {
    const allGuys = getGroupedGuys();
    const guys = filterGuys(allGuys);

    let html = `
      <div class="space-y-6">
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
              <span class="text-indigo-800"> If you copy keys from <code>masi.cc.cd/boss</code> that belong to the same guy, click <b>"Assign Keys to Guys"</b> and put their Telegram handle on each key. They will combine into 1 guy profile automatically!</span>
            </div>
          </div>
          <div class="font-mono text-[11px] bg-white px-2.5 py-1 rounded border border-indigo-200 text-indigo-700 font-semibold whitespace-nowrap">
            ${guys.length} Guys | ${state.workers.length} Keys Total
          </div>
        </div>
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

      html += `
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 hover:border-indigo-300 transition-all overflow-hidden flex flex-col justify-between">
          <div class="p-5">
            <!-- Header: Guy Name & Telegram -->
            <div class="flex items-start justify-between gap-3 mb-4">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-sky-600 text-white flex items-center justify-center font-extrabold text-lg shadow-sm">
                  ${escapeHtml((guy.displayName || 'G').charAt(0).toUpperCase())}
                </div>
                <div>
                  <h3 class="font-extrabold text-slate-900 text-base leading-tight flex items-center gap-2">
                    ${escapeHtml(guy.displayName)}
                    <span class="text-[10px] px-2 py-0.5 rounded-full font-bold bg-indigo-100 text-indigo-800">
                      ${guy.keys.length} ${guy.keys.length === 1 ? 'Key' : 'Keys'}
                    </span>
                  </h3>
                  <div class="flex items-center gap-2 text-xs mt-1">
                    ${guy.telegramUsername ? `
                      <a href="https://t.me/${guy.telegramUsername.replace('@', '')}" target="_blank" class="text-sky-600 hover:underline font-mono font-semibold flex items-center gap-1">
                        <span>💬</span> ${escapeHtml(guy.telegramUsername)}
                      </a>
                    ` : `
                      <span class="text-slate-400 font-mono">No @telegram handle</span>
                    `}
                    <span>•</span>
                    <span class="${isLinked ? 'text-emerald-600 font-semibold' : 'text-slate-400'}">
                      ${isLinked ? '🟢 Linked in Bot' : '⚪ Not Linked'}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Success Rate Badge -->
              <div class="text-right">
                <span class="px-2.5 py-1 rounded-full text-xs font-black ${guy.rateColor} border border-current/20">
                  ${guy.successRate}% Success
                </span>
                ${guy.isCustomRate ? `
                  <div class="text-[10px] text-indigo-600 font-semibold mt-0.5">Admin Decided</div>
                ` : `
                  <div class="text-[10px] text-slate-400 mt-0.5">Masi Official</div>
                `}
              </div>
            </div>

            <!-- Assigned Keys Chips List -->
            <div class="mb-4">
              <div class="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>Assigned Keys (${guy.keys.length})</span>
                <span class="text-slate-400 font-normal">Click key to copy</span>
              </div>
              <div class="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1 bg-slate-50 rounded-lg border border-slate-200">
                ${guy.keys.map(k => `
                  <div class="inline-flex items-center gap-1 px-2 py-1 rounded bg-white border border-slate-300 text-[11px] font-mono shadow-2xs hover:border-indigo-400 transition">
                    <span class="text-slate-800 font-semibold">${escapeHtml(k.key)}</span>
                    <button onclick="copyToClipboard('${escapeHtml(k.key)}', 'Worker Key')" title="Copy Key" class="text-slate-400 hover:text-indigo-600 p-0.5">
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                    </button>
                    <span class="text-[10px] text-emerald-600 font-bold ml-1">${k.completedOrders || 0}✓</span>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Aggregated Metrics Grid -->
            <div class="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-lg border border-slate-100 text-center mb-3">
              <div>
                <div class="text-xs text-slate-400 font-medium">Completed Orders</div>
                <div class="text-base font-black text-emerald-700">${guy.completedOrders}</div>
              </div>
              <div>
                <div class="text-xs text-slate-400 font-medium">Total Calculated Pay</div>
                <div class="text-base font-black text-slate-800">$${guy.totalEarned.toFixed(2)}</div>
              </div>
              <div>
                <div class="text-xs text-slate-400 font-medium">Balance Due</div>
                <div class="text-base font-black ${guy.unpaidAmount > 0 ? 'text-rose-600' : 'text-emerald-600'}">$${guy.unpaidAmount.toFixed(2)}</div>
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
          <div class="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-2">
            <div class="text-xs text-slate-500">
              <span>Rate:</span>
              <strong class="text-slate-800">$${guy.rate.toFixed(2)}/order</strong>
            </div>

            <div class="flex items-center gap-1.5">
              ${guy.unpaidAmount > 0 ? `
                <button onclick="markGuyPaid('${escapeHtml(guy.id)}')" title="Mark paid and notify via Telegram" class="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition">
                  Pay $${guy.unpaidAmount.toFixed(2)} ${isLinked ? '📲' : ''}
                </button>
              ` : `
                <span class="px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md">✓ Settled</span>
              `}

              <button onclick="openDecideRateModal('${guy.keys[0].id}')" title="Set Success Rate" class="px-2.5 py-1.5 rounded-lg text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition">
                🎯 Set Rate
              </button>

              <button onclick="openTeamAssignModal()" title="Assign / Edit Keys" class="p-1.5 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-200 transition">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
              </button>
            </div>
          </div>
        </div>
      `;
    });

    html += `</div></div>`;
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
            <table class="w-full text-left text-sm">
              <thead class="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th class="py-3.5 px-4 font-bold">Worker & Guy Name</th>
                  <th class="py-3.5 px-4 font-bold">Worker Key</th>
                  <th class="py-3.5 px-4 font-bold">Telegram (@...)</th>
                  <th class="py-3.5 px-4 font-bold text-center">Completed Orders</th>
                  <th class="py-3.5 px-4 font-bold text-center">Success Rate %</th>
                  <th class="py-3.5 px-4 font-bold">Calculated Pay</th>
                  <th class="py-3.5 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
    `;

    if (workers.length === 0) {
      html += `
        <tr>
          <td colspan="7" class="py-8 text-center text-slate-500 text-xs">
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

      const baseRate = Number(w.rate) || 15.00;
      const completed = Number(w.completedOrders) || 0;
      const totalEarned = completed * baseRate;

      html += `
        <tr class="hover:bg-slate-50/80 transition group">
          <!-- Worker / Guy -->
          <td class="py-3 px-4">
            <div class="font-bold text-slate-900">${escapeHtml(w.name || 'Worker')}</div>
            ${w.personName && w.personName !== w.name ? `
              <div class="text-[11px] text-indigo-600 font-medium">👤 ${escapeHtml(w.personName)}</div>
            ` : ''}
          </td>

          <!-- Worker Key with Copy -->
          <td class="py-3 px-4 font-mono text-xs">
            <div class="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-slate-50 border border-slate-200">
              <span class="font-semibold text-slate-800">${escapeHtml(w.key)}</span>
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
              <span class="text-slate-400 font-sans text-[11px]">Not assigned</span>
            `}
          </td>

          <!-- Completed Orders -->
          <td class="py-3 px-4 text-center font-bold text-emerald-700">
            ${completed}
          </td>

          <!-- Success Rate % -->
          <td class="py-3 px-4 text-center">
            <span class="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${badgeClass}">
              ${displayRate}%
            </span>
            ${isCustomRate ? `<span class="block text-[10px] text-indigo-600 font-medium mt-0.5">Admin Decided</span>` : ''}
          </td>

          <!-- Calculated Pay -->
          <td class="py-3 px-4 font-bold text-slate-800">
            $${totalEarned.toFixed(2)}
            <span class="text-[11px] font-normal text-slate-400 block">@ $${baseRate}/order</span>
          </td>

          <!-- Actions -->
          <td class="py-3 px-4 text-right whitespace-nowrap">
            <div class="flex items-center justify-end gap-1.5">
              <button onclick="openDecideRateModal('${w.id}')" title="Set Success Rate" class="px-2.5 py-1 text-xs font-semibold rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition">
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
  // PANEL 3: WORKER PAYOUTS & BALANCES
  // ==========================================
  function renderWorkersPanel(container) {
    const guys = getGroupedGuys();
    const totalEarnedTeam = guys.reduce((sum, g) => sum + g.totalEarned, 0);
    const totalPaidTeam = guys.reduce((sum, g) => sum + g.paidAmount, 0);
    const totalDueTeam = Math.max(0, totalEarnedTeam - totalPaidTeam);

    let html = `
      <div class="space-y-6">
        <!-- Banner -->
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6 bg-gradient-to-r from-emerald-50/50 via-teal-50/30 to-white flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 class="text-xl font-extrabold text-slate-800 flex items-center gap-2">
              <svg class="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              Payouts & Worker Pay Calculator
            </h2>
            <p class="text-sm text-slate-500 mt-1">
              Calculates earnings based on completed orders read from Masi. Mark payouts and send automatic Telegram receipts.
            </p>
          </div>

          <div class="flex items-center gap-3">
            <button onclick="exportCSV()" class="px-3.5 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg shadow-sm transition">
              📥 Export Payouts CSV
            </button>
          </div>
        </div>

        <!-- Payout Summary Metric Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
            <div class="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Team Earnings</div>
            <div class="text-2xl font-black text-slate-900 mt-1">$${totalEarnedTeam.toFixed(2)}</div>
            <div class="text-[11px] text-slate-500 mt-0.5">Completed orders across all keys</div>
          </div>
          <div class="bg-white p-5 rounded-xl border border-emerald-200 bg-emerald-50/20 shadow-2xs">
            <div class="text-xs font-bold text-emerald-700 uppercase tracking-wider">Total Settled / Paid</div>
            <div class="text-2xl font-black text-emerald-800 mt-1">$${totalPaidTeam.toFixed(2)}</div>
            <div class="text-[11px] text-emerald-600 mt-0.5">Recorded historical payments</div>
          </div>
          <div class="bg-white p-5 rounded-xl border border-rose-200 bg-rose-50/20 shadow-2xs">
            <div class="text-xs font-bold text-rose-700 uppercase tracking-wider">Pending Balance Due</div>
            <div class="text-2xl font-black text-rose-800 mt-1">$${totalDueTeam.toFixed(2)}</div>
            <div class="text-[11px] text-rose-600 mt-0.5">Currently owed to workers</div>
          </div>
        </div>

        <!-- Payouts List Table -->
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div class="p-4 border-b border-slate-200 font-bold text-slate-800 text-sm flex items-center justify-between">
            <span>Worker & Guy Balances</span>
            <span class="text-xs font-normal text-slate-500">${guys.length} Accounts</span>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm">
              <thead class="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th class="py-3 px-4 font-bold">Guy / Worker</th>
                  <th class="py-3 px-4 font-bold">Keys Assigned</th>
                  <th class="py-3 px-4 font-bold text-center">Completed Orders</th>
                  <th class="py-3 px-4 font-bold">Rate</th>
                  <th class="py-3 px-4 font-bold">Total Earned</th>
                  <th class="py-3 px-4 font-bold">Paid So Far</th>
                  <th class="py-3 px-4 font-bold">Pending Due</th>
                  <th class="py-3 px-4 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
      `;

      guys.forEach(g => {
        const hasDue = g.unpaidAmount > 0;
        const isLinked = Boolean(g.telegramId);

        html += `
          <tr class="hover:bg-slate-50/80 transition">
            <td class="py-3 px-4">
              <div class="font-bold text-slate-900">${escapeHtml(g.displayName)}</div>
              ${g.telegramUsername ? `<div class="text-xs text-sky-600 font-mono">${escapeHtml(g.telegramUsername)}</div>` : ''}
            </td>
            <td class="py-3 px-4 text-xs font-mono text-slate-600">
              ${g.keys.length} ${g.keys.length === 1 ? 'key' : 'keys'}
            </td>
            <td class="py-3 px-4 text-center font-bold text-emerald-700">
              ${g.completedOrders}
            </td>
            <td class="py-3 px-4 text-xs text-slate-600 font-medium">
              $${g.rate.toFixed(2)}/order
            </td>
            <td class="py-3 px-4 font-bold text-slate-800">
              $${g.totalEarned.toFixed(2)}
            </td>
            <td class="py-3 px-4 text-xs font-semibold text-emerald-700">
              $${g.paidAmount.toFixed(2)}
            </td>
            <td class="py-3 px-4 font-black ${hasDue ? 'text-rose-600' : 'text-slate-400'}">
              $${g.unpaidAmount.toFixed(2)}
            </td>
            <td class="py-3 px-4 text-right">
              ${hasDue ? `
                <button onclick="markGuyPaid('${escapeHtml(g.id)}')" class="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition">
                  Pay $${g.unpaidAmount.toFixed(2)} ${isLinked ? '📲' : ''}
                </button>
              ` : `
                <span class="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded">✓ Paid</span>
              `}
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
  // PANEL 4: TELEGRAM BOT & LINKER
  // ==========================================
  function renderBotPanel(container) {
    const isOnline = state.botStatus && state.botStatus.isPolling;
    const botUser = state.botStatus && state.botStatus.botUsername ? `@${state.botStatus.botUsername}` : 'Not Connected';

    let html = `
      <div class="space-y-6">
        <!-- Banner -->
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6 bg-gradient-to-r from-sky-50/50 via-indigo-50/30 to-white flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 class="text-xl font-extrabold text-slate-800 flex items-center gap-2">
              <svg class="w-6 h-6 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
              Telegram Bot Integration Hub
            </h2>
            <p class="text-sm text-slate-500 mt-1">
              Connects your workers directly to their Masi keys, completed order counts, and pay statistics on Telegram.
            </p>
          </div>

          <div class="flex items-center gap-2">
            <button onclick="openBotConfigModal()" class="px-4 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-sm transition">
              ⚙️ Bot Settings
            </button>
          </div>
        </div>

        <!-- Bot Status Card -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h3 class="text-sm font-bold text-slate-800 uppercase tracking-wider">Bot Connection Status</h3>
            <div class="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span class="w-4 h-4 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-rose-400'}"></span>
              <div>
                <div class="font-bold text-slate-900">${isOnline ? 'Active & Polling' : 'Offline / Needs Token'}</div>
                <div class="text-xs text-slate-500 font-mono">${botUser}</div>
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Telegram Bot Token</label>
              <div class="flex items-center gap-2">
                <input type="password" id="tab-bot-token-input" value="${state.settings.botToken || ''}" placeholder="Paste token from @BotFather" class="font-mono text-xs w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none">
                <button onclick="saveBotTokenFromTab()" class="px-4 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-sm whitespace-nowrap">
                  Save & Connect
                </button>
              </div>
            </div>
          </div>

          <!-- Instructions Card for Workers -->
          <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3 text-xs">
            <h3 class="text-sm font-bold text-slate-800 uppercase tracking-wider">How Workers Use the Bot</h3>
            <ol class="list-decimal list-inside space-y-2 text-slate-600">
              <li>Open your bot in Telegram (search <b>${botUser}</b>).</li>
              <li>Worker sends command to link their key:
                <code class="block font-mono bg-slate-100 p-2 rounded text-indigo-700 mt-1">/link YOUR_WORKER_KEY</code>
              </li>
              <li>Worker can view their stats anytime:
                <code class="block font-mono bg-slate-100 p-2 rounded text-indigo-700 mt-1">/stats</code>
              </li>
              <li>Worker checks unpaid balance:
                <code class="block font-mono bg-slate-100 p-2 rounded text-indigo-700 mt-1">/balance</code>
              </li>
            </ol>
          </div>
        </div>
      </div>
    `;

    container.innerHTML = html;
  }

  // ==========================================
  // PAYOUT ACTIONS (Mark Paid)
  // ==========================================
  window.markGuyPaid = async function(guyId) {
    const guys = getGroupedGuys();
    const guy = guys.find(g => g.id === guyId);
    if (!guy) return;

    if (!confirm(`Mark all completed orders as PAID ($${guy.unpaidAmount.toFixed(2)}) for ${guy.displayName}?`)) {
      return;
    }

    let successCount = 0;
    let totalPaid = 0;

    for (const key of guy.keys) {
      if (state.isApiOnline) {
        try {
          const res = await fetch(`${API_BASE}/workers/${key.id}/mark-paid`, { method: 'POST' });
          if (res.ok) {
            const data = await res.json();
            successCount++;
            totalPaid += Number(data.totalPaidAmount) || 0;
          }
        } catch (e) {
          console.error(e);
        }
      } else {
        key.paidAmount = (key.completedOrders || 0) * (Number(key.rate) || 15);
        key.lastPaidAt = new Date().toISOString();
      }
    }

    if (state.isApiOnline) {
      await fetchServerState();
    } else {
      saveToLocalStorage();
      render();
    }

    showToast(`Marked ${guy.displayName} as PAID!`, 'success');
  };

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
    const btn = document.getElementById('btn-masi-extract');
    const syncBtn = document.getElementById('btn-masi-sync');
    const statsContainer = document.getElementById('masi-stats');
    if (!key) {
      showToast('Please enter a Boss Key', 'warning');
      return;
    }

    btn.disabled = true;
    btn.innerHTML = `<span class="animate-spin inline-block mr-1">↻</span> Extracting from masi.cc.cd...`;

    try {
      const res = await fetch(`${API_BASE}/masi/extract`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bossKey: key })
      });
      const data = await res.json();
      btn.disabled = false;
      btn.innerHTML = 'Extract & Analyze';

      if (data.success && data.workers) {
        window.__tempMasiWorkers = data.workers;
        if (syncBtn) syncBtn.disabled = false;
        statsContainer.classList.remove('hidden');
        document.getElementById('masi-worker-count').textContent = data.workers.length;
        document.getElementById('masi-active-count').textContent = data.workers.filter(w => (Number(w.completedOrders) || 0) > 0).length;
        
        const totalCompleted = data.workers.reduce((sum, w) => sum + (Number(w.completedOrders) || 0), 0);
        document.getElementById('masi-completed-count').textContent = totalCompleted;
        showToast(`Extracted ${data.workers.length} workers from masi.cc.cd!`, 'success');
      } else {
        showToast(data.error || 'Failed to extract from Masi', 'danger');
      }
    } catch (e) {
      btn.disabled = false;
      btn.innerHTML = 'Extract & Analyze';
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
        body: JSON.stringify({ masiWorkers: window.__tempMasiWorkers })
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
      ['Guy / Person Name', 'Telegram Username', 'Keys Count', 'Keys List', 'Completed Orders', 'Success Rate %', 'Base Rate', 'Total Calculated Pay', 'Paid Amount', 'Pending Balance']
    ];

    guys.forEach(g => {
      rows.push([
        g.displayName,
        g.telegramUsername || 'N/A',
        g.keys.length,
        g.keys.map(k => k.key).join('; '),
        g.completedOrders,
        g.successRate + '%',
        `$${g.rate.toFixed(2)}`,
        `$${g.totalEarned.toFixed(2)}`,
        `$${g.paidAmount.toFixed(2)}`,
        `$${g.unpaidAmount.toFixed(2)}`
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

  // Search input event listeners
  function setupEventListeners() {
    const searchInput = document.getElementById('global-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        state.searchQuery = e.target.value;
        render();
      });
    }
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
