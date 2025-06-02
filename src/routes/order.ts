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
import { ZParams } from "@/validators/params";
import { hasZodFastifySchemaValidationErrors } from "fastify-type-provider-zod";

export default async function orderRoutes(app: FastifyInstance) {
    app.get('', {
        schema: {
            querystring: ZQueryParams
        },
        onRequest: async (req, reply) => {
            try {
                await req.jwtVerify()
            } catch(err) {
                return reply.status(STATUS_CODE.Unauthorized).send({message: 'Usuário não autorizado.'})
            }
        },
        errorHandler(error, req, reply) {
            if (hasZodFastifySchemaValidationErrors(error)) {
                return reply.status(STATUS_CODE.BadRequest).send({
                    message: 'Erro de validação.',
                    details: {
                        issues: error.validation.map((el)=>{
                            return {
                                issue: el.params.issue.path,
                                code: el.params.issue.code,
                                message: el.params.issue.message
                            }
                        }),
                        method: req.method,
                        url: req.url,
                    },
                })
            }

            req.log.error(error)
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