// Order & Inventory Management Dashboard Logic with Telegram Bot & Worker Key Integration
(function() {
  'use strict';

  const STORAGE_KEY = 'worker_order_inventory_v1';
  const API_BASE = '/api';

  // Application State
  let state = {
    orders: [],
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
    currentTab: 'keys', // 'keys', 'workers', 'unsold', 'sold', 'all'
    keysViewMode: 'grouped', // 'grouped' (Group by Guy) or 'individual' (All Keys)
    teamAssignTab: 'paste',
    searchQuery: '',
    selectedIds: new Set(),
    soldSubFilter: 'all', // 'all', 'unfulfilled', 'fulfilled'
    isApiOnline: true,
    pollTimer: null
  };

  // Initialize
  async function init() {
    setupEventListeners();
    await fetchServerState();
    render();

    // Start auto-poll every 4 seconds to sync Telegram submissions live
    state.pollTimer = setInterval(async () => {
      await fetchServerState(true);
    }, 4000);
  }

  // Fetch state from server API with localStorage fallback
  async function fetchServerState(isBackground = false) {
    try {
      const res = await fetch(`${API_BASE}/state`);
      if (res.ok) {
        const data = await res.json();
        state.isApiOnline = true;
        state.orders = data.orders || [];
        state.workers = data.workers || [];
        state.settings = data.settings || {};
        state.botStatus = data.botStatus || {};
        
        // Cache in localStorage for offline availability
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          orders: state.orders,
          workers: state.workers,
          settings: state.settings
        }));

        updateBotStatusPill();
        if (isBackground) {
          renderKPIs();
          // Update active panel without disturbing inputs
          renderCurrentPanelQuietly();
        } else {
          render();
        }
        return;
      }
    } catch (err) {
      // Server unreachable - fall back to localStorage
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
        state.orders = data.orders || [];
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
        orders: state.orders,
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
    
    let icon = '';
    if (type === 'success') icon = '<svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>';
    else if (type === 'danger') icon = '<svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>';
    else if (type === 'warning') icon = '<svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>';
    else icon = '<svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>';

    toast.innerHTML = `
      ${icon}
      <span class="flex-1">${escapeHtml(message)}</span>
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
      showToast('Failed to copy to clipboard', 'danger');
    });
  };

  function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Update Bot Status Indicator Pill in Header
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

  // Status Toggles
  window.toggleInventoryStatus = async function(id) {
    const item = state.orders.find(o => o.id === id);
    if (!item) return;
    const isNowSold = item.inventoryStatus === 'unsold';
    item.inventoryStatus = isNowSold ? 'sold' : 'unsold';
    item.soldAt = isNowSold ? new Date().toISOString() : null;
    if (!isNowSold) {
      item.fulfillmentStatus = 'unfulfilled';
      item.fulfilledAt = null;
    }

    saveToLocalStorage();
    render();
    showToast(`Order ${item.orderId} marked as ${item.inventoryStatus.toUpperCase()}`, isNowSold ? 'success' : 'info');

    // Sync to backend
    if (state.isApiOnline) {
      try {
        await fetch(`${API_BASE}/orders/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item)
        });
      } catch (e) {
        console.error('API sync error', e);
      }
    }
  };

  window.toggleFulfillmentStatus = async function(id) {
    const item = state.orders.find(o => o.id === id);
    if (!item) return;
    const isNowFulfilled = item.fulfillmentStatus !== 'fulfilled';
    item.fulfillmentStatus = isNowFulfilled ? 'fulfilled' : 'unfulfilled';
    item.fulfilledAt = isNowFulfilled ? new Date().toISOString() : null;

    saveToLocalStorage();
    render();
    showToast(`Order ${item.orderId} marked as ${item.fulfillmentStatus.toUpperCase()}`, isNowFulfilled ? 'success' : 'warning');

    if (state.isApiOnline) {
      try {
        await fetch(`${API_BASE}/orders/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item)
        });
      } catch (e) {
        console.error('API sync error', e);
      }
    }
  };

  window.toggleWorkerPaymentStatus = async function(id) {
    const item = state.orders.find(o => o.id === id);
    if (!item) return;
    const isNowPaid = item.workerPaymentStatus !== 'paid';
    item.workerPaymentStatus = isNowPaid ? 'paid' : 'unpaid';
    item.paidAt = isNowPaid ? new Date().toISOString() : null;

    saveToLocalStorage();
    render();
    showToast(`Payout for ${item.workerName} marked as ${item.workerPaymentStatus.toUpperCase()}`, isNowPaid ? 'success' : 'warning');

    if (state.isApiOnline) {
      try {
        await fetch(`${API_BASE}/orders/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item)
        });
      } catch (e) {
        console.error('API sync error', e);
      }
    }
  };

  // Mark all orders paid for a worker & send automated Telegram notification
  window.markWorkerPaidWithAlert = async function(workerId, workerName) {
    const worker = state.workers.find(w => w.id === workerId || w.name === workerName);
    
    if (state.isApiOnline && worker) {
      try {
        const res = await fetch(`${API_BASE}/workers/${worker.id}/mark-paid`, { method: 'POST' });
        const result = await res.json();
        if (result.success) {
          await fetchServerState();
          let msg = `Marked ${result.paidCount} orders ($${result.totalPaidAmount.toFixed(2)}) as PAID for ${worker.name}!`;
          if (result.telegramSent) {
            msg += ' 📲 Payment notification sent to worker via Telegram!';
          }
          showToast(msg, 'success');
          return;
        }
      } catch (e) {
        console.error('Error marking paid via API', e);
      }
    }

    // Offline fallback
    let count = 0;
    const now = new Date().toISOString();
    state.orders.forEach(o => {
      if ((o.workerName === workerName || (worker && o.workerKey === worker.key)) && o.workerPaymentStatus !== 'paid') {
        o.workerPaymentStatus = 'paid';
        o.paidAt = now;
        count++;
      }
    });
    saveToLocalStorage();
    render();
    showToast(`Marked ${count} orders as PAID for ${workerName}!`, 'success');
  };

  window.deleteOrder = async function(id) {
    const item = state.orders.find(o => o.id === id);
    if (!item) return;
    if (confirm(`Are you sure you want to delete Order "${item.orderId}" submitted by ${item.workerName}?`)) {
      state.orders = state.orders.filter(o => o.id !== id);
      state.selectedIds.delete(id);
      saveToLocalStorage();
      render();
      showToast(`Order ${item.orderId} deleted`, 'info');

      if (state.isApiOnline) {
        try {
          await fetch(`${API_BASE}/orders/${id}`, { method: 'DELETE' });
        } catch (e) {
          console.error('API delete error', e);
        }
      }
    }
  };

  // Switch Tab
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

  window.setSoldSubFilter = function(filter) {
    state.soldSubFilter = filter;
    render();
  };

  // Filter orders by global search and tab
  function getFilteredOrders() {
    let list = state.orders;

    if (state.searchQuery.trim()) {
      const q = state.searchQuery.trim().toLowerCase();
      list = list.filter(o =>
        (o.workerName && o.workerName.toLowerCase().includes(q)) ||
        (o.workerKey && o.workerKey.toLowerCase().includes(q)) ||
        (o.telegramUsername && o.telegramUsername.toLowerCase().includes(q)) ||
        (o.orderId && o.orderId.toLowerCase().includes(q)) ||
        (o.orderNumber && o.orderNumber.toLowerCase().includes(q)) ||
        (o.uniqueId && o.uniqueId.toLowerCase().includes(q)) ||
        (o.notes && o.notes.toLowerCase().includes(q))
      );
    }

    return list;
  }

  // Render application
  function render() {
    renderKPIs();
    renderWorkerDatalist();

    const container = document.getElementById('panel-content');
    if (!container) return;

    if (state.currentTab === 'unsold') {
      renderUnsoldPanel(container);
    } else if (state.currentTab === 'sold') {
      renderSoldPanel(container);
    } else if (state.currentTab === 'keys') {
      renderKeysPanel(container);
    } else if (state.currentTab === 'workers') {
      renderWorkersPanel(container);
    } else if (state.currentTab === 'all') {
      renderAllOrdersPanel(container);
    }
  }

  function renderCurrentPanelQuietly() {
    const container = document.getElementById('panel-content');
    if (!container) return;
    // Only re-render if user is not actively typing in an input
    const activeEl = document.activeElement;
    if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')) {
      return;
    }
    render();
  }

  // Update top KPI cards (Masi Team & Worker Performance Hub)
  function renderKPIs() {
    const guys = getGroupedGuys();
    const totalKeys = state.workers.length;
    
    // Total Completed Orders (sum across all guys / keys)
    const totalCompletedOrders = guys.reduce((sum, g) => sum + (Number(g.completedOrders) || 0), 0);
    
    // Total Orders across all guys
    const totalAllOrders = guys.reduce((sum, g) => sum + (Number(g.totalOrders) || 0), 0);
    
    // Team success rate (weighted percentage or average)
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
    
    // Total Calculated Pay earned across all guys
    const totalPay = guys.reduce((sum, g) => sum + (Number(g.totalEarned) || 0), 0);
    
    // Total Unique Guys
    const totalGuys = guys.length;

    // Update DOM elements for the Masi Team Hub KPI cards
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

    // Fallback for previous element IDs if present
    const elTotal = document.getElementById('kpi-total');
    const elUnsold = document.getElementById('kpi-unsold');
    const elSold = document.getElementById('kpi-sold');
    if (elTotal) elTotal.textContent = totalKeys;
    if (elUnsold) elUnsold.textContent = totalCompletedOrders;
    if (elSold) elSold.textContent = totalGuys;

    // Tab badges
    const unsold = state.orders.filter(o => o.inventoryStatus === 'unsold').length;
    const sold = state.orders.filter(o => o.inventoryStatus === 'sold').length;
    const unpaidOrders = state.orders.filter(o => o.workerPaymentStatus === 'unpaid');

    const badgeUnsold = document.getElementById('tab-badge-unsold');
    const badgeSold = document.getElementById('tab-badge-sold');
    const badgeKeys = document.getElementById('tab-badge-keys');
    const badgeWorkers = document.getElementById('tab-badge-workers');
    const badgeAll = document.getElementById('tab-badge-all');

    if (badgeUnsold) badgeUnsold.textContent = unsold;
    if (badgeSold) badgeSold.textContent = sold;
    if (badgeKeys) badgeKeys.textContent = totalKeys;
    if (badgeWorkers) badgeWorkers.textContent = unpaidOrders.length;
    if (badgeAll) badgeAll.textContent = state.orders.length;
  }

  // Worker datalist
  function renderWorkerDatalist() {
    const datalist = document.getElementById('workerNamesList');
    if (!datalist) return;
    const names = [...new Set([
      ...state.workers.map(w => w.name),
      ...state.orders.map(o => o.workerName)
    ].filter(Boolean))].sort();
    datalist.innerHTML = names.map(w => `<option value="${escapeHtml(w)}">`).join('');
  }

  // When worker selected in Add Order modal, auto-populate Key & default payout
  window.onWorkerSelected = function(name) {
    const worker = state.workers.find(w => w.name.toLowerCase() === (name || '').trim().toLowerCase());
    if (worker) {
      const keyInput = document.getElementById('input-worker-key');
      const payoutInput = document.getElementById('input-payout');
      if (keyInput) keyInput.value = worker.key || '';
      if (payoutInput && worker.rate) payoutInput.value = worker.rate;
    }
  };

  // PANEL 1: Unsold Inventory
  function renderUnsoldPanel(container) {
    const allFiltered = getFilteredOrders();
    const unsoldList = allFiltered.filter(o => o.inventoryStatus === 'unsold');

    let html = `
      <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div class="p-4 sm:p-6 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-emerald-50/50 to-white">
          <div>
            <h2 class="text-xl font-bold text-slate-800 flex items-center gap-2">
              <span class="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
              Unsold Inventory Panel
            </h2>
            <p class="text-sm text-slate-500 mt-1">
              Active stock available to be sold. Click <span class="font-semibold text-emerald-700">"Mark as Sold"</span> to transfer item to the Sold panel.
            </p>
          </div>
          <div class="flex items-center gap-2">
            <span class="px-3 py-1 bg-emerald-100 text-emerald-800 font-semibold text-sm rounded-full">
              ${unsoldList.length} Items Available
            </span>
          </div>
        </div>
    `;

    if (unsoldList.length === 0) {
      html += `
        <div class="p-12 text-center">
          <div class="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
          </div>
          <h3 class="text-lg font-bold text-slate-700">No Unsold Inventory</h3>
          <p class="text-sm text-slate-500 max-w-md mx-auto mt-1 mb-6">
            All submitted items have been sold, or no submissions match your current search query.
          </p>
          <button onclick="openAddModal()" class="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm transition">
            + Add New Submission
          </button>
        </div>
      </div>`;
      container.innerHTML = html;
      return;
    }

    html += `
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm text-slate-600">
          <thead class="bg-slate-50 text-xs uppercase font-semibold text-slate-500 border-b border-slate-200">
            <tr>
              <th class="py-3.5 px-4">Worker & Telegram</th>
              <th class="py-3.5 px-4">Order ID</th>
              <th class="py-3.5 px-4">Order Number</th>
              <th class="py-3.5 px-4">Unique ID</th>
              <th class="py-3.5 px-4">Worker Status</th>
              <th class="py-3.5 px-4">Submitted Date</th>
              <th class="py-3.5 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
    `;

    unsoldList.forEach(item => {
      const isPaid = item.workerPaymentStatus === 'paid';
      const formattedDate = item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A';

      html += `
        <tr class="hover:bg-slate-50/80 transition-colors group">
          <td class="py-3.5 px-4">
            <div class="font-semibold text-slate-900 flex items-center gap-2">
              <div class="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                ${escapeHtml((item.workerName || 'W').charAt(0).toUpperCase())}
              </div>
              <div>
                <div>${escapeHtml(item.workerName)}</div>
                ${item.telegramUsername ? `<span class="text-[11px] text-sky-600 font-mono font-medium">${escapeHtml(item.telegramUsername)}</span>` : ''}
              </div>
            </div>
            ${item.notes ? `<div class="text-xs text-slate-400 mt-0.5 truncate max-w-xs">${escapeHtml(item.notes)}</div>` : ''}
          </td>

          <td class="py-3.5 px-4">
            <div class="flex items-center gap-1.5">
              <span class="font-mono font-medium text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">${escapeHtml(item.orderId)}</span>
              <button onclick="copyToClipboard('${escapeHtml(item.orderId)}', 'Order ID')" title="Copy Order ID" class="copy-btn text-slate-400 hover:text-indigo-600 p-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
              </button>
            </div>
          </td>

          <td class="py-3.5 px-4">
            <div class="flex items-center gap-1.5">
              <span class="font-mono text-slate-700 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">${escapeHtml(item.orderNumber)}</span>
              <button onclick="copyToClipboard('${escapeHtml(item.orderNumber)}', 'Order Number')" title="Copy Order Number" class="copy-btn text-slate-400 hover:text-indigo-600 p-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
              </button>
            </div>
          </td>

          <td class="py-3.5 px-4">
            <div class="flex items-center gap-1.5">
              <span class="font-mono text-xs text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200 font-semibold">${escapeHtml(item.uniqueId)}</span>
              <button onclick="copyToClipboard('${escapeHtml(item.uniqueId)}', 'Unique ID')" title="Copy Unique ID" class="copy-btn text-slate-400 hover:text-indigo-600 p-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
              </button>
            </div>
          </td>

          <td class="py-3.5 px-4">
            <button onclick="toggleWorkerPaymentStatus('${item.id}')" title="Click to toggle Paid/Unpaid" class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition ${isPaid ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' : 'bg-rose-100 text-rose-800 hover:bg-rose-200'}">
              <span class="w-1.5 h-1.5 rounded-full ${isPaid ? 'bg-emerald-500' : 'bg-rose-500'}"></span>
              ${isPaid ? 'Paid' : 'Unpaid'}
              ${item.payoutAmount ? `<span class="opacity-75 font-normal">($${Number(item.payoutAmount).toFixed(2)})</span>` : ''}
            </button>
          </td>

          <td class="py-3.5 px-4 text-xs text-slate-500">
            ${formattedDate}
          </td>

          <td class="py-3.5 px-4 text-right whitespace-nowrap">
            <div class="flex items-center justify-end gap-2">
              <button onclick="toggleInventoryStatus('${item.id}')" class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg shadow-sm transition transform active:scale-95">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                Mark Sold
              </button>
              <button onclick="editOrder('${item.id}')" title="Edit" class="text-slate-400 hover:text-slate-700 p-1.5 rounded hover:bg-slate-100 transition">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
              </button>
              <button onclick="deleteOrder('${item.id}')" title="Delete" class="text-slate-400 hover:text-rose-600 p-1.5 rounded hover:bg-rose-50 transition">
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
    </div>`;

    container.innerHTML = html;
  }

  // PANEL 2: Sold Inventory
  function renderSoldPanel(container) {
    const allFiltered = getFilteredOrders();
    let soldList = allFiltered.filter(o => o.inventoryStatus === 'sold');

    if (state.soldSubFilter === 'unfulfilled') {
      soldList = soldList.filter(o => o.fulfillmentStatus === 'unfulfilled');
    } else if (state.soldSubFilter === 'fulfilled') {
      soldList = soldList.filter(o => o.fulfillmentStatus === 'fulfilled');
    }

    const totalSold = allFiltered.filter(o => o.inventoryStatus === 'sold').length;
    const countUnfulfilled = allFiltered.filter(o => o.inventoryStatus === 'sold' && o.fulfillmentStatus === 'unfulfilled').length;
    const countFulfilled = allFiltered.filter(o => o.inventoryStatus === 'sold' && o.fulfillmentStatus === 'fulfilled').length;

    let html = `
      <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div class="p-4 sm:p-6 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-purple-50/50 to-white">
          <div>
            <h2 class="text-xl font-bold text-slate-800 flex items-center gap-2">
              <span class="w-3 h-3 rounded-full bg-purple-600"></span>
              Sold Inventory Panel
            </h2>
            <p class="text-sm text-slate-500 mt-1">
              Items successfully sold. Track and toggle order <span class="font-semibold text-amber-700">Fulfillment Status</span> and worker payouts.
            </p>
          </div>

          <div class="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-semibold">
            <button onclick="setSoldSubFilter('all')" class="px-3 py-1.5 rounded-md transition ${state.soldSubFilter === 'all' ? 'bg-white shadow-sm text-slate-900 font-bold' : 'text-slate-600 hover:text-slate-900'}">
              All Sold (${totalSold})
            </button>
            <button onclick="setSoldSubFilter('unfulfilled')" class="px-3 py-1.5 rounded-md transition ${state.soldSubFilter === 'unfulfilled' ? 'bg-amber-500 text-white shadow-sm' : 'text-amber-700 hover:bg-amber-100/50'}">
              ⚠️ Unfulfilled (${countUnfulfilled})
            </button>
            <button onclick="setSoldSubFilter('fulfilled')" class="px-3 py-1.5 rounded-md transition ${state.soldSubFilter === 'fulfilled' ? 'bg-emerald-600 text-white shadow-sm' : 'text-emerald-700 hover:bg-emerald-100/50'}">
              ✓ Fulfilled (${countFulfilled})
            </button>
          </div>
        </div>
    `;

    if (soldList.length === 0) {
      html += `
        <div class="p-12 text-center">
          <div class="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
          </div>
          <h3 class="text-lg font-bold text-slate-700">No Items Found in this View</h3>
          <p class="text-sm text-slate-500 max-w-md mx-auto mt-1">
            ${totalSold === 0 ? 'No items have been marked as Sold yet. Go to the "Unsold Inventory" panel and click "Mark Sold".' : 'No items match the selected sub-filter.'}
          </p>
        </div>
      </div>`;
      container.innerHTML = html;
      return;
    }

    html += `
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm text-slate-600">
          <thead class="bg-slate-50 text-xs uppercase font-semibold text-slate-500 border-b border-slate-200">
            <tr>
              <th class="py-3.5 px-4">Order ID & Number</th>
              <th class="py-3.5 px-4">Worker & Telegram</th>
              <th class="py-3.5 px-4">Unique ID</th>
              <th class="py-3.5 px-4">Fulfillment Status</th>
              <th class="py-3.5 px-4">Worker Payout</th>
              <th class="py-3.5 px-4">Sold Timestamp</th>
              <th class="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
    `;

    soldList.forEach(item => {
      const isFulfilled = item.fulfillmentStatus === 'fulfilled';
      const isPaid = item.workerPaymentStatus === 'paid';
      const soldDate = item.soldAt ? new Date(item.soldAt).toLocaleString() : 'Recently';

      html += `
        <tr class="hover:bg-slate-50/80 transition-colors">
          <td class="py-3.5 px-4">
            <div class="flex items-center gap-1.5 mb-1">
              <span class="font-mono font-bold text-slate-900">${escapeHtml(item.orderId)}</span>
              <button onclick="copyToClipboard('${escapeHtml(item.orderId)}', 'Order ID')" title="Copy Order ID" class="copy-btn text-slate-400 hover:text-purple-600">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
              </button>
            </div>
            <div class="flex items-center gap-1 text-xs text-slate-500">
              <span>No:</span>
              <span class="font-mono font-medium text-slate-700">${escapeHtml(item.orderNumber)}</span>
              <button onclick="copyToClipboard('${escapeHtml(item.orderNumber)}', 'Order Number')" title="Copy Order Number" class="copy-btn text-slate-400 hover:text-purple-600">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
              </button>
            </div>
          </td>

          <td class="py-3.5 px-4">
            <div class="font-semibold text-slate-900">${escapeHtml(item.workerName)}</div>
            ${item.telegramUsername ? `<span class="text-[11px] text-sky-600 font-mono">${escapeHtml(item.telegramUsername)}</span>` : ''}
            ${item.notes ? `<div class="text-xs text-slate-400 truncate max-w-xs">${escapeHtml(item.notes)}</div>` : ''}
          </td>

          <td class="py-3.5 px-4">
            <div class="flex items-center gap-1.5">
              <span class="font-mono text-xs font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">${escapeHtml(item.uniqueId)}</span>
              <button onclick="copyToClipboard('${escapeHtml(item.uniqueId)}', 'Unique ID')" title="Copy Unique ID" class="copy-btn text-slate-400 hover:text-purple-600">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
              </button>
            </div>
          </td>

          <td class="py-3.5 px-4">
            <button onclick="toggleFulfillmentStatus('${item.id}')" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-sm ${isFulfilled ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100' : 'bg-amber-50 text-amber-800 border border-amber-300 hover:bg-amber-100 animate-pulse'}">
              ${isFulfilled ? `
                <svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                Fulfilled
              ` : `
                <svg class="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                Unfulfilled (Click to Fulfill)
              `}
            </button>
          </td>

          <td class="py-3.5 px-4">
            <button onclick="toggleWorkerPaymentStatus('${item.id}')" class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition ${isPaid ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' : 'bg-rose-100 text-rose-800 hover:bg-rose-200'}">
              <span class="w-1.5 h-1.5 rounded-full ${isPaid ? 'bg-emerald-500' : 'bg-rose-500'}"></span>
              ${isPaid ? 'Paid' : 'Unpaid'}
              ${item.payoutAmount ? `<span class="opacity-75 font-normal">($${Number(item.payoutAmount).toFixed(2)})</span>` : ''}
            </button>
          </td>

          <td class="py-3.5 px-4 text-xs text-slate-500">
            ${soldDate}
          </td>

          <td class="py-3.5 px-4 text-right whitespace-nowrap">
            <div class="flex items-center justify-end gap-2">
              <button onclick="toggleInventoryStatus('${item.id}')" title="Revert back to Unsold" class="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs rounded-lg transition border border-slate-300">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"></path></svg>
                Revert to Unsold
              </button>
              <button onclick="editOrder('${item.id}')" title="Edit" class="text-slate-400 hover:text-slate-700 p-1.5 rounded hover:bg-slate-100 transition">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
              </button>
              <button onclick="deleteOrder('${item.id}')" title="Delete" class="text-slate-400 hover:text-rose-600 p-1.5 rounded hover:bg-rose-50 transition">
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
    </div>`;

    container.innerHTML = html;
  }

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
      const allKeys = guy.keys.map(k => k.key.toUpperCase());
      const allNames = guy.keys.map(k => (k.name || '').toLowerCase());

      const guyOrders = state.orders.filter(o =>
        (o.workerKey && allKeys.includes(o.workerKey.toUpperCase())) ||
        (o.workerName && allNames.includes(o.workerName.toLowerCase()))
      );

      const localTotal = guyOrders.length;
      const localCompleted = guyOrders.filter(o => o.inventoryStatus === 'sold' && o.fulfillmentStatus === 'fulfilled').length;
      const extractedCompleted = guy.keys.reduce((sum, k) => sum + (Number(k.completedOrders) || 0), 0);
      const extractedFail = guy.keys.reduce((sum, k) => sum + (Number(k.failCount) || 0), 0);

      const completedOrders = Math.max(localCompleted, extractedCompleted);
      const totalOrders = Math.max(localTotal, extractedCompleted + extractedFail);
      const unsoldCount = guyOrders.filter(o => o.inventoryStatus === 'unsold').length;

      const isCustomRate = guy.customSuccessRate !== null && guy.customSuccessRate !== undefined && guy.customSuccessRate !== '';
      let rateNum = 0;
      if (isCustomRate) {
        rateNum = Math.min(100, Math.max(0, Number(guy.customSuccessRate)));
      } else if (totalOrders > 0) {
        rateNum = (completedOrders / totalOrders) * 100;
      } else if (guy.keys.length === 1 && guy.keys[0].successRate) {
        rateNum = Number(guy.keys[0].successRate);
      }
      const successRate = rateNum.toFixed(1);

      const baseRate = guy.rate || 15.00;
      const totalEarned = completedOrders * baseRate;

      const unpaidOrders = guyOrders.filter(o => o.workerPaymentStatus === 'unpaid');
      const unpaidAmount = unpaidOrders.length > 0
        ? unpaidOrders.reduce((sum, o) => sum + (Number(o.payoutAmount) || baseRate), 0)
        : 0;

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
        unsoldCount,
        isCustomRate,
        rateNum,
        successRate,
        rateColor,
        progressColor,
        totalEarned,
        unpaidAmount,
        unpaidCount: unpaidOrders.length
      };
    });
  }

  // PANEL 3: Telegram & Worker Keys Hub (With Multi-Key Team/Guy Grouping)
  function renderKeysPanel(container) {
    const guys = getGroupedGuys();
    const isGroupedView = state.keysViewMode === 'grouped';

    let html = `
      <div class="space-y-6">
        <!-- Banner & Quick Actions -->
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6 bg-gradient-to-r from-sky-50/50 via-indigo-50/30 to-white flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 class="text-xl font-bold text-slate-800 flex items-center gap-2">
              <svg class="w-6 h-6 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path></svg>
              Telegram & Worker Keys Management
            </h2>
            <p class="text-sm text-slate-500 mt-1">
              Group keys under individual team members, connect Telegram usernames, view success rates & calculated payouts.
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <!-- View Mode Switch: Group by Guy vs All Keys -->
            <div class="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-semibold">
              <button onclick="switchKeysViewMode('grouped')" class="px-3 py-1.5 rounded-md transition ${isGroupedView ? 'bg-indigo-600 text-white shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'}">
                👥 Group by Guy (${guys.length})
              </button>
              <button onclick="switchKeysViewMode('individual')" class="px-3 py-1.5 rounded-md transition ${!isGroupedView ? 'bg-indigo-600 text-white shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'}">
                🔑 All Keys (${state.workers.length})
              </button>
            </div>

            <button onclick="openTeamAssignModal()" class="px-3.5 py-2 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition flex items-center gap-1.5">
              <span>👥</span> Assign Keys to Guys
            </button>
            <button onclick="openMasiModal()" class="px-3 py-2 rounded-lg text-xs font-bold bg-violet-600 hover:bg-violet-700 text-white shadow-sm transition flex items-center gap-1.5">
              <span>⚡</span> Extract Masi
            </button>
            <button onclick="openAddWorkerModal()" class="px-3 py-2 rounded-lg text-xs font-bold bg-sky-600 hover:bg-sky-700 text-white shadow-sm transition flex items-center gap-1">
              <span>+</span> New Key
            </button>
          </div>
        </div>

        <!-- Bot Connection Instructions Bar -->
        <div class="bg-sky-50 border border-sky-200 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs text-sky-900">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-sky-200 text-sky-700 flex items-center justify-center font-bold text-sm">💡</div>
            <div>
              <span class="font-bold">Team Multi-Key Feature:</span>
              <span class="text-sky-800"> You can assign multiple keys to the <b>same guy</b> by putting their Telegram username on each key. Their orders, success rates, and pay will combine automatically!</span>
            </div>
          </div>
          <div class="font-mono text-[11px] bg-white px-2.5 py-1 rounded border border-sky-200 text-sky-700 font-semibold whitespace-nowrap">
            Bot Status: ${state.botStatus && state.botStatus.isPolling ? `🟢 @${state.botStatus.botUsername || 'Active'}` : '🔴 Offline / Setup Token'}
          </div>
        </div>
    `;

    if (state.workers.length === 0) {
      html += `
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
          <p class="text-slate-500 mb-4">No worker keys created yet.</p>
          <button onclick="openAddWorkerModal()" class="px-4 py-2 bg-sky-600 text-white font-medium text-xs rounded-lg shadow-sm">
            + Generate First Worker Key
          </button>
        </div>
      </div>`;
      container.innerHTML = html;
      return;
    }

    // MODE 1: Group by Guy (Consolidated Team View)
    if (isGroupedView) {
      html += `<div class="grid grid-cols-1 md:grid-cols-2 gap-5">`;

      guys.forEach(guy => {
        const isLinked = Boolean(guy.telegramId);

        html += `
          <div class="bg-white rounded-xl shadow-sm border border-slate-200 hover:border-indigo-300 transition-all overflow-hidden flex flex-col justify-between">
            <div class="p-5">
              <!-- Header: Guy Name & Telegram -->
              <div class="flex items-start justify-between gap-3 mb-4">
                <div class="flex items-center gap-3">
                  <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                    ${escapeHtml(guy.displayName.charAt(0).toUpperCase())}
                  </div>
                  <div>
                    <div class="flex items-center gap-2">
                      <h3 class="font-bold text-slate-900 text-base leading-tight">${escapeHtml(guy.displayName)}</h3>
                      <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${guy.keys.length > 1 ? 'bg-indigo-100 text-indigo-800 border border-indigo-200' : 'bg-slate-100 text-slate-600'}">
                        ${guy.keys.length} ${guy.keys.length === 1 ? 'Key' : 'Keys Combined'}
                      </span>
                    </div>
                    <div class="flex items-center gap-2 mt-1">
                      ${guy.telegramUsername ? `
                        <a href="https://t.me/${escapeHtml(guy.telegramUsername.replace('@', ''))}" target="_blank" class="font-mono text-xs font-bold text-sky-600 hover:underline flex items-center gap-1">
                          <span>✈️</span> ${escapeHtml(guy.telegramUsername)}
                        </a>
                      ` : `
                        <span class="text-xs text-slate-400 italic">No Telegram handle</span>
                      `}
                      <button onclick="promptEditGuyTelegram('${escapeHtml(guy.keys[0].key)}', '${escapeHtml(guy.telegramUsername || '')}')" class="text-[11px] text-indigo-600 hover:underline font-semibold">
                        ${guy.telegramUsername ? '✏️ Edit' : '+ Set Telegram'}
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Telegram Link Status -->
                ${isLinked ? `
                  <div class="text-right">
                    <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-sky-100 text-sky-800 border border-sky-200">
                      <span class="w-2 h-2 rounded-full bg-sky-500"></span>
                      Linked
                    </span>
                    <div class="text-[10px] text-slate-400 font-mono mt-0.5">ID: ${escapeHtml(guy.telegramId)}</div>
                  </div>
                ` : `
                  <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                    <span class="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                    Unlinked
                  </span>
                `}
              </div>

              <!-- Assigned Keys List (Pill Tags) -->
              <div class="mb-4 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div class="flex items-center justify-between text-xs font-semibold text-slate-600 mb-2">
                  <span class="flex items-center gap-1">🔑 Assigned Keys (${guy.keys.length}):</span>
                  <button onclick="openTeamAssignModal()" class="text-[11px] text-indigo-600 hover:underline font-bold">+ Manage Keys</button>
                </div>
                <div class="flex flex-wrap gap-1.5">
                  ${guy.keys.map(k => `
                    <div class="inline-flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-xs shadow-2xs">
                      <span class="font-mono font-bold text-indigo-700">${escapeHtml(k.key)}</span>
                      <span class="text-[10px] text-slate-500">(${k.completedOrders || 0} done)</span>
                      <button onclick="copyToClipboard('${escapeHtml(k.key)}', 'Key')" title="Copy Key" class="text-slate-400 hover:text-indigo-600">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                      </button>
                    </div>
                  `).join('')}
                </div>
              </div>

              <!-- Combined Success Rate Bar -->
              <div class="bg-slate-50 p-3 rounded-xl border border-slate-100 mb-4">
                <div class="flex items-center justify-between text-xs font-bold mb-1.5">
                  <span class="text-slate-700 flex items-center gap-1.5">
                    <svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    Combined Success Rate:
                    ${guy.isCustomRate ? `<span class="text-[10px] font-bold px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-800">Admin Decided</span>` : `<span class="text-[10px] font-medium px-1.5 py-0.2 rounded bg-slate-200 text-slate-600">Combined</span>`}
                  </span>
                  <div class="flex items-center gap-2">
                    <span class="px-2 py-0.5 rounded font-mono font-bold ${guy.rateColor}">${guy.successRate}%</span>
                    <button onclick="openDecideRateModal('${guy.keys[0].id}')" title="Set Success Rate for this Guy" class="px-2 py-0.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded transition">
                      🎯 Set Rate
                    </button>
                  </div>
                </div>
                <div class="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                  <div class="${guy.progressColor} h-2.5 rounded-full transition-all duration-500" style="width: ${guy.rateNum}%"></div>
                </div>
                <div class="flex justify-between text-[11px] text-slate-400 mt-1">
                  <span>${guy.completedOrders} Orders Fulfilled</span>
                  <span>${guy.totalOrders} Total Orders</span>
                </div>
              </div>

              <!-- Combined Financial Metrics Grid -->
              <div class="grid grid-cols-4 gap-2 text-center text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-100 mb-3">
                <div>
                  <div class="text-slate-400 text-[11px]">Keys</div>
                  <div class="font-bold text-slate-800 text-sm mt-0.5">${guy.keys.length}</div>
                </div>
                <div>
                  <div class="text-slate-400 text-[11px]">Completed</div>
                  <div class="font-bold text-indigo-600 text-sm mt-0.5">${guy.completedOrders}</div>
                </div>
                <div>
                  <div class="text-slate-400 text-[11px]">Total Pay</div>
                  <div class="font-bold text-emerald-700 text-sm mt-0.5">$${guy.totalEarned.toFixed(2)}</div>
                </div>
                <div>
                  <div class="text-slate-400 text-[11px]">Unpaid Due</div>
                  <div class="font-bold ${guy.unpaidAmount > 0 ? 'text-rose-600' : 'text-slate-500'} text-sm mt-0.5">$${guy.unpaidAmount.toFixed(2)}</div>
                </div>
              </div>
            </div>

            <!-- Actions Footer -->
            <div class="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-2">
              <span class="text-xs text-slate-500">Rate: <strong>$${guy.rate.toFixed(2)}/order</strong></span>
              <div class="flex items-center gap-1.5">
                ${guy.unpaidAmount > 0 ? `
                  <button onclick="markWorkerPaidWithAlert('${guy.keys[0].id}', '${escapeHtml(guy.displayName)}')" class="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition">
                    Pay $${guy.unpaidAmount.toFixed(2)} ${isLinked ? '📲' : ''}
                  </button>
                ` : `
                  <span class="px-2 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 rounded">All Settled</span>
                `}
              </div>
            </div>
          </div>
        `;
      });

      html += `</div></div>`;
      container.innerHTML = html;
      return;
    }

    // MODE 2: Individual Keys View
    html += `<div class="grid grid-cols-1 md:grid-cols-2 gap-5">`;

    state.workers.forEach(worker => {
      // Calculate worker stats
      const workerOrders = state.orders.filter(o =>
        (o.workerKey && o.workerKey.toUpperCase() === worker.key.toUpperCase()) ||
        (o.workerName && o.workerName.toLowerCase() === worker.name.toLowerCase())
      );

      const localTotal = workerOrders.length;
      const localCompleted = workerOrders.filter(o => o.inventoryStatus === 'sold' && o.fulfillmentStatus === 'fulfilled').length;
      const completedOrders = (worker.completedOrders !== undefined && worker.completedOrders !== null)
        ? Math.max(localCompleted, Number(worker.completedOrders))
        : localCompleted;
      const totalOrders = Math.max(localTotal, (Number(worker.completedOrders) || 0) + (Number(worker.failCount) || 0));
      const soldOrders = workerOrders.filter(o => o.inventoryStatus === 'sold').length;
      const unsoldCount = workerOrders.filter(o => o.inventoryStatus === 'unsold').length;

      // Success Rate Calculation: Check if admin manually decided the rate or extracted from Masi!
      const isCustomRate = worker.customSuccessRate !== null && worker.customSuccessRate !== undefined && worker.customSuccessRate !== '';
      const rateNum = isCustomRate 
        ? Math.min(100, Math.max(0, Number(worker.customSuccessRate))) 
        : (totalOrders > 0 ? ((completedOrders / totalOrders) * 100) : (Number(worker.successRate) || 0));
      const successRate = rateNum.toFixed(1);

      // Financials
      const baseRate = Number(worker.rate) || 15.00;
      const totalEarned = completedOrders * baseRate;

      const unpaidOrders = workerOrders.filter(o => o.workerPaymentStatus === 'unpaid');
      const unpaidAmount = unpaidOrders.length > 0 
        ? unpaidOrders.reduce((sum, o) => sum + (Number(o.payoutAmount) || baseRate), 0)
        : 0;

      const isLinked = Boolean(worker.telegramId);

      // Color coding for success rate
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

      html += `
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 hover:border-sky-300 transition-all overflow-hidden flex flex-col justify-between">
          <div class="p-5">
            <!-- Header -->
            <div class="flex items-start justify-between gap-3 mb-4">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                  ${escapeHtml(worker.name.charAt(0).toUpperCase())}
                </div>
                <div>
                  <h3 class="font-bold text-slate-900 text-base leading-tight">${escapeHtml(worker.name)}</h3>
                  <div class="flex items-center gap-1.5 mt-1">
                    <span class="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">${escapeHtml(worker.key)}</span>
                    <button onclick="copyToClipboard('${escapeHtml(worker.key)}', 'Worker Key')" title="Copy Key" class="text-slate-400 hover:text-indigo-600 p-0.5">
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                    </button>
                    <button onclick="copyToClipboard('/link ${escapeHtml(worker.key)}', 'Telegram Command')" title="Copy Telegram /link Command" class="text-xs text-sky-600 hover:underline ml-1">
                      Copy <code>/link</code>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Telegram Link Status Pill -->
              ${isLinked ? `
                <div class="text-right">
                  <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-sky-100 text-sky-800 border border-sky-200">
                    <span class="w-2 h-2 rounded-full bg-sky-500"></span>
                    ${escapeHtml(worker.telegramUsername || 'Linked')}
                  </span>
                  <div class="text-[10px] text-slate-400 font-mono mt-0.5">ID: ${escapeHtml(worker.telegramId)}</div>
                </div>
              ` : `
                <div class="text-right">
                  ${worker.telegramUsername ? `
                    <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold text-sky-700 bg-sky-50 border border-sky-200">
                      ${escapeHtml(worker.telegramUsername)}
                    </span>
                    <div class="text-[10px] text-amber-600 mt-0.5">Awaiting /link</div>
                  ` : `
                    <button onclick="promptEditGuyTelegram('${escapeHtml(worker.key)}', '')" class="text-xs text-indigo-600 hover:underline font-semibold bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                      + Set Telegram
                    </button>
                  `}
                </div>
              `}
            </div>

            <!-- Success Rate Metric Bar with Admin Override -->
            <div class="bg-slate-50 p-3 rounded-xl border border-slate-100 mb-4">
              <div class="flex items-center justify-between text-xs font-bold mb-1.5">
                <span class="text-slate-700 flex items-center gap-1.5">
                  <svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  Success Rate:
                  ${isCustomRate ? `<span class="text-[10px] font-bold px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-800">Admin Decided</span>` : `<span class="text-[10px] font-medium px-1.5 py-0.2 rounded bg-slate-200 text-slate-600">Auto</span>`}
                </span>
                <div class="flex items-center gap-2">
                  <span class="px-2 py-0.5 rounded font-mono font-bold ${rateColor}">${successRate}%</span>
                  <button onclick="openDecideRateModal('${worker.id}')" title="Decide Success Rate" class="px-2 py-0.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded transition">
                    🎯 Set Rate
                  </button>
                </div>
              </div>
              <div class="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                <div class="${progressColor} h-2.5 rounded-full transition-all duration-500" style="width: ${rateNum}%"></div>
              </div>
              <div class="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>${completedOrders} Fulfilled</span>
                <span>${totalOrders} Total Submitted</span>
              </div>
            </div>

            <!-- Metrics Grid -->
            <div class="grid grid-cols-4 gap-2 text-center text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-100 mb-3">
              <div>
                <div class="text-slate-400 text-[11px]">Submitted</div>
                <div class="font-bold text-slate-800 text-sm mt-0.5">${totalOrders}</div>
              </div>
              <div>
                <div class="text-slate-400 text-[11px]">Unsold</div>
                <div class="font-bold text-emerald-600 text-sm mt-0.5">${unsoldCount}</div>
              </div>
              <div>
                <div class="text-slate-400 text-[11px]">Earned</div>
                <div class="font-bold text-slate-800 text-sm mt-0.5">$${totalEarned.toFixed(2)}</div>
              </div>
              <div>
                <div class="text-slate-400 text-[11px]">Unpaid Due</div>
                <div class="font-bold ${unpaidAmount > 0 ? 'text-rose-600' : 'text-slate-500'} text-sm mt-0.5">$${unpaidAmount.toFixed(2)}</div>
              </div>
            </div>
          </div>

          <!-- Actions Footer -->
          <div class="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-2">
            <div class="flex items-center gap-1.5 text-xs text-slate-500">
              <span>Rate:</span>
              <span class="font-bold text-slate-800">$${baseRate.toFixed(2)}/order</span>
            </div>

            <div class="flex items-center gap-1.5">
              ${unpaidAmount > 0 ? `
                <button onclick="markWorkerPaidWithAlert('${worker.id}', '${escapeHtml(worker.name)}')" title="Mark all unpaid orders as paid and send alert" class="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition">
                  Pay $${unpaidAmount.toFixed(2)} ${isLinked ? '📲' : ''}
                </button>
              ` : `
                <span class="px-2 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 rounded">All Settled</span>
              `}

              <button onclick="editWorkerKey('${worker.id}')" title="Edit Rate or Key" class="p-1.5 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-200 transition">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
              </button>
              <button onclick="deleteWorkerKey('${worker.id}')" title="Delete Key" class="p-1.5 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50 transition">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
              </button>
            </div>
          </div>
        </div>
      `;
    });

    html += `</div></div>`;
    container.innerHTML = html;
  }

  // PANEL 4: Worker Payouts (Grouped by Worker)
  function renderWorkersPanel(container) {
    const allFiltered = getFilteredOrders();
    const workersMap = {};

    allFiltered.forEach(item => {
      const name = item.workerName || 'Unknown Worker';
      if (!workersMap[name]) {
        workersMap[name] = {
          name,
          workerKey: item.workerKey || '',
          telegramUsername: item.telegramUsername || '',
          totalSubmissions: 0,
          soldCount: 0,
          unsoldCount: 0,
          unpaidCount: 0,
          unpaidAmount: 0,
          paidCount: 0,
          paidAmount: 0,
          orders: []
        };
      }
      workersMap[name].totalSubmissions++;
      if (item.inventoryStatus === 'sold') workersMap[name].soldCount++;
      else workersMap[name].unsoldCount++;

      const amount = Number(item.payoutAmount) || 15.00;
      if (item.workerPaymentStatus === 'paid') {
        workersMap[name].paidCount++;
        workersMap[name].paidAmount += amount;
      } else {
        workersMap[name].unpaidCount++;
        workersMap[name].unpaidAmount += amount;
      }
      workersMap[name].orders.push(item);
    });

    const workersList = Object.values(workersMap).sort((a, b) => b.unpaidCount - a.unpaidCount || a.name.localeCompare(b.name));

    let html = `
      <div class="space-y-6">
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6 bg-gradient-to-r from-blue-50/50 to-white flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 class="text-xl font-bold text-slate-800 flex items-center gap-2">
              <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
              Worker Payouts & Balance Hub
            </h2>
            <p class="text-sm text-slate-500 mt-1">
              Summary grouped by worker. Clear balances with <span class="font-semibold text-emerald-700">"Mark All Paid"</span> with automatic Telegram alert.
            </p>
          </div>
          <div class="text-right">
            <div class="text-xs text-slate-400 uppercase font-semibold">Active Submitting Workers</div>
            <div class="text-lg font-bold text-slate-800">${workersList.length} Workers</div>
          </div>
        </div>
    `;

    if (workersList.length === 0) {
      html += `
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
          <p class="text-slate-500">No worker submission data found.</p>
        </div>
      </div>`;
      container.innerHTML = html;
      return;
    }

    html += `<div class="grid grid-cols-1 md:grid-cols-2 gap-5">`;

    workersList.forEach(w => {
      const hasUnpaid = w.unpaidCount > 0;

      html += `
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 hover:border-indigo-300 transition-all overflow-hidden flex flex-col justify-between">
          <div class="p-5">
            <div class="flex items-start justify-between gap-3 mb-4">
              <div class="flex items-center gap-3">
                <div class="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                  ${escapeHtml(w.name.charAt(0).toUpperCase())}
                </div>
                <div>
                  <h3 class="font-bold text-slate-900 text-base leading-tight">${escapeHtml(w.name)}</h3>
                  <div class="text-xs text-slate-500 mt-0.5">
                    ${w.totalSubmissions} Total Submissions (${w.soldCount} Sold, ${w.unsoldCount} Unsold)
                  </div>
                </div>
              </div>

              ${hasUnpaid ? `
                <span class="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-1">
                  <span class="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                  ${w.unpaidCount} Unpaid ($${w.unpaidAmount.toFixed(2)})
                </span>
              ` : `
                <span class="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                  ✓ All Settled ($${w.paidAmount.toFixed(2)})
                </span>
              `}
            </div>

            <div class="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-lg border border-slate-100 text-center mb-4">
              <div>
                <div class="text-xs text-slate-400 font-medium">Sold / Unsold</div>
                <div class="text-sm font-bold text-slate-800">${w.soldCount} / ${w.unsoldCount}</div>
              </div>
              <div>
                <div class="text-xs text-slate-400 font-medium">Paid Orders</div>
                <div class="text-sm font-bold text-emerald-600">${w.paidCount} ($${w.paidAmount.toFixed(2)})</div>
              </div>
              <div>
                <div class="text-xs text-slate-400 font-medium">Pending Due</div>
                <div class="text-sm font-bold ${hasUnpaid ? 'text-rose-600' : 'text-slate-400'}">$${w.unpaidAmount.toFixed(2)}</div>
              </div>
            </div>

            <div class="text-xs text-slate-500 font-medium mb-2 flex items-center justify-between">
              <span>Order Intakes:</span>
              <span class="text-slate-400">${w.orders.length} orders</span>
            </div>
            <div class="space-y-1.5 max-h-40 overflow-y-auto pr-1">
              ${w.orders.map(o => `
                <div class="flex items-center justify-between p-2 rounded bg-slate-50 hover:bg-slate-100 transition text-xs border border-slate-100">
                  <div class="flex items-center gap-2">
                    <span class="font-mono font-semibold text-slate-800">${escapeHtml(o.orderId)}</span>
                    <span class="text-slate-400">|</span>
                    <span class="font-mono text-purple-600">${escapeHtml(o.uniqueId)}</span>
                    <span class="px-1.5 py-0.2 rounded text-[10px] font-semibold ${o.inventoryStatus === 'sold' ? 'bg-purple-100 text-purple-700' : 'bg-emerald-100 text-emerald-700'}">
                      ${o.inventoryStatus}
                    </span>
                  </div>
                  <button onclick="toggleWorkerPaymentStatus('${o.id}')" class="px-2 py-0.5 rounded font-bold transition text-[11px] ${o.workerPaymentStatus === 'paid' ? 'bg-emerald-200 text-emerald-800' : 'bg-rose-200 text-rose-800 hover:bg-rose-300'}">
                    ${o.workerPaymentStatus === 'paid' ? 'Paid' : 'Pay ($' + Number(o.payoutAmount || 15).toFixed(2) + ')'}
                  </button>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
            <span class="text-xs text-slate-500">
              ${hasUnpaid ? `Owed: <strong class="text-rose-600">$${w.unpaidAmount.toFixed(2)}</strong>` : 'No balance due'}
            </span>
            <button onclick="markWorkerPaidWithAlert(null, '${escapeHtml(w.name)}')" class="px-3.5 py-1.5 rounded-lg text-xs font-bold transition shadow-sm ${hasUnpaid ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-slate-200 text-slate-500 cursor-not-allowed'}">
              Mark All Paid
            </button>
          </div>
        </div>
      `;
    });

    html += `</div></div>`;
    container.innerHTML = html;
  }

  // PANEL 5: Master All Records
  function renderAllOrdersPanel(container) {
    const list = getFilteredOrders();
    const isAllSelected = list.length > 0 && list.every(o => state.selectedIds.has(o.id));

    let html = `
      <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div class="p-4 sm:p-6 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 class="text-xl font-bold text-slate-800 flex items-center gap-2">
              <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path></svg>
              Master Orders Table
            </h2>
            <p class="text-sm text-slate-500 mt-0.5">Comprehensive view of all worker submissions, status flags, and metadata.</p>
          </div>

          <div class="flex flex-wrap items-center gap-2">
            ${state.selectedIds.size > 0 ? `
              <div class="flex items-center gap-2 bg-indigo-50 border border-indigo-200 px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-900">
                <span>${state.selectedIds.size} Selected</span>
                <span class="text-indigo-300">|</span>
                <button onclick="batchAction('markSold')" class="hover:text-indigo-600 font-bold underline">Mark Sold</button>
                <button onclick="batchAction('markUnsold')" class="hover:text-indigo-600 font-bold underline">Mark Unsold</button>
                <button onclick="batchAction('markFulfilled')" class="hover:text-indigo-600 font-bold underline">Mark Fulfilled</button>
                <button onclick="batchAction('markPaid')" class="hover:text-indigo-600 font-bold underline">Mark Paid</button>
                <button onclick="batchAction('delete')" class="text-rose-600 hover:text-rose-800 font-bold underline">Delete</button>
              </div>
            ` : ''}
            <button onclick="openAddModal()" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs rounded-lg shadow-sm transition flex items-center gap-1.5">
              <span>+</span> Add Order
            </button>
          </div>
        </div>
    `;

    if (list.length === 0) {
      html += `
        <div class="p-12 text-center">
          <p class="text-slate-500 mb-4">No records found matching your filters.</p>
          <button onclick="clearSearch()" class="text-indigo-600 font-medium text-sm hover:underline">Reset Search Filters</button>
        </div>
      </div>`;
      container.innerHTML = html;
      return;
    }

    html += `
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm text-slate-600">
          <thead class="bg-slate-50 text-xs uppercase font-semibold text-slate-500 border-b border-slate-200">
            <tr>
              <th class="py-3.5 px-4 w-10">
                <input type="checkbox" onchange="toggleSelectAll(this.checked)" ${isAllSelected ? 'checked' : ''} class="rounded text-indigo-600 focus:ring-indigo-500">
              </th>
              <th class="py-3.5 px-4">Worker & Key</th>
              <th class="py-3.5 px-4">Order ID</th>
              <th class="py-3.5 px-4">Order Number</th>
              <th class="py-3.5 px-4">Unique ID</th>
              <th class="py-3.5 px-4">Inventory</th>
              <th class="py-3.5 px-4">Fulfillment</th>
              <th class="py-3.5 px-4">Worker Status</th>
              <th class="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
    `;

    list.forEach(item => {
      const isSelected = state.selectedIds.has(item.id);
      const isSold = item.inventoryStatus === 'sold';
      const isFulfilled = item.fulfillmentStatus === 'fulfilled';
      const isPaid = item.workerPaymentStatus === 'paid';

      html += `
        <tr class="hover:bg-slate-50/80 transition-colors ${isSelected ? 'bg-indigo-50/40' : ''}">
          <td class="py-3.5 px-4">
            <input type="checkbox" onchange="toggleSelectOne('${item.id}', this.checked)" ${isSelected ? 'checked' : ''} class="rounded text-indigo-600 focus:ring-indigo-500">
          </td>

          <td class="py-3.5 px-4">
            <div class="font-semibold text-slate-900">${escapeHtml(item.workerName)}</div>
            <div class="flex items-center gap-1.5 mt-0.5">
              ${item.workerKey ? `<span class="font-mono text-[10px] text-indigo-700 bg-indigo-50 px-1.5 rounded">${escapeHtml(item.workerKey)}</span>` : ''}
              ${item.telegramUsername ? `<span class="font-mono text-[11px] text-sky-600">${escapeHtml(item.telegramUsername)}</span>` : ''}
            </div>
            ${item.notes ? `<div class="text-xs text-slate-400 truncate max-w-[200px] mt-0.5">${escapeHtml(item.notes)}</div>` : ''}
          </td>

          <td class="py-3.5 px-4">
            <div class="flex items-center gap-1.5">
              <span class="font-mono font-medium text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">${escapeHtml(item.orderId)}</span>
              <button onclick="copyToClipboard('${escapeHtml(item.orderId)}', 'Order ID')" title="Copy Order ID" class="copy-btn text-slate-400 hover:text-indigo-600 p-0.5">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
              </button>
            </div>
          </td>

          <td class="py-3.5 px-4">
            <div class="flex items-center gap-1.5">
              <span class="font-mono text-slate-700 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">${escapeHtml(item.orderNumber)}</span>
              <button onclick="copyToClipboard('${escapeHtml(item.orderNumber)}', 'Order Number')" title="Copy Order Number" class="copy-btn text-slate-400 hover:text-indigo-600 p-0.5">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
              </button>
            </div>
          </td>

          <td class="py-3.5 px-4">
            <div class="flex items-center gap-1.5">
              <span class="font-mono text-xs text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200 font-semibold">${escapeHtml(item.uniqueId)}</span>
              <button onclick="copyToClipboard('${escapeHtml(item.uniqueId)}', 'Unique ID')" title="Copy Unique ID" class="copy-btn text-slate-400 hover:text-indigo-600 p-0.5">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
              </button>
            </div>
          </td>

          <td class="py-3.5 px-4">
            <button onclick="toggleInventoryStatus('${item.id}')" class="px-2.5 py-1 rounded-full text-xs font-semibold transition ${isSold ? 'bg-purple-100 text-purple-800 hover:bg-purple-200' : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'}">
              ${isSold ? 'Sold' : 'Unsold'}
            </button>
          </td>

          <td class="py-3.5 px-4">
            ${isSold ? `
              <button onclick="toggleFulfillmentStatus('${item.id}')" class="px-2.5 py-1 rounded-full text-xs font-semibold transition ${isFulfilled ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' : 'bg-amber-100 text-amber-800 hover:bg-amber-200'}">
                ${isFulfilled ? 'Fulfilled' : 'Unfulfilled'}
              </button>
            ` : `
              <span class="text-xs text-slate-400 italic">Pending Sale</span>
            `}
          </td>

          <td class="py-3.5 px-4">
            <button onclick="toggleWorkerPaymentStatus('${item.id}')" class="px-2.5 py-1 rounded-full text-xs font-semibold transition ${isPaid ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' : 'bg-rose-100 text-rose-800 hover:bg-rose-200'}">
              ${isPaid ? 'Paid' : 'Unpaid'}
            </button>
          </td>

          <td class="py-3.5 px-4 text-right whitespace-nowrap">
            <div class="flex items-center justify-end gap-1">
              <button onclick="editOrder('${item.id}')" title="Edit" class="text-slate-400 hover:text-slate-700 p-1 rounded hover:bg-slate-100 transition">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
              </button>
              <button onclick="deleteOrder('${item.id}')" title="Delete" class="text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-rose-50 transition">
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
    </div>`;

    container.innerHTML = html;
  }

  // Batch action handler
  window.toggleSelectAll = function(checked) {
    const list = getFilteredOrders();
    if (checked) {
      list.forEach(o => state.selectedIds.add(o.id));
    } else {
      state.selectedIds.clear();
    }
    render();
  };

  window.toggleSelectOne = function(id, checked) {
    if (checked) state.selectedIds.add(id);
    else state.selectedIds.delete(id);
    render();
  };

  window.batchAction = async function(action) {
    if (state.selectedIds.size === 0) return;
    const ids = Array.from(state.selectedIds);
    const now = new Date().toISOString();

    if (action === 'delete') {
      if (!confirm(`Delete ${ids.length} selected orders?`)) return;
      state.orders = state.orders.filter(o => !state.selectedIds.has(o.id));
    } else {
      state.orders.forEach(o => {
        if (state.selectedIds.has(o.id)) {
          if (action === 'markSold') {
            o.inventoryStatus = 'sold';
            if (!o.soldAt) o.soldAt = now;
          } else if (action === 'markUnsold') {
            o.inventoryStatus = 'unsold';
            o.soldAt = null;
            o.fulfillmentStatus = 'unfulfilled';
          } else if (action === 'markFulfilled') {
            o.fulfillmentStatus = 'fulfilled';
            o.fulfilledAt = now;
          } else if (action === 'markPaid') {
            o.workerPaymentStatus = 'paid';
            o.paidAt = now;
          }
        }
      });
    }

    state.selectedIds.clear();
    saveToLocalStorage();
    render();
    showToast(`Updated ${ids.length} orders`, 'success');

    if (state.isApiOnline) {
      try {
        await fetch(`${API_BASE}/orders/batch`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ids, action })
        });
      } catch (e) {
        console.error('API batch error', e);
      }
    }
  };

  // Add / Edit Order Modal
  window.openAddModal = function() {
    document.getElementById('modal-title').textContent = 'Add New Worker Submission';
    document.getElementById('order-form').reset();
    document.getElementById('edit-order-id').value = '';
    document.getElementById('order-modal').classList.remove('hidden');
    document.getElementById('input-worker-name').focus();
  };

  window.closeModal = function() {
    document.getElementById('order-modal').classList.add('hidden');
  };

  window.editOrder = function(id) {
    const item = state.orders.find(o => o.id === id);
    if (!item) return;

    document.getElementById('modal-title').textContent = 'Edit Submission Details';
    document.getElementById('edit-order-id').value = item.id;
    document.getElementById('input-worker-name').value = item.workerName || '';
    document.getElementById('input-worker-key').value = item.workerKey || '';
    document.getElementById('input-order-id').value = item.orderId || '';
    document.getElementById('input-order-number').value = item.orderNumber || '';
    document.getElementById('input-unique-id').value = item.uniqueId || '';
    document.getElementById('input-payout').value = item.payoutAmount || 15;
    document.getElementById('input-inventory-status').value = item.inventoryStatus || 'unsold';
    document.getElementById('input-fulfillment-status').value = item.fulfillmentStatus || 'unfulfilled';
    document.getElementById('input-worker-status').value = item.workerPaymentStatus || 'unpaid';
    document.getElementById('input-notes').value = item.notes || '';

    document.getElementById('order-modal').classList.remove('hidden');
    document.getElementById('input-worker-name').focus();
  };

  window.handleFormSubmit = async function(e, addAnother = false) {
    if (e) e.preventDefault();

    const editId = document.getElementById('edit-order-id').value;
    const workerName = document.getElementById('input-worker-name').value.trim();
    const workerKey = document.getElementById('input-worker-key').value.trim();
    const orderId = document.getElementById('input-order-id').value.trim();
    const orderNumber = document.getElementById('input-order-number').value.trim();
    const uniqueId = document.getElementById('input-unique-id').value.trim();
    const payoutAmount = parseFloat(document.getElementById('input-payout').value) || 15.0;
    const inventoryStatus = document.getElementById('input-inventory-status').value;
    const fulfillmentStatus = document.getElementById('input-fulfillment-status').value;
    const workerPaymentStatus = document.getElementById('input-worker-status').value;
    const notes = document.getElementById('input-notes').value.trim();

    if (!workerName || !orderId || !orderNumber || !uniqueId) {
      showToast('Please fill in Worker Name, Order ID, Order Number, and Unique ID', 'warning');
      return;
    }

    const orderPayload = {
      workerName,
      workerKey,
      orderId,
      orderNumber,
      uniqueId,
      payoutAmount,
      inventoryStatus,
      fulfillmentStatus,
      workerPaymentStatus,
      notes
    };

    if (editId) {
      const existing = state.orders.find(o => o.id === editId);
      if (existing) {
        Object.assign(existing, orderPayload);
        showToast(`Order ${orderId} updated successfully`, 'success');
      }
      if (state.isApiOnline) {
        try {
          await fetch(`${API_BASE}/orders/${editId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderPayload)
          });
        } catch (err) {
          console.error('API update error', err);
        }
      }
    } else {
      const newOrder = {
        id: `ord-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        ...orderPayload,
        createdAt: new Date().toISOString(),
        soldAt: inventoryStatus === 'sold' ? new Date().toISOString() : null,
        fulfilledAt: fulfillmentStatus === 'fulfilled' ? new Date().toISOString() : null,
        paidAt: workerPaymentStatus === 'paid' ? new Date().toISOString() : null
      };
      state.orders.unshift(newOrder);
      showToast(`Added Order ${orderId} by ${workerName}`, 'success');

      if (state.isApiOnline) {
        try {
          await fetch(`${API_BASE}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newOrder)
          });
        } catch (err) {
          console.error('API create error', err);
        }
      }
    }

    saveToLocalStorage();
    render();

    if (addAnother) {
      document.getElementById('input-order-id').value = '';
      document.getElementById('input-order-number').value = '';
      document.getElementById('input-unique-id').value = '';
      document.getElementById('input-notes').value = '';
      document.getElementById('input-order-id').focus();
    } else {
      closeModal();
    }
  };

  // Telegram Bot Config Modal
  window.openBotConfigModal = function() {
    document.getElementById('input-bot-token').value = state.settings.botToken || '';
    const feedback = document.getElementById('bot-config-feedback');
    if (state.botStatus && state.botStatus.isPolling) {
      feedback.className = 'text-xs text-emerald-600 font-medium mt-1';
      feedback.textContent = `🟢 Connected as @${state.botStatus.botUsername}`;
    } else if (state.botStatus && state.botStatus.lastError) {
      feedback.className = 'text-xs text-rose-600 font-medium mt-1';
      feedback.textContent = `⚠️ Error: ${state.botStatus.lastError}`;
    } else {
      feedback.className = 'text-xs text-slate-500 mt-1';
      feedback.textContent = 'Paste your token from @BotFather above.';
    }
    document.getElementById('bot-config-modal').classList.remove('hidden');
  };

  window.closeBotConfigModal = function() {
    document.getElementById('bot-config-modal').classList.add('hidden');
  };

  window.saveBotToken = async function() {
    const token = document.getElementById('input-bot-token').value.trim();
    state.settings.botToken = token;

    if (state.isApiOnline) {
      try {
        const res = await fetch(`${API_BASE}/bot/config`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ botToken: token })
        });
        const result = await res.json();
        if (result.success) {
          state.botStatus = result.botStatus;
          showToast(result.message || 'Bot connected successfully!', 'success');
          closeBotConfigModal();
          updateBotStatusPill();
          render();
          return;
        } else {
          showToast(`Bot error: ${result.message || 'Failed to connect'}`, 'danger');
          return;
        }
      } catch (e) {
        showToast('Could not reach backend server to connect bot', 'danger');
      }
    } else {
      saveToLocalStorage();
      showToast('Bot token saved locally. Start server to begin polling.', 'warning');
      closeBotConfigModal();
    }
  };

  // Worker Keys Modal
  window.openAddWorkerModal = function() {
    document.getElementById('edit-worker-id').value = '';
    document.getElementById('input-new-worker-name').value = '';
    document.getElementById('input-new-worker-key').value = '';
    document.getElementById('input-new-worker-rate').value = state.settings.defaultRate || '15.00';
    document.getElementById('worker-modal').classList.remove('hidden');
    document.getElementById('input-new-worker-name').focus();
  };

  window.closeWorkerModal = function() {
    document.getElementById('worker-modal').classList.add('hidden');
  };

  window.autoGenerateKey = function(name) {
    const keyInput = document.getElementById('input-new-worker-key');
    if (!keyInput.value || keyInput.dataset.autogen === 'true') {
      const cleanName = (name || 'USER').replace(/[^a-zA-Z0-9]/g, '').slice(0, 5).toUpperCase();
      keyInput.value = `KEY-${cleanName || 'USER'}-${Math.floor(1000 + Math.random() * 9000)}`;
      keyInput.dataset.autogen = 'true';
    }
  };

  window.regenerateRandomKey = function() {
    const name = document.getElementById('input-new-worker-name').value;
    const cleanName = (name || 'USER').replace(/[^a-zA-Z0-9]/g, '').slice(0, 5).toUpperCase();
    document.getElementById('input-new-worker-key').value = `KEY-${cleanName || 'USER'}-${Math.floor(1000 + Math.random() * 9000)}`;
  };

  window.editWorkerKey = function(workerId) {
    const worker = state.workers.find(w => w.id === workerId);
    if (!worker) return;

    document.getElementById('edit-worker-id').value = worker.id;
    document.getElementById('input-new-worker-name').value = worker.name || '';
    document.getElementById('input-new-worker-key').value = worker.key || '';
    document.getElementById('input-new-worker-rate').value = worker.rate || 15.00;
    document.getElementById('input-new-worker-success-rate').value = (worker.customSuccessRate !== null && worker.customSuccessRate !== undefined) ? worker.customSuccessRate : '';

    document.getElementById('worker-modal').classList.remove('hidden');
  };

  window.saveWorkerKey = async function() {
    const editId = document.getElementById('edit-worker-id').value;
    const name = document.getElementById('input-new-worker-name').value.trim();
    const key = document.getElementById('input-new-worker-key').value.trim();
    const rate = parseFloat(document.getElementById('input-new-worker-rate').value) || 15.00;
    const rawSuccessRate = document.getElementById('input-new-worker-success-rate').value.trim();
    const customSuccessRate = rawSuccessRate !== '' ? Math.min(100, Math.max(0, parseFloat(rawSuccessRate))) : null;

    if (!name || !key) {
      showToast('Worker Name and Key are required', 'warning');
      return;
    }

    if (editId) {
      const worker = state.workers.find(w => w.id === editId);
      if (worker) {
        worker.name = name;
        worker.key = key;
        worker.rate = rate;
        worker.customSuccessRate = customSuccessRate;
      }
      if (state.isApiOnline) {
        try {
          await fetch(`${API_BASE}/workers/${editId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, key, rate, customSuccessRate })
          });
        } catch (e) { console.error('API worker update error', e); }
      }
      showToast(`Updated Worker Key for ${name}`, 'success');
    } else {
      const newWorker = {
        id: `w-${Date.now()}`,
        name,
        key,
        rate,
        customSuccessRate,
        telegramId: null,
        telegramUsername: null,
        linkedAt: null,
        status: 'active'
      };
      state.workers.push(newWorker);
      if (state.isApiOnline) {
        try {
          await fetch(`${API_BASE}/workers`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newWorker)
          });
        } catch (e) { console.error('API worker create error', e); }
      }
      showToast(`Generated Worker Key: ${key}`, 'success');
    }

    saveToLocalStorage();
    render();
    closeWorkerModal();
  };

  // Quick Decide Success Rate Modal Handlers
  window.openDecideRateModal = function(workerId) {
    const worker = state.workers.find(w => w.id === workerId);
    if (!worker) return;
    document.getElementById('decide-rate-worker-id').value = worker.id;
    document.getElementById('decide-rate-worker-name').textContent = `${worker.name} (${worker.key})`;
    const currentRate = (worker.customSuccessRate !== null && worker.customSuccessRate !== undefined) ? worker.customSuccessRate : '';
    document.getElementById('decide-rate-input').value = currentRate;
    document.getElementById('decide-rate-modal').classList.remove('hidden');
    document.getElementById('decide-rate-input').focus();
  };

  window.closeDecideRateModal = function() {
    document.getElementById('decide-rate-modal').classList.add('hidden');
  };

  window.setQuickRate = function(val) {
    document.getElementById('decide-rate-input').value = (val !== null && val !== undefined) ? val : '';
  };

  window.saveDecidedRate = async function() {
    const workerId = document.getElementById('decide-rate-worker-id').value;
    const worker = state.workers.find(w => w.id === workerId);
    if (!worker) return;

    const rawVal = document.getElementById('decide-rate-input').value.trim();
    const rateVal = rawVal !== '' ? Math.min(100, Math.max(0, parseFloat(rawVal))) : null;

    worker.customSuccessRate = rateVal;
    saveToLocalStorage();
    render();
    closeDecideRateModal();

    const label = rateVal !== null ? `${rateVal}%` : 'Auto Calculated';
    showToast(`Assigned Success Rate of ${label} to ${worker.name}!`, 'success');

    if (state.isApiOnline) {
      try {
        await fetch(`${API_BASE}/workers/${worker.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ customSuccessRate: rateVal })
        });
      } catch (e) {
        console.error('API rate update error', e);
      }
    }
  };

  window.deleteWorkerKey = async function(workerId) {
    const worker = state.workers.find(w => w.id === workerId);
    if (!worker) return;
    if (confirm(`Delete Worker Key for ${worker.name} (${worker.key})?`)) {
      state.workers = state.workers.filter(w => w.id !== workerId);
      saveToLocalStorage();
      render();
      showToast(`Worker key deleted`, 'info');

      if (state.isApiOnline) {
        try {
          await fetch(`${API_BASE}/workers/${workerId}`, { method: 'DELETE' });
        } catch (e) { console.error('API delete error', e); }
      }
    }
  };

  // Bulk Import Modal
  window.openBulkModal = function() {
    document.getElementById('bulk-modal').classList.remove('hidden');
    document.getElementById('bulk-textarea').value = '';
    document.getElementById('bulk-preview').innerHTML = '<span class="text-slate-400">Preview will appear here once you paste data.</span>';
  };

  window.closeBulkModal = function() {
    document.getElementById('bulk-modal').classList.add('hidden');
  };

  window.parseBulkText = function() {
    const raw = document.getElementById('bulk-textarea').value.trim();
    if (!raw) {
      document.getElementById('bulk-preview').innerHTML = '<span class="text-slate-400">Preview will appear here once you paste data.</span>';
      return [];
    }

    const lines = raw.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    const parsed = [];

    lines.forEach(line => {
      let parts = [];
      if (line.includes('\t')) parts = line.split('\t');
      else if (line.includes('|')) parts = line.split('|');
      else parts = line.split(',');

      parts = parts.map(p => p.trim());

      if (parts.length >= 4) {
        parsed.push({
          workerName: parts[0],
          orderId: parts[1],
          orderNumber: parts[2],
          uniqueId: parts[3],
          payoutAmount: parts[4] ? parseFloat(parts[4]) || 15.00 : 15.00,
          inventoryStatus: 'unsold',
          fulfillmentStatus: 'unfulfilled',
          workerPaymentStatus: 'unpaid',
          notes: parts[5] || 'Bulk import'
        });
      }
    });

    const previewContainer = document.getElementById('bulk-preview');
    if (parsed.length === 0) {
      previewContainer.innerHTML = `<span class="text-rose-600 font-medium">Could not parse valid rows. Format each line as: Worker Name, Order ID, Order Number, Unique ID</span>`;
    } else {
      previewContainer.innerHTML = `
        <div class="text-xs font-semibold text-emerald-700 mb-2">Detected ${parsed.length} valid record(s):</div>
        <div class="max-h-40 overflow-y-auto space-y-1 text-xs font-mono text-slate-700">
          ${parsed.map((p, i) => `
            <div class="p-1 bg-slate-50 border border-slate-200 rounded flex justify-between">
              <span><strong>${i+1}.</strong> ${escapeHtml(p.workerName)} | ${escapeHtml(p.orderId)} | ${escapeHtml(p.orderNumber)} | ${escapeHtml(p.uniqueId)}</span>
              <span class="text-slate-400">$${p.payoutAmount.toFixed(2)}</span>
            </div>
          `).join('')}
        </div>
      `;
    }

    return parsed;
  };

  window.importBulkData = async function() {
    const parsed = parseBulkText();
    if (parsed.length === 0) {
      showToast('No valid rows to import.', 'warning');
      return;
    }

    const now = new Date().toISOString();
    for (const item of parsed) {
      const newOrder = {
        id: `ord-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
        ...item,
        createdAt: now,
        soldAt: null,
        fulfilledAt: null,
        paidAt: null
      };
      state.orders.unshift(newOrder);

      if (state.isApiOnline) {
        try {
          await fetch(`${API_BASE}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newOrder)
          });
        } catch (e) {}
      }
    }

    saveToLocalStorage();
    render();
    closeBulkModal();
    showToast(`Successfully imported ${parsed.length} orders!`, 'success');
  };

  // Export to CSV
  window.exportCSV = function() {
    if (state.orders.length === 0) {
      showToast('No orders to export', 'warning');
      return;
    }

    const headers = ['ID', 'Worker Name', 'Worker Key', 'Telegram', 'Order ID', 'Order Number', 'Unique ID', 'Inventory Status', 'Fulfillment Status', 'Worker Payment Status', 'Payout Amount', 'Notes', 'Created At'];
    
    const rows = state.orders.map(o => [
      o.id,
      `"${(o.workerName || '').replace(/"/g, '""')}"`,
      `"${(o.workerKey || '').replace(/"/g, '""')}"`,
      `"${(o.telegramUsername || '').replace(/"/g, '""')}"`,
      `"${(o.orderId || '').replace(/"/g, '""')}"`,
      `"${(o.orderNumber || '').replace(/"/g, '""')}"`,
      `"${(o.uniqueId || '').replace(/"/g, '""')}"`,
      o.inventoryStatus,
      o.fulfillmentStatus,
      o.workerPaymentStatus,
      o.payoutAmount || 15,
      `"${(o.notes || '').replace(/"/g, '""')}"`,
      o.createdAt || ''
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `order_inventory_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported CSV successfully', 'success');
  };

  // Export & Import JSON Backup
  window.exportJSON = function() {
    const backupData = {
      orders: state.orders,
      workers: state.workers,
      settings: state.settings
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `orderflow_database_backup_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Database backup exported', 'success');
  };

  // Masi Boss Extractor Modal Handlers
  let lastExtractedMasiData = null;

  window.openMasiModal = function() {
    document.getElementById('masi-modal').classList.remove('hidden');
    document.getElementById('input-masi-key').focus();
  };

  window.closeMasiModal = function() {
    document.getElementById('masi-modal').classList.add('hidden');
  };

  window.extractMasiPreview = async function() {
    const keyInput = document.getElementById('input-masi-key');
    const bossKey = (keyInput ? keyInput.value : '').trim();
    const btnFetch = document.getElementById('btn-masi-fetch');
    const previewBox = document.getElementById('masi-extract-preview');
    const btnSync = document.getElementById('btn-masi-sync');

    if (!bossKey) {
      showToast('Please enter your Masi Boss Key', 'warning');
      return;
    }

    btnFetch.disabled = true;
    btnFetch.textContent = 'Extracting...';
    previewBox.innerHTML = '<div class="flex items-center gap-2 text-indigo-600 font-semibold"><span>⏳ Connecting to https://masi.cc.cd/boss and extracting workers...</span></div>';

    try {
      const res = await fetch(`${API_BASE}/masi/extract`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bossKey })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to extract data');
      }

      lastExtractedMasiData = data;
      btnSync.disabled = false;

      const workers = data.workers || [];
      showToast(`Successfully extracted ${workers.length} workers from Masi Boss!`, 'success');

      previewBox.innerHTML = `
        <div class="space-y-3">
          <div class="flex items-center justify-between pb-2 border-b border-slate-200">
            <span class="font-bold text-slate-800 text-sm">✅ Extracted ${workers.length} Worker Profiles</span>
            <span class="text-indigo-600 font-bold">${data.ordersCount || 0} Orders in History</span>
          </div>
          <div class="max-h-60 overflow-y-auto space-y-2 pr-1">
            ${workers.map((w, idx) => `
              <div class="p-2.5 rounded-lg bg-white border border-slate-200 shadow-2xs text-xs flex items-center justify-between gap-3">
                <div class="min-w-0">
                  <div class="font-bold text-slate-900 flex items-center gap-1.5">
                    <span>${idx + 1}. ${escapeHtml(w.name)}</span>
                    <span class="text-[10px] px-1.5 py-0.2 rounded font-mono ${w.active ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}">${w.active ? 'Active' : 'Inactive'}</span>
                  </div>
                  <div class="font-mono text-[11px] text-indigo-700 font-semibold truncate mt-0.5">${escapeHtml(w.key)}</div>
                </div>
                <div class="text-right whitespace-nowrap">
                  <div class="font-bold text-slate-800">Completed: <strong class="text-emerald-700 font-mono">${w.completedCount}</strong></div>
                  <div class="text-[11px] font-bold text-indigo-600">Success Rate: <strong class="font-mono">${Number(w.successRate).toFixed(1)}%</strong></div>
                </div>
              </div>
            `).join('')}
          </div>
          <p class="text-[11px] text-slate-500 pt-1">
            Click <strong>"Sync & Import to Dashboard"</strong> below to add these keys and assign their exact success rates to your system!
          </p>
        </div>
      `;
    } catch (err) {
      previewBox.innerHTML = `
        <div class="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700">
          <strong>❌ Extraction Error:</strong> ${escapeHtml(err.message)}
          <div class="text-[11px] text-rose-600 mt-1">Please verify that your Boss Key is correct and that your account has boss permissions on masi.cc.cd.</div>
        </div>
      `;
      btnSync.disabled = true;
      showToast(err.message, 'danger');
    } finally {
      btnFetch.disabled = false;
      btnFetch.textContent = 'Extract Data';
    }
  };

  window.syncMasiToDashboard = async function() {
    const keyInput = document.getElementById('input-masi-key');
    const bossKey = (keyInput ? keyInput.value : '').trim();
    const btnSync = document.getElementById('btn-masi-sync');

    if (!bossKey) return;

    btnSync.disabled = true;
    btnSync.textContent = 'Syncing...';

    try {
      const res = await fetch(`${API_BASE}/masi/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bossKey, defaultRate: state.settings.defaultRate || 15.00 })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Sync failed');
      }

      await fetchServerState();
      closeMasiModal();
      switchTab('keys');
      showToast(`Imported ${data.importedWorkers} new workers & updated ${data.updatedWorkers} existing workers with live success rates!`, 'success');
    } catch (err) {
      showToast(`Sync error: ${err.message}`, 'danger');
    } finally {
      btnSync.disabled = false;
      btnSync.textContent = 'Sync & Import to Dashboard';
    }
  };

  // Team & Guy Multi-Key Management Handlers
  window.switchKeysViewMode = function(mode) {
    state.keysViewMode = mode;
    renderCurrentPanelQuietly();
  };

  window.openTeamAssignModal = function() {
    document.getElementById('team-assign-modal').classList.remove('hidden');
    switchTeamAssignTab(state.teamAssignTab || 'paste');
    parseTeamAssignText();
  };

  window.closeTeamAssignModal = function() {
    document.getElementById('team-assign-modal').classList.add('hidden');
  };

  window.switchTeamAssignTab = function(tab) {
    state.teamAssignTab = tab;
    const btnPaste = document.getElementById('btn-tab-assign-paste');
    const btnSearch = document.getElementById('btn-tab-assign-search');
    const panelPaste = document.getElementById('panel-assign-paste');
    const panelSearch = document.getElementById('panel-assign-search');

    if (tab === 'paste') {
      btnPaste.className = 'px-4 py-2 text-xs font-bold border-b-2 border-indigo-600 text-indigo-700 transition';
      btnSearch.className = 'px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition';
      panelPaste.classList.remove('hidden');
      panelSearch.classList.add('hidden');
      document.getElementById('team-assign-textarea').focus();
    } else {
      btnSearch.className = 'px-4 py-2 text-xs font-bold border-b-2 border-indigo-600 text-indigo-700 transition';
      btnPaste.className = 'px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition';
      panelSearch.classList.remove('hidden');
      panelPaste.classList.add('hidden');
      renderTeamAssignTable();
    }
  };

  window.parseTeamAssignText = function() {
    const textarea = document.getElementById('team-assign-textarea');
    const preview = document.getElementById('team-assign-preview');
    const text = textarea ? textarea.value.trim() : '';

    if (!text) {
      preview.innerHTML = '<span class="text-slate-400">Preview will appear here as you type or paste...</span>';
      return;
    }

    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    const mappings = [];

    lines.forEach(line => {
      // Format: KEY @telegram [Guy Name] or KEY, @telegram, [Name]
      const parts = line.split(/[\s,\t]+/).filter(Boolean);
      if (parts.length >= 2) {
        const key = parts[0].trim();
        let tg = parts[1].trim();
        if (tg && !tg.startsWith('@')) tg = '@' + tg;
        const name = parts.slice(2).join(' ') || '';
        mappings.push({ key, telegramUsername: tg, personName: name });
      }
    });

    if (mappings.length === 0) {
      preview.innerHTML = '<div class="text-rose-600">No valid lines detected yet. Use: <code>WORKER-XXXX @username [Name]</code></div>';
      return;
    }

    preview.innerHTML = `
      <div class="space-y-2">
        <div class="font-bold text-slate-800 flex items-center justify-between">
          <span>Detected ${mappings.length} Key Assignments:</span>
          <span class="text-xs text-indigo-600 font-semibold">${new Set(mappings.map(m => m.telegramUsername)).size} Unique Guys</span>
        </div>
        <table class="w-full text-left text-xs border-collapse">
          <thead>
            <tr class="border-b border-slate-200 text-slate-500 font-semibold">
              <th class="py-1">Key</th>
              <th class="py-1">Assigned Telegram</th>
              <th class="py-1">Guy Name</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            ${mappings.map(m => `
              <tr>
                <td class="py-1 font-mono font-bold text-indigo-700">${escapeHtml(m.key)}</td>
                <td class="py-1 font-mono text-sky-700">${escapeHtml(m.telegramUsername)}</td>
                <td class="py-1 text-slate-700">${escapeHtml(m.personName || '—')}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  };

  window.renderTeamAssignTable = function() {
    const tbody = document.getElementById('team-assign-table-body');
    const filterInput = document.getElementById('team-assign-filter');
    const q = (filterInput ? filterInput.value : '').toLowerCase().trim();

    const filtered = state.workers.filter(w => 
      !q ||
      w.name.toLowerCase().includes(q) ||
      w.key.toLowerCase().includes(q) ||
      (w.telegramUsername && w.telegramUsername.toLowerCase().includes(q)) ||
      (w.personName && w.personName.toLowerCase().includes(q))
    );

    tbody.innerHTML = filtered.slice(0, 100).map(w => `
      <tr class="hover:bg-slate-50">
        <td class="p-2">
          <div class="font-bold text-slate-800">${escapeHtml(w.name)}</div>
          <div class="font-mono text-[11px] text-indigo-600">${escapeHtml(w.key)}</div>
        </td>
        <td class="p-2">
          <input type="text" data-key="${escapeHtml(w.key)}" class="input-tg font-mono text-xs w-full px-2 py-1 border border-slate-300 rounded focus:ring-1 focus:ring-indigo-500" placeholder="@username" value="${escapeHtml(w.telegramUsername || '')}">
        </td>
        <td class="p-2">
          <input type="text" data-key="${escapeHtml(w.key)}" class="input-name text-xs w-full px-2 py-1 border border-slate-300 rounded focus:ring-1 focus:ring-indigo-500" placeholder="Guy Name" value="${escapeHtml(w.personName || '')}">
        </td>
      </tr>
    `).join('');
  };

  window.saveTeamAssignments = async function() {
    const btnSave = document.getElementById('btn-save-team-assign');
    btnSave.disabled = true;
    btnSave.textContent = 'Saving...';

    const mappings = [];

    if (state.teamAssignTab === 'paste') {
      const textarea = document.getElementById('team-assign-textarea');
      const text = textarea ? textarea.value.trim() : '';
      const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

      lines.forEach(line => {
        const parts = line.split(/[\s,\t]+/).filter(Boolean);
        if (parts.length >= 2) {
          const key = parts[0].trim();
          let tg = parts[1].trim();
          if (tg && !tg.startsWith('@')) tg = '@' + tg;
          const name = parts.slice(2).join(' ') || '';
          mappings.push({ key, telegramUsername: tg, personName: name });
        }
      });
    } else {
      // Read from table inputs
      const tgInputs = document.querySelectorAll('#team-assign-table-body .input-tg');
      const nameInputs = document.querySelectorAll('#team-assign-table-body .input-name');

      tgInputs.forEach((tgInp, idx) => {
        const key = tgInp.getAttribute('data-key');
        const tg = tgInp.value.trim();
        const name = nameInputs[idx] ? nameInputs[idx].value.trim() : '';
        if (key && (tg || name)) {
          mappings.push({ key, telegramUsername: tg, personName: name });
        }
      });
    }

    if (mappings.length === 0) {
      showToast('Please enter at least one key assignment', 'warning');
      btnSave.disabled = false;
      btnSave.textContent = 'Save & Group Keys';
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/workers/batch-assign-telegram`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mappings })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to save assignments');
      }

      await fetchServerState();
      closeTeamAssignModal();
      switchTab('keys');
      showToast(`Updated ${data.updated} keys! Keys belonging to the same guy are now grouped together!`, 'success');
    } catch (err) {
      showToast(`Error: ${err.message}`, 'danger');
    } finally {
      btnSave.disabled = false;
      btnSave.textContent = 'Save & Group Keys';
    }
  };

  window.promptEditGuyTelegram = async function(key, currentTg) {
    const newTg = prompt(`Assign Telegram username for key ${key} (e.g. @username):`, currentTg || '');
    if (newTg === null) return;
    const personName = prompt(`Enter Guy / Person Name (e.g. Rahul):`, '') || '';

    try {
      const res = await fetch(`${API_BASE}/workers/assign-telegram`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, telegramUsername: newTg.trim(), personName: personName.trim() })
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to update');
      await fetchServerState();
      showToast(`Assigned key ${key} to ${newTg.trim() || 'worker'}`, 'success');
    } catch (e) {
      showToast(e.message, 'danger');
    }
  };

  window.clearSearch = function() {
    state.searchQuery = '';
    const searchInput = document.getElementById('global-search');
    if (searchInput) searchInput.value = '';
    render();
  };

  function setupEventListeners() {
    const searchInput = document.getElementById('global-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        state.searchQuery = e.target.value;
        render();
      });
    }

    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        const modal = document.getElementById('order-modal');
        if (modal && !modal.classList.contains('hidden')) {
          handleFormSubmit(e, false);
        }
      }
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
