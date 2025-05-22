import Header from '@components/Header';
import UserLayout from '@components/perfil/PerfilIzquierdo';
import TransportesContenido from '@components/perfil/ListarMisTransportes';
import Footer from '@components/footer';


const MisTransportes = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <UserLayout>
        <h3 className="text-xl font-bold mb-4">Listar mis transportes</h3>
        <TransportesContenido />
      </UserLayout>
      <Footer />
   
    </div>
  );
};

export default MisTransportes;
