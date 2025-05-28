import { ProductManagement } from "@/pages/Perfil/ProductsManagement";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { InicioManual } from "@pages/Inicio";
import { AdminManagement } from "@pages/AdminManagement";
import { RegisterForm } from "@components/Usuarioregister/RegisterForm";
import MyPurchasesPage from "@/pages/Perfil/ListarMisCompras";
import { ProtectedRoute } from "@components/ProtectedRoute";
import Error404 from "@pages/Error404";
import PaginaProductos from "@pages/producto/PaginaProductos";
import DetalleProducto from "./pages/producto/DetalleProducto";
import ActulizarContraseña from "./pages/inicio/UpdatePassword";
import QuienesSomos from "./pages/inicio/QuienesSomos";
import PoliticasPrivacidad from "./pages/inicio/PoliticasPrivacidad";
import EnviarCorreo from "./pages/inicio/RecoverPassword";
import { DiscountedProductProvider } from "./contexts/Product/ProductsManagement";
import PerfilUsuarioUnico from "./components/perfil/UserEditProfile";
import FormularioTransporte from "./pages/Perfil/FormularioTransporte";
import Transporte from "./pages/Perfil/ListaTransportadores";
import Perfilusuario from "./pages/Perfil/perfilUsuario";
import MisTransportes from "./pages/Perfil/ListarMisTransportes";
import QRCompras from "./pages/Perfil/Qrcompras";
import CodigoCompras from "./pages/Perfil/CodigoCompras";
import EscanearQr from "@/pages/Perfil/EscanearQr";
import CodigoManual from "@/pages/Perfil/CodigoTransportador";
import QrView from "@components/ProductsManagement/codigoqr";
import CodeGenerator from "@components/ProductsManagement/codigounico";
import { IA } from "@pages/IA";
import Transportadores from "@/pages/Perfil/ListaTransportadores";
import { ChatsList } from "./pages/Chats/ChatList";
import { Chat } from "./pages/Chats/Chat";
import { UserList } from "./pages/Chats/UserList";


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


          <Route path="/compra/:id_compra/qr" element={<QRCompras />} />
          <Route path="/compra/:id_compra/codigo" element={<CodigoCompras />} />


          <Route path="/transporte" element={<Transporte />} />
          <Route path="/perfil" element={<Perfilusuario />} />

          <Route path="/mistransportes" element={<MisTransportes />} />

          <Route path="/escanear/:id_compra" element={<EscanearQr />} />
          <Route path="/codigo/:id_compra" element={<CodigoManual />} />

          <Route path="/venta/qr/:id_compra" element={<QrView />} />
          <Route path="/venta/codigo/:id_compra" element={<CodeGenerator />} />
          <Route path="/IA" element={<IA />} />
          <Route path="/transporte/:id_compra" element={<Transportadores />} />

          <Route path="/chats" element={<ChatsList/>}/>
          <Route path="/chat/:id_chat" element={<Chat/>}/>
          <Route path="/chats/usuarios" element={<UserList/>}/>

        </Routes>
      </DiscountedProductProvider>
    </BrowserRouter>
  );
}

export default App;
