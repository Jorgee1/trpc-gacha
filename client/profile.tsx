import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { trpc } from './trpc.js'

export const Profile = () => {
    const { data, isLoading } = trpc.user.whoami.useQuery()
    const [ result, setResult ] = useState('')

    type changePasswordForm = {
        password: string
        newPassword: string,
        newPasswordConfirmation: string
    }
    const { register, handleSubmit, formState: {errors}, setError, reset } = useForm<changePasswordForm>()
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
                    <input {...register('password', {required: true})} type="text" />
                </label>

                { errors.password?.type === 'required' && <div>Required</div> }
            </div>

            <div>
                <label>
                    <div>New Password</div>
                    <input {...register('newPassword', {required: true})} type="text"/>
                </label>

                { errors.newPassword?.type === 'required' && <div>Required</div> }
            </div>

            <div>
                <label>
                    <div>New Password</div>
                    <input {...register('newPasswordConfirmation', {required: true})} type="text" />
                </label>

                { errors.newPasswordConfirmation?.type === 'required' && <div>Required</div> }
                { errors.newPasswordConfirmation?.type === 'value' && <div>Must be the same as new password</div> }
            </div>

            <button>Save</button>

            {result? <div>{result}</div>:<></>}
        </form>
    </>
}