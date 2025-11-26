// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDNgho_q0b-FMWAGgwM99fBwAbYY-o73L4",
  authDomain: "goaninstitutewebsite.firebaseapp.com",
  projectId: "goaninstitutewebsite",
  storageBucket: "goaninstitutewebsite.firebasestorage.app",
  messagingSenderId: "355828396994",
  appId: "1:355828396994:web:793f8f6c2002c0c78d1c5b",
  measurementId: "G-EY8K8K8XGS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
