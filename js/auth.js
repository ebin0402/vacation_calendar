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
            alert('Please enter your Amazon alias without "@" ');
            return false;
        }

        const trimmedAlias = alias.trim().toLowerCase();

        // Validate against allowed aliases
        if (!this.allowedAliases.includes(trimmedAlias)) {
            alert('Access denied. You are not authorized to use this application. Please contact the team administrator if you need access.');
            return false;
        }

        // Store the alias
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

    if (!Auth.login(alias)) {
        return;
    }

    const loginBtn = document.querySelector('#loginScreen button');
    loginBtn.disabled = true;
    loginBtn.textContent = 'Logging in...';

    // Check if database is ready
    if (typeof database === 'undefined') {
        console.error('Database not initialized yet, waiting...');
        setTimeout(() => login(), 100); // Retry after 100ms
        return;
    }

    // Sign in anonymously to Firebase
    firebase.auth().signInAnonymously()
        .then(() => {
            console.log('Firebase auth successful');
            document.getElementById('loginScreen').style.display = 'none';
            document.getElementById('mainApp').style.display = 'block';
            document.getElementById('currentUser').textContent = alias;
            initializeApp();
        })
        .catch((error) => {
            console.error('Firebase auth error:', error);
            alert('Authentication error: ' + error.message + '

Please try again.');
            localStorage.removeItem('currentUser');
            loginBtn.disabled = false;
            loginBtn.textContent = 'Login';
        });
}

// Logout function
function logout() {
    if (Auth.logout()) {
        firebase.auth().signOut().then(() => {
            location.reload();
        });
    }
}

// Check authentication on page load
window.addEventListener('DOMContentLoaded', () => {
    // Wait for database to be initialized
    const checkDatabase = setInterval(() => {
        if (typeof database !== 'undefined') {
            clearInterval(checkDatabase);

            if (Auth.isLoggedIn()) {
                firebase.auth().signInAnonymously()
                    .then(() => {
                        document.getElementById('loginScreen').style.display = 'none';
                        document.getElementById('mainApp').style.display = 'block';
                        document.getElementById('currentUser').textContent = Auth.getCurrentUser();
                        initializeApp();
                    })
                    .catch((error) => {
                        console.error('Auto-login failed:', error);
                        localStorage.removeItem('currentUser');
                        location.reload();
                    });
            }
        }
    }, 50); // Check every 50ms
});
