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

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get database reference
const database = firebase.database();
