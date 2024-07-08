// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

console.log('Firebase API Key:', process.env.REACT_APP_FIREBASE_API_KEY); // Debug log

const firebaseConfig = {
  apiKey: "AIzaSyCKdvwJIjCKWede6oQEmckgrLyS64kZA4Q",
  authDomain: "crunch-news.firebaseapp.com",
  projectId: "crunch-news",
  storageBucket: "crunch-news.appspot.com",
  messagingSenderId: "616615173228",
  appId: "1:616615173228:web:f47451559c2cd44fb50c49"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

export { auth };
