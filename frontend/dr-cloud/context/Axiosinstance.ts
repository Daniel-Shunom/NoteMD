"use client"
// dr-cloud/utils/axiosInstance.ts

import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL, // Ensure this is set correctly in your environment variables
  withCredentials: true, // This allows Axios to send and receive cookies
});

// Optional: Add interceptors for request/response if needed
axiosInstance.interceptors.request.use(
  (config) => {
    // You can modify the request config here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle errors globally if desired
    return Promise.reject(error);
  }
);

export default axiosInstance;
