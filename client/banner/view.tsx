import { Link } from 'react-router-dom'
import { trpc } from '../trpc.js'

export const BannerView = () => {
    const { data, refetch } = trpc.banner.list.useQuery()

    return <>
        <h1>Banners</h1>
        <Link to='add'>Add</Link>
        { data?.map((e, i) => <div key={i}>{e.name} <Link to={`edit/${e.id}`}>Edit</Link></div>) }
    </>
}

