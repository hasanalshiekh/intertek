// Login System JavaScript
let isPasswordVisible = false;

// User credentials database
const users = {
    'admin': {
        password: 'admin123',
        role: 'admin',
        name: 'مدير النظام',
        permissions: ['dashboard', 'users', 'pages', 'analytics', 'calendar', 'payments', 'settings']
    },
    'user': {
        password: 'user123',
        role: 'user',
        name: 'مستخدم عادي',
        permissions: ['dashboard', 'pages', 'calendar']
    }
};

// Initialize login page
document.addEventListener('DOMContentLoaded', function() {
    initializeLoginPage();
    checkExistingSession();
});

// Initialize login page functionality
function initializeLoginPage() {
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    
    // Add form submit event listener
    loginForm.addEventListener('submit', handleLogin);
    
    // Add input event listeners for real-time validation
    usernameInput.addEventListener('input', clearError);
    passwordInput.addEventListener('input', clearError);
    
    // Add enter key support
    passwordInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleLogin(e);
        }
    });
}

// Handle login form submission
function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    
    // Validate inputs
    if (!username || !password) {
        showError('يرجى ملء جميع الحقول المطلوبة');
        return;
    }
    
    // Show loading state
    setLoadingState(true);
    
    // Simulate API call delay
    setTimeout(() => {
        authenticateUser(username, password, rememberMe);
    }, 1000);
}

// Authenticate user
function authenticateUser(username, password, rememberMe) {
    const user = users[username];
    
    if (user && user.password === password) {
        // Login successful
        const sessionData = {
            username: username,
            role: user.role,
            name: user.name,
            permissions: user.permissions,
            loginTime: new Date().toISOString(),
            rememberMe: rememberMe
        };
        
        // Save session
        saveSession(sessionData);
        
        // Show success message
        showSuccessMessage();
        
        // Redirect to dashboard
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
        
    } else {
        // Login failed
        setLoadingState(false);
        showError('اسم المستخدم أو كلمة المرور غير صحيحة');
        
        // Clear password field
        document.getElementById('password').value = '';
        document.getElementById('password').focus();
    }
}

// Save user session
function saveSession(sessionData) {
    if (sessionData.rememberMe) {
        // Save to localStorage for persistent session
        localStorage.setItem('skylineSession', JSON.stringify(sessionData));
    } else {
        // Save to sessionStorage for temporary session
        sessionStorage.setItem('skylineSession', JSON.stringify(sessionData));
    }
}

// Check for existing session
function checkExistingSession() {
    const session = getSession();
    
    if (session) {
        // User is already logged in, redirect to dashboard
        window.location.href = 'dashboard.html';
    }
}

// Get current session
function getSession() {
    const localSession = localStorage.getItem('skylineSession');
    const sessionSession = sessionStorage.getItem('skylineSession');
    
    if (localSession) {
        return JSON.parse(localSession);
    } else if (sessionSession) {
        return JSON.parse(sessionSession);
    }
    
    return null;
}

// Clear session
function clearSession() {
    localStorage.removeItem('skylineSession');
    sessionStorage.removeItem('skylineSession');
}

// Toggle password visibility
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const passwordIcon = document.getElementById('passwordIcon');
    
    if (isPasswordVisible) {
        passwordInput.type = 'password';
        passwordIcon.className = 'fas fa-eye';
        isPasswordVisible = false;
    } else {
        passwordInput.type = 'text';
        passwordIcon.className = 'fas fa-eye-slash';
        isPasswordVisible = true;
    }
}

// Show error message
function showError(message) {
    const errorMessage = document.getElementById('errorMessage');
    const errorText = document.getElementById('errorText');
    
    errorText.textContent = message;
    errorMessage.style.display = 'flex';
    
    // Auto-hide error after 5 seconds
    setTimeout(() => {
        errorMessage.style.display = 'none';
    }, 5000);
}

// Clear error message
function clearError() {
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.style.display = 'none';
}

// Show success message
function showSuccessMessage() {
    const loginBtn = document.querySelector('.login-btn');
    const btnText = loginBtn.querySelector('span');
    
    btnText.textContent = 'تم تسجيل الدخول بنجاح!';
    loginBtn.style.background = 'linear-gradient(135deg, #28a745 0%, #20c997 100%)';
}

// Set loading state
function setLoadingState(loading) {
    const loginBtn = document.querySelector('.login-btn');
    
    if (loading) {
        loginBtn.classList.add('loading');
        loginBtn.disabled = true;
    } else {
        loginBtn.classList.remove('loading');
        loginBtn.disabled = false;
    }
}

// Utility function to check if user has permission
function hasPermission(permission) {
    const session = getSession();
    return session && session.permissions.includes(permission);
}

// Utility function to get current user role
function getCurrentUserRole() {
    const session = getSession();
    return session ? session.role : null;
}

// Utility function to get current user name
function getCurrentUserName() {
    const session = getSession();
    return session ? session.name : null;
}

// Logout function
function logout() {
    clearSession();
    window.location.href = 'login.html';
}

// Export functions for use in dashboard
window.authUtils = {
    getSession,
    clearSession,
    hasPermission,
    getCurrentUserRole,
    getCurrentUserName,
    logout
};
