import 'dotenv/config'
import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2025-04-30.basil',
    typescript: true
})

export const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string