import adminRoute from './admin'

export default async function routes1(fastify: any) {
    fastify.register(adminRoute, { prefix: '/admin' });
}