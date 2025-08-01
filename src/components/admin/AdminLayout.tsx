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
import { SalesTable } from "@/components/admin/table/SalesTable";
import { BarChartSalesByMonth } from "@/components/admin/graphics/BargraphSales";
import { PieChartSalesByMonth } from "@/components/admin/graphics/PieChartSales";
import { LineChartSalesByMonth } from "@/components/admin/graphics/LineChartSalesByMonth";
import FallingLeaves from "@/components/FallingLeaf";
// ErrorBoundary local
type ErrorBoundaryProps = {
  children: React.ReactNode;
  fallback: React.ReactNode;
  onError?: (error: Error, info: { componentStack: string }) => void;
};
type ErrorBoundaryState = { hasError: boolean };

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
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

// Simulación de fallo (puedes eliminarlo si no lo usas)

// Validar vista activa
const getValidActiveView = (): string => {
  const validViews = ["dashboard", "usuarios", "productos", "ventas"];
  const storedView = localStorage.getItem("adminActiveView");
  return validViews.includes(storedView || "")
    ? (storedView as string)
    : "usuarios";
};

// Animación
const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

export const AdminLayout = () => {
  const [activeView, setActiveView] = useState<string>(() =>
    getValidActiveView()
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // CORRECCIÓN: Cargar todo correctamente
  useEffect(() => {
    const init = async () => {
      // Simulamos carga (puedes reemplazar por lógica real si necesitas)
      setTimeout(() => {
        setLoading(false);
      }, 1000); // 1 segundo de espera
    };

    init();
  }, []);

  useEffect(() => {
    localStorage.setItem("adminActiveView", activeView);
  }, [activeView]);

  if (loading) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50">
        <div className="w-20 h-20 border-8 border-green-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-6 text-xl font-semibold text-gray-700">
          Cargando admin...
        </p>
      </div>
    );
  }

  const views: Record<string, React.ReactElement> = {
    dashboard: (
      <ErrorBoundary
        fallback={
          <div className="text-red-600 text-center mt-10">
            Ocurrió un error al cargar el dashboard. Recargando en unos
            segundos...
          </div>
        }
        onError={() => {
          setTimeout(() => window.location.reload(), 3000);
        }}
      >
        <motion.div
          key={activeView}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* ⚠️ Quita esta línea si no quieres simular errores */}
          {/* <SimulatedCrash /> */}
          <div className="text-center text-xl font-semibold mt-10 text-green-800">
            Bienvenido al dashboard del administrador
          </div>
        </motion.div>
      </ErrorBoundary>
    ),

    usuarios: (
      <motion.section
        {...fadeUp}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <motion.h1
          {...fadeUp}
          className="text-3xl font-semibold mb-2 col-span-full text-center md:text-left"
        >
          Dashboard
          <p className="text-xl text-[#666666] font-normal">Usuarios</p>
        </motion.h1>
        <motion.div
          {...fadeUp}
          className="overflow-x-auto bg-white p-6 rounded-xl shadow-lg col-span-1 lg:col-span-2"
        >
          <BarChartRoles />
        </motion.div>
        <motion.div
          {...fadeUp}
          className="overflow-x-auto bg-white p-6 rounded-xl shadow-lg col-span-1 lg:col-span-2"
        >
          <PieChartRoles />
        </motion.div>
        <motion.div {...fadeUp} className="col-span-full overflow-x-auto p-6">
          <UserTable />
        </motion.div>
      </motion.section>
    ),

    productos: (
      <ProductManagementProvider>
        <ErrorBoundary
          fallback={
            <motion.div {...fadeUp} className="text-red-600 text-center mt-10">
              No se pueden visualizar los productos en este momento. Intenta más
              tarde.
            </motion.div>
          }
        >
          <motion.section
            {...fadeUp}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            <motion.h1
              {...fadeUp}
              className="text-3xl font-semibold mb-2 col-span-full text-center md:text-left"
            >
              Dashboard Productos
            </motion.h1>
            <motion.div
              {...fadeUp}
              className="overflow-x-auto w-full h-full col-span-1 lg:col-span-2"
            >
              <BarChartProductsByMonth />
            </motion.div>
            <motion.div
              {...fadeUp}
              className="overflow-x-auto w-full h-full col-span-1 lg:col-span-2"
            >
              <PieChartProductsByMonth />
            </motion.div>
            <motion.div
              {...fadeUp}
              className="col-span-full overflow-x-auto p-6 rounded-xl w-full h-full"
            >
              <h2 className="text-2xl font-bold mb-4 text-center md:text-left">
                Productos
              </h2>
              <ProductTable />
            </motion.div>
          </motion.section>
        </ErrorBoundary>
      </ProductManagementProvider>
    ),

    ventas: (
      <SalesManagementProvider>
        <motion.section
          {...fadeUp}
          className="grid grid-cols-1 md:grid-cols-2 p-5 lg:grid-cols-4 gap-4"
        >
          <motion.h1
            {...fadeUp}
            className="text-3xl font-semibold mb-2 col-span-full text-center text-[#0D141C] md:text-left"
          >
            Dashboard
            <p className="text-xl text-[#666666] font-normal">Ventas</p>
          </motion.h1>
          <motion.div
            {...fadeUp}
            className="overflow-x-auto w-full h-full col-span-1 lg:col-span-2"
          >
            <BarChartSalesByMonth />
          </motion.div>
          <motion.div
            {...fadeUp}
            className="overflow-x-auto w-full h-full col-span-1 lg:col-span-2"
          >
            <PieChartSalesByMonth />
          </motion.div>
          <motion.div
            {...fadeUp}
            className="col-span-full overflow-x-auto w-full h-full"
          >
            <LineChartSalesByMonth />
          </motion.div>
          <motion.div
            {...fadeUp}
            className="col-span-full overflow-x-auto p-10 w-full h-full"
          >
            <SalesTable />
          </motion.div>
        </motion.section>
      </SalesManagementProvider>
    ),
  };

  return (
    <>
      <div className="fixed inset-0 pointer-events-none z-0">
        <FallingLeaves quantity={20} />
      </div>
      <div className="flex flex-col font-[Fredoka] relative  md:flex-row min-h-screen">
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
          <ErrorBoundary
            fallback={
              <div className="text-red-600 text-center mt-10">
                No se pueden visualizar los datos en este momento. Intenta más
                tarde.
              </div>
            }
            onError={() => {
              setTimeout(() => window.location.reload(), 3000);
            }}
          >
            <motion.div
              key={activeView}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              {views[activeView] || (
                <div className="text-center mt-10">
                  Seleccione una opción del menú
                </div>
              )}
            </motion.div>
          </ErrorBoundary>
        </main>
      </div>
    </>
  );
};
//
