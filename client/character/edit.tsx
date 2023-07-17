import { useLoaderData } from 'react-router-dom'
import { trpc } from '../trpc.js'

import type { LoaderFunctionArgs } from 'react-router-dom'

export const characterEditLoader = ({ params }: LoaderFunctionArgs) => {
    return params.id || ''
}

export const CharacterEdit = () => {
    const id = useLoaderData() as string

    const { data, isLoading } = trpc.character.get.useQuery({id})

    return <form>
        <div>ID: { id }</div>
        <div>Name: { data?.name }</div>
        <div>Tier: { data?.tier }</div>
    </form>
}