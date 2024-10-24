import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL; // Getting the API base URL from the .env file
const ACCESS_TOKEN = process.env.REACT_APP_SHOPIFY_ACCESS_TOKEN; // Shopify Access Token from .env
const BEARER_TOKEN = process.env.REACT_APP_BEARER_TOKEN; // Bearer Token from .env

// Fetch Orders
export const fetchOrders = async () => {
  try {
    const response = await fetch(`${API_URL}/orders`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${BEARER_TOKEN}`,
        'X-Shopify-Access-Token': ACCESS_TOKEN,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    console.log("Order data is:", data);
    return data.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
};

// Fetch Single Order by ID
export const fetchSingleOrders = async ({
  orderId
}) => {
  try {
    const response = await fetch(`${API_URL}/orders/${orderId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${BEARER_TOKEN}`,
        'X-Shopify-Access-Token': ACCESS_TOKEN,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    console.log("Single order data is:", data);
    return data.data;
  } catch (error) {
    console.error('Error fetching single orders:', error);
    return [];
  }
};

// Fetch Customers
export const fetchCustomers = async () => {
  try {
    const response = await fetch(`${API_URL}/customers`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${BEARER_TOKEN}`,
        'X-Shopify-Access-Token': ACCESS_TOKEN,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    console.log("Customer data is:", data);
    return data.data;
  } catch (error) {
    console.error('Error fetching customers:', error);
    return [];
  }
};

// Fetch Total Sales Data
export const fetchSalesData = async () => {
  const orders = await fetchOrders();
  const totalSales = orders.reduce((total, order) => total + parseFloat(order.total_price), 0);
  return totalSales;
};


export const fetchShopifyCustomers = async (filterType) => {
  let url = `${API_URL}/customers`;

  // Modify URL for specific customer filters
  switch (filterType) {
    case "purchased_once":
      url += "?orders_count=1"; // Customers who have purchased exactly once
      break;
    case "purchased_more_than_once":
      url += "?orders_count[gt]=1"; // Customers who have purchased more than once
      break;
    case "not_purchased":
      url += "?orders_count=0"; // Customers who have not purchased anything
      break;
    case "email_subscribers":
      url += "?email_marketing_consent[state]=subscribed"; // Customers who are email subscribers
      break;
    case "not_subscribed":
      url += "?email_marketing_consent[state]=not_subscribed"; // Customers who are not subscribed to emails
      break;
    case "abandoned_checkout":
      url += "?state=abandoned"; // Customers with abandoned checkouts
      break;
    default:
      break;
  }

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
      },
    });

    return response.data.data; // Assuming the data is in the 'data' field
  } catch (error) {
    console.error("Error fetching data: ", error);
    throw error;
  }
};