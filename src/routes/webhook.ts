// Controllers
import { UpdateOrderStatus } from "@/controllers/webhook";

// Functions
import { GenericMessages } from "@/functions/genericErrorMsg";

// Validators
import { ZParams } from "@/validators/params";

// Types
import { STATUS_CODE } from "@/types/httpStatus";
import { FastifyInstance } from "fastify";
import { ZStripeWebhookEvent } from "@/validators/stripe";
import { z } from "zod";

export default async function webhookRoute(app: FastifyInstance) {
    app.addContentTypeParser('application/json', { parseAs: 'buffer' }, function (request, bodyBuffer, done) {
        if (request.url === '/webhook') {
          done(null, bodyBuffer);
        } else {
          if (bodyBuffer.length === 0) {
            return done(null, {});
          }
          try {
            const json = JSON.parse(bodyBuffer.toString());
            done(null, json);
          } catch (err: any) {
            err.statusCode = 400;
            done(err, undefined);
          }
        }
      });

    app.post('', {
        errorHandler(error, req, reply) {
            return reply.status(error.statusCode ? error.statusCode : 500)
            .send({message: GenericMessages(error.statusCode as STATUS_CODE) })
        },
    }, UpdateOrderStatus)
}