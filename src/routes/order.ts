// Controllers
import { FindOrderById, FindOrders, CreateOrder } from "@/controllers/order";

// Functions
import { GenericMessages } from "@/functions/genericErrorMsg";

// Validators
import { ZRegisterOrder } from "@/validators/order";
import { ZQueryParams } from "@/validators/queries";

// Types
import { STATUS_CODE } from "@/types/httpStatus";
import { FastifyInstance } from "fastify";

export default async function orderRoutes(app: FastifyInstance) {
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
            params: ZQueryParams
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