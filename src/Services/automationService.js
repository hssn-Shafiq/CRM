import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase/Config';
import { invoiceService } from './invoiceService';

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

// Automation Service
export const automationService = {
  // Get all automation rules
  getAllRules: async () => {
    try {
      const rulesQuery = query(
        collection(db, 'automationRules'),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(rulesQuery);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: convertTimestamp(doc.data().createdAt),
        updatedAt: convertTimestamp(doc.data().updatedAt)
      }));
    } catch (error) {
      console.error('Error getting automation rules:', error);
      throw new Error('Failed to fetch automation rules');
    }
  },

  // Get rule by ID
  getRuleById: async (id) => {
    try {
      const docRef = doc(db, 'automationRules', id);
      const docSnap = await getDoc(docRef);
      const rule = convertFirestoreDoc(docSnap);
      
      if (rule) {
        return {
          ...rule,
          createdAt: convertTimestamp(rule.createdAt),
          updatedAt: convertTimestamp(rule.updatedAt)
        };
      }
      
      throw new Error('Automation rule not found');
    } catch (error) {
      console.error('Error getting automation rule:', error);
      throw new Error('Failed to fetch automation rule');
    }
  },

  // Create new automation rule
  createRule: async (ruleData) => {
    try {
      const ruleWithTimestamp = {
        ...ruleData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        isActive: ruleData.isActive || true,
        executionCount: 0,
        lastExecuted: null
      };
      
      const docRef = await addDoc(collection(db, 'automationRules'), ruleWithTimestamp);
      return { id: docRef.id, ...ruleWithTimestamp };
    } catch (error) {
      console.error('Error creating automation rule:', error);
      throw new Error('Failed to create automation rule');
    }
  },

  // Update automation rule
  updateRule: async (id, ruleData) => {
    try {
      const docRef = doc(db, 'automationRules', id);
      const updateData = {
        ...ruleData,
        updatedAt: serverTimestamp()
      };
      
      await updateDoc(docRef, updateData);
      return { id, ...updateData };
    } catch (error) {
      console.error('Error updating automation rule:', error);
      throw new Error('Failed to update automation rule');
    }
  },

  // Delete automation rule
  deleteRule: async (id) => {
    try {
      const docRef = doc(db, 'automationRules', id);
      await deleteDoc(docRef);
      return { success: true, message: 'Automation rule deleted successfully' };
    } catch (error) {
      console.error('Error deleting automation rule:', error);
      throw new Error('Failed to delete automation rule');
    }
  },

  // Toggle rule active status
  toggleRuleStatus: async (id, isActive) => {
    try {
      const docRef = doc(db, 'automationRules', id);
      await updateDoc(docRef, {
        isActive: isActive,
        updatedAt: serverTimestamp()
      });
      
      return { 
        success: true, 
        message: `Rule ${isActive ? 'activated' : 'deactivated'} successfully` 
      };
    } catch (error) {
      console.error('Error toggling rule status:', error);
      throw new Error('Failed to toggle rule status');
    }
  },

  // Test automation rule (simplified)
  testRule: async (id, testData) => {
    try {
      const rule = await automationService.getRuleById(id);
      
      // Simulate rule execution without actually performing actions
      console.log('Testing rule:', rule.name, 'with data:', testData);
      
      return {
        success: true,
        message: 'Rule test completed (simulation)',
        ruleId: id,
        testData
      };
    } catch (error) {
      console.error('Error testing automation rule:', error);
      throw new Error('Failed to test automation rule');
    }
  },

  // Get rule execution history (simplified)
  getRuleHistory: async (id, limit = 50) => {
    try {
      // In a full implementation, you would have a separate collection for execution logs
      const rule = await automationService.getRuleById(id);
      
      return {
        ruleId: id,
        executionCount: rule.executionCount || 0,
        lastExecuted: rule.lastExecuted,
        history: [] // Placeholder for actual execution history
      };
    } catch (error) {
      console.error('Error getting rule history:', error);
      throw new Error('Failed to fetch rule history');
    }
  },

  // Execute rule manually
  executeRule: async (id, orderData) => {
    try {
      const rule = await automationService.getRuleById(id);
      
      if (!rule.isActive) {
        return { success: false, message: 'Rule is not active' };
      }

      let result = { success: false, message: 'Unknown action type' };

      switch (rule.actionType) {
        case 'generate_invoice':
          result = await automationService.executeGenerateInvoice(rule, orderData);
          break;
        case 'send_email':
          result = await automationService.executeSendEmail(rule, orderData);
          break;
        default:
          result = { success: false, message: `Unknown action type: ${rule.actionType}` };
      }

      // Update rule execution stats
      await updateDoc(doc(db, 'automationRules', id), {
        executionCount: (rule.executionCount || 0) + 1,
        lastExecuted: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      return result;
    } catch (error) {
      console.error('Error executing automation rule:', error);
      throw new Error('Failed to execute automation rule');
    }
  },

  // Get automation statistics
  getAutomationStats: async () => {
    try {
      const rulesQuery = collection(db, 'automationRules');
      const querySnapshot = await getDocs(rulesQuery);
      
      let stats = {
        totalRules: 0,
        activeRules: 0,
        inactiveRules: 0,
        totalExecutions: 0
      };
      
      querySnapshot.docs.forEach(doc => {
        const rule = doc.data();
        stats.totalRules++;
        
        if (rule.isActive) {
          stats.activeRules++;
        } else {
          stats.inactiveRules++;
        }
        
        stats.totalExecutions += rule.executionCount || 0;
      });
      
      return stats;
    } catch (error) {
      console.error('Error getting automation statistics:', error);
      throw new Error('Failed to fetch automation statistics');
    }
  },

  // Process new order (main entry point for order automation)
  processNewOrder: async (orderData) => {
    try {
      const rulesQuery = query(
        collection(db, 'automationRules'),
        where('triggerType', '==', 'new_order'),
        where('isActive', '==', true)
      );
      const querySnapshot = await getDocs(rulesQuery);
      
      const results = [];
      
      for (const ruleDoc of querySnapshot.docs) {
        const rule = { id: ruleDoc.id, ...ruleDoc.data() };
        
        try {
          const result = await automationService.executeRule(rule.id, orderData);
          results.push({ ruleId: rule.id, ruleName: rule.name, ...result });
        } catch (error) {
          results.push({ 
            ruleId: rule.id, 
            ruleName: rule.name, 
            success: false, 
            message: error.message 
          });
        }
      }
      
      return {
        success: true,
        message: `Processed ${querySnapshot.docs.length} automation rules`,
        results
      };
    } catch (error) {
      console.error('Error processing new order automation:', error);
      throw new Error('Failed to process order automation');
    }
  },

  // Execute generate invoice action
  executeGenerateInvoice: async (rule, orderData) => {
    try {
      const templateId = rule.actionConfig?.templateId;
      const invoice = await invoiceService.generateInvoiceFromOrder(orderData.id, templateId);
      
      return {
        success: true,
        message: 'Invoice generated successfully',
        invoiceId: invoice.id
      };
    } catch (error) {
      console.error('Error in generate invoice automation:', error);
      return { success: false, message: error.message };
    }
  },

  // Execute send email action (simplified)
  executeSendEmail: async (rule, orderData) => {
    try {
      const emailConfig = rule.actionConfig?.emailConfig || {};
      
      console.log('Email would be sent:', {
        to: orderData.customer?.email,
        subject: emailConfig.subject || 'New Invoice',
        message: emailConfig.message || 'Your invoice has been generated.'
      });
      
      return {
        success: true,
        message: 'Email notification sent (simulated)'
      };
    } catch (error) {
      console.error('Error in send email automation:', error);
      return { success: false, message: error.message };
    }
  }
};

export default automationService;
