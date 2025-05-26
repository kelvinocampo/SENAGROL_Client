import { useState, useEffect } from "react";
import { AdminMenu } from "@/components/admin/AdminMenu";
import { UserTable } from "@/components/admin/table/userTable";
import { BarChartRoles } from "@/components/admin/graphics/BargraphUsers";
import { PieChartRoles } from "@/components/admin/graphics/PieChartUsers";
import { ProductTable } from "@/components/admin/table/ProductsTable";
import { PieChartProductsByMonth } from "@/components/admin/graphics/PieChartProducts";
import { BarChartProductsByMonth } from "@/components/admin/graphics/BargraphProducts";
import { ProductManagementProvider } from "@/contexts/admin/ProductsManagement";
import { SalesManagementProvider } from "@/contexts/admin/SalesManagement";
import { SalesTable } from "@components/admin/table/SalesTable";
import { BarChartSalesByMonth } from "@components/admin/graphics/BargraphSales";
import { PieChartSalesByMonth } from "@components/admin/graphics/PieChartSales";
import { LineChartSalesByMonth } from "@components/admin/graphics/LineChartSalesByMonth";

// Función para validar la vista almacenada
const getValidActiveView = (): string => {
  const validViews = ["dashboard", "usuarios", "productos", "ventas"];
  const storedView = localStorage.getItem("adminActiveView");
  return validViews.includes(storedView || "") ? storedView! : "usuarios";
};

export const AdminLayout = () => {
  const [activeView, setActiveView] = useState<string>(() => getValidActiveView());
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("adminActiveView", activeView);
  }, [activeView]);

  const views: Record<string, React.ReactElement> = {
    dashboard: (
      <section className="text-center mt-10">
        <h2 className="text-xl font-semibold">
          Dashboard principal (por implementar)
        </h2>
      </section>
    ),

    usuarios: (
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <h1 className="text-3xl font-semibold mb-2 col-span-full text-center md:text-left">
          Dashboard Usuarios
        </h1>
        <div className="overflow-x-auto bg-white p-6 rounded-xl shadow-lg w-full h-full col-span-1 lg:col-span-2">
          <h2 className="text-xl font-semibold mb-3 text-center md:text-left">
            Gráfica de Barras de Usuarios
          </h2>
          <BarChartRoles />
        </div>
        <div className="overflow-x-auto bg-white p-6 rounded-xl shadow-lg w-full h-full col-span-1 lg:col-span-2">
          <h2 className="text-xl font-semibold mb-2 text-center md:text-left">
            Gráfica Circular de Usuarios
          </h2>
          <PieChartRoles />
        </div>
        <div className="col-span-full overflow-x-auto bg-white p-6 rounded-xl shadow-lg w-full h-full">
          <h1 className="text-2xl font-bold mb-2 text-center md:text-left">
            Usuarios
          </h1>
          <UserTable />
        </div>
      </section>
    ),

    productos: (
      <ProductManagementProvider>
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <h1 className="text-3xl font-semibold mb-2 col-span-full text-center md:text-left">
            Dashboard Productos
          </h1>
          <div className="overflow-x-auto bg-white p-6 rounded-xl shadow-lg w-full h-full col-span-1 lg:col-span-2">
            <h2 className="text-xl font-semibold mb-2 text-center md:text-left">
              Gráfica de Barras de Productos
            </h2>
            <BarChartProductsByMonth />
          </div>
          <div className="overflow-x-auto bg-white p-6 rounded-xl shadow-lg w-full h-full col-span-1 lg:col-span-2">
            <h2 className="text-xl font-semibold mb-2 text-center md:text-left">
              Gráfica Circular de Productos
            </h2>
            <PieChartProductsByMonth />
          </div>
          <div className="col-span-full overflow-x-auto bg-white p-6 rounded-xl shadow-lg w-full h-full">
            <h2 className="text-2xl font-bold mb-4 text-center md:text-left">
              Productos
            </h2>
            <ProductTable />
          </div>
        </section>
      </ProductManagementProvider>
    ),

    ventas: (
      <SalesManagementProvider>
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <h1 className="text-3xl font-semibold mb-2 col-span-full text-center md:text-left">
            Dashboard Ventas
          </h1>
          <div className="overflow-x-auto bg-white p-6 rounded-xl shadow-lg w-full h-full col-span-1 lg:col-span-2">
            <h2 className="text-xl font-semibold mb-2 text-center md:text-left">
              Gráfica de Barras de Ventas
            </h2>
            <BarChartSalesByMonth />
          </div>
          <div className="overflow-x-auto bg-white p-6 rounded-xl shadow-lg w-full h-full col-span-1 lg:col-span-2">
            <h2 className="text-xl font-semibold mb-2 text-center md:text-left">
              Gráfica Circular de Ventas
            </h2>
            <PieChartSalesByMonth />
          </div>
           <div className="col-span-full overflow-x-auto bg-white p-6 rounded-xl shadow-lg w-full h-full">
            <h2 className="text-2xl font-bold mb-4 text-center md:text-left">
              Grafica combinada
            </h2>
            <LineChartSalesByMonth />
          </div>
          <div className="col-span-full overflow-x-auto bg-white p-6 rounded-xl shadow-lg w-full h-full">
            <h2 className="text-2xl font-bold mb-4 text-center md:text-left">
              Ventas
            </h2>
            <SalesTable />
          </div>
          
        </section>
        
      </SalesManagementProvider>
    ),
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <AdminMenu
        setActiveView={setActiveView}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
      />
      <main
        className={`flex-1 p-4 w-full min-h-screen overflow-auto ${
          menuOpen ? "md:ml-64" : ""
        }`}
      >
        {views[activeView] || (
          <div className="text-center mt-10">
            Seleccione una opción del menú
          </div>
        )}
      </main>
    </div>
  );
};
