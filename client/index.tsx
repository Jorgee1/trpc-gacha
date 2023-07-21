import { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { httpBatchLink } from '@trpc/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider, ProtectedView } from './auth.js'
import { trpc } from './trpc.js'
import { LogIn } from './login.js'
import { Home } from './home.js'
import { UserListView } from './user.js'
import { CharacterView } from './character/view.js'
import { CharacterAdd } from './character/add.js'
import { CharacterEdit, characterEditLoader } from './character/edit.js'
import { Register } from './register.js'
import { Profile } from './profile.js'
import { Inventory } from './inventory.js'
import { BannerView } from './banner/view.js'
import { BannerAdd } from './banner/add.js'
import { BannerEdit, bannerEditLoader } from './banner/edit.js'
import { PullView, pullLoader } from './pull/view.js'
import './media/index.css'



const App = () => {
    const [trpcClient] = useState(() => trpc.createClient({ links: [ httpBatchLink({ url: '/trpc' }) ] }))
    const [queryClient] = useState(() => new QueryClient())

    const router = createBrowserRouter([
        {
            path: '/',
            element: <ProtectedView/>,
            children: [{
                path: '',
                element: <Home/>
            }]

        },
        {
            path: '/character',
            element: <ProtectedView/>,
            children: [
                {
                    path: '',
                    element: <CharacterView/>
                },
                {
                    path: 'add',
                    element: <CharacterAdd/>
                },
                {
                    path: 'edit/:id',
                    loader: characterEditLoader,
                    element: <CharacterEdit/>
                }
            ]
        },
        {
            path: '/user',
            element: <ProtectedView/>,
            children: [{
                path: '',
                element: <UserListView/>
            }]
        },
        {
            path: '/profile',
            element: <ProtectedView/>,
            children: [{
                path: '',
                element: <Profile/>
            }]
        },
        {
            path: '/inventory',
            element: <ProtectedView/>,
            children: [{
                path: '',
                element: <Inventory/>
            }]
        },
        {
            path: '/banner',
            element: <ProtectedView/>,
            children: [
                {
                    path: '',
                    element: <BannerView/>
                },
                {
                    path: 'add',
                    element: <BannerAdd/>
                },
                {
                    path: 'edit/:id',
                    element: <BannerEdit/>,
                    loader: bannerEditLoader
                }
            ]
        },
        {
            path: '/pull',
            element: <ProtectedView/>,
            children: [{
                path: ':id',
                element: <PullView/>,
                loader: pullLoader
            }]
        },
        {
            path: '/login',
            element: <LogIn/>
        },
        {
            path: '/register',
            element: <Register/>
        }
    ])

    return <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <RouterProvider router={router}/>
            </AuthProvider>
        </QueryClientProvider>
    </trpc.Provider>
}


const main = () => {
    const root = document.createElement('div')
    document.body.appendChild(root)
    createRoot(root).render(<App/>)
}
main()