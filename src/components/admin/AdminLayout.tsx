import { useState } from 'react';
import { AdminMenu } from '@/components/admin/AdminMenu';
import { UserTable } from '@/components/admin/table/userTable';

export const AdminLayout = () => {
  const [activeView, setActiveView] = useState('usuarios'); // valor por defecto

  const renderView = () => {
  switch (activeView) {
    case 'usuarios':
      return  <UserTable />;
    case 'graficasBarras':
      return <div>Gráfica de Barras</div>;
    case 'graficasCircular':
      return <div>Gráfica Circular</div>;
    case 'productos':
      return <div>Lista de productos</div>;
    default:
      return <div>Seleccione una opción del menú</div>;
  }
};

  const getTitle = () => {
    switch (activeView) {
      case 'usuarios':
        return 'Usuarios';
      case 'graficasBarras':
        return 'Gráfica de Barras';
      case 'graficasCircular':
        return 'Gráfica Circular';
      case 'productos':
        return 'Productos';
      case 'ventas':
        return 'Ventas';
      case 'dashboard':
        return 'Dashboard';
      default:
        return '';
    }
  };

  return (
    <div className="flex">
      <AdminMenu setActiveView={setActiveView} />
      <div className="p-4 w-full">
        <h1 className="text-2xl font-bold mb-4">{getTitle()}</h1>
        {renderView()}
      </div>
    </div>
  );
};
