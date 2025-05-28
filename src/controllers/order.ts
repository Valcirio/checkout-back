import bcrypt from 'bcryptjs'

// Utils
import { hash } from "@/utils/hash";
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
    req: FastifyRequest<{ Body: TRegisterOrder }>,
    reply: FastifyReply
) {
    try {

    const resultDbProduct = await prisma.product.findFirst({
        where: {
            id: req.body.productId
        },
        select: {
            price: true
        }
    })

    if(!resultDbProduct){
        throw Error('DB Error.')
    }

    const paymentMethod = await stripe.paymentMethods.create({
    type: 'card',
    card: {
        cvc: req.body.cvc,
        exp_month: parseInt(req.body.expDate.substring(0,2)),
        exp_year: parseInt(req.body.expDate.substring(2,6)),
        number: req.body.cardNumber
    },
    billing_details: {
        name: 'John Doe',
    }},
    {
        apiVersion: '2025-04-30.basil'
    });

    if(!paymentMethod){
        throw new Error('Payment Error')
    }

    const intent: Stripe.Response<Stripe.PaymentIntent> = await stripe.paymentIntents.create({
        amount: Math.round(Number(resultDbProduct.price)* 100),
        currency: 'brl',
        payment_method: paymentMethod.id
    })

        if(!intent){
        throw new Error('Intent error.')
    }

    const resultDB = await prisma.client.create({
        data: {
            name: req.body.name,
            email: req.body.email,
            cpf: req.body.cpf,
            stripeMethodId: paymentMethod.id,
            method: 'card',
            status: intent.status,
            Order: {
                create: {
                    stripeIntentId: intent.id,
                    productId: req.body.productId
                }
            }
        }
    })

    } catch(err) {
        return reply.status(STATUS_CODE.BadRequest).send({message:'Erro ao criar o pedido.'})
    }

    return reply.status(STATUS_CODE.Created).send({message:'Pedido criado com sucesso!'})
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
    const user = req.user as TAdminToken
    const resultDB = await prisma.order.findMany({
        where: {
            id: req.params.id
        }
    })

    if(!resultDB){
        return reply.status(STATUS_CODE.Created).send({message:'Pedido encontrado!'})
    }

    return reply.status(STATUS_CODE.OK)
    .send({message:'Pedido encontrado!', 
        data: {

        }
    })
}