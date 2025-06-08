import Header from '@components/Header';
import TransportesContenido from '@components/perfil/ListarMisTransportes';
import Footer from "@components/footer";


const MisTransportes = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
        <h3 className="text-xl font-bold mb-4">Listar mis transportes</h3>
        <TransportesContenido />
      <Footer />
   
    </div>
  );
};

export default MisTransportes;
