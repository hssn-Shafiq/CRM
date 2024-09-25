const API_URL = `https://90bc89-e7.myshopify.com/admin/api/2023-04/orders.json`;
const ACCESS_TOKEN = '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';

export const fetchOrders = async () => {
    try {
      const response = await fetch('https://crmapi.alayaarts.com/api/shopify/customers', {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer 1|nq8njnFmxYLoda5ImMgwwdxXGb7ONugJLpCCYsYff4264dcc', // Your Bearer token
          'X-Shopify-Access-Token': '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', // Your Shopify access token
          'Content-Type': 'application/json', // Ensure it's JSON format
        },
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
  
      const data = await response.json();
      console.log("order data is ", data);
      return data.data; 
    } catch (error) {
      console.error('Error fetching orders:', error);
      return [];
    }
  };
  

export const fetchCustomers = async () => {
    const API_URL = `https://crmapi.alayaarts.com/api/shopify/customer-checkout`;
  
    try {
      const response = await fetch(API_URL, {
        method: 'GET',
        headers: {
          'X-Shopify-Access-Token': ACCESS_TOKEN,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      return data.customers;
    } catch (error) {
      console.error('Error fetching customers:', error);
      return [];
    }
  };
  
  export const fetchSalesData = async () => {
    const orders = await fetchOrders();
    const totalSales = orders.reduce((total, order) => total + parseFloat(order.total_price), 0);
    return totalSales;
  };
  