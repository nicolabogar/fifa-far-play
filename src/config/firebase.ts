import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyB2FF0TT2ZIEn91DkjhPYqcDABK52Tx2-I",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "fut-manager-6bd85.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "fut-manager-6bd85",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "fut-manager-6bd85.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "999602703550",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:999602703550:web:57cbf17b03f30baf02e2ef",
};

// Singleton instances
export const firebaseApp = initializeApp(firebaseConfig);
export const db = getFirestore(firebaseApp);
export const auth = getAuth(firebaseApp);
export const storage = getStorage(firebaseApp);
