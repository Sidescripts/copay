
//modal confir
function continueDeposit() {
  const amount = parseFloat(document.getElementById('depAmount').value);
  const paymentMethod = document.getElementById('paymentMethod').value;

  if (!amount || !paymentMethod) {
    Modal.error('Error', 'Missing Field(s)');
    return;
  }

  localStorage.removeItem('depositPMethod');
  localStorage.removeItem('depositAmount');

  if (amount && paymentMethod) {
    localStorage.setItem('depositPMethod', paymentMethod);
    localStorage.setItem('depositAmount', amount);
    setTimeout(() => {
      window.location.href = '../Vitron-dashboard/html/confirmDeposit.html';
    }, 1500);
  }
}

// === CoinGecko API ===
const API_CONFIG = {
  BASE_URL: 'https://api.coingecko.com/api/v3',
  CRYPTO_IDS: {
    btc: 'bitcoin',
    eth: 'ethereum',
    usdt: 'tether',
  },
  CURRENCY: 'usd',
};

// Store live prices
let exchangeRates = {};

// Utility functions
const formatNumber = (value, decimals) => Number(value).toFixed(decimals);
const getAssetKey = (method) => method.toLowerCase();

// Fetch live prices from CoinGecko
async function fetchExchangeRates() {
  try {
    const ids = Object.values(API_CONFIG.CRYPTO_IDS).join(',');
    const response = await fetch(
      `${API_CONFIG.BASE_URL}/simple/price?ids=${ids}&vs_currencies=${API_CONFIG.CURRENCY}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    exchangeRates = Object.keys(API_CONFIG.CRYPTO_IDS).reduce((acc, key) => {
      acc[key] = data[API_CONFIG.CRYPTO_IDS[key]][API_CONFIG.CURRENCY];
      return acc;
    }, {});

    updateBalances();
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    Modal.error('API Error', 'Failed to fetch cryptocurrency prices. Please try again.');
  }
}

// Update balances and UI
function updateBalances() {
  const depositMethod = getAssetKey(localStorage.getItem('depositPMethod'));
  const investmentAmount = Number(localStorage.getItem('depositAmount'));

  if (!depositMethod || !investmentAmount || !exchangeRates[depositMethod]) return;

  const assetAmount = investmentAmount / exchangeRates[depositMethod];
  const decimals = depositMethod === 'usdt' ? 2 : 5;

  const assetElement = document.querySelector('#assetEqu');
  if (assetElement) {
    assetElement.textContent = `${formatNumber(assetAmount, decimals)} ${depositMethod.toUpperCase()}`;
  }

  updatePaymentInstruction(depositMethod, assetAmount);
}

// Update payment instruction UI
function updatePaymentInstruction(method, amount) {
  const instructionElement = document.getElementById('paymentInstruction');
  if (!instructionElement) return;

  const network = method === 'usdt' ? ' TRC20' : '';
  const decimals = method === 'usdt' ? 2 : 5;
  const walletAddress = wallets[method] || 'Unknown Wallet';
  instructionElement.innerHTML = `Please send <b>${formatNumber(
    amount,
    decimals
  )} ${method.toUpperCase()}${network}</b> to the wallet address: <b>${walletAddress}</b>.`;
}

// Update UI elements
function updateUI({ amount, method }) {
  const wallet = wallets[method.toLowerCase()] || 'Unknown Wallet';
  const elements = {
    depositAmount: `$${amount}`,
    selectedMethod: method.toUpperCase(),
    walletAddress: wallet,
  };

  Object.entries(elements).forEach(([id, value]) => {
    const element = document.getElementById(id);
    if (element) element.textContent = value;
  });
}

// Initialize app
function initialize() {
  const data = {
    amount: localStorage.getItem('depositAmount'),
    method: localStorage.getItem('depositPMethod'),
  };

  if (data.amount && data.method) {
    updateUI(data);
    fetchExchangeRates();
  }
}

// Handle payment submission
async function handlePayNow({ amount, method }) {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch('/api/v1/deposit/deposit', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        asset: method.toUpperCase(),
        amount,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      Modal.error('Response Error', errorData.error);
      throw new Error(errorData.error || 'Deposit request failed');
    }

    // Clear stored crypto amounts
    ['btc', 'eth', 'usdt'].forEach((crypto) => localStorage.removeItem(crypto));
    // openPaymentModal();
    Modal.success("Success", "Deposit is being processed");
    setTimeout(() => {
      window.location.href = "../Dashboard.html"
    }, 2000);
    
  } catch (error) {
    console.error('Payment error:', error);
    Modal.error('Payment Error', error.message);
  }
}

// Open payment modal with status updates
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

  modalElement.addEventListener(
    'hidden.bs.modal',
    () => {
      window.location.href = '../Vitron-Dashboard/Dashboard.html';
    },
    { once: true }
  );
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  initialize();

  // Add event listener for the "Continue Now" button
  const continueButton = document.getElementById('payNowButton');
  if (continueButton) {
    continueButton.addEventListener('click', () => {
      const data = {
        amount: localStorage.getItem('depositAmount'), // Fixed key to match confirmD
        method: localStorage.getItem('depositPMethod'), // Fixed key to match confirmD
      };
      if (data.amount && data.method) {
        handlePayNow(data);
      } else {
        Modal.error('Invalid Data', 'Please ensure amount and payment method are set.');
      }
    });
  }
});