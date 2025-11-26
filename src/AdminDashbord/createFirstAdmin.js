// createFirstAdmin.js
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

// Replace with your actual Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDNgho_q0b-FMWAGgwM99fBwAbYY-o73L4",
  authDomain: "goaninstitutewebsite.firebaseapp.com",
  projectId: "goaninstitutewebsite",
  storageBucket: "goaninstitutewebsite.firebasestorage.app",
  messagingSenderId: "355828396994",
  appId: "1:355828396994:web:793f8f6c2002c0c78d1c5b",
  measurementId: "G-EY8K8K8XGS"
};

// Your admin details
const adminDetails = {
  name: "Jeit",
  phone: "9947819994",
  email: "educationjbn@gmail.com",
  password: "GoanAdmin@123",
  role: "admin"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function createFirstAdmin() {
  try {
    console.log("Creating admin user...");
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      adminDetails.email,
      adminDetails.password
    );

    const user = userCredential.user;
    console.log("✅ Auth user created:", user.uid);

    await setDoc(doc(db, "adminUsers", user.uid), {
      name: adminDetails.name,
      phone: adminDetails.phone,
      email: adminDetails.email,
      role: adminDetails.role,
      createdAt: new Date().toISOString(),
    });

    console.log("✅ Firestore document created successfully!");
    console.log("🎉 You can now log in as:", adminDetails.email);
  } catch (err) {
    console.error("❌ Error creating admin:", err.message);
  }
}

createFirstAdmin();
