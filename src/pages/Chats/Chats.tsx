import { useState } from "react";
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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen font-[fredoka] bg-gray-50 relative">
      {/* Fondo animado */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <FallingLeaves quantity={20} />
      </div>

      {/* Header fijo arriba, ocupa todo el ancho */}
      <div className="sticky top-0 z-20 w-full bg-gray-50 shadow-md h-16 flex items-center justify-between px-4">
        <Header />

        {/* Botón para abrir sidebar en móvil */}
        <button
          className="md:hidden p-2 rounded-md hover:bg-gray-200 transition"
          onClick={() => setSidebarOpen(true)}
          aria-label="Abrir menú"
        >
          <svg
            className="w-6 h-6 text-gray-700"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
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
          {/* Botón para cerrar sidebar en móvil */}
          <div className="flex justify-end p-2 md:hidden">
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1 rounded-md hover:bg-gray-200"
              aria-label="Cerrar menú"
            >
              <svg
                className="w-6 h-6 text-gray-700"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
         <NavBarChats isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        </div>

        {/* Contenido principal */}
        <div
          className={`flex-1 p-6 relative z-10
            md:ml-60
            ${sidebarOpen ? "pointer-events-none filter blur-sm" : ""}
          `}
          onClick={() => sidebarOpen && setSidebarOpen(false)}
        >
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
