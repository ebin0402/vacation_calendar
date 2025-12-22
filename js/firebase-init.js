// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCV_QjaEghVysOjNVApbo6_eyIclEKItBE",
  authDomain: "arts-eu-vacation-calendar.firebaseapp.com",
  databaseURL: "https://arts-eu-vacation-calendar-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "arts-eu-vacation-calendar",
  storageBucket: "arts-eu-vacation-calendar.firebasestorage.app",
  messagingSenderId: "531028738404",
  appId: "1:531028738404:web:5366ec2b408b0d7e863a71"
};

// Declare database as a global variable (accessible to all other JS files)
let database;

// Wait for Firebase to be available
if (typeof firebase === 'undefined') {
  console.error('Firebase SDK not loaded! Check if Firebase scripts are loading correctly.');
  alert('Firebase SDK failed to load. Please refresh the page or check your internet connection.');
} else {
  console.log('Firebase SDK loaded successfully');

  // Initialize Firebase
  try {
    firebase.initializeApp(firebaseConfig);
    console.log('Firebase initialized successfully');

    // Initialize the global database reference
    database = firebase.database();
    console.log('Database reference created successfully');
    
    // Test database connection
    database.ref('.info/connected').on('value', (snapshot) => {
      if (snapshot.val() === true) {
        console.log('Connected to Firebase Realtime Database');
      } else {
        console.log('Not connected to Firebase Realtime Database');
      }
    });
  } catch (error) {
    console.error('Firebase initialization error:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    alert('Firebase initialization failed: ' + error.message);
  }
}
