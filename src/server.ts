import Fastify, { FastifyInstance } from 'fastify'
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from 'fastify-type-provider-zod'

// Fastify Plugins
import { fastifyCors } from '@fastify/cors'
import { fastifyJwt } from '@fastify/jwt'
import fastifyMultipart from '@fastify/multipart'

// Routes
import adminRoutes from './routes/admin'
import productRoutes from './routes/product'
import { authRouter } from './routes/auth'

class CheckoutApp {
    public server: FastifyInstance

    constructor () {
        this.server = Fastify().withTypeProvider<ZodTypeProvider>()
        this.server.register(fastifyJwt, {secret: process.env.JWT_PASS as string})

        this.middleware()
        this.setZodCompiler()
        this.setRoutes()
    }

    private middleware() {
        this.server.register(fastifyCors, { origin: '*' })
        // this.server.register(fastifyMultipart, { attachFieldsToBody: "keyValues", limits: { fileSize: 10*1024*1024, files: 1 } })
    }

    private setZodCompiler(){
        this.server.setValidatorCompiler(validatorCompiler)
        this.server.setSerializerCompiler(serializerCompiler)
    }

    private setRoutes(){
        this.server.register(adminRoutes, { prefix: '/admin' })
        this.server.register(authRouter, { prefix: '/auth' })
        this.server.register(productRoutes, { prefix: '/product' })
    }


    public initialize(){
        this.server.listen({port: 3333}, (err, address) => {
            if (err) {
              console.error(err)
              process.exit(1)
            }
            console.log(`Server listening at ${address}`)
        })
    }
}

const app = new CheckoutApp()
app.initialize()