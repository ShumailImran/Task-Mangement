// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_APP_FIREBASE_API_KEY,
  authDomain: "task-manager-21.firebaseapp.com",
  projectId: "task-manager-21",
  storageBucket: "task-manager-21.firebasestorage.app",
  messagingSenderId: "733974655618",
  appId: "1:733974655618:web:c963b6d81433a4b91e3a9b",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
