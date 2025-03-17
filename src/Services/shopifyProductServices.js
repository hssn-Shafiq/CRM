const API_URL = "https://crmapi.alayaarts.com/api"; // Getting the API base URL from the .env file
const ACCESS_TOKEN = process.env.REACT_APP_SHOPIFY_ACCESS_TOKEN; // Shopify Access Token from .env
const BEARER_TOKEN = process.env.REACT_APP_BEARER_TOKEN; // Bearer Token from .env

export const fetchProductDetails = async (productId) => {

  try {
    const response = await fetch(`${API_URL}/products/${productId}/images`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${BEARER_TOKEN}`,
        'X-Shopify-Access-Token': ACCESS_TOKEN,
        'Content-Type': 'application/json'
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching product details: ${response.status}`);
    }

    const productData = await response.json();
    const images = productData.data;

    // Now you have the product images array
    console.log(images);
    return images;
  } catch (error) {
    console.error('Error fetching product details:', error);
    return [];
  }
};
