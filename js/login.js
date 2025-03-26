// Select DOM elements
const tabs = document.querySelectorAll('.tab');
const forms = document.querySelectorAll('form');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const togglePasswordIcons = document.querySelectorAll('.toggle-password');

// Tab switching functionality
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const target = tab.getAttribute('data-tab');
        
        // Update active tab
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // Show the target form
        forms.forEach(form => form.classList.remove('active'));
        document.getElementById(`${target}-form`).classList.add('active');
    });
});

// Toggle password visibility
togglePasswordIcons.forEach(icon => {
    icon.addEventListener('click', () => {
        const input = icon.previousElementSibling;
        const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
        input.setAttribute('type', type);
        icon.classList.toggle('fa-eye');
        icon.classList.toggle('fa-eye-slash');
    });
});

// Login form submission
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Simple validation
    if (!email || !password) {
        showErrorMessage(loginForm, 'Please fill in all fields');
        return;
    }
    
    if (!validateEmail(email)) {
        showErrorMessage(loginForm, 'Please enter a valid email address');
        return;
    }
    
    // Mock login process - would be replaced with real API call
    showLoadingState(loginForm.querySelector('.btn-login'));
    
    // Simulating API call
    setTimeout(() => {
        // Store user info in localStorage to maintain login state
        const userData = {
            email,
            name: email.split('@')[0], // Just for demo
            isLoggedIn: true
        };
        
        localStorage.setItem('grosfreshUser', JSON.stringify(userData));
        
        // Redirect to home page
        window.location.href = 'index.html';
    }, 1500);
});

// Register form submission
registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const fullName = document.getElementById('fullname').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const termsChecked = document.getElementById('terms').checked;
    
    // Simple validation
    if (!fullName || !email || !password || !confirmPassword) {
        showErrorMessage(registerForm, 'Please fill in all fields');
        return;
    }
    
    if (!validateEmail(email)) {
        showErrorMessage(registerForm, 'Please enter a valid email address');
        return;
    }
    
    if (password.length < 8) {
        showErrorMessage(registerForm, 'Password must be at least 8 characters long');
        return;
    }
    
    if (password !== confirmPassword) {
        showErrorMessage(registerForm, 'Passwords do not match');
        return;
    }
    
    if (!termsChecked) {
        showErrorMessage(registerForm, 'You must agree to the Terms of Service');
        return;
    }
    
    // Mock registration process - would be replaced with real API call
    showLoadingState(registerForm.querySelector('.btn-login'));
    
    // Simulating API call
    setTimeout(() => {
        // Store user info in localStorage to maintain login state
        const userData = {
            email,
            name: fullName,
            isLoggedIn: true
        };
        
        localStorage.setItem('grosfreshUser', JSON.stringify(userData));
        
        // Redirect to home page
        window.location.href = 'index.html';
    }, 1500);
});

// Social login buttons (simplified mock functionality)
document.querySelectorAll('.social-login').forEach(button => {
    button.addEventListener('click', function() {
        const provider = this.classList.contains('google') ? 'Google' : 'Facebook';
        alert(`${provider} login would be implemented here in a real app`);
    });
});

// Helper functions
function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function showErrorMessage(form, message) {
    // Remove existing error message if any
    const existingError = form.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Create error message element
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.color = '#e74c3c';
    errorDiv.style.backgroundColor = '#fdecea';
    errorDiv.style.padding = '10px';
    errorDiv.style.borderRadius = '4px';
    errorDiv.style.marginBottom = '20px';
    errorDiv.textContent = message;
    
    // Insert at the top of the form
    form.insertBefore(errorDiv, form.firstChild);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.remove();
        }
    }, 5000);
}

function showLoadingState(button) {
    const originalText = button.textContent;
    button.disabled = true;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    
    // Reset button state after a timeout (only for demo)
    setTimeout(() => {
        button.disabled = false;
        button.textContent = originalText;
    }, 5000); // Longer timeout than the simulated API call, just as a fallback
}

// Check if user is already logged in on page load
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already logged in
    checkLoginStatus();
    
    // Handle login form submission
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Handle logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    // Toggle password visibility
    const togglePasswordBtn = document.querySelector('.toggle-password');
    if (togglePasswordBtn) {
        togglePasswordBtn.addEventListener('click', togglePasswordVisibility);
    }
});

/**
 * Check if user is already logged in and update UI accordingly
 */
function checkLoginStatus() {
    const userData = localStorage.getItem('grosfreshUser');
    const loginWelcome = document.getElementById('login-welcome');
    const loginFormContainer = document.getElementById('login-form-container');
    
    if (userData) {
        const user = JSON.parse(userData);
        
        if (user.isLoggedIn) {
            // User is logged in, show welcome message
            document.getElementById('user-name').textContent = user.name || 'User';
            
            if (loginWelcome) loginWelcome.style.display = 'block';
            if (loginFormContainer) loginFormContainer.style.display = 'none';
            
            // Update user icon in header
            const userIcon = document.querySelector('.nav-icons a[href="login.html"] i');
            if (userIcon) {
                userIcon.classList.remove('fa-user');
                userIcon.classList.add('fa-user-check');
            }
            
            return true;
        }
    }
    
    // User is not logged in
    if (loginWelcome) loginWelcome.style.display = 'none';
    if (loginFormContainer) loginFormContainer.style.display = 'block';
    
    return false;
}

/**
 * Handle login form submission
 */
function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('remember').checked;
    
    // Simple validation
    if (!email || !password) {
        showNotification('Please enter both email and password', 'error');
        return;
    }
    
    // For demo purposes, any email/password combination works
    const userData = {
        email: email,
        name: email.split('@')[0], // Extract name from email
        isLoggedIn: true,
        rememberMe: rememberMe
    };
    
    // Save to localStorage
    localStorage.setItem('grosfreshUser', JSON.stringify(userData));
    
    // Show success message
    showNotification('Login successful!', 'success');
    
    // Update UI
    setTimeout(() => {
        checkLoginStatus();
    }, 1000);
}

/**
 * Handle logout button click
 */
function handleLogout() {
    // Remove user data from localStorage
    localStorage.removeItem('grosfreshUser');
    
    // Show notification
    showNotification('You have been logged out', 'info');
    
    // Update UI after a short delay
    setTimeout(() => {
        checkLoginStatus();
    }, 1000);
}

/**
 * Toggle password visibility
 */
function togglePasswordVisibility() {
    const passwordInput = document.getElementById('password');
    const toggleIcon = document.querySelector('.toggle-password');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.classList.remove('fa-eye');
        toggleIcon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        toggleIcon.classList.remove('fa-eye-slash');
        toggleIcon.classList.add('fa-eye');
    }
}

/**
 * Show notification message
 */
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Add styles
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.padding = '12px 20px';
    notification.style.borderRadius = '4px';
    notification.style.zIndex = '1000';
    notification.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    notification.style.transition = 'all 0.3s ease';
    notification.style.opacity = '0';
    notification.style.transform = 'translateY(-10px)';
    
    // Set colors based on type
    if (type === 'success') {
        notification.style.backgroundColor = '#4caf50';
        notification.style.color = 'white';
    } else if (type === 'error') {
        notification.style.backgroundColor = '#f44336';
        notification.style.color = 'white';
    } else {
        notification.style.backgroundColor = '#2196f3';
        notification.style.color = 'white';
    }
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-10px)';
        
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}
