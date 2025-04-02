"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessage_to_using_delayed_queue = exports.sendMessage_to_using_expire_queue = exports.sendMessage_to_using_Lazy_queue = exports.sendMessage_to_priorityBases = exports.sendMessage_usingHeaders = exports.sendMessage_usingFanout = exports.sendMessage_usingTopic = exports.sendMessage = void 0;
const rabbitmq_1 = require("./rabbitmq");
/****
 * Simple send message using queues (Direct Queue)
 */
// export const sendMessage = async (queue: any, body: any) => {
//     const { channel } = await connectRabbitMQ();
//     const correlationId = Math.random().toString();
//     await channel.assertQueue(queue, { durable: true }); // Ensures the queue survives a RabbitMQ server restart.	
//     channel.sendToQueue(queue, Buffer.from(JSON.stringify(body)), {
//         correlationId,
//         replyTo: queue,
//         persistent: true  //Ensures messages are not lost if RabbitMQ crashes before being processed.
//     });
//     console.log(`✅ Sent message: ${JSON.stringify(body)}`);
// };
/****
 * Use exchange type "Direct"
 */
const sendMessage = async (queue, body, routingKey) => {
    const { channel } = await (0, rabbitmq_1.connectRabbitMQ)();
    const exchangeType = "direct";
    const exchange = "class_delete_notification";
    await channel.assertExchange(exchange, exchangeType, { durable: true }); //Ensures the queue survives a RabbitMQ server restart.	
    await channel.assertQueue(queue, { durable: true });
    await channel.bindQueue(queue, exchange, routingKey);
    channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(body)));
    console.log(`✅ Sent message: ${JSON.stringify(body)}`);
};
exports.sendMessage = sendMessage;
/****
 * Use exchange type "Topic"
 */
const sendMessage_usingTopic = async (body, routingKey) => {
    const { channel } = await (0, rabbitmq_1.connectRabbitMQ)();
    const exchangeType = "topic";
    const exchange = "class_delete_notification_usingTopic1";
    await channel.assertExchange(exchange, exchangeType, { durable: true });
    channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(body)));
    console.log(`✅ Sent message: ${JSON.stringify(body)}`);
};
exports.sendMessage_usingTopic = sendMessage_usingTopic;
/****
 * Use exchange type "Fanout"
 */
const sendMessage_usingFanout = async (body) => {
    const { channel } = await (0, rabbitmq_1.connectRabbitMQ)();
    const exchangeType = "fanout";
    const exchange = "class_delete_notification_usingFanout";
    await channel.assertExchange(exchange, exchangeType, { durable: true });
    channel.publish(exchange, '', Buffer.from(JSON.stringify(body)), { persistent: true });
    console.log(`✅ Sent message: ${JSON.stringify(body)}`);
};
exports.sendMessage_usingFanout = sendMessage_usingFanout;
/****
 * Use exchange type "Headers"
 */
const sendMessage_usingHeaders = async (body, headers) => {
    const { channel } = await (0, rabbitmq_1.connectRabbitMQ)();
    const exchangeType = "headers";
    const exchange = "class_delete_notification_using_header_exchange";
    await channel.assertExchange(exchange, exchangeType, { durable: true });
    channel.publish(exchange, '', Buffer.from(JSON.stringify(body)), { persistent: true, headers });
    console.log(`✅ Sent message: ${JSON.stringify(body)}`);
};
exports.sendMessage_usingHeaders = sendMessage_usingHeaders;
/****
 * Priority
 */
const sendMessage_to_priorityBases = async (queue, body, routingKey) => {
    const { channel } = await (0, rabbitmq_1.connectRabbitMQ)();
    const exchangeType = "direct";
    const exchange = "class_delete_notification";
    await channel.assertExchange(exchange, exchangeType, { durable: true }); //Ensures the queue survives a RabbitMQ server restart.	
    await channel.assertQueue(queue, {
        durable: true,
        arguments: {
            "x-max-priority": 10
        }
    });
    await channel.bindQueue(queue, exchange, routingKey);
    for (let i = 0; i < 10; i++) {
        console.log('enter---------------');
        body.priority = i + 1;
        channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(body)), {
            priority: body.priority
        });
        console.log(`✅ Sent message: ${JSON.stringify(body)}`);
    }
};
exports.sendMessage_to_priorityBases = sendMessage_to_priorityBases;
/****
 * Lazy Queue
 */
const sendMessage_to_using_Lazy_queue = async (queue, body, routingKey) => {
    const { channel } = await (0, rabbitmq_1.connectRabbitMQ)();
    const exchangeType = "direct";
    const exchange = "class_delete_notification12112";
    await channel.assertExchange(exchange, exchangeType, { durable: true }); //Ensures the queue survives a RabbitMQ server restart.	
    await channel.assertQueue(queue, {
        durable: true,
        arguments: {
            'x-queue-mode': 'lazy',
        } // Enabling lazy queue
    });
    await channel.bindQueue(queue, exchange, routingKey);
    for (let i = 0; i < 100; i++) {
        console.log('enter---------------');
        body.priority = i + 1;
        channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(body)), {
            priority: body.priority
        });
        console.log(`✅ Sent message: ${JSON.stringify(body)}`);
    }
};
exports.sendMessage_to_using_Lazy_queue = sendMessage_to_using_Lazy_queue;
/****
 * Expire Queue
 */
const sendMessage_to_using_expire_queue = async (queue, body, routingKey) => {
    const { channel } = await (0, rabbitmq_1.connectRabbitMQ)();
    const exchangeType = "direct";
    const exchange = "class_delete_notification12112";
    await channel.assertExchange(exchange, exchangeType, { durable: true }); //Ensures the queue survives a RabbitMQ server restart.	
    await channel.assertQueue(queue, {
        durable: true,
        arguments: {
            "x-message-ttl": 5000
        } // Enabling lazy queue
    });
    await channel.bindQueue(queue, exchange, routingKey);
    for (let i = 0; i < 100; i++) {
        console.log('enter---------------');
        body.priority = i + 1;
        channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(body)), {
            priority: body.priority
        });
        console.log(`✅ Sent message: ${JSON.stringify(body)}`);
    }
};
exports.sendMessage_to_using_expire_queue = sendMessage_to_using_expire_queue;
/****
 * Delayed Queue
 */
const sendMessage_to_using_delayed_queue = async (queue, body, routingKey) => {
    const { channel } = await (0, rabbitmq_1.connectRabbitMQ)();
    const delayQueue = "delayed_queue12_1";
    const processingQueue = "processing_queue";
    const exchange = "delayed_exchange";
    await channel.assertExchange(exchange, "direct", {
        durable: true
    }); //Ensures the queue survives a RabbitMQ server restart.	
    // Declare the processing queue (the final destination)
    await channel.assertQueue(processingQueue, {
        durable: true
    });
    // Declare the delay queue with TTL and Dead Letter Exchange (DLX)
    await channel.assertQueue(delayQueue, {
        durable: true,
        arguments: {
            "x-dead-letter-exchange": exchange, // Send expired messages to DLX
            "x-dead-letter-routing-key": "process", // Routing key to processing queue
            "x-message-ttl": 5000, // Delay time in milliseconds
        }
    });
    await channel.bindQueue(processingQueue, exchange, "process");
    for (let i = 0; i < 100; i++) {
        console.log('enter---------------');
        body.priority = i + 1;
        channel.sendToQueue(delayQueue, Buffer.from(JSON.stringify(body)));
        console.log(`✅ Sent message: ${JSON.stringify(body)}`);
    }
};
exports.sendMessage_to_using_delayed_queue = sendMessage_to_using_delayed_queue;
