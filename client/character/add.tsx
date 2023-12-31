import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { trpc } from '../trpc.js'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

const characterFormSchema = z.object({
    name: z.string().min(1, {message: 'Required'}),
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
            <input {...register('name')}/>
            { errors.name && <div>{errors.name?.message}</div> }

            <input type='number' {...register('tier', {valueAsNumber: true})}/>
            { errors.tier && <div>{errors.tier?.message}</div> }

            <button>Create</button>
        </form>
    </>
}