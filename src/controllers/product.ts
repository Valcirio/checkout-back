// Utils
import { hash } from "@/utils/hash";
import { prisma } from '@/utils/prisma'

// Validatiors
import { TRegisterProduct, TUpdateProduct } from "@/validators/product";

// Types
import { FastifyReply, FastifyRequest } from "fastify";
import { STATUS_CODE } from "@/types/httpStatus";
import { TParams } from "@/validators/params";
import { TAdminToken } from "@/validators/admin";

export async function FindProducts
(
    req: FastifyRequest,
    reply: FastifyReply
) {
    const user = req.user as TAdminToken
    const result = await prisma.product.findMany({
        where: {
            adminId: user.id
        }
    })
    return reply.status(STATUS_CODE.OK)
    .send({ message: result.length ? 'Produtos encontrados!' : 'Ainda não há produtos cadastrados.', data: result })

}

export async function FindProductById
(
    req: FastifyRequest<{ Params: TParams }>,
    reply: FastifyReply
) {
    const result = await prisma.product.findUnique({
        where: {
            id: req.params.id
        }
    })

    if(!result) {
        return reply.status(STATUS_CODE.NotFound).send({ message: 'Produto não encontrado.' })
    }

    return reply.status(STATUS_CODE.OK).send({ message:'Produto encontrado!', data: result })
}

export async function CreateProduct
(
    req: FastifyRequest<{ Body: TRegisterProduct }>,
    reply: FastifyReply
) {
    const user = req.user as TAdminToken
    const resultDB = await prisma.product.create({
        data: {
            title: req.body.title,
            description: req.body.description,
            price: req.body.price,
            picture: req.body.picture,
            quantity: req.body.quantity,
            admin: {
                connect: { 
                    id: user.id 
                }
            }
        }
    })

        if(!resultDB){
        return reply.status(STATUS_CODE.BadRequest).send({message: 'Erro ao tentar criar produto.'})
    }

    return reply.status(STATUS_CODE.Created).send({message:'Produto criado com sucesso!'})
}

export async function UpdateProduct
(
    req: FastifyRequest<{ Body: TUpdateProduct }>,
    reply: FastifyReply
) {

    try {
        await prisma.product.update({
            where: {
                id: req.body.id
            },
            data: {
                title: req.body.title,
                description: req.body.description,
                price: req.body.price,
                picture: req.body.picture,
                quantity: req.body.quantity
            }
        })

        return reply.status(STATUS_CODE.OK).send({message:'Produto atualizado com sucesso!'})

    } catch {
        return reply.status(STATUS_CODE.BadRequest).send({message: 'Erro ao tentar atualizar produto.'})
    }
}

export async function DeleteProduct
(
    req: FastifyRequest<{ Params: TParams }>,
    reply: FastifyReply
) {
    try {
        await prisma.product.delete({
            where: {
                id: req.params.id
            }
        })

        return reply.status(STATUS_CODE.OK).send({message:'Produto deletado com sucesso!'})

    } catch {
        return reply.status(STATUS_CODE.BadRequest).send({message: 'Erro ao tentar deletar produto.'})
    }
}