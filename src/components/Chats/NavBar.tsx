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
      {/* Fondo oscuro en móvil */}
      <div
        onClick={onClose}
        className={`inset-0 bg-black bg-opacity-30 z-40 md:hidden transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      <aside
        className={`
          max-w-xs 
          bg-white rounded-lg shadow-md p-4 space-y-4 transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:static md:translate-x-0 md:h-full mb-100 md:w-100 md:rounded-none md:shadow-none 
          overflow-visible z-10
        `}
      >
        {/* Botón cerrar (solo móvil) */}
        <button
          onClick={onClose}
          className="md:hidden self-end mb-2 p-1 rounded-md hover:bg-gray-200"
        >
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Botón USUARIOS */}
        <motion.div layout>
          <button
            onClick={() => {
              navigate("/Chats/usuarios");
              setShowChatsList(false);
              onClose();
            }}
            className={`block w-full text-left px-4 py-2 rounded-md font-semibold transition-colors duration-300 ${
              isActive("usuarios")
                ? "bg-[#6dd850] text-white"
                : "bg-[#e4fbdd] text-black hover:bg-[#caf5bd]"
            }`}
          >
            Usuarios
          </button>
        </motion.div>

        {/* Botón CHATS desplegable */}
        <motion.div layout>
          <button
            onClick={() => setShowChatsList(prev => !prev)}
            className={`w-full text-left px-4 py-2 rounded-md font-semibold transition-colors duration-300 ${
              isActive("chats") && !isActive("usuarios")
                ? "bg-[#6dd850] text-white"
                : "bg-[#e4fbdd] text-black hover:bg-[#caf5bd]"
            }`}
          >
            Chats ▾
          </button>

          <AnimatePresence initial={false}>
            {showChatsList && (
              <motion.div
                key="chatsContent"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-2 bg-green-50 rounded-lg max-h-[300px] overflow-visible relative z-0"
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
