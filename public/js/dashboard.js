// Function to fetch dashboard data
async function fetchDashboardData() {
    // Check authentication first
    if (!authUtils.isAuthenticated() || authUtils.isTokenExpired()) {
        authUtils.logout();
        throw new Error('Not authenticated or token expired');
    }
    
    try {
        const response = await fetch('/api/v1/user/dashboard', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...authUtils.authHeader()
            }
        });
        
        if (response.status === 401) {
            // Token is invalid or expired
            authUtils.logout();
            throw new Error('Session expired. Please login again.');
        }
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        throw error;
    }
}

// Function to update the UI with dashboard data
function updateDashboardUI(dashboardData) {
    // Update user info
    const user = dashboardData.user || {};
    document.getElementById('user-name').textContent = user.fullname || user.username || 'User';
    document.getElementById('user-email').textContent = user.email || 'N/A';
    document.getElementById('user-country').textContent = user.country || 'N/A';
    document.getElementById('user-joined').textContent = formatDate(user.createdAt);
    
    // Update wallet balance
    document.getElementById('wallet-balance').textContent = formatCurrency(user.walletBalance || '0');
    
    // Update crypto balances
    document.getElementById('btc-balance').textContent = formatCrypto(user.btcBal || '0', 'BTC');
    document.getElementById('eth-balance').textContent = formatCrypto(user.ethBal || '0', 'ETH');
    document.getElementById('ltc-balance').textContent = formatCrypto(user.ltcBal || '0', 'LTC');
    document.getElementById('usdt-balance').textContent = formatCrypto(user.usdtBal || '0', 'USDT');
    document.getElementById('bch-balance').textContent = formatCrypto(user.bchBal || '0', 'BCH');
    document.getElementById('dash-balance').textContent = formatCrypto(user.dashBal || '0', 'DASH');
    document.getElementById('bnb-balance').textContent = formatCrypto(user.bnbBal || '0', 'BNB');
    document.getElementById('doge-balance').textContent = formatCrypto(user.dogeBal || '0', 'DOGE');
    
    // Update financial overview
    document.getElementById('total-revenue').textContent = formatCurrency(user.totalRevenue || '0');
    document.getElementById('total-withdrawal').textContent = formatCurrency(user.totalWithdrawal || '0');
    
    // Update verification status
    const verificationBadge = document.getElementById('verification-status');
    if (user.isVerified) {
        verificationBadge.textContent = 'Verified';
        verificationBadge.className = 'status-badge verified';
    } else {
        verificationBadge.textContent = 'Not Verified';
        verificationBadge.className = 'status-badge not-verified';
    }
    
    // If there are additional dashboard data (like recent transactions, etc.)
    if (dashboardData.recentTransactions) {
        updateRecentTransactions(dashboardData.recentTransactions);
    }
    
    if (dashboardData.investmentStats) {
        updateInvestmentStats(dashboardData.investmentStats);
    }
}

// Helper function to format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(parseFloat(amount));
}

// Helper function to format crypto amounts
function formatCrypto(amount, symbol) {
    const numAmount = parseFloat(amount);
    if (numAmount === 0) return `0 ${symbol}`;
    
    // Determine appropriate decimal places based on amount
    let decimalPlaces = 8;
    if (numAmount >= 1) decimalPlaces = 4;
    if (numAmount >= 100) decimalPlaces = 2;
    
    return `${numAmount.toFixed(decimalPlaces)} ${symbol}`;
}

// Helper function to format date
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Function to update recent transactions (if available)
function updateRecentTransactions(transactions) {
    const transactionsContainer = document.getElementById('recent-transactions');
    if (!transactionsContainer || !transactions || transactions.length === 0) return;
    
    transactionsContainer.innerHTML = transactions.map(transaction => `
        <div class="transaction-item">
            <div class="transaction-type ${transaction.type}">${transaction.type}</div>
            <div class="transaction-amount">${formatCurrency(transaction.amount)}</div>
            <div class="transaction-date">${formatDate(transaction.createdAt)}</div>
            <div class="transaction-status ${transaction.status}">${transaction.status}</div>
        </div>
    `).join('');
}

// Function to update investment stats (if available)
function updateInvestmentStats(stats) {
    // Implementation depends on your stats structure
    if (stats && stats.totalInvested) {
        document.getElementById('total-invested').textContent = formatCurrency(stats.totalInvested);
    }
    
    if (stats && stats.activeInvestments) {
        document.getElementById('active-investments').textContent = stats.activeInvestments;
    }
    
    if (stats && stats.estimatedReturns) {
        document.getElementById('estimated-returns').textContent = formatCurrency(stats.estimatedReturns);
    }
}

// Function to show loading state
function setLoading(isLoading) {
    const loadingElement = document.getElementById('loading-spinner');
    const contentElement = document.getElementById('dashboard-content');
    
    if (loadingElement && contentElement) {
        if (isLoading) {
            loadingElement.style.display = 'block';
            contentElement.style.display = 'none';
        } else {
            loadingElement.style.display = 'none';
            contentElement.style.display = 'block';
        }
    }
}

// Function to show error message
function showError(message) {
    const errorElement = document.getElementById('error-message');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            errorElement.style.display = 'none';
        }, 5000);
    }
}

// Main function to load dashboard
async function loadDashboard() {
    // Check authentication
    if (!authUtils.isAuthenticated()) {
        window.location.href = '../pages/login.html';
        return;
    }
    
    if (authUtils.isTokenExpired()) {
        authUtils.logout();
        return;
    }
    
    // Show loading state
    setLoading(true);
    
    try {
        // Fetch dashboard data
        const dashboardData = await fetchDashboardData();
        
        // Update UI with the data
        updateDashboardUI(dashboardData);
        
        // Hide loading state
        setLoading(false);
        
    } catch (error) {
        console.error('Error loading dashboard:', error);
        showError('Failed to load dashboard data. Please try again.');
        setLoading(false);
    }
}

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Load dashboard data
    loadDashboard();
    
    // Set up logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            authUtils.logout();
        });
    }
    
    // Set up refresh button
    const refreshBtn = document.getElementById('refresh-btn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function(e) {
            e.preventDefault();
            loadDashboard();
        });
    }
});

// Optional: Auto-refresh dashboard every 60 seconds
setInterval(() => {
    if (document.visibilityState === 'visible') {
        loadDashboard();
    }
}, 60000);