
import { StatusCodes } from "http-status-codes";
import authRoute from "./auth";
export default async function userRoute(fastify: any) {
    fastify.register(authRoute, { prefix: '/auth' })
}