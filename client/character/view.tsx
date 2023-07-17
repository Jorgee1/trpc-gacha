import { Link } from 'react-router-dom'
import { trpc } from '../trpc.js'

export const CharacterView = () => {
    const { data, isLoading } = trpc.character.list.useQuery()



    
    return <>
        <Link to="add">Add</Link>
        {data?.map(e => <div>{e.name}</div>)}
    </>
}