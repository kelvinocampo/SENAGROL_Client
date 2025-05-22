 import { Routes, Route } from "react-router-dom";
/* import MyPurchasesPage from "@pages/ListarMisCompras"; 
import Transporte from "@pages/ListaTransportadores"; 
import Perfilusuario from "@pages/perfilUsuario"; 
import Layout1 from "@/pages/Qrcompras";
 import Layout from "@/pages/CodigoCompras";  */
/*  import Transportadores from "@/components/perfil/ListaTransportadores"; */

import MisTransportes from "@/pages/ListarMisTransportes";
import EscanearQr from "@/components/perfil/EscanearQr";

 


function App() {
  return (
    <Routes>

  {/*     <Route path="/" element={<MyPurchasesPage />} />
      <Route path="/compra/:id_compra/qr" element={<Layout1 />} />
      <Route path="/transporte/" element={<Transporte />} />
      <Route path="/perfil" element={<Perfilusuario />} />
      <Route path="/compra/:id_compra/codigo" element={<Layout />} /> */}

      <Route path="/" element={<MisTransportes />} />
      <Route path="/escanear/:id_compra" element={<EscanearQr />} />


{/*       <Route path="/assign/:id_compra/:id_transportador" element={<Transportadores />} />  */}

    </Routes>
  );
}

export default App;

