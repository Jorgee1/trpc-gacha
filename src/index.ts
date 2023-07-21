import Fastify from 'fastify'
import FastifyCookie from '@fastify/cookie'
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify'
import { createContext } from './trpc.js'
import { appRouter } from './routes.js'

import type { AppRouter } from './routes.js'


const port = 3000
const fastify = Fastify({logger: true})

fastify.register(FastifyCookie, {
    secret: '---------',
    parseOptions: {
        secure: false,
        path: '/',
        sameSite: 'strict',
        httpOnly: true
    }
})

fastify.register(fastifyTRPCPlugin<AppRouter>, {
    prefix: '/trpc',
    trpcOptions: {
        router: appRouter,
        createContext 
    }
})

fastify.get('/', () => 'ASASD')

const main = async () => {
    try {
        console.log(`Listening :${port}`)
        await fastify.listen({port})
    } catch (error) {
        fastify.log.error(error)
        process.exit(1)
    }
}
main()