import { useState } from 'react';
import { AdminMenu } from '@/components/admin/AdminMenu';
import { UserTable } from '@/components/admin/table/userTable';
import { BarChartRoles } from '@components/admin/graphics/BargraphUsers';
import { PieChartRoles } from '@components/admin/graphics/PieChartUsers';
import { ProductTable } from './table/ProductsTable';
import { PieChartProductsByMonth } from './graphics/PieChartProducts';
import { BarChartProductsByMonth } from './graphics/BargraphProducts';
import { ProductManagementProvider } from '@/contexts/admin/ProductsManagement';

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
        return <ProductTable />;
      case 'bargraphProducts':
        return <BarChartProductsByMonth />;
      case 'circularProducts':
        return <PieChartProductsByMonth />;
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
    <ProductManagementProvider>
      <div className="flex flex-col md:flex-row min-h-screen">
        {/* AdminMenu ya tiene estilos responsivos */}
        <AdminMenu setActiveView={setActiveView} />
        
        {/* Contenido principal */}
        <main className="flex-1 p-4 w-full min-h-screen overflow-auto">
          <h1 className="text-2xl font-bold mb-4 text-center md:text-left">{getTitle()}</h1>
          {renderView()}
        </main>
      </div>
    </ProductManagementProvider>
  );
};
