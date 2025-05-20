import { useState } from "react";
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

export const AdminLayout = () => {
  const [activeView, setActiveView] = useState<string>("");
  const [menuOpen, setMenuOpen] = useState(false);

  const views: Record<string, React.ReactElement> = {
    dashboard: (
      <section className="text-center mt-10">
        <h2 className="text-xl font-semibold">
          Dashboard principal (por implementar)
        </h2>
      </section>
    ),

    usuarios: (
      <section className="grid grid-cols-2 gap-4">
        <h1 className="text-3xl font-semibold mb-2">Dashboard Usuarios</h1>
        <div className="overflow-x-auto bg-white p-6 rounded-xl shadow-lg w-160 h-full col-start-1 ">
          <h2 className="text-xl font-semibold mb-3">
            Gráfica de Barras de Usuarios
          </h2>
          <BarChartRoles />
        </div>
        <div className="overflow-x-auto bg-white p-6 rounded-xl shadow-lg w-110 h-full col-span-2 col-end-5 ">
          <h2 className="text-xl font-semibold mb-2">
            Gráfica Circular de Usuarios
          </h2>
          <PieChartRoles />
        </div>
        <div className="col-start-1 col-end-7 overflow-x-auto bg-white p-6 rounded-xl shadow-lg w-full h-full">
          <h1 className="text-2xl font-bold mb-2 text-center md:text-left">
            Usuarios
          </h1>
          <UserTable />
        </div>
      </section>
    ),

    productos: (
      <ProductManagementProvider>
        <section className="grid grid-cols-2 gap-4">
          <h1 className="text-3xl font-semibold mb-2">Dashboard Productos</h1>
          <div className="overflow-x-auto bg-white p-6 rounded-xl shadow-lg w-160 h-full col-start-1 ">
            <h2 className="text-xl font-semibold mb-2">
              Gráfica de Barras de Productos
            </h2>
            <BarChartProductsByMonth />
          </div>
          <div className="overflow-x-auto bg-white p-6 rounded-xl shadow-lg w-110 h-full col-span-2 col-end-5 ">
            <h2 className="text-xl font-semibold mb-2">
              Gráfica Circular de Productos
            </h2>
            <PieChartProductsByMonth />
          </div>
          <div className="col-start-1 col-end-7 overflow-x-auto bg-white p-6 rounded-xl shadow-lg w-full h-full">
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
        <section className="grid grid-cols-2 gap-4">
          <h1 className="text-3xl font-semibold mb-2">Dashboard Ventas</h1>
          <div className="overflow-x-auto bg-white p-6 rounded-xl shadow-lg w-160 h-full col-start-1 ">
            <h2 className="text-xl font-semibold mb-2">
              Gráfica de Barras de Ventas
            </h2>
            <BarChartSalesByMonth />
          </div>
          <div className="overflow-x-auto bg-white p-6 rounded-xl shadow-lg w-110 h-full col-span-2 col-end-5 ">
            <h2 className="text-xl font-semibold mb-2">
              Gráfica Circular de Ventas
            </h2>
            <PieChartProductsByMonth />
          </div>
          <div className="col-start-1 col-end-7 overflow-x-auto bg-white p-6 rounded-xl shadow-lg w-full h-full">
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
