// Authentication System using Firebase

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

// Handle Signup with Firebase
async function handleSignup() {
    const username = document.getElementById('signupUsername').value.trim();
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
    const userType = document.getElementById('userType').value;

    // Validation
    if (!username || !password || !confirmPassword || !userType) {
        showMessage('Please fill in all fields', 'error');
        return false;
    }

    // Check if username contains @ symbol (user entered email)
    if (username.includes('@')) {
        showMessage('Please enter a username, not an email address', 'error');
        return false;
    }

    if (username.length < 3) {
        showMessage('Username must be at least 3 characters', 'error');
        return false;
    }

    // Check for valid username format (alphanumeric, dashes, underscores only)
    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
        showMessage('Username can only contain letters, numbers, dashes, and underscores', 'error');
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

    try {
        // Check if username already exists
        const usernameDoc = await db.collection('usernames').doc(username.toLowerCase()).get();
        if (usernameDoc.exists) {
            showMessage('Username already exists', 'error');
            return false;
        }

        // Create Firebase user with email format (username@makergallery.local)
        const email = username.toLowerCase() + '@makergallery.local';
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        
        // Store user data in Firestore
        await db.collection('users').doc(userCredential.user.uid).set({
            username: username,
            userType: userType,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        // Reserve the username
        await db.collection('usernames').doc(username.toLowerCase()).set({
            uid: userCredential.user.uid
        });

        showMessage('Account created successfully! Please login.', 'success');
        
        // Clear form and switch to login after 2 seconds
        setTimeout(() => {
            document.getElementById('signupFormElement').reset();
            switchToLogin();
        }, 2000);

    } catch (error) {
        console.error('Signup error:', error);
        showMessage(error.message || 'Signup failed', 'error');
    }

    return false;
}

// Handle Login with Firebase
async function handleLogin() {
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;

    // Validation
    if (!username || !password) {
        showMessage('Please enter username and password', 'error');
        return false;
    }

    // Check if user entered email instead of username
    if (username.includes('@')) {
        showMessage('Please enter your username, not an email address', 'error');
        return false;
    }

    try {
        // Convert username to email format
        const email = username.toLowerCase() + '@makergallery.local';
        
        console.log('Attempting login with email:', email);
        
        // Sign in with Firebase
        await auth.signInWithEmailAndPassword(email, password);
        
        showMessage('Login successful! Redirecting...', 'success');

        // Redirect to profile page after 1.5 seconds
        setTimeout(() => {
            window.location.href = 'profile.html';
        }, 1500);

    } catch (error) {
        console.error('Login error:', error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        console.error('Attempted email:', username.toLowerCase() + '@makergallery.local');
        
        if (error.code === 'auth/user-not-found') {
            showMessage('Account not found. Please create an account first.', 'error');
        } else if (error.code === 'auth/wrong-password') {
            showMessage('Incorrect password', 'error');
        } else if (error.code === 'auth/invalid-email') {
            showMessage('Invalid username format. Use only letters, numbers, dashes, and underscores.', 'error');
        } else {
            showMessage(`Login failed: ${error.message}`, 'error');
        }
    }

    return false;
}


// Check if user is logged in
function isLoggedIn() {
    return auth.currentUser !== null;
}

// Get current user data
async function getCurrentUser() {
    const user = auth.currentUser;
    if (!user) return null;

    try {
        const userDoc = await db.collection('users').doc(user.uid).get();
        if (userDoc.exists) {
            return userDoc.data();
        }
    } catch (error) {
        console.error('Error getting user data:', error);
    }
    return null;
}

// Logout function
async function logout() {
    try {
        await auth.signOut();
        window.location.href = 'login.html';
    } catch (error) {
        console.error('Logout error:', error);
    }
}

// Protect pages (call this on pages that require authentication)
function requireAuth() {
    auth.onAuthStateChanged((user) => {
        if (!user) {
            window.location.href = 'login.html';
        }
    });
}

// Navigate to profile (checks if logged in first)
function goToProfile() {
    if (auth.currentUser) {
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

// Save a maker to user's favorites in Firebase
async function saveMaker(makerData) {
    const user = auth.currentUser;
    if (!user) {
        alert('Please log in to save makers');
        window.location.href = '../../login.html';
        return false;
    }

    try {
        await db.collection('users').doc(user.uid).collection('savedMakers').doc(makerData.id).set({
            ...makerData,
            savedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        return true;
    } catch (error) {
        console.error('Error saving maker:', error);
        return false;
    }
}

// Remove a maker from favorites
async function unsaveMaker(makerId) {
    const user = auth.currentUser;
    if (!user) return false;

    try {
        await db.collection('users').doc(user.uid).collection('savedMakers').doc(makerId).delete();
        return true;
    } catch (error) {
        console.error('Error removing maker:', error);
        return false;
    }
}

// Get all saved makers for current user
async function getSavedMakers() {
    const user = auth.currentUser;
    if (!user) return [];

    try {
        const snapshot = await db.collection('users').doc(user.uid).collection('savedMakers').get();
        return snapshot.docs.map(doc => doc.data());
    } catch (error) {
        console.error('Error getting saved makers:', error);
        return [];
    }
}

// Check if a maker is saved
async function isMakerSaved(makerId) {
    const user = auth.currentUser;
    if (!user) return false;

    try {
        const doc = await db.collection('users').doc(user.uid).collection('savedMakers').doc(makerId).get();
        return doc.exists;
    } catch (error) {
        console.error('Error checking saved maker:', error);
        return false;
    }
}

// Toggle save/unsave maker
async function toggleSaveMaker(makerData) {
    const saved = await isMakerSaved(makerData.id);
    if (saved) {
        await unsaveMaker(makerData.id);
        return false; // unsaved
    } else {
        await saveMaker(makerData);
        return true; // saved
    }
}
