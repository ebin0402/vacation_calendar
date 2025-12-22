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

    // Check if user exists in Firebase
    checkUserExists(alias, callback) {
        database.ref('users/' + alias).once('value', (snapshot) => {
            callback(snapshot.exists());
        });
    },

    // Create new user with password
    createUser(alias, password, callback) {
        const email = alias + '@arts-eu-vacation.internal';

        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Store user info in database
                database.ref('users/' + alias).set({
                    alias: alias,
                    email: email,
                    createdAt: new Date().toISOString()
                }).then(() => {
                    localStorage.setItem('currentUser', alias);
                    callback(true, null);
                });
            })
            .catch((error) => {
                callback(false, error.message);
            });
    },

    // Login existing user
    loginUser(alias, password, callback) {
        const email = alias + '@arts-eu-vacation.internal';

        firebase.auth().signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                localStorage.setItem('currentUser', alias);
                callback(true, null);
            })
            .catch((error) => {
                callback(false, error.message);
            });
    },

    // Logout
    logout() {
        if (confirm('Are you sure you want to logout?')) {
            localStorage.removeItem('currentUser');
            firebase.auth().signOut();
            return true;
        }
        return false;
    }
};

// Login function
function login() {
    const alias = document.getElementById('aliasInput').value;

    if (!alias || alias.trim() === '') {
        alert('Please enter your Amazon alias');
        return;
    }

    const trimmedAlias = alias.trim().toLowerCase();

    // Validate against allowed aliases
    if (!Auth.allowedAliases.includes(trimmedAlias)) {
        alert('Access denied. You are not authorized to use this application. Please contact the team administrator if you need access.');
        return;
    }

    const loginBtn = document.querySelector('#loginScreen button');
    loginBtn.disabled = true;
    loginBtn.textContent = 'Checking...';

    // Check if database is ready
    if (typeof database === 'undefined') {
        setTimeout(() => login(), 100);
        return;
    }

    // Show password input immediately
    showPasswordInput(trimmedAlias);
    loginBtn.disabled = false;
    loginBtn.textContent = 'Login';
}

// Show password input (works for both new and existing users)
function showPasswordInput(alias) {
    const loginScreen = document.getElementById('loginScreen');
    loginScreen.innerHTML = `
        <h1>Welcome, ${alias}!</h1>
        <div class="login-form">
            <div class="form-group">
                <label>Password</label>
                <input type="password" id="passwordInput" placeholder="Enter your password">
            </div>
            <p style="font-size: 0.9em; color: #666; margin-top: 10px;">
                First time? Just enter a new password (min 6 characters)
            </p>
            <button onclick="submitPasswordOrCreate('${alias}')" class="btn-primary">Continue</button>
            <button onclick="backToAliasInput()" class="btn-secondary" style="margin-top: 10px;">Back</button>
        </div>
    `;
    document.getElementById('passwordInput').focus();
}

// Try to login, if user doesn't exist, create account
function submitPasswordOrCreate(alias) {
    const password = document.getElementById('passwordInput').value;

    if (!password) {
        alert('Please enter a password');
        return;
    }

    if (password.length < 6) {
        alert('Password must be at least 6 characters long');
        return;
    }

    const loginBtn = document.querySelector('#loginScreen button');
    loginBtn.disabled = true;
    loginBtn.textContent = 'Logging in...';

    const email = alias + '@arts-eu-vacation.internal';

    // Try to sign in first
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Login successful
            localStorage.setItem('currentUser', alias);
            document.getElementById('loginScreen').style.display = 'none';
            document.getElementById('mainApp').style.display = 'block';
            document.getElementById('currentUser').textContent = alias;
            initializeApp();
        })
        .catch((error) => {
            console.log('Auth error code:', error.code);

            // If user doesn't exist, create account
            if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-email') {
                loginBtn.textContent = 'Creating account...';

                firebase.auth().createUserWithEmailAndPassword(email, password)
                    .then((userCredential) => {
                        // Store user info in database
                        database.ref('users/' + alias).set({
                            alias: alias,
                            email: email,
                            createdAt: new Date().toISOString()
                        }).then(() => {
                            localStorage.setItem('currentUser', alias);
                            document.getElementById('loginScreen').style.display = 'none';
                            document.getElementById('mainApp').style.display = 'block';
                            document.getElementById('currentUser').textContent = alias;
                            initializeApp();
                        });
                    })
                    .catch((createError) => {
                        alert('Account creation failed: ' + createError.message);
                        loginBtn.disabled = false;
                        loginBtn.textContent = 'Continue';
                    });
            } else if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
                // Wrong password for existing user
                alert('Incorrect password. Please try again.');
                loginBtn.disabled = false;
                loginBtn.textContent = 'Continue';
                document.getElementById('passwordInput').value = '';
                document.getElementById('passwordInput').focus();
            } else {
                // Other authentication errors
                alert('Authentication error: ' + error.message);
                loginBtn.disabled = false;
                loginBtn.textContent = 'Continue';
            }
        });
}

// Show password login form
function showPasswordLogin(alias) {
    const loginScreen = document.getElementById('loginScreen');
    loginScreen.innerHTML = `
        <h1>Welcome back, ${alias}!</h1>
        <div class="login-form">
            <div class="form-group">
                <label>Password</label>
                <input type="password" id="passwordInput" placeholder="Enter your password">
            </div>
            <button onclick="submitPassword('${alias}')" class="btn-primary">Login</button>
            <button onclick="backToAliasInput()" class="btn-secondary" style="margin-top: 10px;">Back</button>
        </div>
    `;
    document.getElementById('passwordInput').focus();
}

// Show password setup form
function showPasswordSetup(alias) {
    const loginScreen = document.getElementById('loginScreen');
    loginScreen.innerHTML = `
        <h1>Welcome, ${alias}!</h1>
        <p>This is your first time logging in. Please set a password.</p>
        <div class="login-form">
            <div class="form-group">
                <label>Create Password</label>
                <input type="password" id="newPasswordInput" placeholder="Enter password (min 6 characters)">
            </div>
            <div class="form-group">
                <label>Confirm Password</label>
                <input type="password" id="confirmPasswordInput" placeholder="Confirm password">
            </div>
            <button onclick="submitNewPassword('${alias}')" class="btn-primary">Set Password & Login</button>
            <button onclick="backToAliasInput()" class="btn-secondary" style="margin-top: 10px;">Back</button>
        </div>
    `;
    document.getElementById('newPasswordInput').focus();
}

// Submit password for existing user
function submitPassword(alias) {
    const password = document.getElementById('passwordInput').value;

    if (!password) {
        alert('Please enter your password');
        return;
    }

    const loginBtn = document.querySelector('#loginScreen button');
    loginBtn.disabled = true;
    loginBtn.textContent = 'Logging in...';

    Auth.loginUser(alias, password, (success, error) => {
        if (success) {
            document.getElementById('loginScreen').style.display = 'none';
            document.getElementById('mainApp').style.display = 'block';
            document.getElementById('currentUser').textContent = alias;
            initializeApp();
        } else {
            alert('Login failed: ' + error);
            loginBtn.disabled = false;
            loginBtn.textContent = 'Login';
        }
    });
}

// Submit new password for first-time user
function submitNewPassword(alias) {
    const password = document.getElementById('newPasswordInput').value;
    const confirmPassword = document.getElementById('confirmPasswordInput').value;

    if (!password || !confirmPassword) {
        alert('Please fill in both password fields');
        return;
    }

    if (password.length < 6) {
        alert('Password must be at least 6 characters long');
        return;
    }

    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }

    const loginBtn = document.querySelector('#loginScreen button');
    loginBtn.disabled = true;
    loginBtn.textContent = 'Creating account...';

    Auth.createUser(alias, password, (success, error) => {
        if (success) {
            document.getElementById('loginScreen').style.display = 'none';
            document.getElementById('mainApp').style.display = 'block';
            document.getElementById('currentUser').textContent = alias;
            initializeApp();
        } else {
            alert('Account creation failed: ' + error);
            loginBtn.disabled = false;
            loginBtn.textContent = 'Set Password & Login';
        }
    });
}

// Back to alias input
function backToAliasInput() {
    const loginScreen = document.getElementById('loginScreen');
    loginScreen.innerHTML = `
        <h1>Please enter your Amazon alias to continue</h1>
        <div class="login-form">
            <div class="form-group">
                <label>Amazon Alias</label>
                <input type="text" id="aliasInput" placeholder="Enter your alias">
            </div>
            <button onclick="login()" class="btn-primary">Login</button>
        </div>
    `;
    document.getElementById('aliasInput').focus();
}

// Logout function
function logout() {
    if (Auth.logout()) {
        location.reload();
    }
}

// Check authentication on page load
window.addEventListener('DOMContentLoaded', () => {
    const checkDatabase = setInterval(() => {
        if (typeof database !== 'undefined') {
            clearInterval(checkDatabase);

            firebase.auth().onAuthStateChanged((user) => {
                if (user && Auth.isLoggedIn()) {
                    document.getElementById('loginScreen').style.display = 'none';
                    document.getElementById('mainApp').style.display = 'block';
                    document.getElementById('currentUser').textContent = Auth.getCurrentUser();
                    initializeApp();
                }
            });
        }
    }, 50);
});
