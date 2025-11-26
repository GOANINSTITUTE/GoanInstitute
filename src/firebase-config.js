// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBCPl597MNfQYPt1EufI6hycEp_4529Je8",
  authDomain: "darvikfoundation-56c6b.firebaseapp.com",
  projectId: "darvikfoundation-56c6b",
  storageBucket: "darvikfoundation-56c6b.appspot.com",  // 🛠 fix typo: use .appspot.com not .app
  messagingSenderId: "327057680572",
  appId: "1:327057680572:web:ca4419ad1ed95ef50248b9",
  measurementId: "G-0JV0DTDQP0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
