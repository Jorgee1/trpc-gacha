import {  useEffect } from 'react'
import { trpc } from './trpc.js'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from './auth.js'

export const LogIn = () => {
    type userForm = {
        username: string,
        password: string
    }
    
    const navigate = useNavigate()
    const { isAuth, logIn, logOut } = useAuth()
    const { register, handleSubmit } = useForm<userForm>()
    const createUser = trpc.user.logIn.useMutation({
        onSuccess: (result) => {
            result ? logIn(): logOut()
        }
    })

    const submit = (form: userForm) => {
        console.log(form)
        createUser.mutate(form)
    }


    useEffect(() => {
        if (isAuth) navigate('/')
    }, [isAuth])

    return <>
        <form className="login" onSubmit={handleSubmit(submit)}>
            <h1>Gacha tRPC</h1>
            <input {...register('username')} type="text"/>
            <input {...register('password')} type="password"/>
            <button>Sign In</button>
            <Link to="/register">Register</Link>
            {isAuth? <div>Logged In</div>: <></>}
        </form>
    </>

}