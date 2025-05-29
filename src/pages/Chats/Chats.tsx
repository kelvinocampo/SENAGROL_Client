import { ChatsList } from "../../components/Chats/ChatList"
import { Routes, Route } from "react-router-dom"
import { Chat } from "@/components/Chats/Chat";
import { UserList } from "@/components/Chats/UserList";
import { NavBarChats } from "@/components/Chats/NavBar";

export const Chats = () => {
    return (
        <section className='min-h-screen flex-1 flex flex-col items-center p-4 gap-4 font-[fredoka] bg-gray-50'>
            <NavBarChats />
            <Routes>
                <Route path="" element={<ChatsList />} />
                <Route path="usuarios" element={<UserList />} />
                <Route path="/:id_chat" element={<Chat />} />
            </Routes>
        </section>
    )
}
