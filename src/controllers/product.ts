import { v4 as uuidv4 } from 'uuid';

// Functions
import { PrismaError } from '@/functions/genericErrorMsg';

// Utils
import { prisma } from '@/utils/prisma'

// Validatiors
import { TRegisterProduct, TUpdateProduct } from "@/validators/product";
import { TParams } from "@/validators/params";
import { TAdminToken } from "@/validators/admin";

// Functions
import { convertBase64ToBuffer } from "@/functions/imageConverter";

// Services
import { deleteImageOnS3, uploadImageToS3 } from "@/services/s3Bucket";

// Types
import { FastifyReply, FastifyRequest } from "fastify";
import { STATUS_CODE } from "@/types/httpStatus";
import { TQueryParams } from '@/validators/queries';
import { OrdinationProductLiterals } from '@/functions/ordinationLiterals';

export async function FindProducts
(
    req: FastifyRequest<{ Params: TParams, Querystring: TQueryParams }>,
    reply: FastifyReply
) {
    const {page, ordination, desc} = req.query as TQueryParams
    const user = req.user as TAdminToken

    const totalPages = Math.ceil(await prisma.order.count() / 5)

    if(page && totalPages !== 0 && Number(page) > totalPages){
        req.log.error('Parâmetro de página é maior que o total de páginas.')
        return reply.status(STATUS_CODE.BadRequest).send({message:'Página não encontrada.'})
    }
    const result = await prisma.product.findMany({
        take: 5,
        skip: page? (Number(page) - 1)*5 : 0,
            orderBy: {
                [OrdinationProductLiterals(ordination)]: desc === 'true' ? 'desc' : 'asc'
            },
        where: {
            adminId: user.id
        }
    })
    return reply.status(STATUS_CODE.OK)
    .send({ message: result.length ? 'Produtos encontrados!' : 'Ainda não há produtos cadastrados.', products: result })

}

export async function FindAllProducts
(
    req: FastifyRequest,
    reply: FastifyReply
) {
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
            id: req.params.id,
            }
    })

    if(!result) {
        return reply.status(STATUS_CODE.NotFound).send({ message: 'Produto não encontrado.' })
    }

    return reply.status(STATUS_CODE.OK).send({ message:'Produto encontrado!', product: result })
}

export async function FindAdminProductById
(
    req: FastifyRequest<{ Params: TParams }>,
    reply: FastifyReply
) {

    const user = req.user as TAdminToken
    const result = await prisma.product.findUnique({
        where: {
            id: req.params.id,
            adminId: user.id
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
    const { id, ...rest } = req.body
    try {
        if(rest.picture){
            const pictureLink = await prisma.product.findUnique({
                where: {
                    id: id
                },
                select: {
                    picture: true
                }
            })

                
            const image = convertBase64ToBuffer(rest.picture)
                
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
                id: id
            },
            data: rest
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