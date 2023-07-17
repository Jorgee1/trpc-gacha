import { useLoaderData } from 'react-router-dom'
import { trpc } from '../trpc.js'

import type { LoaderFunctionArgs } from 'react-router-dom'

export const characterEditLoader = ({ params }: LoaderFunctionArgs) => {
    return params.id || ''
}

export const CharacterEdit = () => {
    const id = useLoaderData() as string
    return <></>
}