"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.receiveMessages = void 0;
const rabbitmq_1 = require("./rabbitmq");
const receiveMessages = async () => {
    const { channel } = await (0, rabbitmq_1.connectRabbitMQ)();
    // Declare multiple queues
    const queues = ["user_details_queue"];
    for (const queue of queues) {
        await channel.assertQueue(queue, { durable: true });
        console.log("🚀 Waiting for messages...");
        channel.consume(queue, async (msg) => {
            if (msg) {
                const receivedData = JSON.parse(msg.content.toString());
                console.log(`📩 Received: ${JSON.stringify(receivedData)}`);
                processMessage(queue, receivedData);
                // Acknowledge the message (removes from queue)
                channel.ack(msg);
            }
        }, { noAck: false });
    }
};
exports.receiveMessages = receiveMessages;
const processMessage = async (queue, message) => {
    // Implement your message processing logic here
    // if (queue === "delete_class_user_queue") {
    //     await adminModel.updateMany({ classId: message }, { $unset: { classId: "" } });
    // }
};
