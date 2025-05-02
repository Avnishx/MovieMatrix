import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";  // 👈 Add this line

// Your Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyD-DHC0pGMDjl9wuvrFHgRalZQfwCyRoaI",
  authDomain: "moviematrix-13415.firebaseapp.com",
  projectId: "moviematrix-13415",
  storageBucket: "moviematrix-13415.appspot.com",
  messagingSenderId: "400484536096",
  appId: "1:400484536096:web:c2dd1550db48fb4a71d145"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Firebase Auth instance
const auth = getAuth(app);

// Initialize Firestore
const db = getFirestore(app);  // 👈 Add this line

// Create Google Auth Provider
const provider = new GoogleAuthProvider();
provider.addScope('profile');
provider.addScope('email');

export { app, auth, provider, db };  // 👈 Export db
