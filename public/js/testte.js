// confirmation.js - Handle confirmation page
document.addEventListener('DOMContentLoaded', function() {
  // Get withdrawal data from localStorage
  const withdrawalData = JSON.parse(localStorage.getItem('pendingWithdrawal'));
  
  if (!withdrawalData) {
      // Redirect back if no data
      window.location.href = '../dashboard.html';
      return;
  }

  // Display withdrawal details on confirmation page
  displayWithdrawalDetails(withdrawalData);

  // Setup confirm button
  document.getElementById('confirmWithdrawalBtn').addEventListener('click', function() {
      processWithdrawal(withdrawalData);
  });

  // Setup cancel button
  document.getElementById('cancelWithdrawalBtn').addEventListener('click', function() {
      localStorage.removeItem('pendingWithdrawal');
      window.location.href = '../dashboard.html';
  });
});
withdrawalAmount
processingFee
netAmount
selectedMethod
walletAddress

function displayWithdrawalDetails(data) {
  document.getElementById('confirmationMethod').textContent = data.displayMethod;
  document.getElementById('confirmationAmount').textContent = `$${data.amount.toFixed(2)}`;
  document.getElementById('confirmationWallet').textContent = data.walletAddress;
  document.getElementById('confirmationDate').textContent = new Date(data.timestamp).toLocaleString();
}

async function processWithdrawal(formData) {
  const submitBtn = document.getElementById('confirmWithdrawalBtn');
  const cancelBtn = document.getElementById('cancelWithdrawalBtn');
  const statusDiv = document.getElementById('withdrawalStatus');

  // Show loading state
  submitBtn.disabled = true;
  cancelBtn.disabled = true;
  submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Processing...';
  statusDiv.innerHTML = '<div class="alert alert-info">Processing your withdrawal...</div>';

  try {
      const result = await submitWithdrawal(formData);
      
      // Show success
      statusDiv.innerHTML = `
          <div class="alert alert-success">
              <i class="bi bi-check-circle-fill"></i> 
              ${result.message || 'Withdrawal processed successfully!'}
          </div>
      `;
      
      // Clear stored data
      localStorage.removeItem('pendingWithdrawal');
      
      // Redirect after delay
      setTimeout(() => {
          window.location.href = '../dashboard.html';
      }, 3000);

  } catch (error) {
      // Show error
      statusDiv.innerHTML = `
          <div class="alert alert-danger">
              <i class="bi bi-exclamation-triangle-fill"></i> 
              ${error.message || 'Failed to process withdrawal. Please try again.'}
          </div>
      `;
      
      // Re-enable buttons
      submitBtn.disabled = false;
      cancelBtn.disabled = false;
      submitBtn.textContent = 'Confirm Withdrawal';
  }
}