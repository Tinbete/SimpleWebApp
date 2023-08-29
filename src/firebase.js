import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAejbhheejY_Hl58rluKbQLY5rgZzcn1TM",
  authDomain: "simple-webapp-6a00d.firebaseapp.com",
  projectId: "simple-webapp-6a00d",
  storageBucket: "simple-webapp-6a00d.appspot.com",
  messagingSenderId: "972406553929",
  appId: "1:972406553929:web:3e3c69c26e844712ad2e98",
  databaseURL:
    "https://simple-webapp-6a00d-default-rtdb.europe-west1.firebasedatabase.app/",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const database = getDatabase(app);

export const auth = getAuth(app);
