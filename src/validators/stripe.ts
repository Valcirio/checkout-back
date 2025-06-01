import { z } from "zod";

const cardPaymentMethodOptionsSchema = z.object({
  installments: z.null().optional(),
  mandate_options: z.null().optional(),
  network: z.null().optional(),
  request_three_d_secure: z.string().optional(),
});

const paymentMethodOptionsSchema = z.object({
  card: cardPaymentMethodOptionsSchema.optional(),
});

const paymentMethodConfigurationDetailsSchema = z.object({
  id: z.string(),
  parent: z.null(),
});

const amountDetailsSchema = z.object({
  tip: z.object({}).optional(),
});

const automaticPaymentMethodsSchema = z.object({
  allow_redirects: z.string().optional(),
  enabled: z.boolean(),
});

const paymentIntentSchema = z.object({
  id: z.string(),
  object: z.literal('payment_intent'),
  amount: z.number(),
  amount_capturable: z.number().optional(),
  amount_details: amountDetailsSchema.optional(),
  amount_received: z.number().optional(),
  application: z.null(),
  application_fee_amount: z.null(),
  automatic_payment_methods: automaticPaymentMethodsSchema.optional(),
  canceled_at: z.null(),
  cancellation_reason: z.null(),
  capture_method: z.string(),
  client_secret: z.string(),
  confirmation_method: z.string(),
  created: z.number(), // Timestamp
  currency: z.string(),
  customer: z.null(),
  description: z.null(),
  last_payment_error: z.null(),
  latest_charge: z.string().nullable(),
  livemode: z.boolean(),
  metadata: z.record(z.string(), z.unknown()),
  next_action: z.null(),
  on_behalf_of: z.null(),
  payment_method: z.string().nullable(),
  payment_method_configuration_details: paymentMethodConfigurationDetailsSchema.optional(),
  payment_method_options: paymentMethodOptionsSchema.optional(),
  payment_method_types: z.array(z.string()),
  processing: z.null(),
  receipt_email: z.string().email().nullable().optional(),
  review: z.null(),
  setup_future_usage: z.null(),
  shipping: z.null(),
  source: z.null(),
  statement_descriptor: z.null(),
  statement_descriptor_suffix: z.null(),
  status: z.string(),
  transfer_data: z.null(),
  transfer_group: z.null(),
});

const eventDataSchema = z.object({
  object: paymentIntentSchema,
});

const eventRequestSchema = z.object({
  id: z.string().nullable(),
  idempotency_key: z.string().nullable(),
});

export const ZStripeWebhookEvent = z.object({
  id: z.string(),
  object: z.literal('event'),
  api_version: z.string().optional(),
  created: z.number(),
  data: eventDataSchema,
  livemode: z.boolean(),
  pending_webhooks: z.number().optional(),
  request: eventRequestSchema.nullable().optional(),
  type: z.string(),
});

export type TStripeWebhookEvent = z.infer<typeof ZStripeWebhookEvent>;