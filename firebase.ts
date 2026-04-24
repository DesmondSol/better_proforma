
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyA9NipZpNhO2xNaV48Sd0IvFfdF5slfiuI",
  authDomain: "proforma-eth.firebaseapp.com",
  projectId: "proforma-eth",
  storageBucket: "proforma-eth.firebasestorage.app",
  messagingSenderId: "109297102612",
  appId: "1:109297102612:web:d5849aa4ce8d0742641c01",
  measurementId: "G-P8P45827YY"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const googleProvider = new GoogleAuthProvider();
// Add the specific client ID as requested
googleProvider.setCustomParameters({
  client_id: "109297102612-4pdtdjdg7ouetar4ic0gsed0h9g4noa5.apps.googleusercontent.com"
});

export const db = getFirestore(app);
export const analytics = getAnalytics(app);
