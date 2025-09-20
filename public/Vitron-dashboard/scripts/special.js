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
        console.log(responseData)
        return responseData.data || responseData.plans || [];
    } catch (error) {
        console.error('Error fetching revenue plans:', error);
        // Return empty array or fallback plans if API fails
        return [];
    }
}

// Function to populate the revenue plan dropdown
async function populateRevenuePlans() {
    const planSelect = document.querySelector('.revenuePlan');
    
    // Clear existing options except the first one (if it's a placeholder)
    while (planSelect.options.length > 0) {
        planSelect.remove(0);
    }

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

    // Add plans to the dropdown
    plans.forEach(plan => {
        const option = document.createElement('option');
        option.value = plan.id; // Use the plan ID as value
        option.textContent = plan.name; // Use the plan name as display text
        
        // Add additional data attributes if needed
        option.dataset.minDeposit = plan.minDeposit || '';
        option.dataset.maxDeposit = plan.maxDeposit || '';
        option.dataset.returnRate = plan.returnRate || '';
        
        planSelect.appendChild(option);
    });
}

// Function to handle modal opening
function setupInvestModal() {
    const investModal = document.getElementById('invest');
    
    // Add event listener for when the modal is shown
    investModal.addEventListener('show.bs.offcanvas', function () {
        populateRevenuePlans();
    });
    
    // Optional: Add event listener for when plan selection changes
    const planSelect = document.querySelector('.revenuePlan');
    planSelect.addEventListener('change', function() {
        const selectedOption = this.options[this.selectedIndex];
        const minDeposit = selectedOption.dataset.minDeposit;
        const maxDeposit = selectedOption.dataset.maxDeposit;
        
        // Update amount input placeholder with min/max values
        const amountInput = document.querySelector('.amount');
        if (minDeposit && maxDeposit) {
            amountInput.placeholder = `Enter amount ($${minDeposit} - $${maxDeposit})`;
        }
    });
}

// Function to handle the continue button click
async function continueEarn() {
    const planSelect = document.querySelector('.revenuePlan');
    const paymentSelect = document.querySelector('.paymentMethod');
    const amountInput = document.querySelector('.amount');
    const termsCheckbox = document.getElementById('c21');
    
    const selectedPlanId = planSelect.value;
    const selectedPlanText = planSelect.options[planSelect.selectedIndex].text;
    const paymentMethod = paymentSelect.value;
    const amount = amountInput.value;
    
    // Validation
    if (!selectedPlanId || selectedPlanId === '') {
        alert('Please select a revenue plan');
        return;
    }
    
    if (!paymentMethod) {
        alert('Please select a payment method');
        return;
    }
    
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
        alert('Please enter a valid amount');
        return;
    }
    
    if (!termsCheckbox.checked) {
        alert('Please accept the Terms of Service');
        return;
    }
    
    // Get min and max deposit values from selected plan
    const selectedOption = planSelect.options[planSelect.selectedIndex];
    const minDeposit = parseFloat(selectedOption.dataset.minDeposit) || 0;
    const maxDeposit = parseFloat(selectedOption.dataset.maxDeposit) || Infinity;
    
    // Validate amount against plan limits
    if (parseFloat(amount) < minDeposit) {
        alert(`Minimum deposit for ${selectedPlanText} is $${minDeposit}`);
        return;
    }
    
    if (parseFloat(amount) > maxDeposit) {
        alert(`Maximum deposit for ${selectedPlanText} is $${maxDeposit}`);
        return;
    }
    
    try {
        // Submit the investment request to the server
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Authentication required. Please login again.');
            window.location.href = '../index.html';
            return;
        }
        
        const response = await fetch('/api/v1/invest/invest-now', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                planId: selectedPlanId,
                paymentMethod: paymentMethod,
                amount: parseFloat(amount)
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to create investment');
        }
        
        const result = await response.json();
        
        // Handle success
        alert('Investment created successfully!');
        
        // Close the modal
        const modal = bootstrap.Offcanvas.getInstance(document.getElementById('invest'));
        modal.hide();
        
        // Reset form
        planSelect.selectedIndex = 0;
        paymentSelect.selectedIndex = 0;
        amountInput.value = '';
        termsCheckbox.checked = false;
        
    } catch (error) {
        console.error('Error creating investment:', error);
        alert('Failed to create investment: ' + error.message);
    }
}

// Initialize when the document is ready
document.addEventListener('DOMContentLoaded', function() {
    // Check if the invest modal exists on the page
    const investModal = document.getElementById('invest');
    if (investModal) {
        setupInvestModal();
    }
    
    // Make continueEarn function available globally
    window.continueEarn = continueEarn;
});