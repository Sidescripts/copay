// // deposits.js
// document.addEventListener('DOMContentLoaded', function() {
//     const tabLinks = document.querySelectorAll('.nav-link');
//     const tabContents = document.querySelectorAll('.tab-content');
    
//     // Tab functionality
//     tabLinks.forEach(link => {
//         link.addEventListener('click', () => {
//             const tabId = link.getAttribute('data-tab');
            
//             // Update active tab
//             tabLinks.forEach(tab => {
//                 tab.classList.remove('active');
//             });
//             link.classList.add('active');
            
//             // Show corresponding tab content
//             tabContents.forEach(content => {
//                 content.classList.remove('active');
//             });
//             document.getElementById(tabId).classList.add('active');
//         });
//     });
// });


 // Mobile sidebar toggle
        const menuToggle = document.getElementById('menuToggle');
        const sidebar = document.getElementById('sidebar');
        const sidebarOverlay = document.getElementById('sidebarOverlay');
        
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
            sidebarOverlay.classList.toggle('active');
        });
        
        sidebarOverlay.addEventListener('click', () => {
            sidebar.classList.remove('active');
            sidebarOverlay.classList.remove('active');
        });
        
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
        
        // Edit Deposit Modal Functionality
        const editModal = document.getElementById('editDepositModal');
        const editButtons = document.querySelectorAll('.edit-deposit');
        const closeEditModal = document.getElementById('closeEditModal');
        
        // Open modal when edit button is clicked
        editButtons.forEach(button => {
            button.addEventListener('click', () => {
                const transactionId = button.getAttribute('data-id');
                const user = button.getAttribute('data-user');
                const amount = button.getAttribute('data-amount');
                const method = button.getAttribute('data-method');
                
                // Update modal content
                document.getElementById('modalTransactionId').textContent = `#DEP-${transactionId}`;
                document.getElementById('modalUser').textContent = user;
                document.getElementById('modalAmount').textContent = `$${amount}`;
                document.getElementById('modalMethod').textContent = method;
                
                // Show modal
                editModal.classList.add('active');
            });
        });
        
        // Close modal functions
        function closeEditModalFunc() {
            editModal.classList.remove('active');
        }
        
        closeEditModal.addEventListener('click', closeEditModalFunc);
        
        // Close modal if clicked outside
        editModal.addEventListener('click', (e) => {
            if (e.target === editModal) {
                closeEditModalFunc();
            }
        });
        
        // Handle form submissions
        const balanceForms = document.querySelectorAll('.balance-form');
        balanceForms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const input = form.querySelector('input');
                const amount = input.value;
                const action = form.querySelector('button').textContent.trim();
                
                if (amount && !isNaN(amount) && amount > 0) {
                    // In a real application, you would send this data to the server
                    alert(`$${amount} will be ${action.toLowerCase()}ed from this deposit.`);
                    input.value = '';
                    closeEditModalFunc();
                }
            });
        });