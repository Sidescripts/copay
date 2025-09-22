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


// Form validation function
function validateForm(formData) {
    const errors = [];
    
    if(!formData){
        errors.push('All field(s) are required');
    }

    // Username validation
    if (!formData.username.trim()) {
        errors.push('Username is required');
    } else if (formData.username.length < 3) {
        errors.push('Username must be at least 3 characters long');
    }
    
    // Full name validation
    if (!formData.fullname.trim()) {
        errors.push('Full name is required');
    }
    
    // Country validation
    if (!formData.country.trim()) {
        errors.push('Country is required');
    }
    
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
    
    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
        errors.push('Passwords do not match');
    }
    
    return errors;
}
const submitButton = document.getElementById('submitButton');

// Function to handle form submission
async function handleSignup(event) {
    event.preventDefault();
    
    // Get form data
    const formData = {
        username: document.getElementById('username-input').value,
        fullname: document.getElementById('fullname-input').value,
        country: document.getElementById('country-input').value,
        email: document.getElementById('email-input').value,
        password: document.getElementById('password-input').value,
        confirmPassword: document.getElementById('confirm-password-input').value
    };
    
    
    submitButton.disabled = true;
    submitButton.textContent = 'Processing...';
    
    // Validate form
    const errors = validateForm(formData);
    
    if (errors.length > 0) {
                // Always re-enable the button
        submitButton.disabled = false;
        submitButton.textContent = 'Sign Up';
        // Show error modal with all validation errors
        Modal.error('Signup Error', errors.join(', '));
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
        // console.log(data)
                // Always re-enable the button
        submitButton.disabled = false;
        submitButton.textContent = 'Sign Up';
        
        if(response.ok){
            localStorage.setItem('token', data.token);
            localStorage.setItem('email', data.user.email);
            localStorage.setItem('username', data.user.username);
            Modal.success('success', 'Account created successfully! Redirecting to dashboard...');
            setTimeout(() =>{
                window.location.href = "../Vitron-Dashboard/Dashboard.html"
            }, 2000)
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
                // Always re-enable the button
                submitButton.disabled = false;
                submitButton.textContent = 'Sign Up';
            Modal.error('error', errorMessage);

        }
        
    } catch (error) {
        console.error('Signup error:', error);
        Modal.error('error', 'Network error. Please check your connection and try again.');
    } finally {
        // Always re-enable the button
        submitButton.disabled = false;
        submitButton.textContent = 'Sign Up';
    }
}

// Add event listener when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
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