"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
// Create Axios instance with default configurations
const axiosInstance = axios_1.default.create({
    baseURL: process.env.Api_Gateway_BaseUrl, // Change this to your API base URL
    timeout: 5000, // Request timeout (optional)
    headers: {
        "Content-Type": "application/json",
    },
});
// Response Interceptor - Handle global errors
axiosInstance.interceptors.response.use((response) => response, (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
});
exports.default = axiosInstance;
