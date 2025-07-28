import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy,
  serverTimestamp,
  writeBatch 
} from 'firebase/firestore';
import { db } from '../firebase/Config';

// Helper function to convert Firestore document to object with ID
const convertFirestoreDoc = (doc) => {
  if (!doc.exists()) return null;
  return { id: doc.id, ...doc.data() };
};

// Helper function to convert Firestore timestamp to readable date
const convertTimestamp = (timestamp) => {
  if (!timestamp) return null;
  return timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
};

// Invoice Template Service
export const templateService = {
  // Get all templates
  getAllTemplates: async () => {
    try {
      const templatesQuery = query(
        collection(db, 'invoiceTemplates'),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(templatesQuery);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: convertTimestamp(doc.data().createdAt),
        updatedAt: convertTimestamp(doc.data().updatedAt)
      }));
    } catch (error) {
      console.error('Error getting templates:', error);
      throw new Error('Failed to fetch templates');
    }
  },

  // Get template by ID
  getTemplateById: async (id) => {
    try {
      const docRef = doc(db, 'invoiceTemplates', id);
      const docSnap = await getDoc(docRef);
      const template = convertFirestoreDoc(docSnap);
      
      if (template) {
        return {
          ...template,
          createdAt: convertTimestamp(template.createdAt),
          updatedAt: convertTimestamp(template.updatedAt)
        };
      }
      
      throw new Error('Template not found');
    } catch (error) {
      console.error('Error getting template:', error);
      throw new Error('Failed to fetch template');
    }
  },

  // Create new template
  createTemplate: async (templateData) => {
    try {
      const templateWithTimestamp = {
        ...templateData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        isActive: templateData.isActive || true,
      };
      
      const docRef = await addDoc(collection(db, 'invoiceTemplates'), templateWithTimestamp);
      return { id: docRef.id, ...templateWithTimestamp };
    } catch (error) {
      console.error('Error creating template:', error);
      throw new Error('Failed to create template');
    }
  },

  // Update template
  updateTemplate: async (id, templateData) => {
    try {
      const docRef = doc(db, 'invoiceTemplates', id);
      const updateData = {
        ...templateData,
        updatedAt: serverTimestamp()
      };
      
      await updateDoc(docRef, updateData);
      return { id, ...updateData };
    } catch (error) {
      console.error('Error updating template:', error);
      throw new Error('Failed to update template');
    }
  },

  // Delete template
  deleteTemplate: async (id) => {
    try {
      const docRef = doc(db, 'invoiceTemplates', id);
      await deleteDoc(docRef);
      return { success: true, message: 'Template deleted successfully' };
    } catch (error) {
      console.error('Error deleting template:', error);
      throw new Error('Failed to delete template');
    }
  },

  // Clone template
  cloneTemplate: async (id, newName) => {
    try {
      const originalTemplate = await templateService.getTemplateById(id);
      
      const clonedTemplate = {
        ...originalTemplate,
        name: newName || `${originalTemplate.name} (Copy)`,
        isActive: false // New cloned templates start as inactive
      };
      
      // Remove the id and timestamp fields
      delete clonedTemplate.id;
      delete clonedTemplate.createdAt;
      delete clonedTemplate.updatedAt;
      
      return await templateService.createTemplate(clonedTemplate);
    } catch (error) {
      console.error('Error cloning template:', error);
      throw new Error('Failed to clone template');
    }
  },

  // Set default template
  setDefaultTemplate: async (id) => {
    try {
      // First, remove default flag from all templates
      const templatesQuery = collection(db, 'invoiceTemplates');
      const querySnapshot = await getDocs(templatesQuery);
      
      const batch = writeBatch(db);
      querySnapshot.docs.forEach(doc => {
        if (doc.data().isDefault) {
          batch.update(doc.ref, { isDefault: false, updatedAt: serverTimestamp() });
        }
      });
      
      // Set the selected template as default
      const docRef = doc(db, 'invoiceTemplates', id);
      batch.update(docRef, { isDefault: true, updatedAt: serverTimestamp() });
      
      await batch.commit();
      
      return { success: true, message: 'Default template updated' };
    } catch (error) {
      console.error('Error setting default template:', error);
      throw new Error('Failed to set default template');
    }
  }
};

export default templateService;
