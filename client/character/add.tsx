import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { trpc } from '../trpc.js'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

const characterFormSchema = z.object({
    name: z.string().nonempty(),
    tier: z.number().min(1).max(3)
})
type CharacterFormType = z.infer<typeof characterFormSchema>

export const CharacterAdd = () => {
    const navigate = useNavigate()

    const createCharacter = trpc.character.create.useMutation({
        onSuccess: () => {
            navigate('..')
        }
    })


    const { register, handleSubmit, formState: {errors} } = useForm<CharacterFormType>({
        resolver: zodResolver(characterFormSchema),
        defaultValues: {
            tier: 1
        }
    })

    const submit = (data: CharacterFormType) => {
        //console.log('Send', data)
        createCharacter.mutate(data)
    }
    console.log(errors)
    return <>
        <form className='flex-column' onSubmit={handleSubmit(submit)}>
            <input {...register('name', {required: true})}/>
            <div>{errors.name?.message}</div>

            <input {...register('tier', {required: true, valueAsNumber: true})}/>
            <div>{errors.tier?.message}</div>

            <button>Create</button>
        </form>
    </>
}