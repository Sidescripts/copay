// Function to fetch revenue plans from the server
async function fetchRevenuePlans() {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No authentication token found');
            return [];
        }

        const response = await fetch('/api/v1/invest/plans', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch plans: ${response.status}`);
        }

        const responseData = await response.json();
        return responseData.data || responseData.plans || [];
    } catch (error) {
        console.error('Error fetching revenue plans:', error);
        // Return empty array if API fails
        return [];
    }
}

// Function to populate the revenue plan dropdown
async function populateRevenuePlans() {
    const planSelect = document.querySelector('.revenuePlan');
    
    if (!planSelect) return;
    
    // Clear existing options
    planSelect.innerHTML = '';
    
    // Add a temporary loading option
    const loadingOption = document.createElement('option');
    loadingOption.value = '';
    loadingOption.textContent = 'Loading plans...';
    loadingOption.disabled = true;
    loadingOption.selected = true;
    planSelect.appendChild(loadingOption);
    
    // Fetch plans from server
    const plans = await fetchRevenuePlans();
    
    // Clear the loading option
    planSelect.innerHTML = '';
    
    if (plans.length === 0) {
        // Add fallback options if no plans are returned
        const fallbackOption = document.createElement('option');
        fallbackOption.value = '';
        fallbackOption.textContent = 'No plans available';
        fallbackOption.disabled = true;
        fallbackOption.selected = true;
        planSelect.appendChild(fallbackOption);
        return;
    }
    
    // Add a default option
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Select a revenue plan';
    defaultOption.disabled = true;
    defaultOption.selected = true;
    planSelect.appendChild(defaultOption);
    
    // Add plans to the dropdown
    plans.forEach(plan => {
        const option = document.createElement('option');
        option.value = plan.id; // Use plan ID as value
        option.textContent = plan.name; // Use plan name as display text
        
        // Add additional data attributes for validation
        option.dataset.minDeposit = plan.min_amount || '';
        option.dataset.maxDeposit = plan.max_amount || '';
        option.dataset.returnRate = plan.roi_percentage || '';
        
        planSelect.appendChild(option);
    });
}

// Initialize the modal when the document is ready
document.addEventListener('DOMContentLoaded', function() {
    const investModal = document.getElementById('invest');
    
    if (investModal) {
        // Add event listener for when the modal is shown
        investModal.addEventListener('show.bs.offcanvas', function () {
            populateRevenuePlans();
        });
        
        // Add event listener for plan selection changes
        const planSelect = document.querySelector('.revenuePlan');
        if (planSelect) {
            planSelect.addEventListener('change', function() {
                const selectedOption = this.options[this.selectedIndex];
                const minDeposit = selectedOption.dataset.min_amount;
                const maxDeposit = selectedOption.dataset.max_amount;
                
                // Update amount input placeholder with min/max values
                const amountInput = document.querySelector('.amount');
                if (minDeposit && maxDeposit) {
                    amountInput.placeholder = `Enter amount ($${min_amount} - $${max_amount})`;
                }
            });
        }
    }
    
    // Load saved values if they exist
    const savedPaymentMethod = localStorage.getItem('pmd');
    const savedRevenuePlan = localStorage.getItem('rvp');
    const savedAmount = localStorage.getItem('amt');
    
    if (savedPaymentMethod) {
        const paymentSelect = document.querySelector('.paymentMethod');
        if (paymentSelect) {
            paymentSelect.value = savedPaymentMethod;
        }
    }
    
    if (savedRevenuePlan) {
        const planSelect = document.querySelector('.revenuePlan');
        if (planSelect) {
            // This will be set after plans are loaded
            setTimeout(() => {
                planSelect.value = savedRevenuePlan;
            }, 500);
        }
    }
    
    if (savedAmount) {
        const amountInput = document.querySelector('.amount');
        if (amountInput) {
            amountInput.value = savedAmount;
        }
    }
});

// Your existing continueEarn function with enhanced validation
function continueEarn() {
    // Get the form elements
    const planSelect = document.querySelector('.revenuePlan');
    const paymentSelect = document.querySelector('.paymentMethod');
    const amountInput = document.querySelector('.amount');
    const termsCheckbox = document.querySelector('#c21');
    
    if (!planSelect || !paymentSelect || !amountInput || !termsCheckbox) {
        Modal.error('Error', 'Form elements not found');
        return;
    }
    
    const revenuePlanId = planSelect.value;
    const revenuePlanName = planSelect.options[planSelect.selectedIndex].text;
    const paymentMethod = paymentSelect.value;
    const amount = amountInput.value;
    const termsAccepted = termsCheckbox.checked;

    // Validate inputs
    if (!revenuePlanId) {
        Modal.error('Missing Information', 'Please select a revenue plan');
        return;
    }

    if (!paymentMethod) {
        Modal.error('Missing Information', 'Please select a payment method');
        return;
    }

    if (!amount) {
        Modal.error('Missing Information', 'Please enter an amount');
        return;
    }

    if (!termsAccepted) {
        Modal.warning('Terms of Service', 'Please accept the Terms of Service');
        return;
    }

    if (amount <= 0 || isNaN(amount)) {
        Modal.error('Invalid Amount', 'Please enter a valid amount');
        return;
    }
    
    // Get min and max deposit values from selected plan
    const selectedOption = planSelect.options[planSelect.selectedIndex];
    const minDeposit = parseFloat(selectedOption.dataset.min_amount) || 0;
    const maxDeposit = parseFloat(selectedOption.dataset.max_amount) || Infinity;
    
    // Validate amount against plan limits
    if (parseFloat(amount) < minDeposit) {
        Modal.error('Invalid Amount', `Minimum deposit for ${revenuePlanName} is $${minDeposit}`);
        return;
    }
    
    if (parseFloat(amount) > maxDeposit) {
        Modal.error('Invalid Amount', `Maximum deposit for ${revenuePlanName} is $${maxDeposit}`);
        return;
    }

    // Store values in localStorage
    localStorage.removeItem('pmd');
    localStorage.removeItem('amt');
    localStorage.removeItem('rvp');
    localStorage.removeItem('rvp_id');

    localStorage.setItem('pmd', paymentMethod);
    localStorage.setItem('amt', amount);
    localStorage.setItem('rvp', revenuePlanName);
    localStorage.setItem('rvp_id', revenuePlanId); // Store plan ID for API call
    
    // Redirect to confirmation page
    setTimeout(() => {
        window.location.href = "../Vitron-dashboard/html/confirmEarn.html";
    }, 1500);
}

// Modified confirmEarn page code to use plan ID
document.addEventListener('DOMContentLoaded', function(){
    const paymentMethod = localStorage.getItem('pmd');
    const revenuePlanName = localStorage.getItem('rvp');
    const revenuePlanId = localStorage.getItem('rvp_id'); // Get the plan ID
    const amount = localStorage.getItem('amt');
    const payNow = document.querySelector('#payNowButton');

    if (paymentMethod) {
        document.getElementById('selectedMethod').textContent = paymentMethod;
    }
    if (revenuePlanName) {
        document.getElementById('revPlan').textContent = revenuePlanName;
    }
    if (amount) {
        document.getElementById('revAmount').textContent = `$${parseFloat(amount).toFixed(2)}`;
    }
    
    payNow.addEventListener('click', async function(){
        try {
            // Use the plan ID instead of name for the API call
            const payload = {
                paymentMethod: paymentMethod, 
                amount: parseFloat(amount),  
                id: revenuePlanId, // Use plan ID instead of name
                name: revenuePlanName
            }
            
            const token = localStorage.getItem('token');
            
            if (!token) {
                Modal.error('Authentication Error', 'Please login again');
                window.location.href = '../index.html';
                return;
            }

            const response = await fetch('/api/v1/invest/invest-now', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if(!response.ok){
                const errorData = await response.json();
                Modal.error('Error', errorData.error || 'Investment failed');
                throw new Error(errorData.error || 'Network error occurred');
            }
            
        Modal.success("Success", "Your investment is being processed, stay tuned.");
        setTimeout(() => {
            window.location.href ="../Dashboard.html"
        }, 3000);

        } catch (error) {
            console.error('Investment error:', error);
        }
    });
});

// Your existing openPaymentModal function
function openPaymentModal() {
    const modalElement = document.getElementById('paymentModal');
    if (!modalElement) return;
  
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
  
    setTimeout(() => {
      const label = document.getElementById('paymentModalLabel');
      if (label) {
        label.innerText = 'Payment Under Review';
        label.classList.remove('text-primary');
        label.classList.add('text-warning');
      }
    }, 3000);
  
    modalElement.addEventListener('hidden.bs.modal', () => {
      window.location.href = '../Dashboard.html';
    }, { once: true });
}

// Make continueEarn function available globally
window.continueEarn = continueEarn;
window.openPaymentModal = openPaymentModal;