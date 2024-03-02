import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: "530868800651",
  appId: "1:530868800651:web:fcb0d7e6a165bb636c588e",
  measurementId: "G-Y6SB3Y37FD",
  databaseURL : process.env.REACT_APP_FIREBASE_DATABASE_URL
};

export const app = initializeApp(firebaseConfig);
