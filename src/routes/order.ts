import { FindOrderById, FindOrders, CreateOrder } from "@/controllers/order";
import { STATUS_CODE } from "@/types/httpStatus";
import { FastifyZodInstance } from "@/types/zod";
import { GenericMessages } from "@/utils/genericErrorMsg";
import { ZRegisterOrder } from "@/validators/order";
import { ZParams } from "@/validators/params";

export default async function orderRoutes(app: FastifyZodInstance) {
    app.get('', {
        onRequest: async (req, reply) => {
            try {
                await req.jwtVerify()
            } catch(err) {
                return reply.status(STATUS_CODE.Unauthorized).send({message: 'Usuário não autorizado.'})
            }
        },
        errorHandler(error, req, reply) {
            return reply.status(error.statusCode ? error.statusCode : 500)
            .send({message: GenericMessages(error.statusCode as STATUS_CODE ) })
        },
    }, FindOrders)

    app.get('/:id', {
        schema: {
            params: ZParams
        },
        onRequest: async (req, reply) => {
            try {
                await req.jwtVerify()
            } catch(err) {
                return reply.status(STATUS_CODE.Unauthorized).send({message: 'Usuário não autorizado.'})
            }
        },
        errorHandler(error, req, reply) {
            return reply.status(error.statusCode ? error.statusCode : 500)
            .send({message: GenericMessages(error.statusCode as STATUS_CODE ) })
        },
    }, FindOrderById)

    app.post('',
    {
        schema: {
            body: ZRegisterOrder
        }
    }, CreateOrder)
}