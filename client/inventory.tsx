import { trpc } from './trpc.js'

export const Inventory = () => {
    const { isLoading, data } = trpc.user.getCharacters.useQuery()
    
    return <>
        { data?.map(e => {
            
            return <div key={e.character.id} >{e.character.name} - {e.character.tier} - Repeats {e.repeats}</div>
        }) }
    </>
}