import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { trpc } from './trpc.js'
import { useNavigate } from 'react-router-dom'


const userFormSchema = z.object({
    username: z.string().min(1, {message: 'required'}),
    password: z.string().min(1, {message: 'required'}),
    confirmPassword: z.string().min(1, {message: 'required'})
}).refine(({password, confirmPassword}) => password === confirmPassword,
    {path: ['confirmPassword'], message:  'Passwords don\'t match'}
)

type UserFormType = z.infer<typeof userFormSchema>

export const Register = () => {
    const navigate = useNavigate()

    const { register, handleSubmit, formState: {errors} } = useForm<UserFormType>({
        resolver: zodResolver(userFormSchema)
    })
    const createUser = trpc.user.create.useMutation({onSuccess: (user) => navigate('/')})

    const submit = (form: UserFormType) => createUser.mutate(form)

    return <>
        <form className="login" onSubmit={handleSubmit(submit)}>
            <h1>Register User</h1>

            <input {...register('username')} placeholder='Username' type="text"/>
            { errors.username && <div>{errors.username?.message}</div> }

            <input {...register('password')} placeholder='Password' type="password"/>
            { errors.password && <div>{errors.password?.message}</div> }

            <input {...register('confirmPassword')} placeholder='Password' type="password"/>
            { errors.confirmPassword && <div>{errors.confirmPassword?.message}</div> }

            <button>Register</button>
        </form>
    </>
}

