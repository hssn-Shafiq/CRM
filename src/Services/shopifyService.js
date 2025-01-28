import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL; 
const ACCESS_TOKEN = process.env.REACT_APP_SHOPIFY_ACCESS_TOKEN; 
const BEARER_TOKEN = process.env.REACT_APP_BEARER_TOKEN; 


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


export const fetchSalesData = async () => {
  const orders = await fetchOrders();
  const totalSales = orders.reduce((total, order) => total + parseFloat(order.total_price), 0);
  return totalSales;
};




export const fetchShopifyCustomers = async (filterType) => {
  const API_URL = "https://crmapi.alayaarts.com/api/shopify";
  const BEARER_TOKEN = "1|nq8njnFmxYLoda5ImMgwwdxXGb7ONugJLpCCYsYff4264dcc";

  const customersEndpoint = `${API_URL}/customers`;
  const checkoutsEndpoint = `${API_URL}/getCheckout`;

  let url = "";
  switch (filterType) {
      case "purchased_once":
          url = `${customersEndpoint}?orders_count=1`;
          break;
      case "purchased_more_than_once":
          url = `${customersEndpoint}?orders_count[gt]=1`;
          break;
      case "not_purchased":
          url = `${customersEndpoint}?orders_count=0`;
          break;
      case "email_subscribers":
          url = `${customersEndpoint}?email_marketing_consent[state]=subscribed`;
          break;
      case "not_subscribed":
          url = `${customersEndpoint}?email_marketing_consent[state]=not_subscribed`;
          break;
      case "orders_count":
          url = `${checkoutsEndpoint}?state=orders_count`;
          break;
      default:
          throw new Error("Invalid filter type provided");
  }

  try {
      const response = await axios.get(url, {
          headers: {
              Authorization: `Bearer ${BEARER_TOKEN}`,
          },
      });

      return response.data.data;
  } catch (error) {
      console.error("Error fetching data: ", error);
      throw error;
  }
};
