import { ChatsList } from "../../components/Chats/ChatList";
import { Routes, Route, useLocation } from "react-router-dom";
import { Chat } from "@/components/Chats/Chat";
import { UserList } from "@/components/Chats/UserList";
import { NavBarChats } from "@/components/Chats/NavBar";
import { ChatsProvider } from "@/contexts/Chats";
import Header from "@/components/Header";
import { AnimatePresence} from "framer-motion";
import FallingLeaves from "@/components/FallingLeaf";

export const Chats = () => {
  const location = useLocation();


  return (
    <section className="min-h-screen flex-1 flex flex-col p-4 gap-4 font-[fredoka] bg-gray-50">
        <div className="fixed inset-0 z-[0] pointer-events-none">
        <FallingLeaves quantity={20} />
      </div>
      <Header />
      .
      <NavBarChats />
      <ChatsProvider>
        <div className="flex-1 w-full relative overflow-hidden">
          <AnimatePresence mode="wait">
            <Routes key={location.pathname}>
              <Route path="" element={<ChatsList />} />
              <Route path="usuarios" element={<UserList />} />
              <Route path=":id_chat" element={<Chat />} />
            </Routes>
          </AnimatePresence>
        </div>
      </ChatsProvider>
    </section>
  );
};
