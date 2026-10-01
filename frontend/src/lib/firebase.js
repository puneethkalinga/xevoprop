import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

/**
 * Xevoprop — Firebase & Cloud Firestore Client
 * Provides persistent database storage on Google Cloud infrastructure.
 * Free tier (Spark plan) never expires.
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "xevoprop-tech.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "xevoprop-tech",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "xevoprop-tech.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
};

let app = null;
let db = null;
let auth = null;

try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  db = getFirestore(app);
  auth = getAuth(app);
} catch (err) {
  console.warn("Firebase initialization note:", err.message);
}

export { app, db, auth };
