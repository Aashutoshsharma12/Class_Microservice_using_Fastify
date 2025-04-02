import 'tsconfig-paths/register';  //Use this for sortcut path inside tsconfig.json
import "./pre-start"; // Must be the first import
import Fastify, { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import path, { join } from "path";
import routes1 from './routes/index'
import cors from "@fastify/cors";
import fastifyJwt from "@fastify/jwt";
const fastifyCookie = require("@fastify/cookie");
import ajvErrors from "ajv-errors";
import { connectRabbitMQ } from '@utils/rabbitmq';
import { receiveMessages } from '@utils/consumer';
import { StatusCodes } from 'http-status-codes';
// Connect RabbitMQ when server starts
(async () => {
    try {
        // Establish connection to RabbitMQ
        await connectRabbitMQ();
        // Start consumers
        await receiveMessages();
        console.log("✅ Consumers are ready to process messages.");
    } catch (error) {
        console.error("❌ Error starting consumers:", error);
        process.exit(1);
    }
})();
const fastify = Fastify({
    logger: false, // Enables logging
    ajv: {
        customOptions: { allErrors: true },
        plugins: [ajvErrors], // Use ajv-errors plugin for custom messages
    }
})
fastify.register(fastifyCookie);

const JWT_SECRET_TOKEN: any = process.env.JWT_SECRET_TOKEN
// Register JWT plugin
fastify.register(fastifyJwt, {
    secret: JWT_SECRET_TOKEN.toString(), // Change this to a strong secret key
});

// Attach `req.user` directly inside the microservice
fastify.addHook("preHandler", async (req: any, reply) => {
    const publicRoutes = [
        // '/api/v1/admin/auth/signUp',
        // '/api/v1/admin/auth/login',
        '/about',
        '/home',
        '/health'
    ];
    const userId = req.headers['x-user-id']
    const role = req.headers['x-user-role']
    if (!publicRoutes.includes(req.url)) {
        // If req.user doesn't exist, return unauthorized
        if (!userId) {
            return reply.status(401).send({
                success: false,
                message: "Unauthorized Access",
                statusCode: 401
            });
        };
        req.userId = userId
        req.role = role
        delete req.headers['x-user-id']
        delete req.headers['x-user-role']
    }
});

// Global error handler
fastify.setErrorHandler((error: FastifyError, request: any, reply: any) => {
    // Log the error
    request.log.error(error);
    // Custom error response
    reply.status(error.statusCode || 500).send({
        success: false,
        message: error.message,
        error: error.message,
        code: error.code,
        statusCode: error.statusCode
    });
});

fastify.register(require("@fastify/cors"), {
    origin: "http://localhost:3000", // Change this to your frontend URL
    credentials: true // ✅ Allow cookies in cross-origin requests
});

fastify.get('/health', (req: any, reply: any) => {
    reply.status(StatusCodes.OK).send({ code: StatusCodes.OK });
});

fastify.register(routes1, { prefix: "/api/v1" });

// Serve static files from the 'public' folder
fastify.register(require("@fastify/static"), {
    root: path.join(__dirname, "public"),
    prefix: "/",
});
fastify.get('/about', (req, reply: any) => {
    reply.sendFile('views/about.html');
});
fastify.get('/home', (req, reply: any) => {
    reply.sendFile('views/home.html');
});

// import fastifyIO from 'fastify-socket.io';
// Register Socket.IO plugin
// fastify.register(fastifyIO, {
//     cors: {
//         origin: "*", // Allow all origins (you can restrict it)
//     },
// });

// // Route to serve different HTML files dynamically
// fastify.get("/:page", async (req: any, reply: any) => {
//     const page = req.params.page;
//     // Ensure only allowed HTML files are served
//     const allowedPages = ["index", "index1"];
//     if (allowedPages.includes(page)) {
//         return reply.sendFile(`${page}.html`);
//     }
//     return reply.status(404).send("Page Not Found");
// });

export = fastify;
