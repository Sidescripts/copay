// ────────────────────────────────────────────────
// Password toggle functionality
// ────────────────────────────────────────────────
function togglePasswordVisibility(inputId) {
    const input = document.getElementById(inputId);
    if (!input) return;

    const icon = input.parentElement?.querySelector('.password-toggle i');
    if (!icon) return;

    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.replace('fa-eye', 'fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.replace('fa-eye-slash', 'fa-eye');
    }
}

// ────────────────────────────────────────────────
// Form data collection
// ────────────────────────────────────────────────
function getFormData() {
    return {
        username: document.getElementById('username-input')?.value.trim() || '',
        fullname: document.getElementById('fullname-input')?.value.trim() || '',
        country: document.getElementById('country-input')?.value.trim() || '',
        email: document.getElementById('email-input')?.value.trim() || '',
        password: document.getElementById('password-input')?.value || '',
        confirmPassword: document.getElementById('confirm-password-input')?.value || ''
    };
}

// ────────────────────────────────────────────────
// Validation rules
// ────────────────────────────────────────────────
function validateForm(data) {
    const errors = [];

    // Username
    if (!data.username) {
        errors.push('Username is required');
    } else if (data.username.length < 3) {
        errors.push('Username must be at least 3 characters');
    } else if (!/^(?=.*\d)[a-zA-Z0-9_]{3,}$/.test(data.username)) {
        errors.push('Username must contain at least one number');
    }

    // Full name
    if (!data.fullname.trim()) {
        errors.push('Full name is required');
    }

    // Country
    if (!data.country.trim()) {
        errors.push('Country is required');
    }

    // Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email) {
        errors.push('Email is required');
    } else if (!emailRegex.test(data.email)) {
        errors.push('Please enter a valid email address');
    }

    // Password
    if (!data.password) {
        errors.push('Password is required');
    } else if (data.password.length < 6) {
        errors.push('Password must be at least 6 characters');
    }

    // Confirm password
    if (data.password !== data.confirmPassword) {
        errors.push('Passwords do not match');
    }

    return errors;
}

// ────────────────────────────────────────────────
// UI feedback helpers
// ────────────────────────────────────────────────
const submitButton = document.getElementById('submitButton');

function setButtonLoading(isLoading = true) {
    if (!submitButton) return;
    submitButton.disabled = isLoading;
    submitButton.textContent = isLoading ? 'Processing...' : 'Sign Up';
}

function showError(message) {
    Modal?.error('Signup Error', message);
}

function showSuccess() {
    Modal?.success('Success', 'Account created successfully! Redirecting...');
}

// ────────────────────────────────────────────────
// Main signup handler
// ────────────────────────────────────────────────
async function handleSignup(event) {
    event.preventDefault();

    const formData = getFormData();
    const errors = validateForm(formData);

    if (errors.length > 0) {
        showError(errors.join(' • '));
        return;
    }

    setButtonLoading(true);

    try {
        const response = await fetch('/api/v1/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (response.ok) {
            // Save authentication data
            localStorage.setItem('token', result.token);
            localStorage.setItem('email', result.user?.email || formData.email);
            localStorage.setItem('username', result.user?.username || formData.username);

            showSuccess();

            setTimeout(() => {
                window.location.href = '../Vitron-dashboard/Dashboard.html';
            }, 1800);
        } else {
            // Try to extract meaningful error message
            let errorMsg = 'Something went wrong. Please try again.';

            if (result.error) {
                errorMsg = result.error;
            } else if (result.message) {
                errorMsg = result.message;
            } else if (result.details?.length) {
                errorMsg = result.details.map(d => d.message || d).join(' • ');
            } else if (typeof result === 'string') {
                errorMsg = result;
            }

            showError(errorMsg);
        }
    } catch (err) {
        console.error('Signup failed:', err);
        showError('Network error. Please check your connection.');
    } finally {
        setButtonLoading(false);
    }
}

// ────────────────────────────────────────────────
// Initialization
// ────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('signup-form');
    if (form) {
        form.addEventListener('submit', handleSignup);
    }

    // Floating label / has-value behavior
    document.querySelectorAll('input').forEach(input => {
        const updateHasValue = () => {
            input.classList.toggle('has-value', input.value.trim() !== '');
        };

        input.addEventListener('input', updateHasValue);
        input.addEventListener('blur', updateHasValue);

        // Initial check
        updateHasValue();
    });

    // Optional: expose toggle function globally if needed for inline onclick
    window.togglePassword = togglePasswordVisibility;
});