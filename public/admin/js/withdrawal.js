        document.addEventListener('DOMContentLoaded', function() {
            // Mobile sidebar toggle
            const menuToggle = document.getElementById('menuToggle');
            const sidebar = document.getElementById('sidebar');
            const sidebarOverlay = document.getElementById('sidebarOverlay');

            if (menuToggle && sidebar && sidebarOverlay) {
                menuToggle.addEventListener('click', () => {
                    sidebar.classList.toggle('active');
                    sidebarOverlay.classList.toggle('active');
                });

                sidebarOverlay.addEventListener('click', () => {
                    sidebar.classList.remove('active');
                    sidebarOverlay.classList.remove('active');
                });
            }

            // Tab switching
            const tabLinks = document.querySelectorAll('.nav-link');
            const tabContents = document.querySelectorAll('.tab-content');

            tabLinks.forEach(link => {
                link.addEventListener('click', () => {
                    const tabId = link.getAttribute('data-tab');
                    
                    // Update active tab
                    tabLinks.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                    
                    // Show active content
                    tabContents.forEach(content => {
                        content.classList.remove('active');
                        if (content.id === tabId) {
                            content.classList.add('active');
                        }
                    });
                });
            });

            // Edit Withdrawal Modal Functionality
            const withdrawalModal = document.getElementById('editWithdrawalModal');
            const withdrawalButtons = document.querySelectorAll('.edit-withdrawal');
            const closeWithdrawalModal = document.getElementById('closeWithdrawalModal');

            // Open modal when edit button is clicked
            withdrawalButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const transactionId = button.getAttribute('data-id');
                    const user = button.getAttribute('data-user');
                    const amount = button.getAttribute('data-amount');
                    const method = button.getAttribute('data-method');

                    // Update modal content
                    document.getElementById('withdrawalTransactionId').textContent = `#WTH-${transactionId}`;
                    document.getElementById('withdrawalUser').textContent = user;
                    document.getElementById('withdrawalAmount').textContent = `$${amount}`;
                    document.getElementById('withdrawalMethod').textContent = method;

                    // Show modal
                    withdrawalModal.classList.add('active');
                });
            });

            // Close modal functions
            function closeWithdrawalModalFunc() {
                withdrawalModal.classList.remove('active');
            }

            if (closeWithdrawalModal) {
                closeWithdrawalModal.addEventListener('click', closeWithdrawalModalFunc);
            }

            // Close modal if clicked outside
            if (withdrawalModal) {
                withdrawalModal.addEventListener('click', (e) => {
                    if (e.target === withdrawalModal) {
                        closeWithdrawalModalFunc();
                    }
                });
            }

            // Handle form submissions
            const balanceForms = document.querySelectorAll('.balance-form');
            balanceForms.forEach(form => {
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const input = form.querySelector('input');
                    const amount = input.value;
                    const action = form.querySelector('button').textContent.trim();

                    if (amount && !isNaN(amount) && amount > 0) {
                        alert(`$${amount} will be ${action.toLowerCase()}ed from this withdrawal.`);
                        input.value = '';
                        closeWithdrawalModalFunc();
                    }
                });
            });
        });