import { v4 as uuidv4 } from 'uuid';

// Utils
import { prisma } from '@/utils/prisma'

// Validatiors
import { TRegisterProduct, TUpdateProduct } from "@/validators/product";

// Functions
import { convertBase64ToBuffer } from "@/functions/imageConverter";

// Services
import { deleteImageOnS3, uploadImageToS3 } from "@/services/s3Bucket";

// Types
import { FastifyReply, FastifyRequest } from "fastify";
import { STATUS_CODE } from "@/types/httpStatus";
import { TParams } from "@/validators/params";
import { TAdminToken } from "@/validators/admin";
import { PrismaClientInitializationError, PrismaClientKnownRequestError } from "@/generated/dbClient/runtime/library";
import { PrismaError } from '@/functions/genericErrorMsg';

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

export async function FindAllProducts
(
    req: FastifyRequest,
    reply: FastifyReply
) {
    const user = req.user as TAdminToken
    const result = await prisma.product.findMany()
    return reply.status(STATUS_CODE.OK)
    .send({ message: result.length ? 'Produtos encontrados!' : 'Ainda não há produtos cadastrados.', products: result })
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

    return reply.status(STATUS_CODE.OK).send({ message:'Produto encontrado!', product: result })
}

export async function CreateProduct
(
    req: FastifyRequest<{ Body: TRegisterProduct }>,
    reply: FastifyReply
) {

    const image = convertBase64ToBuffer(req.body.picture)

    if(!image){
        return reply.status(STATUS_CODE.BadRequest).send({message: 'Imagem não suportada.'})
    }

    const bucketLink = await uploadImageToS3({
        bucketName: 'checkout-prod-img',
        fileName: uuidv4(),
        imageBuffer: image.buffer,
        contentType: image.contentType  
    })

    const user = req.user as TAdminToken
    const resultDB = await prisma.product.create({
        data: {
            title: req.body.title,
            description: req.body.description,
            price: req.body.price,
            picture: bucketLink,
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

        if(req.body.picture){
            const pictureLink = await prisma.product.findUnique({
                where: {
                    id: req.body.id
                },
                select: {
                    picture: true
                }
            })
            const image = convertBase64ToBuffer(req.body.picture)

            if(!image){
                return reply.status(STATUS_CODE.BadRequest).send({message: 'Imagem não suportada.'})
            }

            if(pictureLink?.picture){
                await uploadImageToS3({
                    bucketName: 'checkout-prod-img',
                    fileName: pictureLink.picture.split('/')[pictureLink.picture.split('/').length - 1],
                    imageBuffer: image.buffer,
                    contentType: image.contentType  
                })
            } else {
                return reply.status(STATUS_CODE.BadRequest).send({message: 'Ocorreu um erro ao tentar atualizar a imagem.'})
            }
            
        }

        await prisma.product.update({
            where: {
                id: req.body.id
            },
            data: {
                title: req.body.title,
                description: req.body.description,
                price: req.body.price,
                quantity: req.body.quantity
            }
        })

        return reply.status(STATUS_CODE.OK).send({message:'Produto atualizado com sucesso!'})

    } catch (error) {
        return reply.status(STATUS_CODE.BadRequest).send({message: error instanceof Error ? error.message : 'Erro ao tentar atualizar produto.'})
    }
}

export async function DeleteProduct
(
    req: FastifyRequest<{ Params: TParams }>,
    reply: FastifyReply
) {
    try {
        const result = await prisma.product.delete({
            where: {
                id: req.params.id
            },
            select: {
                picture: true
            }
        })

        if(result.picture){
            await deleteImageOnS3({
                bucketName: 'checkout-prod-img',
                fileName: result.picture.split('/')[result.picture.split('/').length - 1]
            })
        }

        return reply.status(STATUS_CODE.OK).send({message:'Produto deletado com sucesso!'})

    } catch (error) {
        reply.log.error(PrismaError(error))
        return reply.status(STATUS_CODE.BadRequest).send({message: 'Erro ao tentar deletar produto.'})
    }
}