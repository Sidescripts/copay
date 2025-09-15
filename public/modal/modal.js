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
  
  // Function to show a modal
  function showModal(modalId, message) {
    const modal = document.getElementById(modalId);
    const messageElement = document.getElementById(`${modalId}Message`);
    if (modal && messageElement) {
      messageElement.textContent = message || 'Operation completed successfully.';
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden'; // Prevent scrolling
    } else {
      console.error(`${modalId} not found. Ensure modals are loaded.`);
    }
  }
  
  // Function to close a modal
  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = ''; // Restore scrolling
    }
  }
  
  // Function to show success modal
  function showSuccessModal(message) {
    showModal('successModal', message);
  }
  
  // Function to show error modal
  function showErrorModal(message) {
    showModal('errorModal', message || 'An error occurred. Please try again.');
  }
  
  // Add event listener to close modals on overlay click
  document.addEventListener('click', (event) => {
    if (event.target.classList.contains('modal-wrapper')) {
      closeModal('successModal');
      closeModal('errorModal');
    }
  });
  
  // Add event listener for ESC key to close modals
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeModal('successModal');
      closeModal('errorModal');
    }
  });
  
  // Load modals when the script runs
  loadModals();