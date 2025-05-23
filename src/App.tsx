import { ProductManagement } from "@pages/ProductsManagement";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { InicioManual } from "@pages/Inicio";
import { AdminManagement } from "@pages/AdminManagement";
import { RegisterForm } from "@components/Usuarioregister/RegisterForm";
import MyPurchasesPage from "@pages/ListarMisCompras";
import { ProtectedRoute } from "@components/ProtectedRoute";
import Error404 from "@pages/Error404";
import PaginaProductos from "@pages/producto/PaginaProductos";
import DetalleProducto from "./pages/producto/DetalleProducto";
import CompraRealizada from "./pages/producto/CompraExitosa";
import CerrarSesion from "./pages/producto/CerrarSesion";
import ActulizarContraseña from "./pages/inicio/UpdatePassword";
import EnviarCorreo from "./pages/inicio/RecuperaraContraseña";
import { DiscountedProductProvider } from "./contexts/Product/ProductsManagement";

function App() {
  const isLoggedIn = !!localStorage.getItem("token"); // Esto puede mejorar con un contexto

  return (
    <BrowserRouter>
      <DiscountedProductProvider>
        <Routes>
          <Route path="/" element={<PaginaProductos />} />
          <Route path="/inicio" element={<PaginaProductos />} />
          <Route path="/producto/:id" element={<DetalleProducto />} />
          <Route path="/compra-realizada" element={<CompraRealizada />} />
          <Route path="/LogIn" element={<InicioManual />} />
          <Route path="/EnviarCorreo" element={<EnviarCorreo/>} />
          <Route path="/RecuperarContraseña" element={<ActulizarContraseña/>} />
          <Route
            path="/Register"
            element={!isLoggedIn ? <RegisterForm /> : <Navigate to="/" />}
          />
          <Route path="/Profile" element={<MyPurchasesPage />} />
          <Route
            path="/MisProductos/*"
            element={
              <ProtectedRoute allowedRoles={["vendedor"]}>
                <ProductManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute allowedRoles={["administrador"]}>
                <AdminManagement />
              </ProtectedRoute>
            }
          />

          <Route path="/404" element={<Error404 />} />
          <Route path="*" element={<Navigate to="/404" />} />
        </Routes>
      </DiscountedProductProvider>
    </BrowserRouter>
  );
}

export default App;
