import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useLoaderData, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { trpc } from '../trpc.js'

import type { LoaderFunctionArgs } from 'react-router-dom'


const characterFormSchema = z.object({
    name: z.string(),
    tier: z.number().min(1).max(3)
})
type characterFormSchemaType = z.infer<typeof characterFormSchema>



export const characterEditLoader = ({ params }: LoaderFunctionArgs) => {
    return params.id || ''
}

export const CharacterEdit = () => {
    const id = useLoaderData() as string
    const navigate = useNavigate()
    const { data, isLoading } = trpc.character.get.useQuery({id})
    const updateCharacter = trpc.character.update.useMutation({
        onSuccess: () => {
            navigate('..')
        }
    })
    const deleteCharacter = trpc.character.delete.useMutation({
        onSuccess: () => {
            navigate('..')
        }
    })
    const addCharacter = trpc.user.addCharacter.useMutation()

    const { register, handleSubmit } = useForm<characterFormSchemaType>({
        resolver: zodResolver(characterFormSchema),
        values: {
            name: (data?.name) || '',
            tier: (data?.tier) ||  1
        }
    })

    const submit = (formData: characterFormSchemaType) => updateCharacter.mutate({id, ...formData})
    const deleteCharacterEvent = () => deleteCharacter.mutate({id})
    const addCharacterEvent = () => addCharacter.mutate({characterId: id})

    return <>
        <form onSubmit={handleSubmit(submit)}>
            <div>ID: { id }</div>
            <div>Name: <input {...register('name', { required: true })}/></div>
            <div>Tier: <input type='number' {...register('tier', { required: true, valueAsNumber: true })}/></div>
            <button type='submit'>Save</button>
        </form>
        <button onClick={deleteCharacterEvent}>Delete</button>
        <button onClick={addCharacterEvent}>Add to Account</button>
    </>
}