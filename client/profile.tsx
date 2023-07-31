import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { trpc } from './trpc.js'


const changePasswordFormSchema = z.object({
    password: z.string().min(1),
    newPassword: z.string().min(1),
    newPasswordConfirmation: z.string().min(1)
}).refine(({newPassword, newPasswordConfirmation}) => newPassword === newPasswordConfirmation, {
    path: ['newPasswordConfirmation'],
    message: 'Passwords don\'t match'
})

type changePasswordForm = z.infer<typeof changePasswordFormSchema>


export const Profile = () => {
    const { data, isLoading } = trpc.user.whoami.useQuery()
    const [ result, setResult ] = useState('')

    const { register, handleSubmit, formState: {errors}, setError, reset } = useForm<changePasswordForm>({
        resolver: zodResolver(changePasswordFormSchema)
    })
    const changePassword = trpc.user.changePassword.useMutation({
        onSuccess: (status) => {
            if (status) setResult('Password Changed')
            else setResult('Password Error')
            reset()
        }
    })


    const submit = (formData: changePasswordForm) => {
        if (formData.newPassword !== formData.newPasswordConfirmation) {
            setError('newPasswordConfirmation', {type: 'value'})
            return
        }
        changePassword.mutate(formData)
    }

    return <>
        <h1>Profile</h1>
        <div className='text-center'>Username: { data?.username }</div>
        <form className='changePassword' onSubmit={handleSubmit(submit)}>
            <div>
                <label>
                    <div>Password</div>
                    <input {...register('password')} type="text" />
                </label>

                { errors.password && <div>{errors.password.message}</div> }
            </div>

            <div>
                <label>
                    <div>New Password</div>
                    <input {...register('newPassword')} type="text"/>
                </label>

                { errors.newPassword && <div>{errors.newPassword.message}</div> }
            </div>

            <div>
                <label>
                    <div>New Password</div>
                    <input {...register('newPasswordConfirmation')} type="text" />
                </label>

                { errors.newPasswordConfirmation && <div>{errors.newPasswordConfirmation.message}</div> }

            </div>

            <button>Save</button>

            {result? <div>{result}</div>:<></>}
        </form>
    </>
}