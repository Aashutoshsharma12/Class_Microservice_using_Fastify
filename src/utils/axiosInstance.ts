import axios from "axios";

// Create Axios instance with default configurations
const axiosInstance = axios.create({
    baseURL: process.env.Api_Gateway_BaseUrl, // Change this to your API base URL
    timeout: 5000, // Request timeout (optional)
    headers: {
        "Content-Type": "application/json",
    },
});

// Response Interceptor - Handle global errors
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error("API Error:", error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export default axiosInstance;
