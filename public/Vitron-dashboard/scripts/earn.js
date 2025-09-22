const API_BASE_URL = 'http://127.0.0.1:2000/api/v1';

// Wallets (fallback if API doesn't provide)
const wallets = {
  btc: 'bc1qprkyhjwhyccmjgawe77tllgnqjugn8y4aweupl',
  usdt: 'TMRyQ2GdPkJvTAPEnYsJQc5Bqrwjf4tv3G',
  eth: '0x5983609884040B91b0Fe1dEd471193165fD65B82',
  bnb: 'bnb1ExampleWalletabc123',
  bch: 'bitcoincash:qExampleWallet0000',
  ltc: 'ltc1ExampleWalletxyz',
  dash: 'XdashExampleWallet11111'
};

// Show error modal
function showErrorModal(message, title = 'Error') {
  console.error(`Showing error modal: ${message}`);
  const modalMessage = document.getElementById('errorModalMessage');
  const modalTitle = document.getElementById('errorModalLabel');
  modalMessage.textContent = message;
  modalTitle.textContent = title;
  const modal = new bootstrap.Modal(document.getElementById('errorModal'));
  modal.show();
}

// Set plan for Invest Now modal
function setPlan(planId, planName, minInvestment, maxInvestment) {
  console.log(`Setting plan for Invest Now: ${planName} (${planId})`);
  const planSelect = document.getElementById('planSelect');
  planSelect.value = planId;
  const amountInput = document.getElementById('investmentAmount');
  amountInput.setAttribute('min', minInvestment);
  amountInput.setAttribute('max', maxInvestment);
  amountInput.value = '';
}

// Set plan for Invest Using Balance modal
function setBalancePlan(planId, planName, minInvestment, maxInvestment) {
  console.log(`Setting plan for Invest Using Balance: ${planName} (${planId})`);
  const planSelect = document.getElementById('balancePlanSelect');
  planSelect.value = planId;
  const amountInput = document.getElementById('balanceAmount');
  amountInput.setAttribute('min', minInvestment);
  amountInput.setAttribute('max', maxInvestment);
  amountInput.value = '';
}

// Confirm investment (Invest Now modal)
async function confirmInvestment() {
  // console.log('Confirming investment...');
  const planId = document.getElementById('planSelect').value;
  const amount = parseFloat(document.getElementById('investmentAmount').value);
  const paymentMethod = document.getElementById('paymentMethod').value;

  if (!planId || !amount || !paymentMethod) {
    console.error('Validation failed: Missing plan, amount, or payment method');
    showErrorModal('Please select a plan, enter an amount, and select a payment method.');
    return;
  }

  const min = parseFloat(document.getElementById('investmentAmount').getAttribute('min'));
  const max = parseFloat(document.getElementById('investmentAmount').getAttribute('max'));
  if (amount < min || amount > max) {
    console.error(`Validation failed: Amount ${amount} is out of range (${min} - ${max})`);
    showErrorModal(`Amount must be between $${min} and $${max}.`);
    return;
  }

  localStorage.removeItem('depositPMethod');
  localStorage.removeItem('depositAmount');
  // console.log(paymentMethod, amount);
  // console.log(paymentMethod + amount);

  if (amount && paymentMethod) {

    localStorage.setItem('depositPMethod', paymentMethod);
    localStorage.setItem('depositAmount', amount);
    setTimeout(() => {
      window.location.href = '../html/confirmDeposit.html';
    }, 1500);
  }
   
}


// Confirm investment using balance
async function confirmBalanceInvestment() {
  const planSelect = document.querySelector('#balancePlanSelect');
  const revenuePlanName = planSelect.options[planSelect.selectedIndex].text;
  const paymentMethod = document.getElementById('payMethod').value;
  const planId = planSelect.value;
  const amount = parseFloat(document.getElementById('balanceAmount').value);

  if (!planId || !amount || !paymentMethod) {
    console.error('Validation failed: Missing plan or amount');
    showErrorModal('Please select a plan and enter an amount.');
    return;
  }
console.log(paymentMethod)
console.log(amount)
console.log(revenuePlanName)
console.log(planId)

  const min = parseFloat(document.getElementById('balanceAmount').getAttribute('min'));
  const max = parseFloat(document.getElementById('balanceAmount').getAttribute('max'));
  if (amount < min || amount > max) {
    console.error(`Validation failed: Amount ${amount} is out of range (${min} - ${max})`);
    showErrorModal(`Amount must be between $${min} and $${max}.`);
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
    localStorage.setItem('rvp_id', planId); // Store plan ID for API call
    
    // Redirect to confirmation page
    setTimeout(() => {
        window.location.href = "../html/confirmEarn.html";
    }, 1500);

  
}