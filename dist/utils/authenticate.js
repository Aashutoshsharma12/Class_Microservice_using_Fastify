"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRoles = authorizeRoles;
exports.generateToken = generateToken;
function authorizeRoles(allowedRoles) {
    return async (req, reply) => {
        try {
            const user = req.user; // Extract user role from JWT
            if (!user || !allowedRoles.includes(user.role)) {
                return reply.code(403).send({
                    code: "Forbidden", message: "Forbidden - Access Denied", "success": false, "error": "Forbidden - Access Denied",
                    "statusCode": 403
                });
            }
        }
        catch (err) {
            console.log(err);
        }
    };
}
async function generateToken(fastify, userId, role) {
    try {
        if (!fastify.jwt) {
            throw new Error("fastify.jwt is not available. Ensure fastify-jwt is registered.");
        }
        return fastify.jwt.sign({ id: userId, role }, { expiresIn: "10m" });
    }
    catch (err) {
        throw new Error(err);
    }
}
