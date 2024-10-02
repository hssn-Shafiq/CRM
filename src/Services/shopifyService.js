const API_URL = process.env.REACT_APP_API_URL; // Getting the API base URL from the .env file
const ACCESS_TOKEN = process.env.REACT_APP_SHOPIFY_ACCESS_TOKEN; // Shopify Access Token from .env
const BEARER_TOKEN = process.env.REACT_APP_BEARER_TOKEN; // Bearer Token from .env

export const fetchOrders = async () => {

    try {
      const response = await fetch(`${API_URL}/orders`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${BEARER_TOKEN}`, // Bearer token from .env
          'X-Shopify-Access-Token': ACCESS_TOKEN, // Shopify Access Token from .env
          'Content-Type': 'application/json', 
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

export const fetchSingleOrders = async ({orderId}) => {

  try {
    const response = await fetch(`${API_URL}/orders/${orderId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${BEARER_TOKEN}`, // Bearer token from .env
        'X-Shopify-Access-Token': ACCESS_TOKEN, // Shopify Access Token from .env
        'Content-Type': 'application/json', 
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    console.log("Single order data is ", data);
    return data.data; 
  } catch (error) {
    console.error('Error fetching single orders:', error);
    return [];
  }
};

export const fetchCustomers = async () => {
    try {
      const response = await fetch(`${API_URL}/customers`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${BEARER_TOKEN}`, // Bearer token from .env
          'X-Shopify-Access-Token': ACCESS_TOKEN, // Shopify Access Token from .env
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      return data.data;
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
