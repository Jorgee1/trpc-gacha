import { z } from 'zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'

import { trpc } from './trpc.js'
import { useAuth } from './auth.js'

const UserFormSchema = z.object({
    username: z.string().min(1, {message: 'Required'}),
    password: z.string().min(1, {message: 'Required'})
})

type userForm = z.infer<typeof UserFormSchema>


export const LogIn = () => {
    
    const navigate = useNavigate()
    const { isAuth, logIn, logOut } = useAuth()
    const { register, handleSubmit, setError, formState: {errors} } = useForm<userForm>({
        resolver: zodResolver(UserFormSchema)
    })
    const createUser = trpc.user.logIn.useMutation({
        cacheTime: 0,
        onSuccess: (result) => {
            if (result) logIn()
            else setError('root', {type: 'value', message: 'Unable to loggin'})
        }
    })

    const submit = (form: userForm) => createUser.mutate(form)


    useEffect(() => {
        if (isAuth) navigate('/')
    })

    return <>
        <form className="login" onSubmit={handleSubmit(submit)}>
            <h1>Gacha tRPC</h1>
            
            <input {...register('username')} placeholder='Username' type='text'/>
            { errors.username && <div>{errors.username.message}</div> }

            <input {...register('password')} placeholder='Password' type='password'/>
            { errors.password && <div>{errors.password.message}</div> }

            <button>Sign In</button>
            <Link to="/register">Register</Link>
            { errors.root && <div>{errors.root.message}</div> }
            
        </form>
    </>

}