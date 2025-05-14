import { useState } from 'react';
import { FaHome, FaChartPie, FaUsers, FaBox, FaShoppingCart, FaChevronDown, FaChevronUp, FaBars } from 'react-icons/fa';
import senagrol from '@assets/senagrol.jpeg';

interface AdminMenuProps {
  setActiveView: (view: string) => void;
}

export const AdminMenu = ({ setActiveView }: AdminMenuProps) => {
  const [openProductos, setOpenProductos] = useState(false);
  const [openUsuarios, setOpenUsuarios] = useState(false);
  const [openGraficaUsuarios, setopenGraficaUsuarios] = useState(false);

  const menuItemClass = "flex items-center gap-2 py-2 px-4 hover:bg-[#379e1b] rounded cursor-pointer";

  return (
    <aside className="h-screen w-64 bg-[#48bd28] text-white flex flex-col">
      <div className="flex flex-col items-center py-6 border-b border-white">
        <img src={senagrol} alt="Senagrol" className="w-20 h-20 rounded-full mb-2" />
        <h2 className="text-xl font-bold">Admin</h2>
      </div>

      <nav className="flex-1 p-4 text-sm space-y-4">
        <div>
          <div onClick={() => setActiveView('dashboard')} className={menuItemClass}>
            <FaHome /> Dashboard
          </div>
        </div>

        {/* Usuarios */}
        <div>
          <div className={menuItemClass} onClick={() => setOpenUsuarios(!openUsuarios)}>
            <FaUsers /> Usuarios {openUsuarios ? <FaChevronUp /> : <FaChevronDown />}
          </div>
          {openUsuarios && (
            <ul className="pl-6 mt-2 space-y-1">
              <li>
                  <div className={menuItemClass} onClick={() => setopenGraficaUsuarios(!openGraficaUsuarios)}>
                  <FaChartPie /> Graficas {openGraficaUsuarios ? <FaChevronUp /> : <FaChevronDown />}
                  </div>
                  {openGraficaUsuarios && (
                    <ul className="pl-6 mt-2 space-y-1">
                        <li>
                         <div onClick={() => setActiveView('bargraphUsers')} className={menuItemClass}>
                         <FaBars /> Grafica de barras 
                        </div>
                        </li>
                        <li>
                         <div onClick={() => setActiveView('circularUsers')} className={menuItemClass}>
                         <FaChartPie /> Grafica de circular
                        </div>
                        </li>
                    </ul>
                  )}
              </li>
               <li>
                <div onClick={() => setActiveView('ListUser')} className={menuItemClass}>
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
             <div className={menuItemClass} onClick={() => setopenGraficaUsuarios(!openGraficaUsuarios)}>
                  <FaChartPie /> Graficas {openGraficaUsuarios ? <FaChevronUp /> : <FaChevronDown />}
                  </div>
                  {openGraficaUsuarios && (
                    <ul className="pl-6 mt-2 space-y-1">
                        <li>
                         <div onClick={() => setActiveView('bargraphProducts')} className={menuItemClass}>
                         <FaBars /> Grafica de barras 
                        </div>
                        </li>
                        <li>
                         <div onClick={() => setActiveView('circularProducts')} className={menuItemClass}>
                         <FaChartPie /> Grafica de circular
                        </div>
                        </li>
                    </ul>
                  )}
                  <li>
                <div onClick={() => setActiveView('ListProducts')} className={menuItemClass}>
                  <FaUsers /> Lista de productos
                </div>
              </li>
            </ul>
          )}
        </div>

        {/* Ventas */}
        <div>
          <div onClick={() => setActiveView('ventas')} className={menuItemClass}>
            <FaShoppingCart /> Ventas
          </div>
        </div>
      </nav>
    </aside>
  );
};
