document.addEventListener('DOMContentLoaded', () => {
  // Constants for DOM elements, API, and paths
  const PRELOADER = document.getElementById('preloader');
  const API_ENDPOINT = '/api/v1/user/dashboard';
  const LOGIN_PAGE = '../pages/login.html'; // Adjust this path to your login page
  const SELECTORS = {
      username: '#username', // Adjusted to a more likely ID selector
      totalBalance: '.card-top h1',
      totalRevenue: '.RevenueSum',
      activeInvestments: '.active-revenue',
      totalRevenueSummary: '.RevenueSum',
      totalWithdrawal: '.withdrawal-summary',
      btcBalance: '.btcEqu',
      ethBalance: '.ethEqu',
      usdtBalance: '.usdtEqu'
  };

  // Helper function to format currency
  const formatCurrency = (value, decimals = 2) => {
      return isNaN(value) ? '$0.00' : `$${Number(value).toFixed(decimals)}`;
  };

  // Hide preloader after page load
  if (PRELOADER) {
      PRELOADER.style.display = 'none';
  }
username
  // Function to redirect to login page
  const redirectToLogin = () => {
      localStorage.removeItem('token'); // Clear invalid token
      localStorage.removeItem('username'); // Optional: Clear username
      window.location.href = LOGIN_PAGE;
  };

  // Function to fetch dashboard data
  async function fetchDashboardData() {
      const token = localStorage.getItem('token');

      // Check for token
      if (!token) {
          Modal.error('Token Error', 'Please login again');
          setTimeout(redirectToLogin, 2000); // Delay to show error before redirect
          return;
      }

      try {
          const response = await fetch(API_ENDPOINT, {
              method: 'GET',
              headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
              }
          });

          if (!response.ok) {
              if (response.status === 401) {
                  // Handle 401 Unauthorized or token expiration
                  const data = await response.json().catch(() => ({}));
                  if (data.message?.toLowerCase().includes('Token expired') || data.error?.toLowerCase().includes('token expired')) {
                      Modal.error('Session Expired', 'Your session has expired. Please log in again.');
                  } else {
                      Modal.error('Authentication Error', 'Unauthorized access. Please log in.');
                  }
                  setTimeout(redirectToLogin, 2000); // Delay to show error before redirect
                  return;
              }
              Modal.error('Response Error', 'Failed to load dashboard');
              throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const data = await response.json();
          console.log('Dashboard data:', data);
          updateDashboard(data);

      } catch (error) {
          console.error('Error fetching dashboard data:', error);
          Modal.error('Server Error', 'Failed to load dashboard due to a network error');
      }
  }

  // Function to update the dashboard UI
  function updateDashboard(data) {
      // Validate data structure
      if (!data || typeof data !== 'object') {
          Modal.error('Data Error', 'Invalid dashboard data received');
          return;
      }

      const {
          walletBalance = 0,
          totalRevenue = 0,
          activeInvestments = 0,
          totalWithdrawal = 0,
          btcBal = 0,
          ethBal = 0,
          usdtBal = 0
      } = data;

      // Get username with fallback
      const username = localStorage.getItem('username') || 'User';

      // Update DOM elements
      const updateElement = (selector, value) => {
          const element = document.querySelector(selector);
          if (element) {
              element.textContent = value;
          } else {
              console.warn(`Element not found for selector: ${selector}`);
          }
      };

      updateElement(SELECTORS.username, username);
      updateElement(SELECTORS.totalBalance, formatCurrency(walletBalance, 3));
      updateElement(SELECTORS.totalRevenue, formatCurrency(totalRevenue, 3));
      updateElement(SELECTORS.activeInvestments, formatCurrency(activeInvestments, 2));
      updateElement(SELECTORS.totalRevenueSummary, formatCurrency(totalRevenue, 2));
      updateElement(SELECTORS.totalWithdrawal, formatCurrency(totalWithdrawal, 2));
      updateElement(SELECTORS.btcBalance, formatCurrency(btcBal, 2));
      updateElement(SELECTORS.ethBalance, formatCurrency(ethBal, 2));
      updateElement(SELECTORS.usdtBalance, formatCurrency(usdtBal, 2));
  }

  // Initialize dashboard
  fetchDashboardData();
});
