// Vitron-dashboard/scripts/modals.js
// Function to load modals dynamically
async function loadModals() {
    try {
      const response = await fetch('/modal/modal.html');
      if (!response.ok) {
        throw new Error('Failed to load modals');
      }
      const modalHtml = await response.text();
      document.body.insertAdjacentHTML('beforeend', modalHtml);
    } catch (error) {
      console.error('Error loading modals:', error);
    }
  }
  
  // Function to show success modal with a custom message
  function showSuccessModal(message) {
    const modalElement = document.getElementById('successModal');
    const messageElement = document.getElementById('successModalMessage');
    if (modalElement && messageElement) {
      messageElement.textContent = message || 'Operation completed successfully.';
      const modal = new bootstrap.Offcanvas(modalElement);
      modal.show();
    } else {
      console.error('Success modal not found. Ensure modals are loaded.');
    }
  }
  
  // Function to show error modal with a custom message
  function showErrorModal(message) {
    const modalElement = document.getElementById('errorModal');
    const messageElement = document.getElementById('errorModalMessage');
    if (modalElement && messageElement) {
      messageElement.textContent = message || 'An error occurred. Please try again.';
      const modal = new bootstrap.Offcanvas(modalElement);
      modal.show();
    } else {
      console.error('Error modal not found. Ensure modals are loaded.');
    }
  }
  
  // Load modals when the script runs
  loadModals();