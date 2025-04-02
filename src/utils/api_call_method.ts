import CircuitBreaker from "opossum";
import axios from "axios";
import axiosInstance from "./axiosInstance";
const options = {
    timeout: 3000, // Fail if no response in 5 seconds
    errorThresholdPercentage: 50, // If 50% requests fail, stop calling the service
    resetTimeout: 10000, // Try again after 10 seconds
};

export const api_call_post_method = async (serviceName: any, body: any, token: string) => {
    try {
        console.log(token, "token-------------------------------from auth service")
        const circuitBreaker = new CircuitBreaker(async () => {
            const response = await axiosInstance.post("/subject/api/v1/admin/auth/detailswith_multipleclassIds",
                body, {
                headers: {
                    Authorization: token,
                }
            }
            );
            return response.data.data;
        }, options);

        // Fallback for Circuit Breaker (Triggers when service is down)
        circuitBreaker.fallback(() => {
            return { message: `⚠️ ${serviceName} Service is unavailable. Please try later.` };
        });

        return await circuitBreaker.fire();
    } catch (error: any) {
        console.error("❌ Error fetching subject details:", error.message);
        return error;
    }
};

export const api_call_get_method = async (serviceName: any, body: any, token: string) => {
    try {
        const circuitBreaker = new CircuitBreaker(async () => {
            const response = await axiosInstance.get("/subject/api/v1/admin/auth/detailswith_multipleclassIds",
                {
                    headers: {
                        Authorization: token,
                    }
                }
            );
            return response.data.data;
        }, options);

        // Fallback for Circuit Breaker (Triggers when service is down)
        circuitBreaker.fallback(() => {
            return { message: `⚠️ ${serviceName} Service is unavailable. Please try later.` };
        });

        return await circuitBreaker.fire();
    } catch (error: any) {
        console.error("❌ Error fetching subject details:", error.message);
        return error;
    }
};