// Controllers
import { LoginAdmin } from '@/controllers/auth';

// Utils
import { GenericMessages } from '@/functions/genericErrorMsg';

// Validators
import { ZLoginAdmin } from "@/validators/admin";
import { hasZodFastifySchemaValidationErrors } from 'fastify-type-provider-zod';

// Types
import { FastifyInstance } from 'fastify';
import { STATUS_CODE } from "@/types/httpStatus";

export default async function authRouter(app: FastifyInstance){
    app.post('/login', {
        schema: {
            body: ZLoginAdmin
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

            return reply.status(error.statusCode ? error.statusCode : 500)
            .send({message: GenericMessages(error.statusCode as STATUS_CODE) })
        }
    }, LoginAdmin )
}