import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DetalleProducto from "./pages/producto/DetalleProducto";
import PaginaProductos from "./pages/producto/PaginaProductos";
import CompraRealizada from "./pages/producto/CompraExitosa";


// importa otras páginas aquí...

function App() {
  return (
    <Router>
      <Routes>
        {/* tus otras rutas aquí */}
        <Route path="/" element={<PaginaProductos />} />
        <Route path="/producto/:id" element={<DetalleProducto />} />
         <Route path="/compra-realizada" element={<CompraRealizada />} />

      </Routes>
    </Router>
  );
}

export default App;
