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
import ActulizarContraseña from "./pages/inicio/UpdatePassword";
import QuienesSomos from "./pages/inicio/QuienesSomos";
import PoliticasPrivacidad from "./pages/inicio/PoliticasPrivacidad";
import EnviarCorreo from "./pages/inicio/RecuperaraContraseña";
import { DiscountedProductProvider } from "./contexts/Product/ProductsManagement";
import PerfilUsuarioUnico from "./components/perfil/UserEditProfile";
import FormularioTransporte from "./pages/FormularioTransporte";
import Layout1 from "./pages/CodigoCompras";
import Transporte from "./pages/ListaTransportadores";
import Perfilusuario from "./pages/perfilUsuario";
import { Layout } from "lucide-react";
import MisTransportes from "./pages/ListarMisTransportes";
import QRCompras from "./pages/Qrcompras";
import CodigoCompras from "./pages/CodigoCompras";

function App() {

  return (
    <BrowserRouter>
      <DiscountedProductProvider>
        <Routes>
          <Route path="/" element={<PaginaProductos />} />
          <Route path="/inicio" element={<PaginaProductos />} />
          <Route path="/producto/:id" element={<DetalleProducto />} />
          <Route path="/Login" element={<InicioManual />} />
          <Route path="/EnviarCorreo" element={<EnviarCorreo />} />
          <Route path="/RecuperarContraseña" element={<ActulizarContraseña />} />
          <Route path="/QuienesSomos" element={<QuienesSomos />} />
          <Route path="/PoliticasPrivacidad" element={<PoliticasPrivacidad />} />
          <Route
            path="/Register"
            element={<RegisterForm />}
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


          {<Route path="/perfil" element={<PerfilUsuarioUnico />} />}
          {<Route path="/miscompras" element={<MyPurchasesPage />} />}
          {<Route path="/formulariotransportador" element={<FormularioTransporte />} />}
          <Route path="/compra/:id_compra/qr" element={<Layout1 />} />
          <Route path="/transporte/" element={<Transporte />} />
          <Route path="/perfil" element={<Perfilusuario />} />
          <Route path="/compra/:id_compra/codigo" element={<Layout />} />

          <Route path="/mistransportes" element={<MisTransportes />} />
          <Route path="/escanear/:id_compra" element={<QRCompras />} />
          <Route path="/codigo/:id_compra" element={<CodigoCompras />} />
          {/* <Route path="/codigo/:id_compra" element={<TransportCodeForm />} /> */}


          {/* <Route path="/assign/:id_compra/:id_transportador" element={<Transportadores />} /> */}

        </Routes>
      </DiscountedProductProvider>
    </BrowserRouter>
  );
}

export default App;
