import { router } from './trpc.js'
import { userRouter } from './user/routes.js'
import { characterRouter } from './character/routes.js'

export const appRouter = router({
    user: userRouter,
    character: characterRouter
})

export type AppRouter = typeof appRouter