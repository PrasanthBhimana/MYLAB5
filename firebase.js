import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAiUvtWHcALH5p-D3iUeFOkdbj4_wOcE7E",
  authDomain: "mylab4-e162a.firebaseapp.com",
  projectId: "mylab4-e162a",
  storageBucket: "mylab4-e162a.appspot.com",
  messagingSenderId: "313646697284",
  appId: "1:313646697284:web:35a1f096be8453dbc62511"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

export { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, firestore };