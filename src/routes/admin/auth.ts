
import { StatusCodes } from "http-status-codes";
import auth from "../../controllers/admin/class";
import { authorizeRoles } from "@utils/authenticate";
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default async function authRoute(fastify: any) {
    fastify.post('/add', async (req: any, reply: any) => {
        const data = await auth.add(req.body, fastify);
        reply.status(StatusCodes.CREATED).send({ data: data, code: StatusCodes.CREATED });
    });
    fastify.get('/details', async (req: any, reply: any) => {
        try {
            const data = await auth.details(req.query, req.headers);
            reply.status(StatusCodes.OK).send({ data: data, code: StatusCodes.OK });
        } catch (err) {
            reply.code(StatusCodes.BAD_REQUEST).send({ error: err, code: StatusCodes.BAD_REQUEST });
        }
    });
    fastify.get('/list', async (req: any, reply: any) => {
        const data = await auth.list(req.user, req.headers);
        // await delay(7000); // Wait 7 seconds before sending the response
        reply.status(StatusCodes.OK).send({ data: data, code: StatusCodes.OK });
    });
    fastify.delete('/delete/:id', async (req: any, reply: any) => {
        const data = await auth.delete_class(req.params.id);
        // await delay(7000); // Wait 7 seconds before sending the response
        reply.status(StatusCodes.OK).send({ data: data, code: StatusCodes.OK });
    });
}