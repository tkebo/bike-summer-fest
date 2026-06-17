import { initializeApp } from "firebase/app";

import {
  browserLocalPersistence,
  GoogleAuthProvider,
  initializeAuth,
} from "firebase/auth";

import {
  initializeFirestore,
} from "firebase/firestore";

const fallbackFirebaseConfig = {
  apiKey: "AIzaSyDmK1vXUoxbnaUqEVkaThspf5p5-7tQf9Q",
  authDomain: "bike-summer-fest.firebaseapp.com",
  projectId: "bike-summer-fest",
  storageBucket: "bike-summer-fest.firebasestorage.app",
  messagingSenderId: "757610105673",
  appId: "1:757610105673:web:ca9be32b99aea8d5ad6898",
};

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || fallbackFirebaseConfig.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || fallbackFirebaseConfig.authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || fallbackFirebaseConfig.projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || fallbackFirebaseConfig.storageBucket,
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || fallbackFirebaseConfig.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || fallbackFirebaseConfig.appId,
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: browserLocalPersistence,
});

export const googleProvider =
  new GoogleAuthProvider();

export const db = initializeFirestore(app, {
  ignoreUndefinedProperties: true,
});

export default app;
