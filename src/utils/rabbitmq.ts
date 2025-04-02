import client, { Connection, Channel ,ChannelModel} from "amqplib";
import { receiveMessages } from "./consumer";
const CLOUDAMQP_URL = process.env.CLOUDAMQP_URL!;

let connection: ChannelModel | null = null;
let channel: Channel | null = null;

/**
 * Establish connection with RabbitMQ
 */
export const connectRabbitMQ = async () => {
    if (!CLOUDAMQP_URL) {
        throw new Error("❌ CLOUDAMQP_URL is missing in .env");
    }
    if (connection && channel) {
        return { connection, channel };
    }
    try {
        connection = await client.connect(CLOUDAMQP_URL);
        channel = await connection.createChannel();
        console.log("✅ Connected to CloudAMQP");

        // Handle connection close
        connection.on("close", async () => {
            console.log("⚠️ RabbitMQ connection closed. Reconnecting...");
            connection = null;
            channel = null;
            await connectRabbitMQ();
        });

        connection.on("error", (err) => {
            console.error("❌ RabbitMQ connection error:", err);
        });

        return { connection, channel };
    } catch (error) {
        console.error("❌ RabbitMQ Connection Error:", error);
        process.exit(1);
    }
};