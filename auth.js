// Authentication System using LocalStorage

// Switch between Login and Signup forms
function switchToSignup() {
    document.getElementById('loginForm').classList.remove('active');
    document.getElementById('signupForm').classList.add('active');
    clearMessage();
}

function switchToLogin() {
    document.getElementById('signupForm').classList.remove('active');
    document.getElementById('loginForm').classList.add('active');
    clearMessage();
}

// Display messages
function showMessage(message, type) {
    const messageEl = document.getElementById('authMessage');
    messageEl.textContent = message;
    messageEl.className = 'auth-message ' + type;
    messageEl.style.display = 'block';
}

function clearMessage() {
    const messageEl = document.getElementById('authMessage');
    messageEl.style.display = 'none';
    messageEl.className = 'auth-message';
}

// Handle Signup
function handleSignup() {
    const username = document.getElementById('signupUsername').value.trim();
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
    const userType = document.getElementById('userType').value;

    // Validation
    if (!username || !password || !confirmPassword || !userType) {
        showMessage('Please fill in all fields', 'error');
        return false;
    }

    if (username.length < 3) {
        showMessage('Username must be at least 3 characters', 'error');
        return false;
    }

    if (password.length < 6) {
        showMessage('Password must be at least 6 characters', 'error');
        return false;
    }

    if (password !== confirmPassword) {
        showMessage('Passwords do not match', 'error');
        return false;
    }

    // Check if username already exists
    const users = getUsers();
    if (users[username]) {
        showMessage('Username already exists', 'error');
        return false;
    }

    // Create new user
    users[username] = {
        password: password,
        userType: userType,
        createdAt: new Date().toISOString()
    };

    // Save to localStorage
    localStorage.setItem('users', JSON.stringify(users));

    showMessage('Account created successfully! Please login.', 'success');
    
    // Clear form and switch to login after 2 seconds
    setTimeout(() => {
        document.getElementById('signupFormElement').reset();
        switchToLogin();
    }, 2000);

    return false;
}

// Handle Login
function handleLogin() {
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;

    // Validation
    if (!username || !password) {
        showMessage('Please enter username and password', 'error');
        return false;
    }

    // Check credentials
    const users = getUsers();
    if (!users[username]) {
        showMessage('Username not found', 'error');
        return false;
    }

    if (users[username].password !== password) {
        showMessage('Incorrect password', 'error');
        return false;
    }

    // Login successful
    const currentUser = {
        username: username,
        userType: users[username].userType,
        loginTime: new Date().toISOString()
    };

    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    showMessage('Login successful! Redirecting...', 'success');

    // Redirect to profile page after 1.5 seconds
    setTimeout(() => {
        window.location.href = 'profile.html';
    }, 1500);

    return false;
}

// Helper function to get all users from localStorage
function getUsers() {
    const usersJSON = localStorage.getItem('users');
    return usersJSON ? JSON.parse(usersJSON) : {};
}

// Check if user is logged in
function isLoggedIn() {
    const currentUser = localStorage.getItem('currentUser');
    return currentUser !== null;
}

// Get current user
function getCurrentUser() {
    const currentUser = localStorage.getItem('currentUser');
    return currentUser ? JSON.parse(currentUser) : null;
}

// Logout function
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}

// Protect pages (call this on pages that require authentication)
function requireAuth() {
    if (!isLoggedIn()) {
        window.location.href = 'login.html';
    }
}

// Navigate to profile (checks if logged in first)
function goToProfile() {
    if (isLoggedIn()) {
        window.location.href = 'profile.html';
    } else {
        window.location.href = 'login.html';
    }
}

// Get user type badge color
function getUserTypeBadgeColor(userType) {
    const colors = {
        'student': '#0070ff',
        'faculty': '#d60000',
        'employer': '#008000',
        'viewer': '#666666'
    };
    return colors[userType] || '#666666';
}

// Get user type display name
function getUserTypeDisplay(userType) {
    const displayNames = {
        'student': 'Student',
        'faculty': 'Faculty',
        'employer': 'Potential Employer',
        'viewer': 'Viewer'
    };
    return displayNames[userType] || userType;
}

// FAVORITES/SAVED MAKERS FUNCTIONALITY

// Save a maker to user's favorites
function saveMaker(makerData) {
    if (!isLoggedIn()) {
        alert('Please log in to save makers');
        window.location.href = '../../login.html';
        return false;
    }

    const user = getCurrentUser();
    const savedMakers = getSavedMakers();
    
    // Check if already saved
    const existingIndex = savedMakers.findIndex(m => m.id === makerData.id);
    if (existingIndex === -1) {
        savedMakers.push(makerData);
        localStorage.setItem('savedMakers_' + user.username, JSON.stringify(savedMakers));
        return true;
    }
    return false;
}

// Remove a maker from favorites
function unsaveMaker(makerId) {
    if (!isLoggedIn()) {
        return false;
    }

    const user = getCurrentUser();
    const savedMakers = getSavedMakers();
    const filteredMakers = savedMakers.filter(m => m.id !== makerId);
    
    localStorage.setItem('savedMakers_' + user.username, JSON.stringify(filteredMakers));
    return true;
}

// Get all saved makers for current user
function getSavedMakers() {
    if (!isLoggedIn()) {
        return [];
    }

    const user = getCurrentUser();
    const savedJSON = localStorage.getItem('savedMakers_' + user.username);
    return savedJSON ? JSON.parse(savedJSON) : [];
}

// Check if a maker is saved
function isMakerSaved(makerId) {
    const savedMakers = getSavedMakers();
    return savedMakers.some(m => m.id === makerId);
}

// Toggle save/unsave maker
function toggleSaveMaker(makerData) {
    if (isMakerSaved(makerData.id)) {
        unsaveMaker(makerData.id);
        return false; // unsaved
    } else {
        saveMaker(makerData);
        return true; // saved
    }
}

