import { trpc } from './trpc.js'

import type { User } from '@prisma/client'

export const UserListView = () => {

    const UserList = () => {
        const { data, isLoading, refetch } = trpc.user.list.useQuery()
        const deleteUser = trpc.user.deleteUser.useMutation({
            onSuccess: () => refetch()
        })
        const click = (id: string) => deleteUser.mutate({id})


        const UserElement = ({user}: {user: User}) => {
            const { id, username } = user
            return <div>{ username } <button onClick={() => click(id)}>Delete</button></div>
        }

        if (isLoading) return <></>

        return <div>
            { data?.map((e, i) => <UserElement key={i} user={e}/>) }
        </div>
    }

    return <>
        <UserList/>
    </>
}