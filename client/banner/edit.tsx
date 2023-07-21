import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useLoaderData, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { trpc } from '../trpc.js'

import type { LoaderFunctionArgs } from 'react-router-dom'

const bannerFormSchema = z.object({
    name: z.string(),
    isActive: z.boolean()
})
type BannerFormType = z.infer<typeof bannerFormSchema>

export const bannerEditLoader = ({ params }: LoaderFunctionArgs) => params.id || ''

export const BannerEdit = () => {
    const id = useLoaderData() as string
    const navigate = useNavigate()

    const { data } = trpc.banner.get.useQuery({id})

    const updateBanner = trpc.banner.update.useMutation()
    const deleteBanner = trpc.banner.delete.useMutation({onSuccess: () => navigate('..')})

    const { register, handleSubmit } = useForm<BannerFormType>({
        resolver: zodResolver(bannerFormSchema),
        values: {
            name: data?.name || '',
            isActive: data?.isActive || false
        }
    })

    const submit = (formData: BannerFormType) => {
        updateBanner.mutate({id, ...formData})
    }


    const CharactersList = ({id}:{id:string}) => {
        const characterAddSchema = z.object({
            characterId: z.string()
        })
        type CharacterAddSchema = z.infer<typeof characterAddSchema>

        const { data, refetch } = trpc.banner.getCharacters.useQuery({id})
        
        const characterQuery = trpc.character.list.useQuery()

        const addCharacter = trpc.banner.addCharacter.useMutation({
            onSuccess: () => {
                reset()
                refetch()
            }
        })
        const removeCharacter = trpc.banner.deleteCharacter.useMutation({
            onSuccess: () => {
                reset()
                refetch()
            }
        })
        const { register, handleSubmit, reset } = useForm<CharacterAddSchema>()

        const submit = ({ characterId }: CharacterAddSchema) => {
            addCharacter.mutate({bannerId: id, characterId})
        }

        const removeCharacterEvent = (characterId: string) => {
            removeCharacter.mutate({bannerId: id, characterId})
        }

        return <>
            <h2>Add Character</h2>
            <form onSubmit={handleSubmit(submit)}>
                <select {...register('characterId')}>
                    <option value=""></option>
                    { characterQuery.data?.map((e, i) => <option key={i} value={e.id}>{e.name}</option>) }
                </select>
                <button>Save</button>
            </form>
            {data?.map((e,i) => <div key={i}>{e.name} - {e.tier} <button onClick={() => removeCharacterEvent(e.id)}>Remove</button></div>)}
        </>
    }

    return <>
        <h1>{data?.name}</h1>
        <form onSubmit={handleSubmit(submit)}>
            <div>
                <label>Name</label>
                <input {...register('name')}/>
            </div>
            <div>
                <label>Active</label>
                <input type="checkbox" {...register('isActive')}/>
            </div>
            
            <button>Save</button>
        </form>
        <button onClick={() => deleteBanner.mutate({id})}>Delete</button>
        <CharactersList id={id}/>
    </>
}


