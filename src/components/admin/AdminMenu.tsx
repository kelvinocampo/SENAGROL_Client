import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BackToHome } from "./common/BackToHome";
import {
  FaUsers,
  FaBox,
  FaShoppingCart,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import senagrol from "@assets/senagrol.png";

interface AdminMenuProps {
  setActiveView: (view: string) => void;
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
}

const menuItemClass =
  "flex items-center gap-2 py-2 px-4 hover:bg-[#379e1b] rounded cursor-pointer";

const menuItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.1 },
  }),
};

export const AdminMenu = ({
  setActiveView,
  menuOpen,
  setMenuOpen,
}: AdminMenuProps) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Evita errores en SSR
  }, []);

  const handleSelect = (view: string) => {
    setActiveView(view);
    setMenuOpen(false);
  };

  const menuItems = [
    { key: "usuarios", icon: <FaUsers />, label: "Usuarios" },
    { key: "productos", icon: <FaBox />, label: "Productos" },
    { key: "ventas", icon: <FaShoppingCart />, label: "Ventas" },
  ];

  return (
    <>
      {/* Botón hamburguesa solo en móvil */}
      <button
        className="fixed top-4 left-4 z-50 text-white bg-[#48bd28] p-2 rounded-md md:hidden"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      {/* Menú lateral */}
      <AnimatePresence>
        {isClient && (menuOpen || window.innerWidth >= 768) && (
          <motion.aside
            key="sidebar"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3 }}
            className={`
              bg-[#48bd28] text-white
              w-full md:w-64
              fixed md:static top-0 left-0 z-40
              flex flex-col
               min-h-screen
            `}
          >
            {/* Encabezado del menú */}
            <div className="flex flex-col items-center py-6 border-b border-white">
            <BackToHome textColor="text-white" />

              <img
                src={senagrol}
                alt="Senagrol"
                className="w-20 h-20 rounded-full mb-2"
              />
              <h2 className="text-xl font-bold">Admin</h2>
            </div>

            {/* Opciones del menú */}
            <nav className="flex-1 p-4 text-sm space-y-4 overflow-auto">
              {menuItems.map((item, index) => (
                <motion.div
                  key={item.key}
                  className={menuItemClass}
                  custom={index}
                  variants={menuItemVariants}
                  initial="hidden"
                  animate="visible"
                  onClick={() => handleSelect(item.key)}
                >
                  {item.icon} {item.label}
                </motion.div>
              ))}
            </nav>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};
