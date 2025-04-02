"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = authRoute;
const http_status_codes_1 = require("http-status-codes");
const class_1 = __importDefault(require("../../controllers/admin/class"));
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
async function authRoute(fastify) {
    fastify.post('/add', async (req, reply) => {
        const data = await class_1.default.add(req.body, fastify);
        reply.status(http_status_codes_1.StatusCodes.CREATED).send({ data: data, code: http_status_codes_1.StatusCodes.CREATED });
    });
    fastify.get('/details', async (req, reply) => {
        try {
            const data = await class_1.default.details(req.query, req.headers);
            reply.status(http_status_codes_1.StatusCodes.OK).send({ data: data, code: http_status_codes_1.StatusCodes.OK });
        }
        catch (err) {
            reply.code(http_status_codes_1.StatusCodes.BAD_REQUEST).send({ error: err, code: http_status_codes_1.StatusCodes.BAD_REQUEST });
        }
    });
    fastify.get('/list', async (req, reply) => {
        const data = await class_1.default.list(req.user, req.headers);
        // await delay(7000); // Wait 7 seconds before sending the response
        reply.status(http_status_codes_1.StatusCodes.OK).send({ data: data, code: http_status_codes_1.StatusCodes.OK });
    });
    fastify.delete('/delete/:id', async (req, reply) => {
        const data = await class_1.default.delete_class(req.params.id);
        // await delay(7000); // Wait 7 seconds before sending the response
        reply.status(http_status_codes_1.StatusCodes.OK).send({ data: data, code: http_status_codes_1.StatusCodes.OK });
    });
}
