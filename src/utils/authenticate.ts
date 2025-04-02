export function authorizeRoles(allowedRoles: string[]) {
    return async (req: any, reply: any) => {
        try {
            const user = req.user as { role: string }; // Extract user role from JWT
            if (!user || !allowedRoles.includes(user.role)) {
                return reply.code(403).send({
                    code: "Forbidden", message: "Forbidden - Access Denied", "success": false, "error": "Forbidden - Access Denied",
                    "statusCode": 403
                });
            }
        } catch (err) {
            console.log(err);
        }
    };
}

export async function generateToken(fastify: any, userId: string, role: string) {
    try {
        if (!fastify.jwt) {
            throw new Error("fastify.jwt is not available. Ensure fastify-jwt is registered.");
        }
        return fastify.jwt.sign({ id: userId, role }, { expiresIn: "10m" });
    } catch (err) {
        throw new Error(err);
    }

}
