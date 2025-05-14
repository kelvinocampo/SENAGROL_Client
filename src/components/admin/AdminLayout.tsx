import { useState } from 'react';
import { AdminMenu } from '@/components/admin/AdminMenu';
import { UserTable } from '@/components/admin/table/userTable';
import { BarChartRoles } from '@components/admin/graphics/BargraphUsers';
import { PieChartRoles } from '@components/admin/graphics/PieChartUsers';
import { ProductTable } from './table/ProductsTable';

export const AdminLayout = () => {
  const [activeView, setActiveView] = useState('usuarios');


  const renderView = () => {
    switch (activeView) {
      case 'ListUser':
        return <UserTable />;
      case 'bargraphUsers':
        return <BarChartRoles />;
      case 'circularUsers':
        return <PieChartRoles />;
      case 'ListProducts':
        return <ProductTable />
      default:
        return <div>Seleccione una opción del menú</div>;
    }
  };

  const getTitle = () => {
    switch (activeView) {
      case 'ListUser':
        return 'Usuarios';
      case 'bargraphUsers':
        return 'Gráfica de Barras';
      case 'circularUsers':
        return 'Gráfica Circular';
      case 'bargraphProducts':
        return 'Gráfica de barras';
      case 'circularProducts':
        return 'Gráfica Circular';
      case 'ListProducts':
        return 'Productos';
      case 'dashboard':
        return 'Dashboard';
      default:
        return '';
    }
  };

  return (
    <div className="flex">
      <AdminMenu setActiveView={setActiveView} />
      <div className="p-4 w-full flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">{getTitle()}</h1>
        {renderView()}
      </div>
    </div>
  );
};
