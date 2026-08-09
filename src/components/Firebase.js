// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDl5GaGyxN5JnPQPFEDXehPv0TfkW2-NPw",
  authDomain: "tuka-969fa.firebaseapp.com",
  projectId: "tuka-969fa",
  storageBucket: "tuka-969fa.firebasestorage.app",
  messagingSenderId: "188570479628",
  appId: "1:188570479628:web:c265a8ae19df61b772d229",
  measurementId: "G-7QMSGCTXT3"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
