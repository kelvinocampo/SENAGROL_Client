import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { PiUsersThreeLight } from "react-icons/pi";
import { TbWorld } from "react-icons/tb";
import { BsBox } from "react-icons/bs";
import { useState } from "react";
import { HiOutlineMenu, HiX } from "react-icons/hi";

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const menuItems = [
    {
      path: "/MisProductos",
      label: "Mis Productos",
      icon: <BsBox className="mr-2 text-[#00A650]" size={20} />,
    },
    {
      path: "/MisProductos/MisVentas",
      label: "Mis Ventas",
      icon: <PiUsersThreeLight className="mr-2 text-[#00A650]" size={20} />,
    },
    {
      path: "/MisProductos/Crear",
      label: "Crear Producto",
      icon: <TbWorld className="mr-2 text-[#00A650]" size={20} />,
    },
  ];

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <>
      {/* Botón hamburguesa - siempre visible en móvil */}
      <div className="md:hidden abosulte  top-12 right-20 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-[#00A650] bg-white shadow-md rounded-full p-2"
        >
          {isOpen ? <HiX size={24} /> : <HiOutlineMenu size={24} />}
        </button>
      </div>

      {/* Menú lateral escritorio (igual que antes) */}
      <motion.aside
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="hidden md:flex font-[Fredoka] w-64 min-h-screen bg-white shadow-xl rounded-2xl p-6 flex-col gap-6"
      >
        {menuItems.map(({ path, label, icon }, index) => (
          <motion.button
            key={path}
            onClick={() => handleNavigate(path)}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + index * 0.1, duration: 0.4 }}
            className={`flex items-center px-4 py-2 rounded-xl text-sm font-medium transition
              ${isActive(path)
                ? "bg-[#E4FBDD] text-[#0D141C]"
                : "bg-white hover:bg-[#E4FBDD] text-[#0D141C]"}`}
          >
            {icon}
            <span>{label}</span>
          </motion.button>
        ))}
      </motion.aside>

      {/* Menú lateral móvil - aparece debajo del header */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Fondo oscuro semi-transparente */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Menú móvil */}
            <motion.aside
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed top-16 left-0 w-full h-[calc(100vh-4rem)] bg-white shadow-xl z-50 p-6 flex flex-col gap-6 font-[Fredoka] overflow-y-auto"
            >
              {menuItems.map(({ path, label, icon }) => (
                <button
                  key={path}
                  onClick={() => handleNavigate(path)}
                  className={`flex items-center px-4 py-2 rounded-xl text-sm font-medium transition
                    ${isActive(path)
                      ? "bg-[#E4FBDD] text-[#0D141C]"
                      : "bg-white hover:bg-[#E4FBDD] text-[#0D141C]"}`}
                >
                  {icon}
                  <span>{label}</span>
                </button>
              ))}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};