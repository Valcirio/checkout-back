import Fastify, { FastifyInstance } from 'fastify'
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from 'fastify-type-provider-zod'
import ngrok from '@ngrok/ngrok'

// Fastify Plugins
import { fastifyCors } from '@fastify/cors'
import { fastifyJwt } from '@fastify/jwt'

// Utils
import { pinoOptions } from './utils/pino'

// Routes
import adminRoutes from './routes/admin'
import productRoutes from './routes/product'
import authRouter from './routes/auth'
import orderRoutes from './routes/order'
import webhookRoute from './routes/webhook'

class CheckoutApp {
    public server: FastifyInstance

    constructor () {
        this.server = Fastify({
            logger: process.env.NODE_ENV === 'development' ? pinoOptions : true
        }).withTypeProvider<ZodTypeProvider>()
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
        this.server.register(webhookRoute, {prefix: '/webhook'})
    }


    public initialize(){
        this.server.listen({port: 3333}, (err, address) => {
            if (err) {
              this.server.log.error(err)
              process.exit(1)
            }
            this.server.log.info(`Server listening at ${address}`)
        })
    }
}

const app = new CheckoutApp()
app.initialize()

ngrok.connect({ addr: 3333, authtoken: process.env.NGROK_AUTHTOKEN, domain: 'poorly-cool-buck.ngrok-free.app' })
.then(listener => console.log(`Ingress established at: ${listener.url()}`));