// Utils
import { hash } from "@/functions/hash";
import { prisma } from '@/utils/prisma'

// Validatiors
import { TAdminToken, TRegisterAdmin } from "@/validators/admin";

// Types
import { FastifyReply, FastifyRequest } from "fastify";
import { STATUS_CODE } from "@/types/httpStatus";

export async function CreateAdmin
(
    req: FastifyRequest<{ Body: TRegisterAdmin }>,
    reply: FastifyReply
) {
    const result = await prisma.admin.findUnique({
        where:{
            email: req.body.email
        }
    })

    if(result){
        // throw new Error('Usuário com este e-mail já existe.', { cause: STATUS_CODE.BadRequest })
        return reply.status(STATUS_CODE.BadRequest).send({message: 'Usuário com este e-mail já existe.'})
    }

    const resultDB = await prisma.admin.create({
        data: {
            ...req.body,
            password: await hash(req.body.password),
        }
    })

    return reply.status(STATUS_CODE.Created).send({message:'Usuário criado com sucesso!'})
}

export async function FindAdminById (
    req: FastifyRequest,
    reply: FastifyReply
) {
    const user = req.user as TAdminToken
    const result = await prisma.admin.findUnique({
        where:{
            id: user.id
        },
        select: {
            name: true,
            email: true
        }
    })

    if(!result){
        return reply.status(STATUS_CODE.NotFound).send({message: 'Usuário não encontrado.'})
    }

    return reply.status(STATUS_CODE.OK)
    .header('Content-Type', 'application/json; charset=utf-8')
    .send({message:'Usuário encontrado!', data: result })
}