import 'dotenv/config'

const pinoOptions = {
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true,
            translateTime: 'dd/mm/yyyy HH:MM:ss',
            ignore: 'pid,hostname',
        },
    },
}

export { pinoOptions }