import { BrowserRouter, Route, Routes } from "react-router-dom";

// Páginas
import { InicioManual } from "@pages/Inicio";
import { ProductManagement } from "@pages/ProductsManagement";
import { AdminManagement } from "@pages/AdminManagement";
import MyPurchasesPage from "@pages/ListarMisCompras";

// Componentes
import { RegisterForm } from "@components/Usuarioregister/RegisterForm";
import CodeGenerator from "@components/ProductsManagement/Codigounico";
import QrView from "./components/ProductsManagement/codigoqr";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas de Autenticación */}
        <Route path="/LogIn" element={<InicioManual />} />
        <Route path="/Register" element={<RegisterForm />} />

        {/* Perfil del Usuario */}
        <Route path="/Profile" element={<MyPurchasesPage />} />

        {/* Gestión de Productos */}
        <Route path="/MisProductos/*" element={<ProductManagement />} />

        {/* Gestión del Administrador */}
        <Route path="/admin/*" element={<AdminManagement />} />

        {/* Visualización de Código de Compra */}
        <Route path="/:id_compra" element={<CodeGenerator />} /> 

        <Route path="/qr/:id_compra" element={<QrView />} />


  

      </Routes>
    </BrowserRouter>
  );
}

export default App;
