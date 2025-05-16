import { useState } from 'react';
import {
  FaHome,
  FaChartPie,
  FaUsers,
  FaBox,
  FaShoppingCart,
  FaChevronDown,
  FaChevronUp,
  FaBars,
  FaTimes,
} from 'react-icons/fa';
import senagrol from '@assets/senagrol.jpeg';

interface AdminMenuProps {
  setActiveView: (view: string) => void;
}

export const AdminMenu = ({ setActiveView }: AdminMenuProps) => {
  const [openProductos, setOpenProductos] = useState(false);
  const [openUsuarios, setOpenUsuarios] = useState(false);
  const [openGraficaUsuarios, setopenGraficaUsuarios] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // Estado para menú móvil

  const menuItemClass = 'flex items-center gap-2 py-2 px-4 hover:bg-[#379e1b] rounded cursor-pointer';

  // Cierra el menú móvil al seleccionar una opción
  const handleSelect = (view: string) => {
    setActiveView(view);
    setMenuOpen(false);
  };

  return (
    <>
      {/* Botón hamburguesa móvil */}
      <button
        className="fixed top-4 left-4 z-60 text-white bg-[#48bd28] p-2 rounded-md md:hidden"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      {/* Menú */}
      <aside
        className={`
          bg-[#48bd28] text-white
          min-h-screen
          w-full md:w-64
          fixed top-0 left-0
          z-50
          flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${menuOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:translate-x-0 md:relative
        `}
      >
        <div className="flex flex-col items-center py-6 border-b border-white">
          <img src={senagrol} alt="Senagrol" className="w-20 h-20 rounded-full mb-2" />
          <h2 className="text-xl font-bold">Admin</h2>
        </div>

        <nav className="flex-1 p-4 text-sm space-y-4 overflow-auto">
          <div onClick={() => handleSelect('dashboard')} className={menuItemClass}>
            <FaHome /> Dashboard
          </div>

          {/* Usuarios */}
          <div>
            <div className={menuItemClass} onClick={() => setOpenUsuarios(!openUsuarios)}>
              <FaUsers /> Usuarios {openUsuarios ? <FaChevronUp /> : <FaChevronDown />}
            </div>
            {openUsuarios && (
              <ul className="pl-6 mt-2 space-y-1">
                <li>
                  <div
                    className={menuItemClass}
                    onClick={() => setopenGraficaUsuarios(!openGraficaUsuarios)}
                  >
                    <FaChartPie /> Graficas {openGraficaUsuarios ? <FaChevronUp /> : <FaChevronDown />}
                  </div>
                  {openGraficaUsuarios && (
                    <ul className="pl-6 mt-2 space-y-1">
                      <li>
                        <div onClick={() => handleSelect('bargraphUsers')} className={menuItemClass}>
                          <FaBars /> Grafica de barras
                        </div>
                      </li>
                      <li>
                        <div
                          onClick={() => handleSelect('circularUsers')}
                          className={menuItemClass}
                        >
                          <FaChartPie /> Grafica de circular
                        </div>
                      </li>
                    </ul>
                  )}
                </li>
                <li>
                  <div onClick={() => handleSelect('ListUser')} className={menuItemClass}>
                    <FaUsers /> Lista Usuarios
                  </div>
                </li>
              </ul>
            )}
          </div>

          {/* Productos */}
          <div>
            <div className={menuItemClass} onClick={() => setOpenProductos(!openProductos)}>
              <FaBox /> Productos {openProductos ? <FaChevronUp /> : <FaChevronDown />}
            </div>
            {openProductos && (
              <ul className="pl-6 mt-2 space-y-1">
                <div
                  className={menuItemClass}
                  onClick={() => setopenGraficaUsuarios(!openGraficaUsuarios)}
                >
                  <FaChartPie /> Graficas {openGraficaUsuarios ? <FaChevronUp /> : <FaChevronDown />}
                </div>
                {openGraficaUsuarios && (
                  <ul className="pl-6 mt-2 space-y-1">
                    <li>
                      <div
                        onClick={() => handleSelect('bargraphProducts')}
                        className={menuItemClass}
                      >
                        <FaBars /> Grafica de barras
                      </div>
                    </li>
                    <li>
                      <div
                        onClick={() => handleSelect('circularProducts')}
                        className={menuItemClass}
                      >
                        <FaChartPie /> Grafica de circular
                      </div>
                    </li>
                  </ul>
                )}
                <li>
                  <div onClick={() => handleSelect('ListProducts')} className={menuItemClass}>
                    <FaUsers /> Lista de productos
                  </div>
                </li>
              </ul>
            )}
          </div>

          {/* Ventas */}
          <div onClick={() => handleSelect('ventas')} className={menuItemClass}>
            <FaShoppingCart /> Ventas
          </div>
        </nav>
      </aside>

      {/* Contenido */}
      <main className="md:ml-64 p-4">
        {/* Aquí va el contenido que cambie según la vista */}
      </main>
    </>
  );
};
