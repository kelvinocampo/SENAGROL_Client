import { useState } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { ChatsList } from "../../components/Chats/ChatList";
import { UserList } from "@/components/Chats/UserList";
import { Chat } from "@/components/Chats/Chat";
import { NavBarChats } from "@/components/Chats/NavBar";
import { ChatsProvider } from "@/contexts/Chats";
import { useContext } from "react";
import { ChatsContext } from "@/contexts/Chats";
import Header from "@/components/Header";
import Footer from "@/components/footer";
import { AnimatePresence } from "framer-motion";
import FallingLeaves from "@/components/FallingLeaf";

export const Chats = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Redirección si la ruta es /Chats/3 → /Chats/chat/3
  const chatIdMatch = location.pathname.match(/^\/Chats\/(\d+)$/);
  if (chatIdMatch) {
    const id = chatIdMatch[1];
    return <Navigate to={`/Chats/chat/${id}`} replace />;
  }

  return (
    <div className="min-h-screen font-[fredoka] bg-gray-50 relative">
      {/* Fondo decorativo */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <FallingLeaves quantity={20} />
      </div>

      {/* Header */}
      <div className="sticky top-0 z-20 w-full bg-gray-50 shadow-md h-16 flex items-center justify-between px-4">
        <Header />
        <button
          className="md:hidden p-2 rounded-md hover:bg-gray-200 transition"
          onClick={() => setSidebarOpen(true)}
          aria-label="Abrir menú"
        >
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Sidebar y contenido */}
      <div className="flex">
        {/* Sidebar */}
        <div
          className={`
            fixed left-0 z-30 w-60 bg-white shadow-md
            transform transition-transform duration-300 ease-in-out
            md:relative md:translate-x-0 md:h-[calc(100vh-4rem)] md:top-16 md:z-10
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
            top-16 h-[calc(100vh-4rem)]
          `}
        >
          {/* Botón cerrar sidebar en móvil */}
          <div className="flex justify-end p-2 md:hidden">
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1 rounded-md hover:bg-gray-200"
              aria-label="Cerrar menú"
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <NavBarChats isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        </div>

        {/* Contenido principal */}
        <div
          className={`flex-1 p-6 relative z-10 md:ml-60 ${sidebarOpen ? "pointer-events-none filter blur-sm" : ""}`}
          onClick={() => sidebarOpen && setSidebarOpen(false)}
        >
          <ChatsProvider>
            <Routes location={location} key={location.pathname}>
              {/* Redirige a último chat si hay uno en localStorage */}
              <Route
                path=""
                element={(() => {
                  const { chats } = useContext(ChatsContext);
                  const lastId = localStorage.getItem("lastChatId");
                  const chatExists = chats.some(chat => chat.id_chat === Number(lastId));

                  return chatExists && lastId
                    ? <Navigate to={`chat/${lastId}`} replace />
                    : (
                      <AnimatePresence mode="wait">
                        <ChatsList />
                      </AnimatePresence>
                    );
                })()}
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
          </ChatsProvider>
        </div>
      </div>

      <Footer />
    </div>
  );
};
