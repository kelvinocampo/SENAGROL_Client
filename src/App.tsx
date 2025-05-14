// import InicioManual from '@pages/inicioFormulario';
// import Usuarioregister from './components/Usuarioregister/RegisterForm';
// import UsuarioEditarPerfil from './components/UsuarioEditarPerfil/UserEditProfile'
// import FormularioTransportador from './pages/FormularioTransportador';

// function App() {
//   return (
//     <>
//       {/* {<InicioManual />} */}
//       {/* {<Usuarioregister />} */}
//       {<UsuarioEditarPerfil />}

//     </>
//   );
// }

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UsuarioEditarPerfil from './components/UsuarioEditarPerfil/UserEditProfile';
import FormularioTransportador from './pages/FormularioTransportador';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UsuarioEditarPerfil />} />
        <Route path="/formulario-transportador" element={<FormularioTransportador />} />
      </Routes>
    </Router>
  );
}

export default App;

