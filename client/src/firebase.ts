// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
   apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "project-2cbd5.firebaseapp.com",
  projectId: "project-2cbd5",
  storageBucket: "project-2cbd5.firebasestorage.app",
  messagingSenderId: "405317882533",
  appId: "1:405317882533:web:f4056ed30d6a5758f6f34c",
  measurementId: "G-713K15D4NY"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);