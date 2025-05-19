import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PaginaProductos from "./pages/producto/PaginaProductos";
import InicioManual from '@pages/inicio/inicioFormulario' 
import Usuarioregister from './components/Usuarioregister/RegisterForm';
import DetalleProducto from "./pages/producto/DetalleProducto";
import CompraRealizada from "./pages/producto/CompraExitosa";
import CerrarSesion from "./pages/producto/CerrarSesion";

//import ConfirmarCierreSesion from './components/CerrarSesion'; // Asegúrate de que este componente exista


// importa otras páginas aquí...

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<InicioManual />} />
        <Route path="/registro" element={<Usuarioregister />} />
        <Route path="/inicio" element={<PaginaProductos />} />
        <Route path="/producto/:id" element={<DetalleProducto />} />
        <Route path="/compra-realizada" element={<CompraRealizada />} />
        <Route path="/cerrar-sesion" element={<CerrarSesion />} />

        {/*  */}

      </Routes>
    </Router>
  );
}

export default App;
