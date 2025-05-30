// Controllers
import { CreateAdmin, FindAdminById } from "@/controllers/admin";

// Utils
import { GenericMessages } from "@/functions/genericErrorMsg";

// Validators
import { ZRegisterAdmin } from "@/validators/admin";
import { hasZodFastifySchemaValidationErrors } from "fastify-type-provider-zod";

// Types
import { STATUS_CODE } from "@/types/httpStatus";

// Types
import { FastifyInstance } from "fastify";

export default async function adminRoutes(app: FastifyInstance) {
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
            .send({message: GenericMessages(error.statusCode as STATUS_CODE) })
        },
    }, FindAdminById)
    
    app.post('',
    {
        schema: {
            body: ZRegisterAdmin
        },
        errorHandler(error, req, reply) {
            if (hasZodFastifySchemaValidationErrors(error)) {
                return reply.status(STATUS_CODE.BadRequest).send({
                    message: 'Erro de validação',
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

            return reply.status(error.statusCode ? error.statusCode : 500)
            .send({message: GenericMessages(error.statusCode as STATUS_CODE) })
        },
    }, CreateAdmin )
}