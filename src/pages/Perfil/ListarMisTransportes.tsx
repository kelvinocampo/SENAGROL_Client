import Header from '@components/Header';
import TransportesContenido from '@components/perfil/ListarMisTransportes';
import Footer from "@components/footer";


const MisTransportes = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
        <TransportesContenido />
      <Footer />
   
    </div>
  );
};

export default MisTransportes;
