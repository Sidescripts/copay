document.addEventListener('DOMContentLoaded', function() {
    // Check if user is authenticated
    function checkAuth() {
        const token = localStorage.getItem('authToken');
        const email = localStorage.getItem('userEmail');
        
        if (!token || !email) {
            // Redirect to login if not authenticated
            window.location.href = '../index.html';
            return;
        }
        
        // Verify token validity (in a real app, you might decode and verify expiry)
        console.log('User authenticated:', email);
    }
     // Check authentication status
    checkAuth();

    function getToken(){
        localStorage.getItem(token, "token")
    }
});