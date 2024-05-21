// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCJIFktQx0NijO2_JAshfK6-nkDuTpjW7g",
  authDomain: "themodapp-c75be.firebaseapp.com",
  databaseURL: "https://themodapp-c75be-default-rtdb.firebaseio.com",
  projectId: "themodapp-c75be",
  storageBucket: "themodapp-c75be.appspot.com",
  messagingSenderId: "955171932935",
  appId: "1:955171932935:web:e8e213e58cb4acdc4f13a2",
  measurementId: "G-MWVM3KPY9V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth=getAuth();
export const db=getFirestore(app);
export default app;