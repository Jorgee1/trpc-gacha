import { useForm } from 'react-hook-form'
import { trpc } from './trpc.js'
import { useNavigate } from 'react-router-dom'

export const Register = () => {
    const navigate = useNavigate()
    type userForm = {
        username: string,
        password: string
    }

    const { register, handleSubmit } = useForm<userForm>()
    const createUser = trpc.user.create.useMutation({onSuccess: (user) => {
        navigate('/')
    }})

    const submit = (form: userForm) => {
        console.log(form)
        createUser.mutate(form)
    }

    return <>
        <form className="login" onSubmit={handleSubmit(submit)}>
            <h1>Register User</h1>
            <input {...register('username')} type="text"/>
            <input {...register('password')} type="password"/>
            <button>Register</button>
        </form>
    </>
}

