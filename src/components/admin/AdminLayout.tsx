import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
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

// ErrorBoundary implementado directamente aquí o puedes moverlo a un archivo común
type ErrorBoundaryProps = {
  children: React.ReactNode;
  fallback: React.ReactNode;
  onError?: (error: Error, info: { componentStack: string }) => void;
};

type ErrorBoundaryState = { hasError: boolean };

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    this.setState({ hasError: true });
    this.props.onError?.(error, info);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

const getValidActiveView = (): string => {
  const validViews = ["dashboard", "usuarios", "productos", "ventas"];
  const storedView = localStorage.getItem("adminActiveView");
  return validViews.includes(storedView || "") ? (storedView as string) : "usuarios";
};

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

export const AdminLayout = () => {
  const [activeView, setActiveView] = useState<string>(() => getValidActiveView());
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("adminActiveView", activeView);
  }, [activeView]);

  const views: Record<string, React.ReactElement> = {
    dashboard: (
      <ErrorBoundary
        fallback={
          <div className="text-red-600 text-center mt-10">
            Ocurrió un error al cargar el dashboard. Recargando en unos segundos...
          </div>
        }
        onError={() => {
          setTimeout(() => window.location.reload(), 3000);
        }}
      >
        <motion.section {...fadeUp} className="text-center mt-10">
          <h2 className="text-xl font-semibold">Dashboard principal</h2>
          <p className="mt-4">Contenido aún no disponible.</p>
        </motion.section>
      </ErrorBoundary>
    ),
    usuarios: (
      <motion.section {...fadeUp} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.h1 {...fadeUp} className="text-3xl font-semibold mb-2 col-span-full text-center md:text-left">
          Dashboard Usuarios
        </motion.h1>
        <motion.div {...fadeUp} className="overflow-x-auto bg-white p-6 rounded-xl shadow-lg w-full h-full col-span-1 lg:col-span-2">
          <h2 className="text-xl font-semibold mb-3 text-center md:text-left">Gráfica de Barras de Usuarios</h2>
          <BarChartRoles />
        </motion.div>
        <motion.div {...fadeUp} className="overflow-x-auto bg-white p-6 rounded-xl shadow-lg w-full h-full col-span-1 lg:col-span-2">
          <h2 className="text-xl font-semibold mb-2 text-center md:text-left">Gráfica Circular de Usuarios</h2>
          <PieChartRoles />
        </motion.div>
        <motion.div {...fadeUp} className="col-span-full overflow-x-auto bg-white p-6 rounded-xl shadow-lg w-full h-full">
          <h1 className="text-2xl font-bold mb-2 text-center md:text-left">Usuarios</h1>
          <UserTable />
        </motion.div>
      </motion.section>
    ),
    productos: (
      <ProductManagementProvider>
        <ErrorBoundary
          fallback={
            <motion.div {...fadeUp} className="text-red-600 text-center mt-10">
              No se pueden visualizar los productos en este momento. Intenta más tarde.
            </motion.div>
          }
        >
          <motion.section {...fadeUp} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <motion.h1 {...fadeUp} className="text-3xl font-semibold mb-2 col-span-full text-center md:text-left">
              Dashboard Productos
            </motion.h1>
            <motion.div {...fadeUp} className="overflow-x-auto bg-white p-6 rounded-xl shadow-lg w-full h-full col-span-1 lg:col-span-2">
              <h2 className="text-xl font-semibold mb-2 text-center md:text-left">Gráfica de Barras de Productos</h2>
              <BarChartProductsByMonth />
            </motion.div>
            <motion.div {...fadeUp} className="overflow-x-auto bg-white p-6 rounded-xl shadow-lg w-full h-full col-span-1 lg:col-span-2">
              <h2 className="text-xl font-semibold mb-2 text-center md:text-left">Gráfica Circular de Productos</h2>
              <PieChartProductsByMonth />
            </motion.div>
            <motion.div {...fadeUp} className="col-span-full overflow-x-auto bg-white p-6 rounded-xl shadow-lg w-full h-full">
              <h2 className="text-2xl font-bold mb-4 text-center md:text-left">Productos</h2>
              <ProductTable />
            </motion.div>
          </motion.section>
        </ErrorBoundary>
      </ProductManagementProvider>
    ),
    ventas: (
      <SalesManagementProvider>
        <motion.section {...fadeUp} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.h1 {...fadeUp} className="text-3xl font-semibold mb-2 col-span-full text-center md:text-left">
            Dashboard Ventas
          </motion.h1>
          <motion.div {...fadeUp} className="overflow-x-auto bg-white p-6 rounded-xl shadow-lg w-full h-full col-span-1 lg:col-span-2">
            <h2 className="text-xl font-semibold mb-2 text-center md:text-left">Gráfica de Barras de Ventas</h2>
            <BarChartSalesByMonth />
          </motion.div>
          <motion.div {...fadeUp} className="overflow-x-auto bg-white p-6 rounded-xl shadow-lg w-full h-full col-span-1 lg:col-span-2">
            <h2 className="text-xl font-semibold mb-2 text-center md:text-left">Gráfica Circular de Ventas</h2>
            <PieChartSalesByMonth />
          </motion.div>
          <motion.div {...fadeUp} className="col-span-full overflow-x-auto bg-white p-6 rounded-xl shadow-lg w-full h-full">
            <h2 className="text-2xl font-bold mb-4 text-center md:text-left">Gráfica combinada</h2>
            <LineChartSalesByMonth />
          </motion.div>
          <motion.div {...fadeUp} className="col-span-full overflow-x-auto bg-white p-6 rounded-xl shadow-lg w-full h-full">
            <h2 className="text-2xl font-bold mb-4 text-center md:text-left">Ventas</h2>
            <SalesTable />
          </motion.div>
        </motion.section>
      </SalesManagementProvider>
    )
  };

 return (
  <div className="flex flex-col md:flex-row min-h-screen">
    <AdminMenu setActiveView={setActiveView} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
    <main className={`flex-1 p-4 w-full min-h-screen overflow-auto ${menuOpen ? "md:ml-64" : ""}`}>
      <ErrorBoundary
        fallback={
          <div className="text-red-600 text-center mt-10">
            Ocurrió un error al cargar el dashboard. Recargando en unos segundos...
          </div>
        }
        onError={() => {
          setTimeout(() => window.location.reload(), 3000);
        }}
      >
        <motion.div key={activeView} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          {views[activeView] || <div className="text-center mt-10">Seleccione una opción del menú</div>}
        </motion.div>
      </ErrorBoundary>
    </main>
  </div>
);

};
