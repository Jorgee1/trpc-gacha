import { TRPCError, initTRPC } from '@trpc/server'
import { db } from './db.js'
import type { inferAsyncReturnType } from '@trpc/server'
import type { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify'
import type { FastifyCookieOptions } from '@fastify/cookie'

export const createContext = async ({req, res}: CreateFastifyContextOptions & FastifyCookieOptions) => {
    const token = req.cookies.token || ''
    const session = await db.session.findUnique({where: {token}, select: {user: true}})
    
    const user = session? session.user: undefined

    return {req, res, user}
}

export type Context = inferAsyncReturnType<typeof createContext>

export const t = initTRPC.context<Context>().create()
export const router = t.router
export const publicProcedure = t.procedure
export const privateProcedure = t.procedure
    .use(({next, ctx}) => {
        const { user } = ctx
        if (!user) throw new TRPCError({ code: 'UNAUTHORIZED' })
        
        return next({
            ctx: { user }
        })
    })

