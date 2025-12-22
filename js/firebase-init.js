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

// Declare database as a global variable
var database;

// Initialize Firebase immediately
(function() {
  if (typeof firebase === 'undefined') {
    console.error('Firebase SDK not loaded!');
    return;
  }

  console.log('Firebase SDK loaded successfully');

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
      }
    });
  } catch (error) {
    console.error('Firebase initialization error:', error);
  }
})();
