import { z } from 'zod'
import { db } from '../db.js'
import { privateProcedure, router } from '../trpc.js'


const getRandom = <T>(list: T[]) => {
    const length = list.length

    const index = Math.floor(Math.random() * length)

    return list[index]
}


export const pullRouter = router({
    rollOnBanner: privateProcedure
        .input(z.object({
            bannerId: z.string()
        }))
        .mutation(async ({ input, ctx }) => {
            const { user } = ctx
            const { bannerId } = input
            const banner = await db.banner.findUnique({
                where: {id: bannerId, AND: {isActive: true}},
                include: {characters: {include: {character: true}}}
            })
            if (!banner) return null

            if (!banner.characters.length) return null

            const character = getRandom(banner.characters).character

            const isCharacterOnBanner = await db.charactersOnPlayer.findUnique({where: {userId_characterId: {userId: user.id, characterId: character.id}}})

            if (isCharacterOnBanner) {
                await db.charactersOnPlayer.update({where: {
                    userId_characterId: {userId: user.id, characterId: character.id}},
                    data: {repeats: isCharacterOnBanner.repeats +1}
                })
            } else {
                await db.charactersOnPlayer.create({data: {userId: user.id, characterId: character.id}})
            }

            return character
        })
})