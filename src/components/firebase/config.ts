import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
  apiKey: "AIzaSyBEeWdujoaabkmbS8G70eC-77TnAW8R4h0",
  authDomain: "overwatchbuilds-dev.firebaseapp.com",
  projectId: "overwatchbuilds-dev",
  storageBucket: "overwatchbuilds-dev.firebasestorage.app",
  messagingSenderId: "402277529166",
  appId: "1:402277529166:web:94cfc8c7ea01a7d44b351f",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);
