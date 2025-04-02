"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
require("tsconfig-paths/register"); //Use this for sortcut path inside tsconfig.json
require("./pre-start"); // Must be the first import
const fastify_1 = __importDefault(require("fastify"));
const path_1 = __importDefault(require("path"));
const index_1 = __importDefault(require("./routes/index"));
const jwt_1 = __importDefault(require("@fastify/jwt"));
const fastifyCookie = require("@fastify/cookie");
const ajv_errors_1 = __importDefault(require("ajv-errors"));
const rabbitmq_1 = require("./utils/rabbitmq");
const consumer_1 = require("./utils/consumer");
const http_status_codes_1 = require("http-status-codes");
// Connect RabbitMQ when server starts
(async () => {
    try {
        // Establish connection to RabbitMQ
        await (0, rabbitmq_1.connectRabbitMQ)();
        // Start consumers
        await (0, consumer_1.receiveMessages)();
        console.log("✅ Consumers are ready to process messages.");
    }
    catch (error) {
        console.error("❌ Error starting consumers:", error);
        process.exit(1);
    }
})();
const fastify = (0, fastify_1.default)({
    logger: false, // Enables logging
    ajv: {
        customOptions: { allErrors: true },
        plugins: [ajv_errors_1.default], // Use ajv-errors plugin for custom messages
    }
});
fastify.register(fastifyCookie);
const JWT_SECRET_TOKEN = process.env.JWT_SECRET_TOKEN;
// Register JWT plugin
fastify.register(jwt_1.default, {
    secret: JWT_SECRET_TOKEN.toString(), // Change this to a strong secret key
});
// Attach `req.user` directly inside the microservice
fastify.addHook("preHandler", async (req, reply) => {
    const publicRoutes = [
        // '/api/v1/admin/auth/signUp',
        // '/api/v1/admin/auth/login',
        '/about',
        '/home',
        '/health'
    ];
    const userId = req.headers['x-user-id'];
    const role = req.headers['x-user-role'];
    if (!publicRoutes.includes(req.url)) {
        // If req.user doesn't exist, return unauthorized
        if (!userId) {
            return reply.status(401).send({
                success: false,
                message: "Unauthorized Access",
                statusCode: 401
            });
        }
        ;
        req.userId = userId;
        req.role = role;
        delete req.headers['x-user-id'];
        delete req.headers['x-user-role'];
    }
});
// Global error handler
fastify.setErrorHandler((error, request, reply) => {
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
fastify.get('/health', (req, reply) => {
    reply.status(http_status_codes_1.StatusCodes.OK).send({ code: http_status_codes_1.StatusCodes.OK });
});
fastify.register(index_1.default, { prefix: "/api/v1" });
// Serve static files from the 'public' folder
fastify.register(require("@fastify/static"), {
    root: path_1.default.join(__dirname, "public"),
    prefix: "/",
});
fastify.get('/about', (req, reply) => {
    reply.sendFile('views/about.html');
});
fastify.get('/home', (req, reply) => {
    reply.sendFile('views/home.html');
});
module.exports = fastify;
