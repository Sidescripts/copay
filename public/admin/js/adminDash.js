document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const logoutBtn = document.getElementById('logoutBtn');
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    
    // Stats Elements
    const totalUsersEl = document.getElementById('totalUsers');
    const activeUsersEl = document.getElementById('activeUsers');
    const verifiedUsersEl = document.getElementById('verifiedUsers');
    const totalDepositsEl = document.getElementById('totalDeposits');
    const totalWithdrawalsEl = document.getElementById('totalWithdrawals');
    const totalInvestmentsEl = document.getElementById('totalInvestments');
    
    const todayDepositsEl = document.getElementById('todayDeposits');
    const todayWithdrawalsEl = document.getElementById('todayWithdrawals');
    const todayRegistrationsEl = document.getElementById('todayRegistrations');
    const todayInvestmentsEl = document.getElementById('todayInvestments');
    
    // Pending Actions Elements
    const pendingDepositsCountEl = document.getElementById('pendingDepositsCount');
    const pendingWithdrawalsCountEl = document.getElementById('pendingWithdrawalsCount');
    const unverifiedUsersCountEl = document.getElementById('unverifiedUsersCount');
    
    const pendingDepositsListEl = document.getElementById('pendingDepositsList');
    const pendingWithdrawalsListEl = document.getElementById('pendingWithdrawalsList');
    const unverifiedUsersListEl = document.getElementById('unverifiedUsersList');
    
    // Toggle sidebar on mobile
    function toggleSidebar() {
        sidebar.classList.toggle('active');
        sidebarOverlay.classList.toggle('active');
        
        if (sidebar.classList.contains('active')) {
            menuToggle.innerHTML = '<i class="fas fa-times"></i>';
        } else {
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        }
    }
    
    menuToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleSidebar();
    });
    
    // Close sidebar when clicking outside on mobile
    sidebarOverlay.addEventListener('click', function() {
        toggleSidebar();
    });
    
    // Close sidebar when clicking on a link
    document.querySelectorAll('.sidebar-nav a').forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth < 992) {
                toggleSidebar();
            }
        });
    });
    
    // Format currency
    function formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    }
    
    // Format date
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }
    
    // Fetch dashboard stats
    async function fetchDashboardStats() {
        try {
            // In a real application, you would fetch from your API
            // const response = await fetch('/api/admin/dashboard/stats', {
            //     headers: {
            //         'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            //     }
            // });
            // const data = await response.json();
            
            // Simulated API response based on the controller structure
            const data = {
                success: true,
                data: {
                    overview: {
                        totalUsers: 1542,
                        activeUsers: 1248,
                        verifiedUsers: 1125,
                        totalDeposits: 542500.75,
                        totalWithdrawals: 328750.50,
                        totalInvestments: 875200.25,
                        pendingDeposits: 12,
                        pendingWithdrawals: 8
                    },
                    today: {
                        deposits: 12500.50,
                        withdrawals: 8750.25,
                        registrations: 18,
                        investments: 24200.75
                    }
                }
            };
            
            if (data.success) {
                updateDashboardStats(data.data);
            } else {
                throw new Error('Failed to fetch dashboard stats');
            }
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
            alert('Failed to load dashboard data. Please try again.');
        }
    }
    
    // Update dashboard stats with fetched data
    function updateDashboardStats(stats) {
        // Update overview stats
        totalUsersEl.textContent = stats.overview.totalUsers.toLocaleString();
        activeUsersEl.textContent = stats.overview.activeUsers.toLocaleString();
        verifiedUsersEl.textContent = stats.overview.verifiedUsers.toLocaleString();
        totalDepositsEl.textContent = formatCurrency(stats.overview.totalDeposits);
        totalWithdrawalsEl.textContent = formatCurrency(stats.overview.totalWithdrawals);
        totalInvestmentsEl.textContent = formatCurrency(stats.overview.totalInvestments);
        
        // Update today's stats
        todayDepositsEl.textContent = formatCurrency(stats.today.deposits);
        todayWithdrawalsEl.textContent = formatCurrency(stats.today.withdrawals);
        todayRegistrationsEl.textContent = stats.today.registrations;
        todayInvestmentsEl.textContent = formatCurrency(stats.today.investments);
    }
    
    // Fetch pending actions
    async function fetchPendingActions() {
        try {
            // In a real application, you would fetch from your API
            // const response = await fetch('/api/admin/dashboard/pending-actions', {
            //     headers: {
            //         'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            //     }
            // });
            // const data = await response.json();
            
            // Simulated API response based on the controller structure
            const data = {
                success: true,
                data: {
                    pendingDeposits: {
                        count: 3,
                        items: [
                            { id: 1, amount: 2500, currency: 'USD', user: { username: 'john_doe', email: 'john@example.com' }, createdAt: new Date() },
                            { id: 2, amount: 5000, currency: 'USD', user: { username: 'jane_smith', email: 'jane@example.com' }, createdAt: new Date(Date.now() - 86400000) },
                            { id: 3, amount: 1200, currency: 'USD', user: { username: 'mike_jones', email: 'mike@example.com' }, createdAt: new Date(Date.now() - 172800000) }
                        ]
                    },
                    pendingWithdrawals: {
                        count: 2,
                        items: [
                            { id: 1, amount: 1500, currency: 'USD', user: { username: 'sara_conor', email: 'sara@example.com' }, createdAt: new Date() },
                            { id: 2, amount: 3200, currency: 'USD', user: { username: 'david_wilson', email: 'david@example.com' }, createdAt: new Date(Date.now() - 432000000) }
                        ]
                    },
                    unverifiedUsers: {
                        count: 4,
                        items: [
                            { id: 1, username: 'new_user1', email: 'new1@example.com', createdAt: new Date() },
                            { id: 2, username: 'new_user2', email: 'new2@example.com', createdAt: new Date(Date.now() - 86400000) },
                            { id: 3, username: 'new_user3', email: 'new3@example.com', createdAt: new Date(Date.now() - 172800000) },
                            { id: 4, username: 'new_user4', email: 'new4@example.com', createdAt: new Date(Date.now() - 259200000) }
                        ]
                    }
                }
            };
            
            if (data.success) {
                updatePendingActions(data.data);
            } else {
                throw new Error('Failed to fetch pending actions');
            }
        } catch (error) {
            console.error('Error fetching pending actions:', error);
            alert('Failed to load pending actions. Please try again.');
        }
    }
    
    // Update pending actions with fetched data
    function updatePendingActions(actions) {
        // Update counts
        pendingDepositsCountEl.textContent = actions.pendingDeposits.count;
        pendingWithdrawalsCountEl.textContent = actions.pendingWithdrawals.count;
        unverifiedUsersCountEl.textContent = actions.unverifiedUsers.count;
        
        // Update pending deposits list
        if (actions.pendingDeposits.count > 0) {
            pendingDepositsListEl.innerHTML = '';
            actions.pendingDeposits.items.forEach(deposit => {
                const itemEl = document.createElement('div');
                itemEl.className = 'action-item';
                itemEl.innerHTML = `
                    <div class="action-item-info">
                        <h4>${deposit.user.username}</h4>
                        <p>${deposit.user.email}</p>
                        <small>${formatDate(deposit.createdAt)}</small>
                    </div>
                    <div class="action-item-amount">${formatCurrency(deposit.amount)}</div>
                `;
                pendingDepositsListEl.appendChild(itemEl);
            });
        }
        
        // Update pending withdrawals list
        if (actions.pendingWithdrawals.count > 0) {
            pendingWithdrawalsListEl.innerHTML = '';
            actions.pendingWithdrawals.items.forEach(withdrawal => {
                const itemEl = document.createElement('div');
                itemEl.className = 'action-item';
                itemEl.innerHTML = `
                    <div class="action-item-info">
                        <h4>${withdrawal.user.username}</h4>
                        <p>${withdrawal.user.email}</p>
                        <small>${formatDate(withdrawal.createdAt)}</small>
                    </div>
                    <div class="action-item-amount">${formatCurrency(withdrawal.amount)}</div>
                `;
                pendingWithdrawalsListEl.appendChild(itemEl);
            });
        }
        
        // Update unverified users list
        if (actions.unverifiedUsers.count > 0) {
            unverifiedUsersListEl.innerHTML = '';
            actions.unverifiedUsers.items.forEach(user => {
                const itemEl = document.createElement('div');
                itemEl.className = 'action-item';
                itemEl.innerHTML = `
                    <div class="action-item-info">
                        <h4>${user.username}</h4>
                        <p>${user.email}</p>
                        <small>Joined: ${formatDate(user.createdAt)}</small>
                    </div>
                `;
                unverifiedUsersListEl.appendChild(itemEl);
            });
        }
    }
    
    // Logout function
    function logout() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userEmail');
        window.location.href = 'login.html';
    }
    
    // Event listeners
    logoutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        logout();
    });
    
    // Initialize dashboard
    fetchDashboardStats();
    fetchPendingActions();
    
    // Refresh data every 5 minutes
    setInterval(() => {
        fetchDashboardStats();
        fetchPendingActions();
    }, 300000);
    
    
});