import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCw6iZvWxcABtn3FUTMrcbrQeVXQ7umEcQ",
  authDomain: "trajectory-a7478.firebaseapp.com",
  projectId: "trajectory-a7478",
  storageBucket: "trajectory-a7478.appspot.com",
  messagingSenderId: "968425006252",
  appId: "1:968425006252:web:634599bd4fdca72917ab09",
  measurementId: "G-ZNNBQKS4DN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
// const analytics = getAnalytics(app);

export { db, auth };