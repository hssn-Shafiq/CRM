import axios from "axios";

const CRM_API_URL = "https://crm.digibuzzify.com/api";
// const CRM_API_URL = process.env.REACT_APP_CRM_API_URL;

const BEARER_TOKEN = process.env.REACT_APP_BEARER_TOKEN;

// API configuration
const api = axios.create({
  baseURL: CRM_API_URL,
  headers: {
    'Authorization': `Bearer ${BEARER_TOKEN}`,
    "Content-Type": "application/json",
  },
});

export default api;