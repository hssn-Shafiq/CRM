import axios from 'axios';

const token = '1|nq8njnFmxYLoda5ImMgwwdxXGb7ONugJLpCCYsYff4264dcc';

const api = axios.create({
    baseURL: 'https://crmapi.alayaarts.com/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
    }
});

export default api; 