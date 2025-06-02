// Utils
import { prisma } from '@/utils/prisma'
import { stripe } from '@/utils/stripe';

// Validators
import { TRegisterOrder } from "@/validators/order";
import { TParams } from '@/validators/params';
import { TQueryParams } from '@/validators/queries';
import { TAdminToken } from '@/validators/admin';

// Types
import { FastifyReply, FastifyRequest } from "fastify";
import { STATUS_CODE } from "@/types/httpStatus";
import Stripe from 'stripe';
import { OrdinationLiterals } from '@/functions/ordinationLiterals';

export async function CreateOrder
(
    req: FastifyRequest<{ Body: TRegisterOrder }>,
    reply: FastifyReply
) {
    try {

    const resultDbProduct = await prisma.product.findFirst({
        where: {
            id: req.body.productId
        },
        omit: {
            id: true,
            adminId: true,
            createdAt: true,
            updatedAt: true
        }
    })

    
    if(!resultDbProduct){
        throw Error('Erro ao buscar o produto.')
    }

    if(resultDbProduct.quantity < req.body.quantity){
        req.log.error('Quantidade insuficiente no estoque.')
        return reply.status(STATUS_CODE.BadRequest).send({message:'Quantidade insuficiente no estoque.'})
    }

    const intent: Stripe.Response<Stripe.PaymentIntent> = await stripe.paymentIntents.create({
        amount: Math.round((Number(resultDbProduct.price) * 100) * req.body.quantity),
        currency: 'brl',
        automatic_payment_methods: {
            enabled: true
        },
        metadata: {
            productId: req.body.productId,
            quantity: req.body.quantity
        }
    })

        if(!intent){
        throw new Error('Intent error.')
    }

    await prisma.client.create({
        data: {
            name: req.body.name,
            email: req.body.email,
            cpf: req.body.cpf,
            address: req.body.address,
            Order: {
                create: {
                    value: Number(resultDbProduct.price) * req.body.quantity,
                    status: intent.status,
                    stripeIntentId: intent.id,
                    productId: req.body.productId
                }
            }
        }
    })

    await prisma.product.update({
        where: {
            id: req.body.productId
        },
        data: {
            quantity: { decrement: req.body.quantity }
        }
    })

    return reply.status(STATUS_CODE.Created)
    .send({message:'Pedido criado com sucesso!', secret: intent.client_secret })

    } catch(err) {
        req.log.error(err)
        return reply.status(STATUS_CODE.BadRequest).send({message:'Erro ao criar o pedido.'})
    }

}

export async function FindOrders
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

    console.log(page, ordination, desc)

    const resultDB = await prisma.order.findMany({
        take: 5,
        skip: page? (Number(page) - 1)*5 : 0,
        orderBy: OrdinationLiterals(ordination, desc),
        where: {
            product: {
                adminId: user.id
            }
        },
        include: {
            product: {
                select: {
                    title: true,
                }
            },
            client: {
                select: {
                    name: true,
                }
            }
        },
        omit: {
            clientId: true,
            productId: true,
            stripeIntentId: true
        }
    })

    if(!resultDB){
        req.log.error('Ocorreu um erro ao buscar os pedidos.')
        return reply.status(STATUS_CODE.NotFound).send({message:'Pedidos não encontrados.'})
    }

    req.log.info('Pedidos encontrados com sucesso.')
    return reply.status(STATUS_CODE.OK)
    .send({ message: resultDB.length ? 'Pedidos encontrados!' : 'Ainda não há pedidos cadastrados.',
        orders: resultDB, 
        hasNext: Number(page) < totalPages && true
    })
}

export async function FindOrderById
(
    req: FastifyRequest<{ Params: TParams }>,
    reply: FastifyReply
) {
    const result = await prisma.order.findUnique({
        where: {
            id: req.params.id
        },
        omit: {
            id: true,
            stripeIntentId: true,
        }
    })

    if(!result){
        req.log.error('Pedido não encontrado.')
        return reply.status(STATUS_CODE.NotFound).send({message:'Pedido não encontrado.'})
    }

    req.log.info('Pedido encontrado com sucesso.')
    return reply.status(STATUS_CODE.OK)
    .send({message:'Pedido encontrado!', result })
}