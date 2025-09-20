 
function continueEarn() {
    // Get the form elements
    const revenuePlan = document.querySelector('.revenuePlan').value;
    const paymentMethod = document.querySelector('.paymentMethod').value;
    const amount = document.querySelector('.amount').value;
    const termsAccepted = document.querySelector('#c21').checked;

    // Validate inputs
    if (!revenuePlan || !paymentMethod || !amount) {
        Modal.error('Missing Information', 'Please fill in all required fields');
        // alert('Please fill in all required fields');
        return;
    }

    if (!termsAccepted) {
        Modal.warning('Terms of Service', 'Please accept the Terms of Service');
        // alert('Please accept the Terms of Service');
        return;
    }

    if (amount <= 0) {
        Modal.error('Invalid Amount', 'Please enter a valid amount')
        // alert('Please enter a valid amount');
        return;
    }
    localStorage.removeItem('pmd');
    localStorage.removeItem('amt');
    localStorage.removeItem('rvp');

    localStorage.setItem('pmd', paymentMethod);
    localStorage.setItem('amt', amount);
    localStorage.setItem('rvp', revenuePlan);
    setTimeout(() => {
        window.location.href = "../Vitron-dashboard/html/confirmEarn.html";
    }, 1500);
    
    // window.location.href = "../Vitron-dashboard/html/confirmEarn.html";
}


document.addEventListener('DOMContentLoaded', function(){
    const paymentMethod = localStorage.getItem('pmd');
    const revenuePlan = localStorage.getItem('rvp');
    const amount = localStorage.getItem('amt');
    const payNow = document.querySelector('#payNowButton');

    if (paymentMethod) {
        document.getElementById('selectedMethod').textContent = paymentMethod;
    }
    if (revenuePlan) {
        document.getElementById('revPlan').textContent = revenuePlan;
    }
    if (amount) {
        document.getElementById('revAmount').textContent = `$${parseFloat(amount).toFixed(2)}`;
    }

    payNow.addEventListener('click', async function(){
     
        try {
            
        const payload = {
            paymentMethod: paymentMethod, 
            amount: parseFloat(amount),  
            name: revenuePlan.toLowerCase()
        }
        const token = localStorage.getItem('token');

        const response = await fetch('/api/v1/invest/invest-now', {
            method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    // Add any necessary authorization headers
                    // 'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(payload)
        });

        if(!response.ok){
            const errorData = await response.json();
            Modal.error('Error', errorData.error)
            throw new Error(errorData.error || 'Network error occurred');
        }
        
        // localStorage.removeItem('pmd')
        // localStorage.removeItem('amt')
        // localStorage.removeItem('rvp')
        openPaymentModal()
        // localStorage.removeItem(crypto)
        } catch (error) {
            console.log(error)
            throw new Error(error)
        }
    })

});



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
