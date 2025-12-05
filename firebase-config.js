// Firebase Configuration
// IMPORTANT: Replace these values with your actual Firebase project credentials
// To get these:
// 1. Go to https://console.firebase.google.com/
// 2. Create a new project (or use existing)
// 3. Go to Project Settings > General
// 4. Scroll down to "Your apps" and click the web icon (</>)
// 5. Copy the firebaseConfig object

const firebaseConfig = {
  apiKey: "AIzaSyBhvDAkc0Ei7aYLuKKK5t-ar_792KdSWUk",
  authDomain: "the-maker-s-gallery.firebaseapp.com",
  projectId: "the-maker-s-gallery",
  storageBucket: "the-maker-s-gallery.firebasestorage.app",
  messagingSenderId: "329958015024",
  appId: "1:329958015024:web:26807bddf82a99e313edf5",
  measurementId: "G-6SWYG3SG9P"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firestore
const db = firebase.firestore();
const auth = firebase.auth();
