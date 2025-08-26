const App = (function() {
  // Modal elements
  const modalElements = {
    modal: null,
    modalTitle: null,
    modalBody: null
  };

  // Form elements
  const formElements = {
    form: null,
    inputs: {
      username: null,
      fullname: null,
      country: null,
      email: null,
      password: null,
      confirmPassword: null
    }
  };

  // Form validation logic
  function validateForm(formData) {
    const errors = [];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.username || formData.username.length < 3) {
      errors.push('Username must be at least 3 characters long');
    }

    if (!formData.fullname || formData.fullname.trim().split(/\s+/).length < 2) {
      errors.push('Please enter your full name (first and last name)');
    }

    if (!formData.country) {
      errors.push('Please select your country');
    }

    if (!formData.email || !emailRegex.test(formData.email)) {
      errors.push('Please enter a valid email address');
    }

    if (!formData.password || formData.password.length < 6) {
      errors.push('Password must be at least 6 characters long');
    }

    if (formData.password !== formData.confirmPassword) {
      errors.push('Passwords do not match');
    }

    return errors;
  }

  // Initialize modal elements
  function initializeModal() {
    try {
      modalElements.modalTitle = document.getElementById('modalTitle');
      modalElements.modalBody = document.getElementById('modalBody');
      modalElements.modal = document.getElementById('feedbackModal');

      if (!modalElements.modalTitle || !modalElements.modalBody || !modalElements.modal) {
        console.error('Modal elements not found');
        return false;
      }

      // Add close button event listener
      const closeButton = modalElements.modal.querySelector('.modal-close');
      if (closeButton) {
        closeButton.addEventListener('click', hideModal);
      }

      return true;
    } catch (error) {
      console.error('Modal initialization error:', error);
      return false;
    }
  }

  // Initialize form elements
  function initializeForm() {
    try {
      formElements.form = document.getElementById('signup-form');
      formElements.inputs.username = document.getElementById('username-input');
      formElements.inputs.fullname = document.getElementById('fullname-input');
      formElements.inputs.country = document.getElementById('country-input');
      formElements.inputs.email = document.getElementById('email-input');
      formElements.inputs.password = document.getElementById('password-input');
      formElements.inputs.confirmPassword = document.getElementById('confirm-password-input');

      if (!formElements.form || Object.values(formElements.inputs).some(input => !input)) {
        console.error('Form or input elements not found');
        return false;
      }

      formElements.form.addEventListener('submit', handleSignup);
      return true;
    } catch (error) {
      console.error('Form initialization error:', error);
      return false;
    }
  }

  // Sanitize input to prevent XSS
  function sanitizeInput(input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
  }

  // Show modal with title, message, and optional success state
  function showModal(title, message, isSuccess = false) {
    if (!modalElements.modalTitle || !modalElements.modalBody || !modalElements.modal) {
      console.error('Modal not initialized properly');
      return;
    }

    try {
      modalElements.modalTitle.textContent = title;
      modalElements.modalBody.innerHTML = `
        <p style="color: black;">${sanitizeInput(message)}</p>
        <div class="text-end">
          ${isSuccess 
            ? '<button id="redirectBtn" class="modal-button modal-button-primary">Go to Dashboard</button>'
            : '<button type="button" class="modal-button modal-button-secondary modal-close">Close</button>'
          }
        </div>
      `;

      modalElements.modal.style.display = 'block';
      modalElements.modal.classList.add('modal-visible');

      if (isSuccess) {
        const redirectBtn = document.getElementById('redirectBtn');
        if (redirectBtn) {
          redirectBtn.addEventListener('click', () => {
            window.location.href = '../Vitron-dashboard/dashboard.html';
          });
        }
      }
    } catch (error) {
      console.error('Error showing modal:', error);
    }
  }

  // Hide modal
  function hideModal() {
    if (modalElements.modal) {
      modalElements.modal.style.display = 'none';
      modalElements.modal.classList.remove('modal-visible');
    }
  }

  // Handle form submission
  async function handleSignup(event) {
    event.preventDefault();

    const formData = {
      username: formElements.inputs.username.value.trim(),
      fullname: formElements.inputs.fullname.value.trim(),
      country: formElements.inputs.country.value.trim(),
      email: formElements.inputs.email.value.trim(),
      password: formElements.inputs.password.value,
      confirmPassword: formElements.inputs.confirmPassword.value
    };

    const errors = validateForm(formData);
    if (errors.length > 0) {
      showModal('Validation Error', errors.join('<br>'));
      return;
    }

    try {
      const response = await fetch('/api/v1/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok && data.token) {
        // Save token and email to localStorage
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userEmail', formData.email);
        console.log('Token received:', data.token);
        showModal('Success', 'Your account has been created successfully!', true);
      } else {
        showModal('Error', data.message || 'An error occurred during signup');
      }
    } catch (error) {
      console.error('Signup error:', error);
      showModal('Error', 'Network error. Please try again later.');
    }
  }

  // Initialize both modal and form
  function initialize() {
    const modalInitialized = initializeModal();
    const formInitialized = initializeForm();
    return modalInitialized && formInitialized;
  }

  return {
    init: initialize,
    showModal: showModal,
    hideModal: hideModal
  };
})();

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
  if (!App.init()) {
    console.error('Failed to initialize application');
  }
});