import { initializeApp } from 'firebase/app';
import {addDoc, collection, getFirestore} from "firebase/firestore"
import {getStorage} from 'firebase/storage';
import { getAuth } from 'firebase/auth';
const firebaseConfig = {
  apiKey: "AIzaSyCzFX1hnJ381ApNQH2u2FTg80FHKRH5ZHM",
  authDomain: "crm-project-a8b51.firebaseapp.com",
  projectId: "crm-project-a8b51",
  storageBucket: "crm-project-a8b51.appspot.com",
  messagingSenderId: "715765740841",
  appId: "1:715765740841:web:83421807c36a23894b7338",
  measurementId: "G-WQ01E8M136"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
const imageDb = getStorage(app);

export {storage, imageDb, db, auth, app};


export const addUserRole = (collectionName, data) => {
 try {
  const docRef = addDoc(collection(db, collectionName), data);
    console.log("User role added successfully");
 } catch (error) {
    console.log("error while adding userRole", error.message);
 }

}