document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const authTabs = document.querySelectorAll('.auth-tab');
    const authForms = document.querySelectorAll('.auth-form');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const googleLogin = document.getElementById('googleLogin');
    
    // Error elements
    const loginError = document.createElement('div');
    loginError.className = 'error-message';
    loginForm.appendChild(loginError);
    
    const registerError = document.createElement('div');
    registerError.className = 'error-message';
    registerForm.appendChild(registerError);
    
    // Switch between login/register tabs
    authTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabName = this.dataset.tab;
            
            // Update active tab
            authTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding form
            authForms.forEach(form => form.classList.remove('active'));
            document.getElementById(`${tabName}Form`).classList.add('active');
            
            // Clear errors
            loginError.style.display = 'none';
            registerError.style.display = 'none';
        });
    });
    
    // Handle login form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        // Simple validation
        if (!email || !password) {
            loginError.textContent = 'Please fill in all fields';
            loginError.style.display = 'block';
            return;
        }
        
        // Simulate authentication (in real app, this would be a server call)
        if (password.length < 6) {
            loginError.textContent = 'Invalid credentials';
            loginError.style.display = 'block';
            return;
        }
        
        // Store user data in localStorage
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', email);
        
        // Redirect to fraud detection page
        window.location.href = 'fraud-detection.html';
    });
    
    // Handle registration form submission
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('registerConfirm').value;
        
        // Validation
        if (!name || !email || !password || !confirmPassword) {
            registerError.textContent = 'Please fill in all fields';
            registerError.style.display = 'block';
            return;
        }
        
        if (password !== confirmPassword) {
            registerError.textContent = 'Passwords do not match';
            registerError.style.display = 'block';
            return;
        }
        
        if (password.length < 6) {
            registerError.textContent = 'Password must be at least 6 characters';
            registerError.style.display = 'block';
            return;
        }
        
        // Store user data in localStorage
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userName', name);
        
        // Redirect to fraud detection page
        window.location.href = 'fraud-detection.html';
    });
    
    // Google login handler
    googleLogin.addEventListener('click', function() {
        // In a real app, implement Google OAuth
        alert('Google login would be implemented here');
        
        // Simulate successful Google login
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', 'google-user@example.com');
        localStorage.setItem('userName', 'Google User');
        
        window.location.href = 'fraud-detection.html';
    });
});