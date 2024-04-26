import { initializeApp } from 'firebase/app';
import {getFirestore} from "firebase/firestore"
import {getStorage} from 'firebase/storage';
const firebaseConfig = {
  apiKey: "AIzaSyBd41f3jaGi_3TJYg1JcqR_nA2VuernmRk",
  authDomain: "gtfs-fdd83.firebaseapp.com",
  projectId: "gtfs-fdd83",
  storageBucket: "gtfs-fdd83.appspot.com",
  messagingSenderId: "621027464537",
  appId: "1:621027464537:web:5c5331b3944bd311d3a848",
  measurementId: "G-4HK51ZCL10"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const imageDb = getStorage(app);

export {storage, imageDb, db};
