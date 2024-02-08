// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCUb7mtXAUl0O9fVuwFuhKeUVQhu2W0vWk",
  authDomain: "bharatapp-5aa00.firebaseapp.com",
  projectId: "bharatapp-5aa00",
  storageBucket: "bharatapp-5aa00.appspot.com",
  messagingSenderId: "530868800651",
  appId: "1:530868800651:web:fcb0d7e6a165bb636c588e",
  measurementId: "G-Y6SB3Y37FD",
  databaseURL : "https://bharatapp-5aa00-default-rtdb.firebaseio.com/"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
