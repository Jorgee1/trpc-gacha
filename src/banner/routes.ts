import { z } from 'zod'
import { db } from '../db.js'
import { privateProcedure, router } from '../trpc.js'

export const bannerRouter = router({
    create: privateProcedure
        .input(z.object({name: z.string(), isActive: z.boolean().default(false)}))
        .mutation(async ({input}) => await db.banner.create({data: input})),
    delete: privateProcedure
        .input(z.object({id: z.string()}))
        .mutation(async ({input}) => {
            await db.charactersOnBanners.deleteMany({where: {bannerId: input.id}})
            return await db.banner.delete({where: input})
        }),
    update: privateProcedure
        .input(z.object({id: z.string(), name: z.string(), isActive: z.boolean()}))
        .mutation(async ({input}) => {
            const { id, name, isActive } = input
            return await db.banner.update({where: {id}, data: {name, isActive}})
        }),
    get: privateProcedure
        .input(z.object({id: z.string(), characters: z.boolean().default(false)}))
        .query(async ({input}) => {
            const { id, characters } = input
            return await db.banner.findUnique({where: {id}, include: {characters: {include: {character: characters}}}})
        }),
    list: privateProcedure
        .query(async () => await db.banner.findMany()),
    getActiveBanners: privateProcedure
        .query(async () => await db.banner.findMany({where: {isActive: true}})),
    getCharacters: privateProcedure
        .input(z.object({id: z.string()}))
        .query(async ({input}) => {
            const { id } = input
            return await db.character.findMany({where: {banners: {some: {bannerId: id}}}})
        }),
    addCharacter: privateProcedure
        .input(z.object({bannerId: z.string(), characterId: z.string()}))
        .mutation(async ({input}) => {
            const isCharacterOnBanner = await db.charactersOnBanners.findUnique({where: {bannerId_characterId: input}})
            if (isCharacterOnBanner) return false

            await db.charactersOnBanners.create({data: input})
            return true
        }),
    deleteCharacter: privateProcedure
        .input(z.object({bannerId: z.string(), characterId: z.string()}))
        .mutation(async ({input}) => await db.charactersOnBanners.delete({where: {bannerId_characterId: input}}))
})