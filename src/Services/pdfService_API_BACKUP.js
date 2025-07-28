import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// PDF Generation Service
export const pdfService = {
  // Generate PDF from HTML element
  generatePDFFromElement: async (element, options = {}) => {
    try {
      const {
        scale = 2,
        useCORS = true,
        allowTaint = true,
        backgroundColor = '#ffffff',
        format = 'a4',
        orientation = 'portrait'
      } = options;

      // Create canvas from HTML element
      const canvas = await html2canvas(element, {
        scale,
        useCORS,
        allowTaint,
        backgroundColor,
        logging: false
      });

      // Calculate PDF dimensions
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF(orientation, 'mm', format);
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 30; // Top margin

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      
      return pdf;
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw new Error('Failed to generate PDF');
    }
  },

  // Download PDF
  downloadPDF: async (element, filename = 'invoice.pdf', options = {}) => {
    try {
      const pdf = await pdfService.generatePDFFromElement(element, { ...options, filename });
      pdf.save(filename);
      return true;
    } catch (error) {
      console.error('Error downloading PDF:', error);
      throw error;
    }
  },

  // Get PDF as blob for email attachment
  getPDFBlob: async (element, options = {}) => {
    try {
      const pdf = await pdfService.generatePDFFromElement(element, options);
      return pdf.output('blob');
    } catch (error) {
      console.error('Error getting PDF blob:', error);
      throw error;
    }
  },

  // Generate PDF from template data
  generateInvoicePDF: async (invoiceData, templateHTML, options = {}) => {
    try {
      // Create a temporary div with the template HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = templateHTML;
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.top = '-9999px';
      tempDiv.style.width = '800px';
      
      // Apply invoice data to template
      const populatedHTML = pdfService.populateTemplate(templateHTML, invoiceData);
      tempDiv.innerHTML = populatedHTML;
      
      document.body.appendChild(tempDiv);
      
      try {
        const pdf = await pdfService.generatePDFFromElement(tempDiv, options);
        return pdf;
      } finally {
        document.body.removeChild(tempDiv);
      }
    } catch (error) {
      console.error('Error generating invoice PDF:', error);
      throw error;
    }
  },

  // Populate template with data
  populateTemplate: (template, data) => {
    let populatedTemplate = template;

    // Replace placeholders with actual data
    const replacements = {
      '{{invoice_number}}': data.invoice_number || '',
      '{{invoice_date}}': data.invoice_date || new Date().toLocaleDateString(),
      '{{due_date}}': data.due_date || '',
      '{{customer_name}}': data.customer?.name || `${data.customer?.first_name || ''} ${data.customer?.last_name || ''}`.trim(),
      '{{customer_email}}': data.customer?.email || '',
      '{{customer_phone}}': data.customer?.phone || '',
      '{{customer_address}}': data.customer?.address || '',
      '{{customer_city}}': data.customer?.city || '',
      '{{customer_state}}': data.customer?.state || data.customer?.province || '',
      '{{customer_zip}}': data.customer?.zip || '',
      '{{customer_country}}': data.customer?.country || '',
      '{{company_name}}': data.company?.name || 'Your Company',
      '{{company_address}}': data.company?.address || '',
      '{{company_phone}}': data.company?.phone || '',
      '{{company_email}}': data.company?.email || '',
      '{{subtotal}}': data.subtotal || '0.00',
      '{{tax_amount}}': data.tax_amount || '0.00',
      '{{discount_amount}}': data.discount_amount || '0.00',
      '{{total_amount}}': data.total_amount || '0.00',
      '{{currency}}': data.currency || 'USD',
      '{{notes}}': data.notes || '',
      '{{terms}}': data.terms || ''
    };

    // Replace all placeholders
    Object.keys(replacements).forEach(placeholder => {
      const regex = new RegExp(placeholder.replace(/[{}]/g, '\\$&'), 'g');
      populatedTemplate = populatedTemplate.replace(regex, replacements[placeholder]);
    });

    // Handle line items
    if (data.line_items && data.line_items.length > 0) {
      const itemsHTML = data.line_items.map(item => `
        <tr>
          <td>${item.name || item.title || ''}</td>
          <td>${item.quantity || 1}</td>
          <td>${data.currency || '$'}${item.price || '0.00'}</td>
          <td>${data.currency || '$'}${(parseFloat(item.price || 0) * parseInt(item.quantity || 1)).toFixed(2)}</td>
        </tr>
      `).join('');
      
      populatedTemplate = populatedTemplate.replace('{{line_items}}', itemsHTML);
    } else {
      populatedTemplate = populatedTemplate.replace('{{line_items}}', '<tr><td colspan="4">No items</td></tr>');
    }

    return populatedTemplate;
  },

  // Create standard invoice template
  createStandardTemplate: () => {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; background: white;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 30px;">
          <div>
            <h1 style="color: #333; margin: 0;">{{company_name}}</h1>
            <p style="margin: 5px 0;">{{company_address}}</p>
            <p style="margin: 5px 0;">{{company_phone}} | {{company_email}}</p>
          </div>
          <div style="text-align: right;">
            <h2 style="color: #333; margin: 0;">INVOICE</h2>
            <p style="margin: 5px 0;"><strong>Invoice #:</strong> {{invoice_number}}</p>
            <p style="margin: 5px 0;"><strong>Date:</strong> {{invoice_date}}</p>
            <p style="margin: 5px 0;"><strong>Due Date:</strong> {{due_date}}</p>
          </div>
        </div>

        <div style="margin-bottom: 30px;">
          <h3 style="color: #333; margin-bottom: 10px;">Bill To:</h3>
          <p style="margin: 5px 0;"><strong>{{customer_name}}</strong></p>
          <p style="margin: 5px 0;">{{customer_email}}</p>
          <p style="margin: 5px 0;">{{customer_phone}}</p>
          <p style="margin: 5px 0;">{{customer_address}}</p>
          <p style="margin: 5px 0;">{{customer_city}}, {{customer_state}} {{customer_zip}}</p>
          <p style="margin: 5px 0;">{{customer_country}}</p>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
          <thead>
            <tr style="background-color: #f5f5f5;">
              <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Item</th>
              <th style="border: 1px solid #ddd; padding: 12px; text-align: center;">Qty</th>
              <th style="border: 1px solid #ddd; padding: 12px; text-align: right;">Price</th>
              <th style="border: 1px solid #ddd; padding: 12px; text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            {{line_items}}
          </tbody>
        </table>

        <div style="display: flex; justify-content: flex-end;">
          <div style="width: 300px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
              <span>Subtotal:</span>
              <span>{{currency}}{{subtotal}}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
              <span>Discount:</span>
              <span>-{{currency}}{{discount_amount}}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
              <span>Tax:</span>
              <span>{{currency}}{{tax_amount}}</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 18px; border-top: 2px solid #333; padding-top: 10px;">
              <span>Total:</span>
              <span>{{currency}}{{total_amount}}</span>
            </div>
          </div>
        </div>

        <div style="margin-top: 40px;">
          <h4 style="color: #333;">Notes:</h4>
          <p style="margin: 10px 0;">{{notes}}</p>
        </div>

        <div style="margin-top: 30px;">
          <h4 style="color: #333;">Terms & Conditions:</h4>
          <p style="margin: 10px 0;">{{terms}}</p>
        </div>
      </div>
    `;
  }
};

export default pdfService;
