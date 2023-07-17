import { createTRPCReact } from '@trpc/react-query'
import type { AppRouter } from '../src/routes.js'


export const trpc = createTRPCReact<AppRouter>()
