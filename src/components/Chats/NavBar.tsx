import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

interface NavBarChatsProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NavBarChats = ({ isOpen, onClose }: NavBarChatsProps) => {
  const location = useLocation();

  const links = [
    { path: "/chats", label: "Chats" },
    { path: "/chats/usuarios", label: "Usuarios" },
  ];

  return (
    <>
      {/* Overlay para cerrar sidebar en móvil */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black bg-opacity-30 z-40 md:hidden transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      <aside
        className={`
          fixed top-0 left-0 h-full w-60 bg-white shadow-xl rounded-r-2xl p-6 flex flex-col gap-4 font-medium z-50
          transform transition-transform duration-300 ease-in-out
          md:relative md:translate-x-0 md:top-auto md:h-auto md:rounded-none md:shadow-none
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Botón cerrar solo en móvil */}
        <button
          onClick={onClose}
          className="md:hidden self-end mb-4 p-1 rounded-md hover:bg-gray-200"
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

        <h2 className="text-xl font-bold text-green-600 mb-6 px-2">Menú</h2>
        {links.map(({ path, label }) => {
          const isCurrent = location.pathname.toLowerCase() === path.toLowerCase();

          return (
            <motion.div
              key={path}
              className="relative"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <NavLink
                to={path}
                className={`block px-4 py-3 rounded-lg transition-all duration-300 ${
                  isCurrent
                    ? "text-white bg-green-600 shadow-md"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {label}
              </NavLink>

              {isCurrent && (
                <motion.div
                  layoutId="underline"
                  className="absolute left-0 top-0 h-full w-1 bg-green-600 rounded-r-md"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </motion.div>
          );
        })}
      </aside>
    </>
  );
};
