import { useState, useRef } from "react";
import senagrol from "@assets/senagrol.jpeg";
import { Link } from 'react-router-dom';

const Header = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setDropdownOpen(false);
    }, 200);
  };

  return (
    <header className="bg-white shadow-md px-6 py-3 relative z-50">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        
        {/* Logo */}
        <div className="flex items-center gap-3">
          <img src={senagrol} alt="Logo" className="w-10 h-10 rounded-full" />
        </div>

        {/* Navegación */}
        <nav className="flex flex-wrap justify-center md:justify-end items-center gap-4 text-sm font-medium w-full md:w-auto relative">
          <a href="#" className="hover:text-[#48BD28] transition">Chats</a>
          <a href="#" className="hover:text-[#48BD28] transition">Productos</a>
          <a href="#" className="hover:text-[#48BD28] transition">Chat IA</a>
          <a href="#" className="hover:text-[#48BD28] transition">Administrador</a>

          {/* Menú desplegable de perfil */}
          <div
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button className="hover:text-[#48BD28] transition">Perfil</button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-md shadow-lg z-50 text-sm">
                <Link to="/" className="block px-3 py-2 hover:bg-[#E4FBDD]">🛒 Mis compras</Link>
                <Link to="#" className="block px-3 py-2 hover:bg-[#E4FBDD]">🚚 Transportadores</Link>
                <Link to="#" className="block px-3 py-2 hover:bg-[#E4FBDD]">📦 Mis transportes</Link>
                <Link to="#" className="block px-3 py-2 hover:bg-[#E4FBDD]">👁️ Escaneo facial</Link>
              </div>
            )}
          </div>

          {/* Botón de inicio */}
          <button className="bg-[#48BD28] text-white px-3 py-1.5 rounded-full text-sm transition mt-4 md:mt-0">
            Inicio
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
