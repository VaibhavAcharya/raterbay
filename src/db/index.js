import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAZf9z5bviUk4Lbq5tbjIN5te-rM9W9S5Y",
  authDomain: "raterbay.firebaseapp.com",
  projectId: "raterbay",
  storageBucket: "raterbay.appspot.com",
  messagingSenderId: "96567953047",
  appId: "1:96567953047:web:340fe8cb43a1cca1f68bd2",
};

export const firebase = initializeApp(firebaseConfig);

export const authentication = getAuth(firebase);

export const firestore = getFirestore(firebase);

export const storage = getStorage(firebase);
