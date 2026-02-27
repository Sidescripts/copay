// manipulation.js

document.addEventListener('DOMContentLoaded', () => {
    // ────────────────────────────────────────────────
    // State
    // ────────────────────────────────────────────────
    let currentTab     = 'add';
    let selectedAsset  = 'USDT';
    let actionLog      = [];

    // ────────────────────────────────────────────────
    // DOM cache (safer than querying every time)
    // ────────────────────────────────────────────────
    const els = {
        username:   document.getElementById('username'),
        amount:     document.getElementById('amount'),
        submitBtn:  document.getElementById('submitBtn'),
        btnText:    document.getElementById('btnText'),
        card:       document.getElementById('card'),
        logList:    document.getElementById('logList'),
        logEmpty:   document.getElementById('logEmpty'),
        toast:      document.getElementById('toast'),
        toastMsg:   document.getElementById('toastMsg')
    };

    // Early exit if critical elements are missing
    if (!els.submitBtn || !els.card || !els.username || !els.amount) {
        console.error("Required DOM elements not found");
        return;
    }

    // ────────────────────────────────────────────────
    // Tab switching (called from onclick="switchTab(...)")
    // ────────────────────────────────────────────────
    function switchTab(tab) {
        currentTab = tab;

        const addTab = document.querySelector('.tab-btn.add');
        const subTab = document.querySelector('.tab-btn.sub');

        if (tab === 'add') {
            addTab?.classList.add('active');
            subTab?.classList.remove('active');
            els.card.className = 'card add-mode';
            els.submitBtn.className = 'btn btn-add';
            els.btnText.textContent = 'ADD BALANCE';
        } else {
            subTab?.classList.add('active');
            addTab?.classList.remove('active');
            els.card.className = 'card sub-mode';
            els.submitBtn.className = 'btn btn-sub';
            els.btnText.textContent = 'SUBTRACT BALANCE';
        }
    }

    // ────────────────────────────────────────────────
    // Asset selection (called from onclick="selectAsset(this)")
    // ────────────────────────────────────────────────
    function selectAsset(element) {
        document.querySelectorAll('.asset-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        element.classList.add('selected');
        selectedAsset = element.dataset.asset || 'USDT';
    }

    // ────────────────────────────────────────────────
    // Toast
    // ────────────────────────────────────────────────
    let toastTimer;
    function showToast(message, type = 'success') {
        if (!els.toast || !els.toastMsg) return;

        els.toast.className = `toast ${type}`;
        els.toastMsg.textContent = message;
        els.toast.classList.add('show');

        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => {
            els.toast.classList.remove('show');
        }, 3800);
    }

    // ────────────────────────────────────────────────
    // Logging
    // ────────────────────────────────────────────────
    function addToLog(username, asset, amount, type) {
        actionLog.unshift({ username, asset, amount, type, time: new Date() });
        renderLog();
    }

    function renderLog() {
        if (!els.logList || !els.logEmpty) return;

        if (actionLog.length === 0) {
            els.logEmpty.style.display = 'block';
            els.logList.innerHTML = '';
            return;
        }

        els.logEmpty.style.display = 'none';
        els.logList.innerHTML = '';

        actionLog.forEach(entry => {
            const sign = entry.type === 'add' ? '+' : '−';
            const cls  = entry.type === 'add' ? 'add' : 'sub';
            const timeStr = entry.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            const item = document.createElement('div');
            item.className = 'log-item';
            item.innerHTML = `
                <div class="log-left">
                    <span class="log-user">@${entry.username}</span>
                    <span class="log-time">${timeStr}</span>
                </div>
                <div class="log-right">
                    <span class="log-asset">${entry.asset}</span>
                    <span class="log-amount ${cls}">${sign}${entry.amount}</span>
                </div>
            `;
            els.logList.appendChild(item);
        });
    }

    window.clearLog = function () {
        if (confirm('Clear the action log?')) {
            actionLog = [];
            renderLog();
            showToast('Log cleared', 'success');
        }
    };

    // ────────────────────────────────────────────────
    // Submit with confirmation
    // ────────────────────────────────────────────────
    async function handleSubmit() {
        const usernameVal = (els.username?.value || '').trim();
        const amountVal   = (els.amount?.value || '').trim();

        if (!usernameVal) return showToast('Username is required', 'error');
        if (!amountVal || Number(amountVal) <= 0) {
            return showToast('Enter a valid positive amount', 'error');
        }

        const amount   = Number(amountVal);
        const isAdd    = currentTab === 'add';
        const verb     = isAdd ? 'ADD' : 'SUBTRACT';
        const endpoint = isAdd ? '/api/v1/admin/add-balance' : '/api/v1/admin/subtract-balance';

        const confirmed = confirm(
            `${verb} ${amount} ${selectedAsset} ` +
            `${isAdd ? 'to' : 'from'} @${usernameVal}?\n\n` +
            "This cannot be undone."
        );

        if (!confirmed) {
            showToast('Cancelled', 'error');
            return;
        }

        els.submitBtn.classList.add('loading');
        els.submitBtn.disabled = true;

        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('No token found – please log in');

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    username: usernameVal,
                    amount,
                    asset: selectedAsset.toLowerCase()
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || `Server error (${response.status})`);
            }

            showToast(`${verb} successful!`, 'success');
            addToLog(usernameVal, selectedAsset, amount, isAdd ? 'add' : 'sub');
            els.amount.value = '';

        } catch (err) {
            console.error(err);
            showToast(err.message || 'Failed to update balance', 'error');
        } finally {
            els.submitBtn.classList.remove('loading');
            els.submitBtn.disabled = false;
        }
    }

    // ────────────────────────────────────────────────
    // Expose functions to window (for onclick="")
    // ────────────────────────────────────────────────
    window.switchTab   = switchTab;
    window.selectAsset = selectAsset;
    window.handleSubmit = handleSubmit;

    // Enter key support
    document.addEventListener('keydown', e => {
        if (e.key === 'Enter' && document.activeElement !== document.body) {
            e.preventDefault();
            handleSubmit();
        }
    });

    // Initial render
    renderLog();
});