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

// Invoice Service
export const invoiceService = {
  // Get all invoices
  getAllInvoices: async () => {
    try {
      const invoicesQuery = query(
        collection(db, 'invoices'),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(invoicesQuery);
      return querySnapshot.docs.map(doc => {
        const invoice = doc.data();
        return {
          id: doc.id,
          ...invoice,
          createdAt: convertTimestamp(invoice.createdAt),
          updatedAt: convertTimestamp(invoice.updatedAt),
          dueDate: convertTimestamp(invoice.dueDate),
          issueDate: convertTimestamp(invoice.issueDate) || convertTimestamp(invoice.createdAt),
          // Ensure customer object has the expected structure
          customer: invoice.customer || {
            firstName: invoice.customerName?.split(' ')[0] || '',
            lastName: invoice.customerName?.split(' ').slice(1).join(' ') || '',
            email: invoice.customerEmail || '',
            phone: invoice.customerPhone || '',
            address: {
              address1: invoice.customerAddress || '',
              address2: '',
              city: '',
              province: '',
              zip: '',
              country: ''
            }
          }
        };
      });
    } catch (error) {
      console.error('Error getting invoices:', error);
      throw new Error('Failed to fetch invoices');
    }
  },

  // Get invoice by ID
  getInvoiceById: async (id) => {
    try {
      const docRef = doc(db, 'invoices', id);
      const docSnap = await getDoc(docRef);
      const invoice = convertFirestoreDoc(docSnap);
      
      if (invoice) {
        return {
          ...invoice,
          createdAt: convertTimestamp(invoice.createdAt),
          updatedAt: convertTimestamp(invoice.updatedAt),
          dueDate: convertTimestamp(invoice.dueDate),
          issueDate: convertTimestamp(invoice.issueDate) || convertTimestamp(invoice.createdAt), // Map createdAt to issueDate if needed
          // Ensure customer object has the expected structure
          customer: invoice.customer || {
            firstName: invoice.customerName?.split(' ')[0] || '',
            lastName: invoice.customerName?.split(' ').slice(1).join(' ') || '',
            email: invoice.customerEmail || '',
            phone: invoice.customerPhone || '',
            address: {
              address1: invoice.customerAddress || '',
              address2: '',
              city: '',
              province: '',
              zip: '',
              country: ''
            }
          }
        };
      }
      
      throw new Error('Invoice not found');
    } catch (error) {
      console.error('Error getting invoice:', error);
      throw new Error('Failed to fetch invoice');
    }
  },

  // Create new invoice
  createInvoice: async (invoiceData) => {
    try {
      const invoiceWithTimestamp = {
        ...invoiceData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        issueDate: invoiceData.issueDate || serverTimestamp(),
        status: invoiceData.status || 'draft',
        invoiceNumber: invoiceData.invoiceNumber || `INV-${Date.now()}`,
      };
      
      const docRef = await addDoc(collection(db, 'invoices'), invoiceWithTimestamp);
      return { id: docRef.id, ...invoiceWithTimestamp };
    } catch (error) {
      console.error('Error creating invoice:', error);
      throw new Error('Failed to create invoice');
    }
  },

  // Update invoice
  updateInvoice: async (id, invoiceData) => {
    try {
      const docRef = doc(db, 'invoices', id);
      const updateData = {
        ...invoiceData,
        updatedAt: serverTimestamp()
      };
      
      await updateDoc(docRef, updateData);
      return { id, ...updateData };
    } catch (error) {
      console.error('Error updating invoice:', error);
      throw new Error('Failed to update invoice');
    }
  },

  // Delete invoice
  deleteInvoice: async (id) => {
    try {
      const docRef = doc(db, 'invoices', id);
      await deleteDoc(docRef);
      return { success: true, message: 'Invoice deleted successfully' };
    } catch (error) {
      console.error('Error deleting invoice:', error);
      throw new Error('Failed to delete invoice');
    }
  },

  // Generate invoice from order
  generateInvoiceFromOrder: async (orderId, templateId) => {
    try {
      // First, get the order data from Shopify collection or orders collection
      const orderRef = doc(db, 'orders', orderId);
      const orderSnap = await getDoc(orderRef);
      
      if (!orderSnap.exists()) {
        throw new Error('Order not found');
      }
      
      const orderData = orderSnap.data();
      
      // Get template if provided
      let template = null;
      if (templateId) {
        const templateRef = doc(db, 'invoiceTemplates', templateId);
        const templateSnap = await getDoc(templateRef);
        template = templateSnap.exists() ? templateSnap.data() : null;
      }
      
      // Generate invoice data from order
      const invoiceData = {
        orderId: orderId,
        templateId: templateId,
        customerId: orderData.customerId || orderData.customer?.id,
        customerName: orderData.customerName || orderData.customer?.name,
        customerEmail: orderData.customerEmail || orderData.customer?.email,
        customerAddress: orderData.customerAddress || orderData.customer?.address,
        items: orderData.items || orderData.line_items || [],
        subtotal: orderData.subtotal || orderData.total_price,
        tax: orderData.tax || 0,
        total: orderData.total || orderData.total_price,
        status: 'generated',
        invoiceNumber: `INV-${Date.now()}`,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      };
      
      const docRef = await addDoc(collection(db, 'invoices'), invoiceData);
      return { id: docRef.id, ...invoiceData };
    } catch (error) {
      console.error('Error generating invoice from order:', error);
      throw new Error('Failed to generate invoice from order');
    }
  },

  // Send invoice by email (simplified - without actual email sending)
  sendInvoiceByEmail: async (invoiceId, emailData) => {
    try {
      // Update invoice status to indicate it was sent
      const docRef = doc(db, 'invoices', invoiceId);
      await updateDoc(docRef, {
        status: 'sent',
        sentAt: serverTimestamp(),
        sentTo: emailData.email,
        emailSubject: emailData.subject,
        emailMessage: emailData.message,
        updatedAt: serverTimestamp()
      });
      
      // In a real implementation, you would integrate with an email service here
      console.log('Invoice would be sent via email:', emailData);
      
      return { 
        success: true, 
        message: 'Invoice marked as sent (email integration pending)',
        invoiceId 
      };
    } catch (error) {
      console.error('Error sending invoice by email:', error);
      throw new Error('Failed to send invoice by email');
    }
  },

  // Get invoices by customer
  getInvoicesByCustomer: async (customerId) => {
    try {
      const invoicesQuery = query(
        collection(db, 'invoices'),
        where('customerId', '==', customerId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(invoicesQuery);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: convertTimestamp(doc.data().createdAt),
        updatedAt: convertTimestamp(doc.data().updatedAt),
        dueDate: convertTimestamp(doc.data().dueDate)
      }));
    } catch (error) {
      console.error('Error getting invoices by customer:', error);
      throw new Error('Failed to fetch customer invoices');
    }
  },

  // Get invoice statistics
  getInvoiceStats: async () => {
    try {
      const invoicesQuery = collection(db, 'invoices');
      const querySnapshot = await getDocs(invoicesQuery);
      
      let stats = {
        total: 0,
        paid: 0,
        pending: 0,
        overdue: 0,
        draft: 0,
        totalAmount: 0,
        paidAmount: 0,
        pendingAmount: 0
      };
      
      const now = new Date();
      
      querySnapshot.docs.forEach(doc => {
        const invoice = doc.data();
        stats.total++;
        
        const total = parseFloat(invoice.total || 0);
        stats.totalAmount += total;
        
        switch (invoice.status) {
          case 'paid':
            stats.paid++;
            stats.paidAmount += total;
            break;
          case 'pending':
            stats.pending++;
            stats.pendingAmount += total;
            
            // Check if overdue
            const dueDate = convertTimestamp(invoice.dueDate);
            if (dueDate && dueDate < now) {
              stats.overdue++;
            }
            break;
          case 'draft':
            stats.draft++;
            break;
          default:
            stats.pending++;
            stats.pendingAmount += total;
        }
      });
      
      return stats;
    } catch (error) {
      console.error('Error getting invoice statistics:', error);
      throw new Error('Failed to fetch invoice statistics');
    }
  },

  // Mark invoice as paid
  markInvoiceAsPaid: async (invoiceId, paymentData) => {
    try {
      const docRef = doc(db, 'invoices', invoiceId);
      const updateData = {
        status: 'paid',
        paidAt: serverTimestamp(),
        paymentMethod: paymentData.paymentMethod || 'manual',
        paymentReference: paymentData.paymentReference || '',
        paymentNotes: paymentData.notes || '',
        updatedAt: serverTimestamp()
      };
      
      await updateDoc(docRef, updateData);
      return { 
        success: true, 
        message: 'Invoice marked as paid',
        invoiceId,
        ...updateData 
      };
    } catch (error) {
      console.error('Error marking invoice as paid:', error);
      throw new Error('Failed to mark invoice as paid');
    }
  },

  // Download invoice PDF (simplified - returns invoice data for PDF generation)
  downloadInvoicePDF: async (invoiceId) => {
    try {
      // Since we're not using Firebase Storage, return invoice data for client-side PDF generation
      const invoice = await invoiceService.getInvoiceById(invoiceId);
      
      // In a real implementation, you would generate PDF here
      console.log('Invoice data for PDF generation:', invoice);
      
      return {
        success: true,
        message: 'Invoice data ready for PDF generation',
        invoiceData: invoice
      };
    } catch (error) {
      console.error('Error preparing invoice for PDF download:', error);
      throw new Error('Failed to prepare invoice for download');
    }
  },

  // Bulk invoice operations
  bulkUpdateInvoices: async (invoiceIds, updateData) => {
    try {
      const batch = writeBatch(db);
      
      invoiceIds.forEach(id => {
        const docRef = doc(db, 'invoices', id);
        batch.update(docRef, {
          ...updateData,
          updatedAt: serverTimestamp()
        });
      });
      
      await batch.commit();
      
      return {
        success: true,
        message: `${invoiceIds.length} invoices updated successfully`,
        updatedCount: invoiceIds.length
      };
    } catch (error) {
      console.error('Error bulk updating invoices:', error);
      throw new Error('Failed to bulk update invoices');
    }
  }
};

export default invoiceService;
