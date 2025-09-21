// API endpoints
const CHANGE_PASSWORD_ENDPOINT = '/api/v1/user/change-password';
const USER_DETAILS_ENDPOINT = '/api/v1/user/get-user';

// Get authentication token
function getAuthToken() {
    return localStorage.getItem('token');
}

// Show message function
function showMessage(message, type) {
    const messageDiv = document.getElementById('form-message');
    messageDiv.textContent = message;
    messageDiv.className = type === 'error' ? 'error' : 'success';
    messageDiv.style.display = 'block';
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 5000);
}

// Toggle password visibility
function togglePassword(inputId, element) {
    const passwordInput = document.getElementById(inputId);
    const icon = element.querySelector('i');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.classList.remove('bi-eye');
        icon.classList.add('bi-eye-slash');
    } else {
        passwordInput.type = 'password';
        icon.classList.remove('bi-eye-slash');
        icon.classList.add('bi-eye');
    }
}

// Validate password requirements
function validatePassword(password) {
    // Check length
    const hasLength = password.length >= 8;
    document.getElementById('req-length').className = hasLength ? 'valid' : 'invalid';
    
    // Check uppercase
    const hasUppercase = /[A-Z]/.test(password);
    document.getElementById('req-uppercase').className = hasUppercase ? 'valid' : 'invalid';
    
    // Check number
    const hasNumber = /[0-9]/.test(password);
    document.getElementById('req-number').className = hasNumber ? 'valid' : 'invalid';
    
    // Check special character
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    document.getElementById('req-special').className = hasSpecial ? 'valid' : 'invalid';
    
    return hasLength && hasUppercase && hasNumber && hasSpecial;
}

// Get user details to check current password (if API allows)
async function getUserDetails() {
    const authToken = getAuthToken();
    
    if (!authToken) {
        return null;
    }
    
    try {
        const response = await fetch(USER_DETAILS_ENDPOINT, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            return data;
        }
    } catch (error) {
        console.error('Error fetching user details:', error);
    }
    
    return null;
}

// Change password API call
async function changePassword(currentPassword, newPassword) {
    const authToken = getAuthToken();
    
    if (!authToken) {
        showMessage('Authentication token missing. Please log in again.', 'error');
        return { success: false, message: 'Authentication token missing' };
    }
    
    try {
        const response = await fetch(CHANGE_PASSWORD_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({
                currentPassword: currentPassword,
                newPassword: newPassword
            })
        });
        
        const data = await response.json();
        
        if (response.status == 401) {
            Modal.error("unauthenticated", "Section expired, please login again.");
            setTimeout(() => {
                window.location.href = "../../pages/login.html"
            }, 3000);
        }

        if (response.ok) {
            Modal.success("success", "Password has been successfuly changed");
            return { success: true, data: data };
        } else {
            Modal.error("error", "Failed to change password")
            return { 
                success: false, 
                message: data.message || 'Failed to change password' 
            };
        }
    } catch (error) {
        console.error('Error changing password:', error);
        return { 
            success: false, 
            message: 'Network error. Please check your connection.' 
        };
    }
}

// Form submission handling
document.getElementById('change-password-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const submitBtn = document.getElementById('submit-btn');
    
    // Reset any previous messages
    document.getElementById('form-message').style.display = 'none';
    
    // Check if new password is the same as current password
    if (newPassword === currentPassword) {
        showMessage('New password cannot be the same as your current password.', 'error');
        return;
    }
    
    // Validate new password meets requirements
    if (!validatePassword(newPassword)) {
        showMessage('New password does not meet requirements.', 'error');
        return;
    }
    
    // Check if new passwords match
    if (newPassword !== confirmPassword) {
        showMessage('New passwords do not match.', 'error');
        return;
    }
    
    // Disable submit button and show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="loading"></span> Updating...';
    
    // Call the change password API
    const result = await changePassword(currentPassword, newPassword);
    
    // Re-enable submit button
    submitBtn.disabled = false;
    submitBtn.innerHTML = 'Update Password';
    
    if (result.success) {
        showMessage('Password changed successfully!', 'success');
        
        // Clear form fields
        document.getElementById('current-password').value = '';
        document.getElementById('new-password').value = '';
        document.getElementById('confirm-password').value = '';
        
        // Redirect back to settings after a delay
        setTimeout(() => {
            window.location.href = './profile-settings.html';
        }, 2000);
    } else {
        showMessage(result.message || 'Failed to change password. Please try again.', 'error');
    }
});

// Real-time password validation as user types
document.getElementById('new-password').addEventListener('input', function() {
    validatePassword(this.value);
    
    // Check if new password is the same as current password
    const currentPassword = document.getElementById('current-password').value;
    if (this.value && this.value === currentPassword) {
        showMessage('New password cannot be the same as your current password.', 'error');
    } else {
        document.getElementById('form-message').style.display = 'none';
    }
});

// Also check when current password changes
document.getElementById('current-password').addEventListener('input', function() {
    const newPassword = document.getElementById('new-password').value;
    if (newPassword && newPassword === this.value) {
        showMessage('New password cannot be the same as your current password.', 'error');
    } else {
        document.getElementById('form-message').style.display = 'none';
    }
});

// Check if user is authenticated on page load and set up password toggle listeners
document.addEventListener('DOMContentLoaded', function() {
    const authToken = getAuthToken();
    if (!authToken) {
        showMessage('Please log in to change your password.', 'error');
        // window.location.href = './login.html';
    }

    // Attach event listeners for password toggle buttons
    document.querySelectorAll('.password-toggle').forEach(toggle => {
        toggle.addEventListener('click', function() {
            const inputId = this.getAttribute('data-input-id');
            togglePassword(inputId, this);
        });
    });
});