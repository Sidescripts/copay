// Authentication utilities
const authUtils = {
    // Save authentication data to localStorage
    saveAuthData: function(responseData) {
        if (responseData.token) {
            localStorage.setItem('authToken', responseData.token);
        }
        
        if (responseData.user) {
            localStorage.setItem('userData', JSON.stringify(responseData.user));
        }
    },
    
    // Check if user is authenticated
    isAuthenticated: function() {
        return !!localStorage.getItem('authToken');
    },
    
    // Get the stored token
    getToken: function() {
        return localStorage.getItem('authToken');
    },
    
    // Get user data
    getUser: function() {
        const userData = localStorage.getItem('userData');
        return userData ? JSON.parse(userData) : null;
    },
    
    // Function to add token to API requests
    authHeader: function() {
        const token = this.getToken();
        return token ? { 'Authorization': 'Bearer ' + token } : {};
    },
    
    // Check if token is expired (basic implementation)
    isTokenExpired: function() {
        const token = this.getToken();
        if (!token) return true;
        
        try {
            // Decode the token payload (middle part between the dots)
            const payload = JSON.parse(atob(token.split('.')[1]));
            // Check if expiration time is in the past
            return payload.exp * 1000 < Date.now();
        } catch (e) {
            console.error('Error decoding token:', e);
            return true;
        }
    }
};

// Authentication check for protected pages
function requireAuth() {
    if (!authUtils.isAuthenticated() || authUtils.isTokenExpired()) {
        // Redirect to login page if not authenticated or token is expired
        window.location.href = '../pages/login.html';
        return false;
    }
    return true;
}