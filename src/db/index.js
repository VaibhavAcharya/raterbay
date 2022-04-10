import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyAGbaPcK5mnW1kPNwkTdda_Hitbd9VQfNU",
  authDomain: "new-raterbay.firebaseapp.com",
  projectId: "new-raterbay",
  storageBucket: "new-raterbay.appspot.com",
  messagingSenderId: "7644984851",
  appId: "1:7644984851:web:b8d9cfae1464dfd48271e6",
};

export const firebase = initializeApp(firebaseConfig);

export const authentication = getAuth(firebase);

export const firestore = getFirestore(firebase);

export const storage = getStorage(firebase);
