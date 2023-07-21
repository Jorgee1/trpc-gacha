import { z } from 'zod'
import { db } from '../db.js'
import { router, publicProcedure, privateProcedure } from '../trpc.js'
import { createUser, changePassword, checkPassword, deleteUser } from './index.js'

export const userRouter = router({
    list: privateProcedure
        .query(async () => await db.user.findMany()),
    create: publicProcedure
        .input(z.object({
            username: z.string(),
            password: z.string()
        }))
        .mutation(async ({ input }) => {
            const { username, password } = input
            return await createUser({username, password})
        }),
    changePassword: privateProcedure
        .input(z.object({
            password: z.string(),
            newPassword: z.string()
        }))
        .mutation(async ({input, ctx}) => {
            const { user } = ctx
            const { password, newPassword } = input

            return await changePassword({user, password, newPassword})
        }),
    deleteUser: publicProcedure
        .input(z.object({
            id: z.string()
        }))
        .mutation(async ({input}) => {
            const { id } = input
            return await deleteUser(id)
        }),
    logIn: publicProcedure
        .input(z.object({
            username: z.string(),
            password: z.string()
        }))
        .mutation(async ({input, ctx}) => {
            const { res } = ctx
            const { username, password } = input
            const user = await db.user.findUnique({where: {username}})
            if (!user) return false

            const logInResult = await checkPassword({ user, passwordToCheck: password})
            if (!logInResult) return false

            const oldSession = await db.session.findUnique({where: {userId: user.id}})
            if (oldSession) await db.session.delete({where: {userId: user.id}})
            
            const session = await db.session.create({data: {userId: user.id}})
            res.setCookie('token', session.token)

            return true
        }),
    logOut: publicProcedure
        .mutation(async ({ctx}) => {
            const { user } = ctx
            if (!user) return true
            
            await db.session.delete({where: {userId: user.id}})
            return true
        }),
    addCharacter: privateProcedure
        .input(z.object({characterId:z.string()}))
        .mutation(async ({input, ctx}) => {
            const { user } = ctx
            const { characterId } = input
            console.log('User:', user.id, 'Character:', characterId)
            const isCharacterOnPlayer = await db.charactersOnPlayer.findUnique({ where: {
                userId_characterId: {
                    characterId,
                    userId: user.id
                }
            }})

            if (isCharacterOnPlayer) return false

            console.log('HYAAAAAAAAAA')
            console.log('ASASDS', await db.charactersOnPlayer.create({data: {
                characterId,
                userId: user.id
            }}))

            return true
        }),
    getCharacters: privateProcedure
        .query(async ({ctx}) => {
            const { user } = ctx
            //return await db.character.findMany({where: {users: {some: {userId: user.id}}}})
            return await db.charactersOnPlayer.findMany({where: {userId: user.id}, include: {character: true}})
        }),
    whoami: publicProcedure.query(async ({ctx}) => ctx.user || null)
})