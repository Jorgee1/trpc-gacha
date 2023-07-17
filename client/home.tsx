import { useAuth } from './auth.js'
import { trpc } from './trpc.js'
import { Link } from 'react-router-dom'


export const Home = () => {

    const User = () => {
        const { isAuth, logOut } = useAuth()
        const { data, isSuccess } = trpc.user.whoami.useQuery()
        const logOutRequest = trpc.user.logOut.useMutation({
            onSuccess: () => logOut()
        })

        return <nav>
            { isSuccess? <div>{ data?.username }</div>: <></> }
            <Link to={'/profile'}>Profile</Link>
            <button onClick={() => logOutRequest.mutate()}>Logout</button>
        </nav>
    }



    return <>
        <h1>Home</h1>
        <User/>
        <div>
            <Link to='/user'>User *Admin*</Link>
            <Link to='/character'>Character</Link>
        </div>
        
    </>
}