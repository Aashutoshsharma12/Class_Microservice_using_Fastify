"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.api_call_get_method = exports.api_call_post_method = void 0;
const opossum_1 = __importDefault(require("opossum"));
const axiosInstance_1 = __importDefault(require("./axiosInstance"));
const options = {
    timeout: 3000, // Fail if no response in 5 seconds
    errorThresholdPercentage: 50, // If 50% requests fail, stop calling the service
    resetTimeout: 10000, // Try again after 10 seconds
};
const api_call_post_method = async (serviceName, body, token) => {
    try {
        console.log(token, "token-------------------------------from auth service");
        const circuitBreaker = new opossum_1.default(async () => {
            const response = await axiosInstance_1.default.post("/subject/api/v1/admin/auth/detailswith_multipleclassIds", body, {
                headers: {
                    Authorization: token,
                }
            });
            return response.data.data;
        }, options);
        // Fallback for Circuit Breaker (Triggers when service is down)
        circuitBreaker.fallback(() => {
            return { message: `⚠️ ${serviceName} Service is unavailable. Please try later.` };
        });
        return await circuitBreaker.fire();
    }
    catch (error) {
        console.error("❌ Error fetching subject details:", error.message);
        return error;
    }
};
exports.api_call_post_method = api_call_post_method;
const api_call_get_method = async (serviceName, body, token) => {
    try {
        const circuitBreaker = new opossum_1.default(async () => {
            const response = await axiosInstance_1.default.get("/subject/api/v1/admin/auth/detailswith_multipleclassIds", {
                headers: {
                    Authorization: token,
                }
            });
            return response.data.data;
        }, options);
        // Fallback for Circuit Breaker (Triggers when service is down)
        circuitBreaker.fallback(() => {
            return { message: `⚠️ ${serviceName} Service is unavailable. Please try later.` };
        });
        return await circuitBreaker.fire();
    }
    catch (error) {
        console.error("❌ Error fetching subject details:", error.message);
        return error;
    }
};
exports.api_call_get_method = api_call_get_method;
