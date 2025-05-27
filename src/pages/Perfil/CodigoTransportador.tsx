import Header from '@components/Header';
import UserLayout from '@components/perfil/PerfilIzquierdo';
import Footer from '@/components/Footer';
import ManualCodeForm from '@components/perfil/CodigoTransportador';


const CodigoManual = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <UserLayout>
        <ManualCodeForm />
      </UserLayout>
      <Footer />
   
    </div>
  );
};

export default CodigoManual;
