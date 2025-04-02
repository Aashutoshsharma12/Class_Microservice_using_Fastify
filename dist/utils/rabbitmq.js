"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectRabbitMQ = void 0;
const amqplib_1 = __importDefault(require("amqplib"));
const CLOUDAMQP_URL = process.env.CLOUDAMQP_URL;
let connection = null;
let channel = null;
/**
 * Establish connection with RabbitMQ
 */
const connectRabbitMQ = async () => {
    if (!CLOUDAMQP_URL) {
        throw new Error("❌ CLOUDAMQP_URL is missing in .env");
    }
    if (connection && channel) {
        return { connection, channel };
    }
    try {
        connection = await amqplib_1.default.connect(CLOUDAMQP_URL);
        channel = await connection.createChannel();
        console.log("✅ Connected to CloudAMQP");
        // Handle connection close
        connection.on("close", async () => {
            console.log("⚠️ RabbitMQ connection closed. Reconnecting...");
            connection = null;
            channel = null;
            await (0, exports.connectRabbitMQ)();
        });
        connection.on("error", (err) => {
            console.error("❌ RabbitMQ connection error:", err);
        });
        return { connection, channel };
    }
    catch (error) {
        console.error("❌ RabbitMQ Connection Error:", error);
        process.exit(1);
    }
};
exports.connectRabbitMQ = connectRabbitMQ;
