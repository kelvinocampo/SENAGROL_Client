/*  import InicioManual from '@pages/inicioFormulario'  */
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MyPurchasesPage from '@pages/ListarMisCompras';
import Transporte from '@pages/ListaTransportadores';
import ListarMisCompras from '@pages/ListarMisCompras';

function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<ListarMisCompras />} />
        <Route path="/" element={<MyPurchasesPage />} />
        <Route path="/transportadores" element={<Transporte />} />
      </Routes>
    </Router>
  );
}

export default App;
