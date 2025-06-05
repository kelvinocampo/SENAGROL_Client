import { ChatsList } from "../../components/Chats/ChatList";
import { Routes, Route, useLocation } from "react-router-dom";
import { Chat } from "@/components/Chats/Chat";
import { UserList } from "@/components/Chats/UserList";
import { NavBarChats } from "@/components/Chats/NavBar";
import { ChatsProvider } from "@/contexts/Chats";
import Header from "@/components/Header";
import { AnimatePresence } from "framer-motion";
import FallingLeaves from "@/components/FallingLeaf";

export const Chats = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen font-[fredoka] bg-gray-50 relative">
      {/* Fondo animado */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <FallingLeaves quantity={20} />
      </div>

      {/* Header fijo arriba */}
      <div className="sticky top-10 z-20 ml-60">
        <Header />
      </div>

      {/* Layout principal: Sidebar + contenido */}
      <div className="flex">
        {/* Sidebar */}
        <div className="w-60 h-[calc(100vh-4rem)] sticky top-[4rem] z-10">
          {/* Asegúrate de que el Header mide 4rem de alto */}
          <NavBarChats />
        </div>

        {/* Contenido principal */}
        <div className="flex-1 p-6 relative z-10">
          <ChatsProvider>
            <Routes location={location} key={location.pathname}>
              <Route
                path=""
                element={
                  <AnimatePresence mode="wait">
                    <ChatsList />
                  </AnimatePresence>
                }
              />
              <Route
                path="usuarios"
                element={
                  <AnimatePresence mode="wait">
                    <UserList />
                  </AnimatePresence>
                }
              />
              <Route
                path=":id_chat"
                element={
                  <AnimatePresence mode="wait">
                    <Chat />
                  </AnimatePresence>
                }
              />
            </Routes>
          </ChatsProvider>
        </div>
      </div>
    </div>
  );
};
