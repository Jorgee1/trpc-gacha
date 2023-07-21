import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { trpc } from '../trpc.js'


const bannerFormSchema = z.object({
    name: z.string()
})
type BannerFormType = z.infer<typeof bannerFormSchema>

export const BannerAdd = () => {
    const navigate = useNavigate()
    const { register, handleSubmit } = useForm<BannerFormType>({resolver: zodResolver(bannerFormSchema)})
    const createBanner = trpc.banner.create.useMutation({ onSuccess: () => navigate('..') })

    const submit = (formData: BannerFormType) => {
        createBanner.mutate(formData)
    }

    return <>
        <h1>ADD</h1>
        <form onSubmit={handleSubmit(submit)}>
            <input {...register('name')}/>
            <button>Save</button>
        </form>
    </>
}