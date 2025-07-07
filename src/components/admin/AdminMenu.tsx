import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BackToHome } from "./common/BackToHome";
import { PiUsersThreeLight } from "react-icons/pi";
import { TbWorld } from "react-icons/tb";
import { BsBox } from "react-icons/bs";
import { FaBars, FaTimes } from "react-icons/fa";
import senagrol from "@assets/senagrol.png";

interface AdminMenuProps {
  setActiveView: (view: string) => void;
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
}

const menuItemClass =
  "flex items-center gap-3 py-3 px-4 rounded-xl cursor-pointer transition-colors hover:bg-[#caf5bd] text-black font-medium";

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
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    setIsClient(true);

    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    handleResize(); // Inicializa el estado al montar

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSelect = (view: string) => {
    setActiveView(view);
    setMenuOpen(false);
  };

  const menuItems = [
    { key: "usuarios", icon: <PiUsersThreeLight color="#00A650" size={24} />, label: "Usuarios" },
    { key: "productos", icon: <BsBox color="#00A650" size={24} />, label: "Productos" },
    { key: "ventas", icon: <TbWorld color="#00A650" size={24} />, label: "Ventas" },
  ];

  return (
    <>
      {/* Botón hamburguesa visible solo en móviles */}
      <button
        className="fixed top-10 left-4 z-50 text-white bg-[#48bd28] p-2 rounded-md shadow-md md:hidden"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Abrir menú"
      >
        {menuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>

      {/* Menú lateral */}
      <AnimatePresence>
        {isClient && (menuOpen || isDesktop) && (
          <motion.aside
            key="sidebar"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3 }}
            className={`
              bg-white text-black
              w-[85%] sm:w-[60%] md:w-64
              fixed md:static top-0 left-0 z-40
              flex flex-col
              min-h-screen
              shadow-md md:shadow-none
            `}
          >
            {/* Encabezado */}
            <div className="flex flex-col items-center py-6 border-b border-none relative space-y-4">
              <div className="w-full pl-4">
                <BackToHome />
              </div>

              <img
                src={senagrol}
                alt="Senagrol"
                className="w-32 h-32 rounded-full object-cover border-4 border-none"
              />
              <h2 className="text-lg font-bold text-[#1B7D00]">Administrador</h2>
            </div>

            {/* Opciones del menú */}
            <nav className="flex-1 p-4 text-sm space-y-2 overflow-auto">
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
                  {item.icon}
                  {item.label}
                </motion.div>
              ))}
            </nav>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};
