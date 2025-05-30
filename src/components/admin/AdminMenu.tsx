import { useState } from "react";
import {Link} from "react-router-dom";
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

export const AdminMenu = ({ setActiveView }: AdminMenuProps) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const menuItemClass =
    "flex items-center gap-2 py-2 px-4 hover:bg-[#379e1b] rounded cursor-pointer";

  const handleSelect = (view: string) => {
    setActiveView(view);
    setMenuOpen(false);
  };

  return (
    <>
      <button
        className="fixed top-4 left-4 z-60 text-white bg-[#48bd28] p-2 rounded-md md:hidden"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      <aside
        className={`
          bg-[#48bd28] text-white
          min-h-screen w-full md:w-64
          fixed top-0 left-0 z-50
          flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${menuOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:relative
        `}
      >
        <div className="flex flex-col items-center py-6 border-b border-white">
          <div className="px-4 pt-6">
        <Link
          to="/inicio"
          className="inline-flex items-center text-white hover:text-green-900 font-medium"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5 mr-2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
          Volver al inicio
        </Link>
      </div>

          <img
            src={senagrol}
            alt="Senagrol"
            className="w-20 h-20 rounded-full mb-2"
          />
          <h2 className="text-xl font-bold">Admin</h2>
        </div>
        <nav className="flex-1 p-4 text-sm space-y-4 overflow-auto">
          

          {/* Usuarios - mostrar tabla */}
          <div
            onClick={() => handleSelect("usuarios")}
            className={menuItemClass}
          >
            <FaUsers /> Usuarios
          </div>

          {/* Productos - mostrar tabla */}
          <div
            onClick={() => handleSelect("productos")}
            className={menuItemClass}
          >
            <FaBox /> Productos
          </div>

          {/* Ventas */}
          <div onClick={() => handleSelect("ventas")} className={menuItemClass}>
            <FaShoppingCart /> Ventas
          </div>
        </nav>
      </aside>
    </>
  );
};
