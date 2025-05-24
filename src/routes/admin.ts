import { FastifyTypedIsntance } from "@/types/zod";
import { ZRegisterAdmin } from "@/validators/admin";

export default async function adminRoutes(app: FastifyTypedIsntance) {

    app.post('',
    {
        schema: {
            body: ZRegisterAdmin
        }
    },
    async (req, reply) =>{
        return reply.status(200).send({message: ''})
    })
}