import fastify from './server';
import connectDb from './utils/database';

// // Create a raw HTTP server for Fastify (since Fastify v5 doesn't support socket.io directly)
const PORT: any = process.env.PORT || 4002; // Use Render-assigned port or fallback

fastify.listen({ port: PORT, host: '0.0.0.0' }, (err: any, address: any) => {
    if (err) {
        fastify.log.error(err);
        process.exit(1);
    }
    console.log(`🚀 Class Server running at http://localhost:${PORT}`);
    connectDb();
})

