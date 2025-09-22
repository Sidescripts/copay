  // Configuration
      const API_BASE = '/api/v1/invest/plans';

      // Show error message in UI
      function showError(message) {
        console.error(`UI Error: ${message}`);
        const errorDiv = document.getElementById('errorMessage');
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
      }

      // Hide error message
      function hideError() {
        console.log('Cleared UI error message');
        const errorDiv = document.getElementById('errorMessage');
        errorDiv.style.display = 'none';
      }

      // Fetch investment plans
      async function fetchPlans() {
        console.log('Fetching investment plans...');
        const token = localStorage.getItem("token");
        try {
          const response = await fetch(API_BASE, {
            method: 'Get', 
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json' 
            }
          });
          if (response.status == 401) {
            setTimeout(() => {
              window.location.href ="../../../pages/login.html"
            }, 1500);
          }
          if (!response.ok) {
            console.error(`Plans API failed with status: ${response.status}`);
            throw new Error(`Failed to fetch plans: ${response.status}`);
          }
          const data = await response.json();
          console.log(data.data);
          console.log(`Fetched ${data.data.length} investment plans`);
          // return data.data;
          return data.data || data.plans || [];
        } catch (error) {
          console.error(`Error fetching plans: ${error.message}`);
          showError('Failed to load investment plans. Please try again later.');
          return [];
        }
      }

      // Render investment plans
      function renderPlans(plans) {
        console.log(`Rendering ${plans.length} investment plans`);
        const plansList = document.getElementById('plansList');
        plansList.innerHTML = '';

        if (plans.length === 0) {
          showError('No investment plans available.');
          console.log('No plans to display');
          return;
        }

        hideError();
        plans.forEach(plan => {
          const card = `
            <div class="col-12 col-md-6 pe-0">
              <div class="card plan-card me-4">
                <div class="card-body">
                  <h3 class="plan-title">${plan.name}</h3>
                  <p class="plan-sub">⏰ ${plan.duration_days}</p>
                  <ul class="plan-features">
                    <li><span>Min Investment</span> <b>$ ${Number(plan.min_amount).toFixed(2)}</b></li>
                    <li><span>Max Investment</span> <b>$ ${Number(plan.max_amount).toFixed(2)}</b></li>
                    <li><span>Capital Back</span> <b>Yes</b></li>
                    <li><span>Instant Withdrawal</span> <b>Yes</b></li>
                  </ul>
                  <div class="earn-box">
                    <p class="mb-1"><b>$ ${plan.description}</b></p>
                  </div>
                  <label class="btn btn-plan mb-3" data-bs-toggle="modal" data-bs-target="#investNowModal"
                    onclick="setPlan('${plan.id}', '${plan.name}', ${plan.min_amount}, ${plan.max_amount})">Invest Now</label>
                  <label class="btn btn-plan" data-bs-toggle="modal" data-bs-target="#investBalanceModal"
                    onclick="setBalancePlan('${plan.id}', '${plan.name}', ${plan.min_amount}, ${plan.max_amount})">Invest Using Balance</label>
                </div>
              </div>
            </div>
          `;
          plansList.insertAdjacentHTML('beforeend', card);
        });

        // Populate modal dropdowns
        const planSelect = document.getElementById('planSelect');
        const balancePlanSelect = document.getElementById('balancePlanSelect');
        planSelect.innerHTML = '<option selected disabled>Select Plan</option>';
        balancePlanSelect.innerHTML = '<option selected disabled>Select Plan</option>';
        plans.forEach(plan => {
          const option = `<option value="${plan.id}">${plan.name}</option>`;
          planSelect.insertAdjacentHTML('beforeend', option);
          balancePlanSelect.insertAdjacentHTML('beforeend', option);
        });
        console.log('Populated modal dropdowns');
      }
    

      // Fetch balance (placeholder, replace with actual API)
      // async function fetchBalance() {
      //   console.log('Fetching user balance...');
      //   try {
      //     // Replace with actual balance API
      //     const response = await fetch(`${API_BASE_URL}/user/balance`);
      //     if (!response.ok) {
      //       console.error(`Balance API failed with status: ${response.status}`);
      //       throw new Error('Failed to fetch balance');
      //     }
      //     const data = await response.json();
      //     console.log(`Fetched balance: $${data.balance}`);
      //     return data.balance;
      //   } catch (error) {
      //     console.error(`Error fetching balance: ${error.message}`);
      //     return 0;
      //   }
      // }

      // Initialize page
      document.addEventListener('DOMContentLoaded', async () => {
        console.log('Page loaded, initializing...');
        const plans = await fetchPlans();
        renderPlans(plans);

        // const balance = await fetchBalance();
        // document.getElementById('availableBalance').textContent = `$${balance}`;
        // console.log('Page initialization complete');
      });