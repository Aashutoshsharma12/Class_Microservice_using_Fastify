import adminModel from "@models/class";
import { connectRabbitMQ } from "./rabbitmq";
import { sendMessage } from "./publisher";

export const receiveMessages = async () => {
    const {channel} = await connectRabbitMQ();
    // Declare multiple queues
    const queues = ["user_details_queue"];
    for (const queue of queues) {
        await channel.assertQueue(queue, { durable: true });
        console.log("🚀 Waiting for messages...");
        channel.consume(queue, async (msg: any) => {
            if (msg) {
                const receivedData = JSON.parse(msg.content.toString());
                console.log(`📩 Received: ${JSON.stringify(receivedData)}`);
                processMessage(queue, receivedData);
                // Acknowledge the message (removes from queue)
                channel.ack(msg);
            }
        },{ noAck: false });
    }
}
const processMessage = async(queue: string, message: string) => {
    // Implement your message processing logic here
    // if (queue === "delete_class_user_queue") {
    //     await adminModel.updateMany({ classId: message }, { $unset: { classId: "" } });
    // }
};