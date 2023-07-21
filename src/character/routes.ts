import { z } from 'zod'
import { db } from '../db.js'
import { router, privateProcedure, publicProcedure } from '../trpc.js'

export const characterRouter = router({
    list: privateProcedure
        .query(async () => await db.character.findMany()),
    create: privateProcedure
        .input(z.object({
            name: z.string(),
            tier: z.number()
        }))
        .mutation(async ({input}) => await db.character.create({data: input})),
    delete: privateProcedure
        .input(z.object({id: z.string()}))
        .mutation(async ({input}) => await db.character.delete({where: input})),
    get: privateProcedure
        .input(z.object({id: z.string()}))
        .query(async ({input}) => await db.character.findUnique({where: input})),
    update: privateProcedure
        .input(z.object({
            id: z.string(),
            name: z.string(),
            tier: z.number().min(1).max(3)
        }))
        .mutation(async ({input}) => {
            const {id, name, tier} = input
            return await db.character.update({where: {id}, data: {name, tier}})
        })
})