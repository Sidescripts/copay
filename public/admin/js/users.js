// users.js
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    
    const viewUserModal = document.getElementById('viewUserModal');
    const closeViewModal = document.getElementById('closeViewModal');
    const closeView = document.getElementById('closeView');
    const editFromView = document.getElementById('editFromView');
    
    const editUserModal = document.getElementById('editUserModal');
    const closeEditModal = document.getElementById('closeEditModal');
    const cancelEdit = document.getElementById('cancelEdit');
    const saveUserChanges = document.getElementById('saveUserChanges');
    const suspendUser = document.getElementById('suspendUser');
    
    const confirmationModal = document.getElementById('confirmationModal');
    const closeConfirmationModal = document.getElementById('closeConfirmationModal');
    const cancelAction = document.getElementById('cancelAction');
    const confirmAction = document.getElementById('confirmAction');
    const confirmationTitle = document.getElementById('confirmationTitle');
    const confirmationMessage = document.getElementById('confirmationMessage');

    // Global user data
    window.usersData = {
        1: {
            id: "#USR-001",
            name: "John Doe",
            email: "john@example.com",
            joined: "2023-05-15",
            status: "verified",
            balance: "1250.00",
            phone: "+1 (555) 123-4567",
            country: "United States",
            plan: "Premium Plan",
            lastLogin: "2023-10-15 14:30"
        },
        2: {
            id: "#USR-002",
            name: "Jane Smith",
            email: "jane@example.com",
            joined: "2023-06-20",
            status: "unverified",
            balance: "850.00",
            phone: "+1 (555) 987-6543",
            country: "Canada",
            plan: "Basic Plan",
            lastLogin: "2023-10-14 09:15"
        },
        3: {
            id: "#USR-003",
            name: "Robert Johnson",
            email: "robert@example.com",
            joined: "2023-07-10",
            status: "verified",
            balance: "3450.00",
            phone: "+44 20 1234 5678",
            country: "United Kingdom",
            plan: "VIP Plan",
            lastLogin: "2023-10-15 16:45"
        }
    };

    // Mobile sidebar toggle
    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
        sidebarOverlay.classList.toggle('active');
    });
    
    sidebarOverlay.addEventListener('click', () => {
        sidebar.classList.remove('active');
        sidebarOverlay.classList.remove('active');
    });

    // Refresh user table function
    window.refreshUserTable = function(usersData) {
        const tbody = document.querySelector('.data-table tbody');
        if (tbody) {
            tbody.innerHTML = '';
            Object.values(usersData).forEach((user, index) => {
                const userId = Object.keys(usersData)[index];
                const actions = user.status === 'banned' 
                    ? `<button class="btn btn-sm btn-primary unsuspend-user-btn" data-user-id="${userId}">Unsuspend</button>`
                    : `<button class="btn btn-sm btn-primary view-user-btn" data-user-id="${userId}">View</button>
                       <button class="btn btn-sm btn-secondary edit-user-btn" data-user-id="${userId}">Edit</button>`;
                row.innerHTML = `
                    <td>${user.id}</td>
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td>${user.joined}</td>
                    <td><span class="badge ${user.status === 'verified' ? 'badge-approved' : user.status === 'unverified' ? 'badge-pending' : 'badge-rejected'}">${user.status.charAt(0).toUpperCase() + user.status.slice(1)}</span></td>
                    <td>$${user.balance}</td>
                    <td>${actions}</td>
                `;
                tbody.appendChild(row);
            });

            // Reattach event listeners
            document.querySelectorAll('.view-user-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const userId = this.getAttribute('data-user-id');
                    const user = usersData[userId];
                    if (user) {
                        document.getElementById('viewUserId').textContent = user.id;
                        document.getElementById('viewUserName').textContent = user.name;
                        document.getElementById('viewUserEmail').textContent = user.email;
                        document.getElementById('viewUserJoined').textContent = user.joined;
                        document.getElementById('viewUserBalance').textContent = '$' + user.balance;
                        document.getElementById('viewUserPhone').textContent = user.phone || 'N/A';
                        document.getElementById('viewUserCountry').textContent = user.country || 'N/A';
                        document.getElementById('viewUserPlan').textContent = user.plan || 'No Plan';
                        document.getElementById('viewUserLastLogin').textContent = user.lastLogin || 'N/A';
                        const statusBadge = document.getElementById('viewUserStatus');
                        statusBadge.textContent = user.status.charAt(0).toUpperCase() + user.status.slice(1);
                        statusBadge.className = 'badge ' + (
                            user.status === 'verified' ? 'badge-approved' : 
                            user.status === 'unverified' ? 'badge-pending' : 'badge-rejected'
                        );
                        editFromView.setAttribute('data-user-id', userId);
                        viewUserModal.classList.add('active');
                    }
                });
            });

            document.querySelectorAll('.edit-user-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const userId = this.getAttribute('data-user-id');
                    openEditModal(userId);
                });
            });

            document.querySelectorAll('.unsuspend-user-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const userId = this.getAttribute('data-user-id');
                    showConfirmation('Unsuspend User', 'Are you sure you want to unsuspend this user?', () => {
                        updateUserStatus(userId, 'verified');
                    });
                });
            });
        }
    };

    // Initial population
    window.refreshUserTable(window.usersData);

    // View user functionality (handled in refresh)

    closeViewModal.addEventListener('click', () => {
        viewUserModal.classList.remove('active');
    });
    
    closeView.addEventListener('click', () => {
        viewUserModal.classList.remove('active');
    });
    
    editFromView.addEventListener('click', function() {
        const userId = this.getAttribute('data-user-id');
        viewUserModal.classList.remove('active');
        openEditModal(userId);
    });

    function openEditModal(userId) {
        const user = window.usersData[userId];
        if (user) {
            document.getElementById('editUserId').value = userId;
            document.getElementById('editUserName').value = user.name;
            document.getElementById('editUserEmail').value = user.email;
            document.getElementById('editUserPhone').value = user.phone || '';
            document.getElementById('editUserBalance').value = user.balance;
            document.getElementById('editUserStatus').value = user.status;
            document.getElementById('editUserPlan').value = user.plan ? user.plan.toLowerCase().replace(' Plan', '') : '';
            document.getElementById('editUserCountry').value = user.country || '';
            editUserModal.classList.add('active');
        }
    }
    
    closeEditModal.addEventListener('click', () => {
        editUserModal.classList.remove('active');
    });
    
    cancelEdit.addEventListener('click', () => {
        editUserModal.classList.remove('active');
    });

    saveUserChanges.addEventListener('click', async () => {
        const userId = document.getElementById('editUserId').value;
        const userName = document.getElementById('editUserName').value;
        const userEmail = document.getElementById('editUserEmail').value;
        const userPhone = document.getElementById('editUserPhone').value;
        const userBalance = document.getElementById('editUserBalance').value;
        const userStatus = document.getElementById('editUserStatus').value;
        const userPlan = document.getElementById('editUserPlan').value;
        const userCountry = document.getElementById('editUserCountry').value;

        if (!userName || !userEmail || !userBalance) {
            showConfirmation('Error', 'Please fill all required fields');
            return;
        }

        // Update via API
        try {
            // Update balance separately if needed
            if (window.usersData[userId].balance !== userBalance) {
                await fetch(`/api/v1/admin/users/${userId}/balance`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
                    body: JSON.stringify({ balance: userBalance })
                });
            }
            // Update other details (assuming a generic endpoint; confirm with backend)
            await fetch(`/api/v1/admin/users/${userId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
                body: JSON.stringify({
                    name: userName,
                    email: userEmail,
                    phone: userPhone,
                    status: userStatus,
                    plan: userPlan ? userPlan.charAt(0).toUpperCase() + userPlan.slice(1) + ' Plan' : 'No Plan',
                    country: userCountry
                })
            });
            // Sync with user dashboard
            await fetch('http://localhost:2000/api/v1/user/update-details', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
                body: JSON.stringify({
                    name: userName,
                    email: userEmail,
                    phone: userPhone,
                    country: userCountry
                })
            });
            const response = await fetch(`/api/v1/admin/users/details?userId=${userId}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            if (!response.ok) throw new Error('Failed to fetch updated details');
            const updatedUser = await response.json();
            window.usersData[userId] = updatedUser;
            window.refreshUserTable(window.usersData);
            editUserModal.classList.remove('active');
            showConfirmation('Success', 'User details updated successfully!');
        } catch (error) {
            console.error('Update error:', error);
            showConfirmation('Error', 'Failed to update user details');
        }
    });

    suspendUser.addEventListener('click', function() {
        const userId = document.getElementById('editUserId').value;
        const userName = document.getElementById('editUserName').value;
        
        showConfirmation(
            'Suspend User', 
            `Are you sure you want to suspend ${userName}? This will restrict their account access.`,
            () => {
                updateUserStatus(userId, 'banned');
            }
        );
    });

    async function updateUserStatus(userId, status) {
        try {
            const response = await fetch(`/api/v1/admin/users/${userId}/verify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
                body: JSON.stringify({ status })
            });
            if (!response.ok) throw new Error('Failed to update status');
            const updatedUser = await response.json();
            window.usersData[userId].status = updatedUser.status;
            window.refreshUserTable(window.usersData);
            showConfirmation('Success', `${userName} has been ${status === 'banned' ? 'suspended' : 'unsuspended'}.`);
        } catch (error) {
            console.error('Status update error:', error);
            showConfirmation('Error', 'Failed to update user status');
        }
    }

    function showConfirmation(title, message, confirmCallback) {
        confirmationTitle.textContent = title;
        confirmationMessage.textContent = message;
        confirmationModal.classList.add('active');
        
        confirmAction.onclick = () => {
            confirmationModal.classList.remove('active');
            if (confirmCallback) confirmCallback();
        };
        
        cancelAction.onclick = () => {
            confirmationModal.classList.remove('active');
        };
    }
    
    closeConfirmationModal.addEventListener('click', () => {
        confirmationModal.classList.remove('active');
    });
});