import Stripe from "stripe";
import { FastifyRequest, FastifyReply } from "fastify";

// Types
import { STATUS_CODE } from "@/types/httpStatus";

// Utils
import { stripe, stripeWebhookSecret } from "@/utils/stripe";
import { prisma } from "@/utils/prisma";

export async function UpdateOrderStatus(
    req: FastifyRequest<{ Body: Buffer }>,
    reply: FastifyReply
) {
    let event: Stripe.Event | null = null
    if (!stripeWebhookSecret) {
        return reply.status(STATUS_CODE.BadRequest).send({message: 'Webhook secret não encontrado.'})
    }

    const signature = req.headers['stripe-signature'];
    if (!signature) {
        return reply.status(STATUS_CODE.BadRequest).send({message: 'Assinatura do Stripe não encontrada no cabeçalho.'});
    }

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            signature as string,
            stripeWebhookSecret
        );

    const paymentIntent = event.data.object as Stripe.PaymentIntent;
        paymentIntent.payment_method 
    await prisma.order.update({
        where: {
            stripeIntentId: paymentIntent.id
        },
        data: {
            status: paymentIntent.status
        }
    });

    return reply.status(STATUS_CODE.OK).send({message: 'Evento recebido e processado com sucesso.', eventId: event.id})
} catch (err: any) {
    return reply.status(STATUS_CODE.BadRequest).send({message: `Erro no webhook: ${err.message}`});
}
}