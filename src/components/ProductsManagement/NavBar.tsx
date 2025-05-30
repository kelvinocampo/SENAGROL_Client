import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <>
      {/* Botón menú hamburguesa */}
      <div className="font-[Fredoka] flex items-center absolute top-4 right-4 z-50">
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-700 hover:text-gray-900 focus:outline-none relative p-2 rounded-md bg-white shadow-md transition-colors duration-300"
          aria-label="Toggle menu"
          whileTap={{ scale: 0.95 }}
        >
          <motion.svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            initial={false}
            animate={isOpen ? "open" : "closed"}
          >
            <motion.path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              variants={{
                closed: { d: "M4 6h16" },
                open: { d: "M6 18L18 6" },
              }}
            />
            <motion.path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              variants={{
                closed: { d: "M4 12h16", opacity: 1 },
                open: { opacity: 0 },
              }}
              transition={{ duration: 0.2 }}
            />
            <motion.path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              variants={{
                closed: { d: "M4 18h16" },
                open: { d: "M6 6l12 12" },
              }}
            />
          </motion.svg>
        </motion.button>
      </div>

      {/* Menú lateral animado */}
      <AnimatePresence>
        {isOpen && (
          <motion.nav
            className="fixed top-0 p-4 pt-16 bg-white h-screen flex flex-col gap-4 shadow-lg transition-all duration-300 z-40"
            style={{ width: '250px' }}
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 260, damping: 25 }}
          >
            <motion.button
              onClick={() => handleNavigation('/MisProductos')}
              className="w-full p-2 rounded-xl bg-[#48BD28] hover:bg-green-600 cursor-pointer text-white font-medium"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Mis Productos
            </motion.button>
            <motion.button
              onClick={() => handleNavigation('/MisProductos/Crear')}
              className="w-full p-2 rounded-xl bg-[#48BD28] hover:bg-green-600 cursor-pointer text-white font-medium"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Crear Producto
            </motion.button>
            <motion.button
              onClick={() => handleNavigation('/MisProductos/MisVentas')}
              className="w-full p-2 rounded-xl bg-[#48BD28] hover:bg-green-600 cursor-pointer text-white font-medium"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Mis ventas
            </motion.button>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
};
