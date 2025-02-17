// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { getFirestore, collection, addDoc, doc, updateDoc, arrayUnion } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyD7p5kmJCYWHNBAuSSBNWayCiu6h92_21E",
  authDomain: "etalones-25a5f.firebaseapp.com",
  projectId: "etalones-25a5f",
  storageBucket: "etalones-25a5f.firebasestorage.app",
  messagingSenderId: "600971740349",
  appId: "1:600971740349:web:9536507419dd90633e23d4",
  measurementId: "G-6V7J4N8K6D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const db = getFirestore(app);
