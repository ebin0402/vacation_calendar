// Authentication management
const Auth = {
    // Allowed aliases
    allowedAliases: ['babinbe', 'sonufer', 'patksh','azahmali','tyrlia','arkajyb','luccris','esannda','felixrad','rudjainb','scokeeli','michmcbr','musomari','nzzamier','rahmahej','rajmondm','rohijo','shaziask','vjsundar'],

    // Check if user is logged in
    isLoggedIn() {
        return localStorage.getItem('currentUser') !== null;
    },

    // Get current user
    getCurrentUser() {
        return localStorage.getItem('currentUser');
    },

// Login with validation
login(alias) {
    if (!alias || alias.trim() === '') {
        alert('Please enter your Amazon alias');
        return false;
    }

    const trimmedAlias = alias.trim().toLowerCase();

    // Validate against allowed aliases
    if (!this.allowedAliases.includes(trimmedAlias)) {
        alert('Access denied. You are not authorized to use this application. Please contact the team administrator if you need access.');
        return false;
    }

    // Sign in anonymously to Firebase
    firebase.auth().signInAnonymously()
        .then(() => {
            localStorage.setItem('currentUser', trimmedAlias);
            return true;
        })
        .catch((error) => {
            console.error('Firebase auth error:', error);
            alert('Authentication error. Please try again.');
            return false;
        });

    localStorage.setItem('currentUser', trimmedAlias);
    return true;
},

    // Logout
    logout() {
        if (confirm('Are you sure you want to logout?')) {
            localStorage.removeItem('currentUser');
            return true;
        }
        return false;
    }
};

// Login function
function login() {
    const alias = document.getElementById('aliasInput').value;
    if (Auth.login(alias)) {
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('mainApp').style.display = 'block';
        document.getElementById('currentUser').textContent = alias;
        initializeApp();
    }
}

// Logout function
function logout() {
    if (Auth.logout()) {
        location.reload();
    }
}

// Check authentication on page load
window.addEventListener('DOMContentLoaded', () => {
    if (Auth.isLoggedIn()) {
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('mainApp').style.display = 'block';
        document.getElementById('currentUser').textContent = Auth.getCurrentUser();
        initializeApp();
    }
});