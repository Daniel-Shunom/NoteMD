// utils/api.ts

import dotenv from 'dotenv'
import axios from 'axios';

dotenv.config()

/**
 * Create an Axios instance with predefined configurations.
 * This instance will be used for all API calls throughout the application.
 */
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api', // Default to localhost for development
  withCredentials: true, // Include cookies in requests
});

// Optional: Add request interceptors (e.g., for logging)
api.interceptors.request.use(
  (config) => {
    // You can log requests here or add authorization headers if needed
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Optional: Add response interceptors (e.g., for error handling)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // You can handle global errors here
    if (error.response) {
      console.error(`[API Error] ${error.response.status}: ${error.response.data.message}`);
    } else {
      console.error(`[API Error] ${error.message}`);
    }
    return Promise.reject(error);
  }
);

export default api;
