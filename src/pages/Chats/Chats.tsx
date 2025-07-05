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
import FallingLeaves from "@/components/FallingLeaf";

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

      <div className="min-h-screen flex flex-col ] font-[Fredoka]">
        <div className="fixed inset-0 pointer-events-none z-0">
          <FallingLeaves quantity={20} />
        </div>
        {/* Header */}
        <Header />

        {/* Botón para abrir el menú en móvil */}
        <div className="md:hidden px-4 pt-2">
          <button
            className="p-2 rounded-md hover:bg-gray-200"
            onClick={() => setSidebarOpen(true)}
            aria-label="Abrir menú"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Contenido principal con flex y responsividad */}
        <div className="flex flex-1 flex-col md:flex-row px-4 md:px-10 pt-4 gap-4 pb-2">
          {/* Sidebar */}
          <div className="w-full md:w-[280px] lg:w-[300px]">
            <NavBarChats isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          </div>

          {/* Main content area */}
          <main className="flex-1 min-h-0 overflow-hidden rounded-xl transition-all duration-300">
            <Routes location={location} key={location.pathname}>
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
              <Route
                path="chats"
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

        {/* Footer */}
        <footer className="mt-auto w-full border-t border-black/10 bg-white">
          <Footer />
        </footer>
      </div>
    </ChatsProvider>
  );
};
