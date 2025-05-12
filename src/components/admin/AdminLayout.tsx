import { useState } from 'react';
import { AdminMenu } from '@/components/admin/AdminMenu';
import { UserTable } from '@/components/admin/table/userTable';
// puedes importar otras vistas como <BarChart />, <ProductList />, etc.

export const AdminLayout = () => {
  const [activeView, setActiveView] = useState('usuarios'); // valor por defecto

  const renderView = () => {
    switch (activeView) {
      case 'usuarios':
        return <UserTable />;
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

  return (
    <div className="flex">
      <AdminMenu setActiveView={setActiveView} />
      <div className="p-4 w-full">
        <h1 className="text-2xl font-bold mb-4">Usuarios</h1>
        {renderView()}
      </div>
    </div>
  );
};
