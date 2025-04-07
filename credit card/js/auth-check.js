document.addEventListener('DOMContentLoaded', function() {
    // Check authentication status
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    
    if (!isLoggedIn) {
        // Redirect to login page if not authenticated
        window.location.href = 'login.html';
        return;
    }
    
    // Display user info
    const userEmail = localStorage.getItem('userEmail');
    const userName = localStorage.getItem('userName') || userEmail;
    
    if (document.getElementById('userName')) {
        document.getElementById('userName').textContent = userName;
    }
    
    // Handle logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('userEmail');
            localStorage.removeItem('userName');
            window.location.href = 'login.html';
        });
    }
});