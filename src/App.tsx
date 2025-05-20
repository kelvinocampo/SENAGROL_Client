import { ProductManagement } from "@pages/ProductsManagement";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { InicioManual } from "@pages/Inicio";
import { AdminManagement } from "./pages/AdminManagement";
import { RegisterForm } from "@components/Usuarioregister/RegisterForm";
import MyPurchasesPage from "@pages/ListarMisCompras";
import { ProtectedRoute } from "@components/ProtectedRoute";
import Error404 from "@pages/Error404";
import { IA } from "./pages/IA";

function App() {
  const isLoggedIn = !!localStorage.getItem('token'); // Esto puede mejorar con un contexto

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/LogIn" element={<InicioManual />} />
        <Route
          path="/Register"
          element={!isLoggedIn ? <RegisterForm /> : <Navigate to="/" />}
        />
        <Route path="/Profile" element={<MyPurchasesPage />} />

        <Route
          path="/MisProductos/*"
          element={
            <ProtectedRoute allowedRoles={['vendedor']}>
              <ProductManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute allowedRoles={['administrador']}>
              <AdminManagement />
            </ProtectedRoute>
          }
        />
        <Route path="/IA" element={<IA />} />

        <Route path="/404" element={<Error404 />} />
        <Route path="*" element={<Navigate to="/404" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
