import { 
    FastifyInstance, 
    FastifyBaseLogger, 
    RawReplyDefaultExpression, 
    RawRequestDefaultExpression, 
    RawServerDefault
} from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";

export type FastifyZodInstance = FastifyInstance<
    RawServerDefault,
    RawRequestDefaultExpression,
    RawReplyDefaultExpression,
    FastifyBaseLogger,
    ZodTypeProvider
>