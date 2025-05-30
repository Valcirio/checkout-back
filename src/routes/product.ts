// Controllers
import { CreateProduct, DeleteProduct, FindAllProducts, FindProductById, FindProducts, UpdateProduct } from "@/controllers/product";

// Utils
import { GenericMessages } from "@/functions/genericErrorMsg";

// Validators
import { ZRegisterProduct, ZUpdateProduct } from "@/validators/product";
import { ZParams } from "@/validators/params";
import { hasZodFastifySchemaValidationErrors } from "fastify-type-provider-zod";

// Types
import { STATUS_CODE } from "@/types/httpStatus";
import { FastifyInstance } from "fastify";

export default async function productRoutes(app: FastifyInstance) {
    app.get('/admin', {
        onRequest: async (req, reply) => {
            try {
                await req.jwtVerify()
            } catch(err) {
                return reply.status(STATUS_CODE.Unauthorized).send({message: 'Usuário não autorizado.'})
            }
        },
        errorHandler(error, req, reply) {
            return reply.status(error.statusCode ? error.statusCode : 500)
            .send({message: GenericMessages(error.statusCode as STATUS_CODE) })
        },
    }, FindProducts)

    app.get('', {
        errorHandler(error, req, reply) {
            return reply.status(error.statusCode ? error.statusCode : 500)
            .send({message: GenericMessages(error.statusCode as STATUS_CODE) })
        },
    }, FindAllProducts)

    app.get('/:id', {
        onRequest: async (req, reply) => {
            try {
                await req.jwtVerify()
            } catch(err) {
                return reply.status(STATUS_CODE.Unauthorized).send({message: 'Usuário não autorizado.'})
            }
        },
        schema: {
            params: ZParams
        },
        errorHandler(error, req, reply) {
            if (hasZodFastifySchemaValidationErrors(error)) {
                return reply.status(STATUS_CODE.BadRequest).send({
                    message: 'Erro de validação.',
                    details: {
                        issues: error.validation.map((el)=>{
                            return {
                                issue: el.params.issue.path,
                                code: el.params.issue.code,
                                message: el.params.issue.message
                            }
                        }),
                        method: req.method,
                        url: req.url,
                    },
                })
            }
            console.log(error, req.params)
            return reply.status(error.statusCode ? error.statusCode : 500)
            .send({message: GenericMessages(error.statusCode as STATUS_CODE) })
        },
    }, FindProductById)
    
    app.post('',
    {
        onRequest: async (req, reply) => {
            try {
                await req.jwtVerify()
            } catch(err) {
                return reply.status(STATUS_CODE.Unauthorized).send({message: 'Usuário não autorizado.'})
            }
        },
        schema: {
            body: ZRegisterProduct
        },
        errorHandler(error, req, reply) {
            if (hasZodFastifySchemaValidationErrors(error)) {
                return reply.status(STATUS_CODE.BadRequest).send({
                    message: 'Erro de validação.',
                    details: {
                        issues: error.validation.map((el)=>{
                            return {
                                issue: el.params.issue.path,
                                code: el.params.issue.code,
                                message: el.params.issue.message
                            }
                        }),
                        method: req.method,
                        url: req.url,
                    },
                })
            }

            return reply.status(error.statusCode ? error.statusCode : 500)
            .send(new Error(GenericMessages(error.statusCode as STATUS_CODE)))
        },
    }, CreateProduct )

app.put('',
    {
        onRequest: async (req, reply) => {
            try {
                await req.jwtVerify()
            } catch(err) {
                return reply.status(STATUS_CODE.Unauthorized).send({message: 'Usuário não autorizado.'})
            }
        },
        schema: {
            body: ZUpdateProduct
        },
        errorHandler(error, req, reply) {
            if (hasZodFastifySchemaValidationErrors(error)) {
                return reply.status(STATUS_CODE.BadRequest).send({
                    message: 'Erro de validação.',
                    details: {
                        issues: error.validation.map((el)=>{
                            return {
                                issue: el.params.issue.path,
                                code: el.params.issue.code,
                                message: el.params.issue.message
                            }
                        }),
                        method: req.method,
                        url: req.url,
                    },
                })
            }

            return reply.status(error.statusCode ? error.statusCode : 500)
            .send({message: GenericMessages(error.statusCode as STATUS_CODE) })
        },
    }, UpdateProduct )

app.delete('/:id',
    {
        onRequest: async (req, reply) => {
            try {
                await req.jwtVerify()
            } catch(err) {
                return reply.status(STATUS_CODE.Unauthorized).send({message: 'Usuário não autorizado.'})
            }
        },
        schema: {
            params: ZParams
        },
        errorHandler(error, req, reply) {
            if (hasZodFastifySchemaValidationErrors(error)) {
                return reply.status(STATUS_CODE.BadRequest).send({
                    message: 'Erro de validação.',
                    details: {
                        issues: error.validation.map((el)=>{
                            return {
                                issue: el.params.issue.path,
                                code: el.params.issue.code,
                                message: el.params.issue.message
                            }
                        }),
                        method: req.method,
                        url: req.url,
                    },
                })
            }
            console.log(error)
            return reply.status(error.statusCode ? error.statusCode : 500)
            .send({message: GenericMessages(error.statusCode as STATUS_CODE) })
        },
    }, DeleteProduct )
}