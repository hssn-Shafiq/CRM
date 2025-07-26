// Temporary debug utility to check Firebase data
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/Config';

export const debugFirebaseData = async () => {
  try {
    console.log('🔍 Checking Firebase invoices collection...');
    
    const invoicesSnapshot = await getDocs(collection(db, 'invoices'));
    
    console.log('📊 Total invoices found:', invoicesSnapshot.docs.length);
    
    if (invoicesSnapshot.docs.length > 0) {
      console.log('📋 Sample invoice data:');
      invoicesSnapshot.docs.forEach((doc, index) => {
        if (index < 3) { // Show first 3 invoices
          console.log(`Invoice ${index + 1}:`, {
            id: doc.id,
            ...doc.data()
          });
        }
      });
    } else {
      console.log('❌ No invoices found in Firebase');
    }
    
    return {
      success: true,
      count: invoicesSnapshot.docs.length,
      invoices: invoicesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
    };
  } catch (error) {
    console.error('❌ Error checking Firebase data:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Add to window for easy debugging
if (typeof window !== 'undefined') {
  window.debugFirebaseData = debugFirebaseData;
}
