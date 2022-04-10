import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyDSR0GqhvY8aIyTx7RIfIC7uhtdFyrrhS0",
  authDomain: "fir-5f5f8.firebaseapp.com",
  projectId: "fir-5f5f8",
  storageBucket: "fir-5f5f8.appspot.com",
  messagingSenderId: "889310087644",
  appId: "1:889310087644:web:2ab781c2d5c864ba73e719",
};

export const firebase = initializeApp(firebaseConfig);

export const authentication = getAuth(firebase);

export const firestore = getFirestore(firebase);

export const storage = getStorage(firebase);
