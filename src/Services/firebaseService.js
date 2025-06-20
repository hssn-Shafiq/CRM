import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import { app } from './firebaseConfig'; // Make sure you have this file with Firebase initialization
import { app } from "../firebase/Config";

const db = getFirestore(app);
const storage = getStorage(app);

// Fetch custom leads from Firebase
export const fetchCustomLeads = async () => {
  try {
    const leadsCollection = collection(db, "customLeads");
    const snapshot = await getDocs(leadsCollection);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      source: "custom", // Add source to differentiate from Shopify leads
    }));
  } catch (error) {
    console.error("Error fetching custom leads:", error);
    throw error;
  }
};

// Add a single custom lead to Firebase
export const addCustomLead = async (leadData) => {
  try {
    const leadsCollection = collection(db, "customLeads");
    const docRef = await addDoc(leadsCollection, {
      ...leadData,
      createdAt: new Date(),
      source: "custom",
    });
    return {
      id: docRef.id,
      ...leadData,
      source: "custom",
    };
  } catch (error) {
    console.error("Error adding custom lead:", error);
    throw error;
  }
};

// Update a custom lead in Firebase
export const updateCustomLead = async (id, leadData) => {
  try {
    const leadRef = doc(db, "customLeads", id);
    await updateDoc(leadRef, {
      ...leadData,
      updatedAt: new Date(),
    });
    return {
      id,
      ...leadData,
    };
  } catch (error) {
    console.error("Error updating custom lead:", error);
    throw error;
  }
};

// Delete a custom lead from Firebase
export const deleteCustomLead = async (id) => {
  try {
    const leadRef = doc(db, "customLeads", id);
    await deleteDoc(leadRef);
    return id;
  } catch (error) {
    console.error("Error deleting custom lead:", error);
    throw error;
  }
};

// Upload Excel file and process data
export const uploadExcelAndProcess = async (file, processFunction) => {
  try {
    // Upload file to Firebase Storage
    const storageRef = ref(storage, `excel_uploads/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);

    // Return the download URL - the actual processing will happen in the component
    return {
      fileUrl: downloadURL,
      fileName: file.name,
    };
  } catch (error) {
    console.error("Error uploading Excel file:", error);
    throw error;
  }
};

// Add multiple leads from Excel to Firebase
export const addBulkCustomLeads = async (leadsArray) => {
  try {
    const batch = [];
    const leadsCollection = collection(db, "customLeads");

    // Add each lead to Firebase
    for (const lead of leadsArray) {
      const docRef = await addDoc(leadsCollection, {
        ...lead,
        createdAt: new Date(),
        source: lead.source || 'imported',
        importedViaExcel: true,
      });
      batch.push({
        id: docRef.id,
        ...lead,
      });
    }

    return batch;
  } catch (error) {
    console.error("Error adding bulk leads:", error);
    throw error;
  }
};
