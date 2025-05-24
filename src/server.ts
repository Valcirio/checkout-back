import Fastify, { FastifyInstance } from 'fastify'
import { fastifyCors } from '@fastify/cors'
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod'
import adminRoutes from './routes/admin'

class CheckoutApp {
    public server: FastifyInstance

    constructor () {
        this.server = Fastify()

        this.middleware()
        this.setZod()
        this.setRoutes()
    }

    private middleware() {
        this.server.register(fastifyCors, { origin: '*' })
    }

    private setZod(){
        this.server.setValidatorCompiler(validatorCompiler)
        this.server.setSerializerCompiler(serializerCompiler)
    }

    private setRoutes(){
        this.server.register(adminRoutes, { prefix: '/admin' })
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