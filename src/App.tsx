 import { Routes, Route } from "react-router-dom";
import MyPurchasesPage from "@pages/ListarMisCompras"; 
import Transporte from "@pages/ListaTransportadores"; 
import Perfilusuario from "@pages/perfilUsuario";
import Layout from "@/pages/Qrcompras";
import Layout1 from "@/pages/CodigoCompras";
 
/*  import ScanQRCode from "@pages/Qrcompras";  */

function App() {
  return (
  <Routes>
    <Route path="/" element={<MyPurchasesPage />} />
    <Route path="/transportadores" element={<Transporte />} />
    <Route path="/perfil" element={<Perfilusuario />} />
      <Route path="/qrcomprador/:id_compra" element={<Layout />} />
      <Route path="/codigocomprador/:id_compra" element={<Layout1 />} />

  </Routes>
 
);
}

export default App;

{/* <Route path="/codigocomprador/:id_compra" element={<CodigoComprador />} /> */}