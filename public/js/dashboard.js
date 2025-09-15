document.addEventListener('DOMContentLoaded', () => {
    // Hide preloader after page load
    const preloader = document.getElementById('preloader');
    if (preloader) {
      preloader.style.display = 'none';
    }
  
    // Function to fetch dashboard data
    async function fetchDashboardData() {
      try {
        const token = localStorage.getItem('token'); // Get token for authentication
        const response = await fetch('/api/v1/user/dashboard', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
  
        
        if (!response.ok) {
          showErrorModal("Failed to fetch dashboard data")
          //   throw new Error('Failed to fetch dashboard data');
        }
  
        const data = await response.json();
        console.log(data)
        updateDashboard(data);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        showErrorModal('Failed to load dashboard data. Please try again later.')
        
      }
    }
  
    // Function to update the dashboard UI
    function updateDashboard(data) {
        const {
            bchBal,
            bnbBal,
            btcBal,
            dashBal,
            dogeBal,
            ethBal,
            ltcBal,
            usdtBal
        } = data;
      // Update Total Balance and Revenue
      document.querySelector('.card-top h1').textContent = `$${Number(data.walletBalance.toFixed(2))}`;
      document.querySelector('.card-bottom h1').textContent = `$${data.totalRevenue.toFixed(2)}`;
  
      // Update Account Summary
      document.querySelector('#account .card-styles:nth-child(1) h1 b').textContent = data.activeInvestments.toFixed(2);
      document.querySelector('#account .card-styles:nth-child(2) h1 b').textContent = data.totalRevenue.toFixed(2);
      document.querySelector('#account .card-styles:nth-child(3) h1 b').textContent = data.totalWithdrawal.toFixed(2);
       
      // update cryto assest bal
      document.getElementsByClassName('btcEqu').textContent = `$${btcBal.toFixed(2)}`;
      document.getElementsByClassName('ethEqu').textContent = `$${ethBal.toFixed(2)}`;
      document.getElementsByClassName('usdtEqu').textContent = `$${usdtBal.toFixed(2)}`;

    
    
    }
  
    // Initialize dashboard
    fetchDashboardData();
  });