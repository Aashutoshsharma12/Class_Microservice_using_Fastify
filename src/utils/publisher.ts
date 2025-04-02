import { connectRabbitMQ } from "./rabbitmq";

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
export const sendMessage = async (queue: any, body: any, routingKey: any) => {
    const { channel } = await connectRabbitMQ();
    const exchangeType = "direct"
    const exchange = "class_delete_notification";
    await channel.assertExchange(exchange, exchangeType, { durable: true }); //Ensures the queue survives a RabbitMQ server restart.	
    await channel.assertQueue(queue, { durable: true });
    await channel.bindQueue(queue, exchange, routingKey);
    channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(body)));
    console.log(`✅ Sent message: ${JSON.stringify(body)}`);
};

/****
 * Use exchange type "Topic"
 */
export const sendMessage_usingTopic = async (body: any, routingKey: any) => {
    const { channel } = await connectRabbitMQ();
    const exchangeType = "topic"
    const exchange = "class_delete_notification_usingTopic1";
    await channel.assertExchange(exchange, exchangeType, { durable: true });
    channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(body)));
    console.log(`✅ Sent message: ${JSON.stringify(body)}`);
};

/****
 * Use exchange type "Fanout"
 */
export const sendMessage_usingFanout = async (body: any) => {
    const { channel } = await connectRabbitMQ();
    const exchangeType = "fanout"
    const exchange = "class_delete_notification_usingFanout";
    await channel.assertExchange(exchange, exchangeType, { durable: true });
    channel.publish(exchange, '', Buffer.from(JSON.stringify(body)), { persistent: true });
    console.log(`✅ Sent message: ${JSON.stringify(body)}`);
};

/****
 * Use exchange type "Headers"
 */
export const sendMessage_usingHeaders = async (body: any, headers: any) => {
    const { channel } = await connectRabbitMQ();
    const exchangeType = "headers"
    const exchange = "class_delete_notification_using_header_exchange";
    await channel.assertExchange(exchange, exchangeType, { durable: true });
    channel.publish(exchange, '', Buffer.from(JSON.stringify(body)), { persistent: true, headers });
    console.log(`✅ Sent message: ${JSON.stringify(body)}`);
};

/****
 * Priority
 */
export const sendMessage_to_priorityBases = async (queue: any, body: any, routingKey: any) => {
    const { channel } = await connectRabbitMQ();
    const exchangeType = "direct"
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
        console.log('enter---------------')
        body.priority = i + 1
        channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(body)), {
            priority: body.priority
        });
        console.log(`✅ Sent message: ${JSON.stringify(body)}`);
    }
};

/****
 * Lazy Queue
 */
export const sendMessage_to_using_Lazy_queue = async (queue: any, body: any, routingKey: any) => {
    const { channel } = await connectRabbitMQ();
    const exchangeType = "direct"
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
        console.log('enter---------------')
        body.priority = i + 1
        channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(body)), {
            priority: body.priority
        });
        console.log(`✅ Sent message: ${JSON.stringify(body)}`);
    }
};

/****
 * Expire Queue
 */
export const sendMessage_to_using_expire_queue = async (queue: any, body: any, routingKey: any) => {
    const { channel } = await connectRabbitMQ();
    const exchangeType = "direct"
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
        console.log('enter---------------')
        body.priority = i + 1
        channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(body)), {
            priority: body.priority
        });
        console.log(`✅ Sent message: ${JSON.stringify(body)}`);
    }
};

/****
 * Delayed Queue
 */
export const sendMessage_to_using_delayed_queue = async (queue: any, body: any, routingKey: any) => {
    const { channel } = await connectRabbitMQ();
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
        console.log('enter---------------')
        body.priority = i + 1
        channel.sendToQueue(delayQueue, Buffer.from(JSON.stringify(body)));

        console.log(`✅ Sent message: ${JSON.stringify(body)}`);
    }
};
