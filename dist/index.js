"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./server"));
const database_1 = __importDefault(require("./utils/database"));
// // Create a raw HTTP server for Fastify (since Fastify v5 doesn't support socket.io directly)
const PORT = process.env.PORT || 4002; // Use Render-assigned port or fallback
server_1.default.listen({ port: PORT, host: '0.0.0.0' }, (err, address) => {
    if (err) {
        server_1.default.log.error(err);
        process.exit(1);
    }
    console.log(`🚀 Class Server running at http://localhost:${PORT}`);
    (0, database_1.default)();
});
