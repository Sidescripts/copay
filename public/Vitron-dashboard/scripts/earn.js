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
  console.log('Confirming investment...');
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

  try {
    const response = await fetch(`${API_BASE_URL}/invest/invest-now`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ planId, amount, paymentMethod })
    });

    if (!response.ok) {
      console.error(`Invest API failed with status: ${response.status}`);
      throw new Error('Failed to submit investment');
    }

    const data = await response.json();
    console.log(`Investment successful: ${JSON.stringify(data)}`);

    // Store for confirmDeposit.html
    localStorage.setItem('investmentAmount', amount);
    localStorage.setItem('paymentMethod', paymentMethod);
    localStorage.setItem('walletAddress', wallets[paymentMethod] || data.walletAddress);
    localStorage.setItem('planId', planId);

    console.log('Redirecting to confirmDeposit.html');
    window.location.href = '../html/confirmDeposit.html';
  } catch (error) {
    console.error(`Error submitting investment: ${error.message}`);
    showErrorModal('Failed to submit investment. Please try again.');
  }
}

// Confirm investment using balance
async function confirmBalanceInvestment() {
  console.log('Confirming investment using balance...');
  const planId = document.getElementById('balancePlanSelect').value;
  const amount = parseFloat(document.getElementById('balanceAmount').value);

  if (!planId || !amount) {
    console.error('Validation failed: Missing plan or amount');
    showErrorModal('Please select a plan and enter an amount.');
    return;
  }

  const min = parseFloat(document.getElementById('balanceAmount').getAttribute('min'));
  const max = parseFloat(document.getElementById('balanceAmount').getAttribute('max'));
  if (amount < min || amount > max) {
    console.error(`Validation failed: Amount ${amount} is out of range (${min} - ${max})`);
    showErrorModal(`Amount must be between $${min} and $${max}.`);
    return;
  }

  // Check balance (replace with actual balance check)
  const balance = parseFloat(document.getElementById('availableBalance').textContent.replace('$', ''));
  if (amount > balance) {
    console.error(`Validation failed: Amount ${amount} exceeds balance ${balance}`);
    showErrorModal('Insufficient balance.');
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/invest/invest-now`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ planId, amount, paymentMethod: 'balance' })
    });

    if (!response.ok) {
      console.error(`Invest API failed with status: ${response.status}`);
      throw new Error('Failed to submit investment');
    }

    const data = await response.json();
    console.log(`Investment successful: ${JSON.stringify(data)}`);
    bootstrap.Modal.getInstance(document.getElementById('investBalanceModal')).hide();
    // Show success message
    showErrorModal('Investment submitted successfully!', 'Success');
    // Optionally refresh page after delay
    setTimeout(() => window.location.reload(), 2000);
  } catch (error) {
    console.error(`Error submitting balance investment: ${error.message}`);
    showErrorModal('Failed to submit investment. Please try again.');
  }
}