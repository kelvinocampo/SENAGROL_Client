/* import Header from '@components/Header'; */
import UserLayout from '@components/perfil/PerfilIzquierdo';
import Transportadores from '@components/perfil/ListaTransportadores';
import Header from '@components/Header';


const Transporte = () => {
  return (
    <div className="min-h-screen bg-white">
       <Header />
      <UserLayout>
        <h3 className="text-xl font-bold mb-4">Listar Transportadores</h3>
        <Transportadores  />
      </UserLayout>
   
    </div>
  );  
};

export default Transporte;
