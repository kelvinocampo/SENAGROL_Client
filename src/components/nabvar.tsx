import { FaHome, FaChartPie, FaUsers, FaBox, FaShoppingCart } from 'react-icons/fa';

export default function Sidebar() {
  return (
    <aside className="h-screen w-64 bg-[#48bd28] text-white flex flex-col">
      {/* Logo */}
      <div className="flex flex-col items-center py-6 border-b border-white">
        <img src="/logo-senagrol.png" alt="Senagrol" className="w-20 h-20 rounded-full mb-2" />
        <h2 className="text-xl font-bold">Admin</h2>
      </div>

      {/* Menú */}
      <nav className="flex-1 p-4 space-y-6 text-sm">
        <div>
          <h3 className="text-white font-semibold mb-2">Dashboard</h3>
          <ul>
            <li className="flex items-center gap-2 py-2 hover:bg-[#379e1b] rounded px-2 cursor-pointer">
              <FaHome /> Dashboard
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-2">Usuarios</h3>
          <ul className="space-y-1">
            <li className="flex items-center gap-2 py-2 hover:bg-[#379e1b] rounded px-2 cursor-pointer">
              <FaChartPie /> Gráficas
            </li>
            <li className="flex items-center gap-2 py-2 hover:bg-[#379e1b] rounded px-2 cursor-pointer">
              <FaUsers /> Lista Usuarios
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-2">Productos</h3>
          <ul className="space-y-1">
            <li className="flex items-center gap-2 py-2 hover:bg-[#379e1b] rounded px-2 cursor-pointer">
              <FaChartPie /> Gráfica de barras
            </li>
            <li className="flex items-center gap-2 py-2 hover:bg-[#379e1b] rounded px-2 cursor-pointer">
              <FaChartPie /> Gráfica circular
            </li>
            <li className="flex items-center gap-2 py-2 hover:bg-[#379e1b] rounded px-2 cursor-pointer">
              <FaBox /> Lista Productos
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-2">Ventas</h3>
          <ul>
            <li className="flex items-center gap-2 py-2 hover:bg-[#379e1b] rounded px-2 cursor-pointer">
              <FaShoppingCart /> Gráficas
            </li>
          </ul>
        </div>
      </nav>
    </aside>
  );
}
