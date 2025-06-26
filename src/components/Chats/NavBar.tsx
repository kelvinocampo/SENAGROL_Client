import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChatsList } from "@/components/Chats/ChatList";


interface NavBarChatsProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NavBarChats = ({ isOpen, onClose }: NavBarChatsProps) => {
  const location = useLocation();
  const [showChatsList, setShowChatsList] = useState(false);

  return (
    <>
      {/* Fondo oscuro móvil */}
      <div
        onClick={onClose}
        className={` bg-opacity-30  z-40 md:hidden transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

     <aside
    className={`fixed top-10 left-10 z-50 w-[26rem] h-[20rem] ml-20 mt-10 bg-white shadow-3xl rounded-r-3xl p-6 flex flex-col gap-4 font-medium
  transform transition-transform duration-300 ease-in-out
  ${isOpen ? "translate-x-0" : "-translate-x-full"}
  md:relative md:ml-0 md:mt-0 md:w-64 md:h-auto md:translate-x-0 md:shadow-none md:rounded-none`}
>
        {/* Cerrar en móvil */}
        <button
          onClick={onClose}
          className="md:hidden self-end mb-4 p-1 rounded-md hover:bg-gray-200"
        >
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
  <motion.div layout>
          <a
            href="/chats/usuarios"
            className={`block px-4 py-2 rounded-lg transition-colors duration-300 bg-[#48BD28] ${
              location.pathname.includes("usuarios")
                ? "text-white "
                : "text-white hover:bg-green-700"
            }`}
          >
            Usuarios
          </a>
        </motion.div>
        <motion.div layout className="relative">
          <button
            onClick={() => setShowChatsList((prev) => !prev)}
            className={`w-full text-left px-4 py-2 rounded-lg font-semibold transition-colors duration-300 ${
              location.pathname.startsWith("/chats")
                ? "text-white bg-[#48BD28]"
                : "text-gray-700 hover:bg-gray-100"
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
                className="mt-2 bg-green-50 rounded-lg overflow-y-auto max-h-[300px]"
              >
                <ChatsList />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Botón USUARIOS */}
      
      </aside>
    </>
  );
};
