import axios from 'axios';

// Create a configured axios instance
// const API = axios.create({
//   baseURL: 'http://localhost:3000/api', //TODO process.env.base ? or just ./api
//   headers: {
//     'Content-Type': 'application/json'
//   }
// });


const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://survey-system-api-l693.onrender.com/api',
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

// Add auth token automatically to every request
API.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;