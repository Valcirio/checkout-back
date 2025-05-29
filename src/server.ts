import Fastify, { FastifyInstance } from 'fastify'
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from 'fastify-type-provider-zod'

// Fastify Plugins
import { fastifyCors } from '@fastify/cors'
import { fastifyJwt } from '@fastify/jwt'

// Routes
import adminRoutes from './routes/admin'
import productRoutes from './routes/product'
import { authRouter } from './routes/auth'
import orderRoutes from './routes/order'

class CheckoutApp {
    public server: FastifyInstance

    constructor () {
        this.server = Fastify().withTypeProvider<ZodTypeProvider>()
        this.middleware()
        this.setZodCompiler()
        this.setRoutes()
    }

    private middleware() {
        this.server.register(fastifyCors, { origin: '*' })
        this.server.register(fastifyJwt, {secret: process.env.JWT_PASS as string})
    }

    private setZodCompiler(){
        this.server.setValidatorCompiler(validatorCompiler)
        this.server.setSerializerCompiler(serializerCompiler)
    }

    private setRoutes(){
        this.server.register(adminRoutes, { prefix: '/admin' })
        this.server.register(authRouter, { prefix: '/auth' })
        this.server.register(productRoutes, { prefix: '/product' })
        this.server.register(orderRoutes, {prefix: '/order'})
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