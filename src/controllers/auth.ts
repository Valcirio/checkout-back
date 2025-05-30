import bcrypt from 'bcryptjs'

// Utils
import { prisma } from '@/utils/prisma'

// Types
import { TLoginAdmin } from '@/validators/admin'
import { FastifyReply, FastifyRequest } from 'fastify'
import { STATUS_CODE } from '@/types/httpStatus'
import { TIME_STAMP } from '@/types/magicNumbers'

export async function LoginAdmin
(
    req: FastifyRequest<{ Body: TLoginAdmin }>,
    reply: FastifyReply
){
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

    const token = req.server.jwt.sign(
        { 
            id: result.id, 
            name: result.name
        },
        { 
            expiresIn: Date.now() + (TIME_STAMP.OneDay*3) 
        }
    )
    return reply.status(STATUS_CODE.OK).send({ message:'usuário logado com sucesso!', access_token: token })
}