import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || "https://crm.digibuzzify.com/api/shopify";
const BEARER_TOKEN = process.env.REACT_APP_BEARER_TOKEN || "1|nq8njnFmxYLoda5ImMgwwdxXGb7ONugJLpCCYsYff4264dcc";
const CACHE_EXPIRY = 30 * 60 * 1000; // 30 minutes in milliseconds

// Helper function to get cached data
const getCachedData = (key) => {
  try {
    const cachedData = localStorage.getItem(key);
    if (!cachedData) return null;

    const { data, timestamp } = JSON.parse(cachedData);

    // Check if cache has expired
    if (Date.now() - timestamp > CACHE_EXPIRY) {
      localStorage.removeItem(key); // Clear expired cache
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error reading from cache:', error);
    return null;
  }
};

// Helper function to set cached data
const setCachedData = (key, data) => {
  try {
    const dataToCache = {
      data,
      timestamp: Date.now()
    };
    localStorage.setItem(key, JSON.stringify(dataToCache));
  } catch (error) {
    console.error('Error writing to cache:', error);
  }
};

// Fetch customers with caching - keeping original function for backward compatibility
export const fetchCustomers = async () => {
  const cacheKey = 'shopify_all_customers';
  const cachedData = getCachedData(cacheKey);
  if (cachedData) return cachedData;

  try {
    const response = await fetch(`${API_URL}/customers`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${BEARER_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    setCachedData(cacheKey, data.data);
    return data.data;
  } catch (error) {
    console.error('Error fetching customers:', error);
    return [];
  }
};

// Fetch customers with caching and filtering
export const fetchShopifyCustomers = async (filterType) => {
  // Create a cache key based on the filter type
  const cacheKey = `shopify_customers_${filterType}`;

  // Try to get data from cache first
  const cachedData = getCachedData(cacheKey);
  if (cachedData) {
    console.log('Using cached data for', filterType);
    return cachedData;
  }

  // If not in cache, fetch from API
  console.log('Fetching fresh data for', filterType);

  // Determine the endpoint based on the filter type
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

    // Cache the data before returning
    setCachedData(cacheKey, response.data.data);

    return response.data.data;
  } catch (error) {
    console.error("Error fetching data: ", error);
    throw error;
  }
};

// ...existing code...

export const fetchRequestOrders = async (queryParams = '') => {
  try {
    let allData = [];
    let currentPage = 1;
    let hasMorePages = true;

    while (hasMorePages) {
      // Add cache-busting parameter if not already present
      const separator = queryParams.includes('?') ? '&' : '?';
      const cacheBuster = queryParams.includes('_t=') ? '' : `${separator}_t=${Date.now()}`;
      
      // Add pagination parameters
      const paginationParams = queryParams.includes('page=') ? '' : `&page=${currentPage}&per_page=100`;
      
      const response = await fetch(`${API_URL}/Requestorders${queryParams}${cacheBuster}${paginationParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      // Handle different response structures
      if (result.data && Array.isArray(result.data)) {
        allData = [...allData, ...result.data];
        
        // Check pagination info
        if (result.pagination) {
          const { current_page, last_page } = result.pagination;
          console.log(`Fetched page ${current_page} of ${last_page}. Total records so far: ${allData.length}`);
          
          if (current_page >= last_page) {
            hasMorePages = false;
          } else {
            currentPage++;
          }
        } else {
          hasMorePages = false;
        }
      } else if (Array.isArray(result)) {
        allData = result;
        hasMorePages = false;
      } else {
        throw new Error('Unexpected response format');
      }
    }

    console.log(`Total records fetched: ${allData.length}`);
    return allData;
  } catch (error) {
    console.error('Error fetching request orders:', error);
    throw error;
  }
};




// Post request form orders

export const postRequestOrders = async (orderData) => {
  try {
    // Log the data being sent to debug
    console.log('Sending order data to API:', orderData);
    
    const response = await fetch(`${API_URL}/Requestorders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add any authentication headers if required
        // 'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(orderData)
    });

    // Log the response status and body for debugging
    console.log('API Response Status:', response.status);
    
    if (!response.ok) {
      // Get the response body to see the exact error
      const errorBody = await response.text();
      console.error('API Error Response:', errorBody);
      
      try {
        const errorJson = JSON.parse(errorBody);
        console.error('Parsed Error:', errorJson);
        throw new Error(`API Error ${response.status}: ${errorJson.message || errorJson.error || 'Unknown error'}`);
      } catch (parseError) {
        throw new Error(`API Error ${response.status}: ${errorBody || 'Unknown error'}`);
      }
    }

    const result = await response.json();
    console.log('API Response Data:', result);
    return result;
  } catch (error) {
    console.error('Error posting request orders:', error);
    throw error;
  }
};



// Fetch initial data for all segments
export const prefetchAllSegments = async () => {
  const segments = [
    "purchased_once",
    "purchased_more_than_once",
    "not_purchased",
    "email_subscribers",
    "not_subscribed",
    "orders_count"
  ];

  const prefetchPromises = segments.map(segment => {
    return fetchShopifyCustomers(segment)
      .catch(error => {
        console.error(`Error prefetching ${segment}:`, error);
        return null;
      });
  });

  try {
    await Promise.all(prefetchPromises);
    console.log('All segments prefetched');
    return true;
  } catch (error) {
    console.error('Error during prefetch:', error);
    return false;
  }
};

// Clear all cached data
export const clearCache = () => {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('shopify_')) {
        localStorage.removeItem(key);
      }
    });
    console.log('Cache cleared');
    return true;
  } catch (error) {
    console.error('Error clearing cache:', error);
    return false;
  }
};

// Fetch all orders with caching
export const fetchOrders = async () => {
  const cacheKey = 'shopify_orders';
  const cachedData = getCachedData(cacheKey);
  if (cachedData) return cachedData;

  try {
    const response = await fetch(`${API_URL}/orders`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${BEARER_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    setCachedData(cacheKey, data.data);
    return data.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
};

// Fetch single order with caching
export const fetchSingleOrders = async (orderId) => {
  const cacheKey = `shopify_order_${orderId}`;
  const cachedData = getCachedData(cacheKey);
  if (cachedData) return cachedData;

  try {
    const response = await fetch(`${API_URL}/orders/${orderId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${BEARER_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    setCachedData(cacheKey, data.data);
    return data.data;
  } catch (error) {
    console.error('Error fetching single orders:', error);
    return [];
  }
};

// Fetch sales data with caching
export const fetchSalesData = async () => {
  const cacheKey = 'shopify_sales_data';
  const cachedData = getCachedData(cacheKey);
  if (cachedData) return cachedData;

  const orders = await fetchOrders();
  const totalSales = orders.reduce((total, order) => total + parseFloat(order.total_price), 0);

  setCachedData(cacheKey, totalSales);
  return totalSales;
};