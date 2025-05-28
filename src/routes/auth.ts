import bcrypt from 'bcryptjs'

// Utils
import { prisma } from '@/utils/prisma'
import { GenericMessages } from '@/utils/genericErrorMsg';

// Validators
import { ZLoginAdmin } from "@/validators/admin";
import { hasZodFastifySchemaValidationErrors, isResponseSerializationError } from 'fastify-type-provider-zod';

// Types
import { FastifyZodInstance } from "@/types/zod";
import { STATUS_CODE } from "@/types/httpStatus";
import { TIME_STAMP } from '@/types/magicNumbers';

export async function authRouter(app: FastifyZodInstance){

    app.post('/singup', {
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
    },
    async (req, reply)=>{
        console.log(req.body)
        const result = await prisma.admin.findUnique({
            where:{
                email: req.body.email
            }
        })

        if(!result){
            return reply.status(STATUS_CODE.BadRequest).send({message: 'E-mail e(ou) senha do usuário estão incorretas.'})
        }
        
        if(await bcrypt.compare(req.body.password, result.password) === false){
            return reply.status(STATUS_CODE.BadRequest).send({message: 'E-mail e(ou) senha do usuário estão incorretas.'})
        }

        const token = app.jwt.sign(
            { 
                id: result.id, 
                name: result.name
            },
            { 
                expiresIn: Date.now() + (TIME_STAMP.OneDay*3) 
            }
        )
        return reply.status(STATUS_CODE.OK).send({ message:'usuário logado com sucesso!', access_token: token })
    })
}