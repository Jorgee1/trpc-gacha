import { useState, type ReactElement } from 'react'
import { useLoaderData } from 'react-router-dom'
import { trpc } from '../trpc.js'
import type { LoaderFunctionArgs } from 'react-router-dom'
import type { Character } from '@prisma/client'

export const pullLoader = ({ params }: LoaderFunctionArgs) => params.id || ''

export const PullView = () => {
    const id = useLoaderData() as string
    const [state, setState] = useState(false)
    const [characterResult, setCharacter] = useState<Character>()

    const { data } = trpc.banner.get.useQuery({id, characters: true})
    const charcaterPull = trpc.pull.rollOnBanner.useMutation({
        onSuccess: (data) => {
            setCharacter(data as Character)
            console.log(data)
            setState(true)
        }
    })

    let view: ReactElement

    const restState = () => {
        setCharacter(undefined)
        setState(false)
    }

    if (!state) {
        view = <>
            PULL {id}
            <button onClick={() => charcaterPull.mutate({bannerId: id})}>Pull</button>
            {data?.characters.map((e, i) => <div key={i}>{e.character.name}</div>)}
        </>
    } else {
        view = <>
            result {characterResult?.name}
            <button onClick={restState}>Ok</button>
        </>
    }

    return view
}