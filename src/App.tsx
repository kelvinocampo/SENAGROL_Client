import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { DiscountedProductProvider } from "./contexts/Product/ProductsManagement";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PaginaProductos from "@pages/producto/PaginaProductos";
import DetalleProducto from "@pages/producto/DetalleProducto";
import { InicioManual } from "@pages/Inicio";
import ActulizarContraseña from "@pages/inicio/UpdatePassword";
import QuienesSomos from "@pages/inicio/QuienesSomos";
import PoliticasPrivacidad from "@pages/inicio/PoliticasPrivacidad";
import EnviarCorreo from "@pages/inicio/RecoverPassword";
import PerfilUsuarioUnico from "@components/perfil/UserEditProfile";
import MyPurchasesPage from "@/pages/Perfil/ListarMisCompras";
import FormularioTransporte from "@/pages/Perfil/FormularioTransporte";
import Transporte from "@/pages/Perfil/ListaTransportadores";
import MisTransportes from "@/pages/Perfil/ListarMisTransportes";
import QRCompras from "@/pages/Perfil/Qrcompras";
import CodigoCompras from "@/pages/Perfil/CodigoCompras";
import QrView from "@components/ProductsManagement/codigoqr";
import CodeGenerator from "@components/ProductsManagement/codigounico";
import { IA } from "@pages/IA";
import Transportadores from "@/pages/Perfil/ListaTransportadores";
import UbicacionCompra from "@/pages/Perfil/UbicacionCompra";
import { Chats } from "@pages/Chats/Chats";
import { ProductManagement } from "@pages/Perfil/ProductsManagement";
import { AdminManagement } from "@pages/AdminManagement";
import { RegisterForm } from "@components/Usuarioregister/RegisterForm";
import { ProtectedRoute } from "@components/ProtectedRoute";
import Error404 from "@pages/Error404";
import PagoWrapper from "./pages/producto/PagoWrapper";

function AutoLogoutWrapper({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  useEffect(() => {
    const INACTIVITY_MS = 60 * 60 * 1000; 
    let timeoutId: ReturnType<typeof setTimeout>;

    const cerrarSesion = () => {
      localStorage.clear();
      navigate("/");
    };

    const resetTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(cerrarSesion, INACTIVITY_MS);
    };

    const eventos = ["mousemove", "keydown", "click", "scroll", "touchstart"];
    eventos.forEach((ev) => window.addEventListener(ev, resetTimer));
    resetTimer();

    return () => {
      eventos.forEach((ev) => window.removeEventListener(ev, resetTimer));
      clearTimeout(timeoutId);
    };
  }, [navigate]);

  return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <DiscountedProductProvider>
        <AutoLogoutWrapper>
          <Routes>
            <Route path="/" element={<PaginaProductos />} />
            <Route path="/producto/:id" element={<DetalleProducto />} />
            <Route path="/Login" element={<InicioManual />} />
            <Route path="/EnviarCorreo" element={<EnviarCorreo />} />
            <Route path="/RecuperarContraseña" element={<ActulizarContraseña />} />
            <Route path="/QuienesSomos" element={<QuienesSomos />} />
            <Route path="/PoliticasPrivacidad" element={<PoliticasPrivacidad />} />
            <Route path="/Register" element={<RegisterForm />} />
            <Route path="/perfil" element={<PerfilUsuarioUnico />} />
            <Route path="/miscompras" element={<MyPurchasesPage />} />
            <Route path="/transporte" element={<Transporte />} />
            <Route path="/mistransportes" element={<MisTransportes />} />
            <Route path="/compra/:id_compra/qr" element={<QRCompras />} />
            <Route path="/compra/:id_compra/codigo" element={<CodigoCompras />} />
            <Route path="/venta/qr/:id_compra" element={<QrView />} />
            <Route path="/venta/codigo/:id_compra" element={<CodeGenerator />} />
            <Route path="/IA" element={<IA />} />
            <Route path="/transporte/:id_compra" element={<Transportadores />} />
            <Route path="/chats/*" element={<Chats />} />
            <Route path="/ubicacion/:id" element={<UbicacionCompra />} />
            <Route path="/pago/:id" element={<PagoWrapper />} />
            

            <Route
              path="/MisProductos/*"
              element={
                <ProtectedRoute allowedRoles={["vendedor"]}>
                  <ProductManagement />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/formulariotransportador"
              element={
                <ProtectedRoute allowedRoles={["vendedor","comprador","administrador"]}>
                  <FormularioTransporte />  
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
        </AutoLogoutWrapper>
      </DiscountedProductProvider>
    </BrowserRouter>
  );
}

export default App;
