import { initializeApp } from "firebase/app";

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

export const app = initializeApp(firebaseConfig);
