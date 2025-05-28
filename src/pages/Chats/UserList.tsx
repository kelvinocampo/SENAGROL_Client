import { ChatService } from "@/services/Chats/ChatService"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

export const UserList = () => {
    const navigate = useNavigate()
    const [users, setUsers] = useState<any[]>([])
    const handleClickUser = async (id_user2: number) => {
        const { chat } = await ChatService.getChat(id_user2);
        navigate(`/chat/${chat}`)
    }
    useEffect(() => {
        const fetchUsers = async () => {
            const result = await ChatService.getUsers()
            console.log(result);
            setUsers(result)
        }
        fetchUsers()
    }, [])
    return (
        <section>
            <h2>Lista de Usuarios</h2>
            <ul className="flex w-full flex-col gap-4">
                {users.map((user) => (
                    <li className="flex justify-between w-full border p-2" onClick={() => handleClickUser(user.id_usuario)} key={user.id_usuario}>
                        <span>{user.nombre_usuario}</span>
                        <span>{user.roles}</span>
                    </li>
                ))}
            </ul>
        </section>
    )
}
