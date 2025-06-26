import { useState, useContext } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { ChatsList } from "@/components/Chats/ChatList";
import { UserList } from "@/components/Chats/UserList";
import { Chat } from "@/components/Chats/Chat";
import { NavBarChats } from "@/components/Chats/NavBar";
import { ChatsProvider, ChatsContext } from "@/contexts/Chats";
import Header from "@/components/Header";
import Footer from "@/components/footer";
import { AnimatePresence } from "framer-motion";

export const Chats = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const chatIdMatch = location.pathname.match(/^\/Chats\/(\d+)$/);
  if (chatIdMatch) {
    const id = chatIdMatch[1];
    return <Navigate to={`/Chats/chat/${id}`} replace />;
  }

  return (
    <ChatsProvider>
      <div className="min-h-screen font-[Fredoka] bg-[#F4FCF1] relative">
        {/* Fondo decorativo */}

        {/* Encabezado */}
        <header className="sticky top-0 z-20 w-full h-20 flex items-center justify-between px-4 bg-[#F4FCF1] shadow-md">
          <Header />
          <button
            className="md:hidden p-2 rounded-md hover:bg-gray-200"
            onClick={() => setSidebarOpen(true)}
            aria-label="Abrir menú"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </header>

        <div className="flex flex-col md:flex-row">
          {/* Sidebar */}
          
            <NavBarChats isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />


          {/* Contenido principal */}
          <main
            className={`flex-1 p-4 md:p-6 transition-all duration-300 ${sidebarOpen ? "blur-sm pointer-events-none" : ""}`}
            onClick={() => sidebarOpen && setSidebarOpen(false)}
          >
            <Routes location={location} key={location.pathname}>
              {/* Inicio */}
              <Route
                path=""
                element={(() => {
                  const { chats } = useContext(ChatsContext);
                  const lastId = localStorage.getItem("lastChatId");
                  const chatExists = chats.some(c => c.id_chat === Number(lastId));

                  return chatExists && lastId ? (
                    <Navigate to={`chat/${lastId}`} replace />
                  ) : (
                    <AnimatePresence mode="wait">
                      <UserList />
                    </AnimatePresence>
                  );
                })()}
              />

              {/* Lista de chats */}
              <Route
                path="chats"
                element={
                  <AnimatePresence mode="wait">
                    <ChatsList />
                  </AnimatePresence>
                }
              />

              {/* Lista de usuarios */}
              <Route
                path="usuarios"
                element={
                  <AnimatePresence mode="wait">
                    <UserList />
                  </AnimatePresence>
                }
              />

              {/* Conversación individual */}
              <Route
                path="chat/:id_chat"
                element={
                  <AnimatePresence mode="wait">
                    <Chat />
                  </AnimatePresence>
                }
              />
            </Routes>
          </main>
        </div>

        <Footer />
      </div>
    </ChatsProvider>
  );
};
