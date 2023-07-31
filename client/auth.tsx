import { useState, useEffect, useRef } from 'react'
import { createContext, useContext } from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { trpc } from './trpc.js'

const context = { isAuth: false, logIn: () => {}, logOut: () => {} }

const auth = createContext(context)

export const AuthProvider = ({children}: {children: JSX.Element}) => {
    const localIsAuth = window.localStorage.getItem('isAuth')

    let [isAuth, setAuth] = useState(localIsAuth === 't' ? true: false)
    const logIn = () => {
        window.localStorage.setItem('isAuth', 't')
        setAuth(true)
    }
    const logOut = () => {
        window.localStorage.setItem('isAuth', 'f')
        setAuth(false)
    }

    const context = { isAuth, logIn, logOut }

    return <auth.Provider value={context}>
        { children }
    </auth.Provider>
}
export const useAuth = () => useContext(auth)

export const ProtectedView = () => {
    const { isAuth, logIn, logOut } = useAuth()
    const { isLoading, data, isSuccess,  } = trpc.user.whoami.useQuery(undefined,{cacheTime: 0, refetchInterval: 1000})

    useEffect(() => {
        if (isSuccess && !data) logOut()
    }, [isSuccess])

    if (isLoading) return 'Loading'

    return isAuth? <Outlet/>: <Navigate to='/login'/>
}

