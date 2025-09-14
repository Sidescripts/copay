// Function to toggle password visibility
function togglePassword(inputId) {
    const passwordInput = document.getElementById(inputId);
    const toggleIcon = passwordInput.parentNode.querySelector('.password-toggle i');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.classList.replace('fa-eye', 'fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        toggleIcon.classList.replace('fa-eye-slash', 'fa-eye');
    }
}

// Function to create and show modal
function showModal(type, message) {
    // Remove existing modal if any
    const existingModal = document.getElementById('custom-modal');
    const existingBackdrop = document.querySelector('.modal-backdrop');
    
    if (existingModal) {
        existingModal.remove();
    }
    if (existingBackdrop) {
        existingBackdrop.remove();
    }
    
    // Create modal elements
    const modalBackdrop = document.createElement('div');
    modalBackdrop.className = 'modal-backdrop fade show';
    
    const modal = document.createElement('div');
    modal.className = 'modal fade show';
    modal.style.display = 'block';
    modal.style.backgroundColor = 'rgba(0,0,0,0.5)';
    modal.style.color = 'black';
    modal.style.textAlign = 'center';
    modal.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)';
    modal.style.borderRadius = '12px';
    modal.id = 'custom-modal';
    
    modal.innerHTML = `
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header ${type === 'error' ? 'bg-danger' : 'bg-success'} text-white">
                    <h5 class="modal-title">${type === 'error' ? 'Error' : 'Success'}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <p>${message}</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn ${type === 'error' ? 'btn-danger' : 'btn-success'}" id="modal-ok-button">OK</button>
                </div>
            </div>
        </div>
    `;
    
    // Add to document
    document.body.appendChild(modalBackdrop);
    document.body.appendChild(modal);
    
    // Add event listener to OK button
    const okButton = document.getElementById('modal-ok-button');
    okButton.addEventListener('click', function() {
        if (type === 'success') {
            // Redirect to dashboard on success
            window.location.href = '../Vitron-dashboard/dashboard.html';
        } else {
            // Just close the modal on error
            modalBackdrop.remove();
            modal.remove();
        }
    });
    
    // Close modal when clicking close button
    const closeButton = modal.querySelector('.btn-close');
    closeButton.addEventListener('click', function() {
        modalBackdrop.remove();
        modal.remove();
    });
    
    // Close modal when clicking outside
    modalBackdrop.addEventListener('click', function() {
        modalBackdrop.remove();
        modal.remove();
    });
}

// Form validation function
function validateForm(formData) {
    const errors = [];
    
    // if(!formData.username || !formData.password){
    //     errors.push('All fields are required');
    // }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
        errors.push('Email is required');
    } else if (!emailRegex.test(formData.email)) {
        errors.push('Please enter a valid email address');
    }
    
    // Password validation
    if (!formData.password) {
        errors.push('Password is required');
    } else if (formData.password.length < 6) {
        errors.push('Password must be at least 6 characters long');
    }
    
    return errors;
}
const submitButton = document.getElementById('submitButton');

// Function to handle form submission
async function handleLogin(event) {
    event.preventDefault();
    
    // Get form data
    const formData = {
        
        email: document.getElementById('login-email-input').value,
        password: document.getElementById('login-password-input').value
    };
    
    
    submitButton.disabled = true;
    submitButton.textContent = 'Processing...';
    
    // Validate form
    const errors = validateForm(formData);
    
    if (errors.length > 0) {
        // Show error modal with all validation errors
        showModal('error', errors.join('<br>'));
        submitButton.disabled = false;
        submitButton.textContent = 'Login';
        return;
    }
    
    try {
        
        const response = await fetch('/api/v1/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();
        console.log(data)
        submitButton.disabled = false;
        submitButton.textContent = 'Login';

        if(response.ok){
            localStorage.removeItem('token')
            localStorage.setItem('token', data.token);
            localStorage.setItem('email', data.user.email);
            submitButton.disabled = false;
            submitButton.textContent = 'Login';
            // console.log('Token received:', data.token);
            showModal('success', 'Welcome back to Vitron-trade. Redirecting to dashboard...');
        }else{
            // Enhanced error handling
            let errorMessage = 'Network error. Please try again later.';
            
            if (data.error) {
                errorMessage = data.error;
            } else if (data.message) {
                errorMessage = data.message;
            } else if (data.details && Array.isArray(data.details)) {
                errorMessage = data.details.map(detail => detail.message).join(', ');
            }
            submitButton.disabled = false;
            submitButton.textContent = 'Login';
            showModal('error', errorMessage);

        }
        
    } catch (error) {
        console.error('Signup error:', error);
        submitButton.disabled = false;
        submitButton.textContent = 'Login';
        showModal('error', 'Network error. Please check your connection and try again.');
    } finally {
        // Always re-enable the button
        submitButton.disabled = false;
        submitButton.textContent = 'Login';
    }
}

// Add event listener when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Add input event listeners for real-time validation styling
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value.trim() !== '') {
                this.classList.add('has-value');
            } else {
                this.classList.remove('has-value');
            }
        });
        
        // Initialize has-value class for pre-filled inputs
        if (input.value.trim() !== '') {
            input.classList.add('has-value');
        }
    });
});