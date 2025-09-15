
// === CoinGecko API ===
const API_BASE_URL = 'https://api.coingecko.com/api/v3';
const CRYPTO_IDS = {
  btc: 'bitcoin',
  eth: 'ethereum',
  usdt: 'tether'
};
const CURRENCY = 'usd';

// Store live prices
let exchangeRates = {};

// Fetch live prices
async function fetchExchangeRates() {
  try {
    const response = await fetch(
      `${API_BASE_URL}/simple/price?ids=${Object.values(CRYPTO_IDS).join(',')}&vs_currencies=${CURRENCY}`
    );

    if (!response.ok) throw new Error('Failed to fetch exchange rates');

    const data = await response.json();

    exchangeRates = {
      btc: data[CRYPTO_IDS.btc].usd,
      eth: data[CRYPTO_IDS.eth].usd,
      usdt: data[CRYPTO_IDS.usdt].usd
    };

    updateBalances();
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
  }
}

// Update balances dynamically
function updateBalances() {
  // === BTC ===
  const btcUsdText = document.querySelector('.btcEqu')?.textContent || '$0';
  const btcUsd = parseFloat(btcUsdText.replace(/[^0-9.]/g, '')) || 0;
  document.querySelector('.btcBal').textContent =
    (btcUsd / exchangeRates.btc).toFixed(6) + ' BTC';

  // === ETH ===
  const ethUsdText = document.querySelector('.ethEqu')?.textContent || '$0';
  const ethUsd = parseFloat(ethUsdText.replace(/[^0-9.]/g, '')) || 0;
  document.querySelector('.ethBal').textContent =
    (ethUsd / exchangeRates.eth).toFixed(6) + ' ETH';

  // === USDT ===
  const usdtUsdText = document.querySelector('.usdtEqu')?.textContent || '$0';
  const usdtUsd = parseFloat(usdtUsdText.replace(/[^0-9.]/g, '')) || 0;
  document.querySelector('.usdtBal').textContent =
    (usdtUsd / exchangeRates.usdt).toFixed(2) + ' USDT';
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  fetchExchangeRates();
  setInterval(fetchExchangeRates, 60000); // refresh every 1 min
});