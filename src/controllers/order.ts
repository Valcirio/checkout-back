// Utils
import { hash } from "@/functions/hash";
import { prisma } from '@/utils/prisma'

// Validators
import { TRegisterOrder } from "@/validators/order";

// Types
import { STATUS_CODE } from "@/types/httpStatus";
import { FastifyReply, FastifyRequest } from "fastify";
import { TParams } from '@/validators/params';
import { TAdminToken } from '@/validators/admin';
import { stripe } from '@/utils/stripe';
import Stripe from 'stripe';

export async function CreateOrder
(
    req: FastifyRequest<{ Params: TParams }>,
    reply: FastifyReply
) {
    try {

    const resultDbProduct = await prisma.product.findFirst({
        where: {
            id: req.params.id
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

    const intent: Stripe.Response<Stripe.PaymentIntent> = await stripe.paymentIntents.create({
        amount: Math.round(Number(resultDbProduct.price)* 100),
        currency: 'brl',
        automatic_payment_methods: {
            enabled: true
        }
    })

        if(!intent){
        throw new Error('Intent error.')
    }

    return reply.status(STATUS_CODE.Created)
    .send({message:'Pedido criado com sucesso!', secret: intent.client_secret, product: resultDbProduct})

    } catch(err) {
        console.log(err)
        return reply.status(STATUS_CODE.BadRequest).send({message:'Erro ao criar o pedido.'})
    }

}

export async function FindOrders
(
    req: FastifyRequest,
    reply: FastifyReply
) {
    const user = req.user as TAdminToken
    const resultDB = await prisma.order.findMany({
        where: {
            id: user.id
        }
    })

    if(!resultDB){
        return reply.status(STATUS_CODE.NotFound).send({message:'Pedidos não encontrados.'})
    }

    return reply.status(STATUS_CODE.OK)
    .send({ message: resultDB.length ? 'Pedidos encontrados!' : 'Ainda não há pedidos cadastrados.', orders: resultDB })
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
        return reply.status(STATUS_CODE.NotFound).send({message:'Pedido não encontrado.'})
    }

    return reply.status(STATUS_CODE.OK)
    .send({message:'Pedido encontrado!', result })
}

// export async function CreateOrder
// (
//     req: FastifyRequest<{ Body: TRegisterOrder }>,
//     reply: FastifyReply
// ) {
//     try {

//     const resultDbProduct = await prisma.product.findFirst({
//         where: {
//             id: req.body.productId
//         },
//         select: {
//             price: true
//         }
//     })

//     if(!resultDbProduct){
//         throw Error('Erro ao buscar o produto.')
//     }

//     const intent: Stripe.Response<Stripe.PaymentIntent> = await stripe.paymentIntents.create({
//         amount: Math.round(Number(resultDbProduct.price)* 100),
//         currency: 'brl',
//         automatic_payment_methods: {
//             enabled: true
//         }
//     })

//         if(!intent){
//         throw new Error('Intent error.')
//     }

//     await prisma.client.create({
//         data: {
//             name: req.body.name,
//             email: req.body.email,
//             cpf: req.body.cpf,
//             Order: {
//                 create: {
//                     status: intent.status,
//                     stripeIntentId: intent.id,
//                     productId: req.body.productId
//                 }
//             }
//         }
//     })

//     return reply.status(STATUS_CODE.Created).send({message:'Pedido criado com sucesso!', secret: intent.client_secret})

//     } catch(err) {
//         console.log(err)
//         return reply.status(STATUS_CODE.BadRequest).send({message:'Erro ao criar o pedido.'})
//     }

// }