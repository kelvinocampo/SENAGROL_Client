import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChatsList } from "@/components/Chats/ChatList";

interface NavBarChatsProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NavBarChats = ({ isOpen, onClose }: NavBarChatsProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showChatsList, setShowChatsList] = useState(false);

  const isActive = (route: string) => location.pathname.includes(route);

  return (
    <>
      {/* Fondo oscuro móvil */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black bg-opacity-30 z-40 md:hidden transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!isOpen}
      />

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full max-w-xs bg-white z-50 p-4 shadow-lg rounded-r-lg space-y-4 transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          md:static md:translate-x-0 md:rounded-none md:shadow-none md:h-auto md:w-[300px] md:min-h-full md:block
        `}
      >
        {/* Botón cerrar en móvil */}
        <div className="flex justify-end md:hidden">
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-gray-200"
            aria-label="Cerrar menú"
          >
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Botón Usuarios */}
        <motion.div layout>
          <button
            onClick={() => {
              navigate("/Chats/usuarios");
              setShowChatsList(false);
              onClose();
            }}
            className={`block w-full text-center px-4 py-2 rounded-md font-semibold transition-colors duration-300 ${
              isActive("usuarios")
                ? "bg-[#379E1B] text-white"
                : "bg-[#48BD28] text-white hover:bg-[#379E1B]"
            }`}
          >
            Usuarios
          </button>
        </motion.div>

        {/* Botón desplegable de Chats */}
        <motion.div layout>
          <button
            onClick={() => setShowChatsList(prev => !prev)}
            className={`block w-full text-center px-4 py-2 rounded-md font-semibold transition-colors duration-300 ${
              isActive("chats") && !isActive("usuarios")
                ? "bg-[#379E1B] text-white"
                : "bg-[#48BD28] text-white hover:bg-[#379E1B]"
            }`}
          >
            Chats ▾
          </button>

          {/* Lista desplegable */}
          <AnimatePresence initial={false}>
            {showChatsList && (
              <motion.div
                key="chatsContent"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-2 bg-green-50 rounded-lg max-h-[300px] overflow-auto relative"
              >
                <ChatsList />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </aside>
    </>
  );
};
