import { router } from './trpc.js'
import { userRouter } from './user/routes.js'
import { characterRouter } from './character/routes.js'
import { bannerRouter } from './banner/routes.js'
import { pullRouter } from './pull/routes.js'

export const appRouter = router({
    user: userRouter,
    character: characterRouter,
    banner: bannerRouter,
    pull: pullRouter
})

export type AppRouter = typeof appRouter