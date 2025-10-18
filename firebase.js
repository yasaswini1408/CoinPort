import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCoc-_8Ej4paxy0d-Yd9raiBBz4ylFJYXM",
  authDomain: "codeport-243e3.firebaseapp.com",
  projectId: "codeport-243e3",
  storageBucket: "codeport-243e3.firebasestorage.app",
  messagingSenderId: "1067399097141",
  appId: "1:1067399097141:web:9d87d1acdc41c0075bfa7c",
  measurementId: "G-9FBCRNCY2B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
