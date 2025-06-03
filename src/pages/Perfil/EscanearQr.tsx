import Header from '@components/Header';
import UserLayout from '@components/perfil/PerfilIzquierdo';
import Footer from "@components/footer";
import QrScanner from '@components/perfil/EscanearQr';


const EscanearQr = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <UserLayout>
        <QrScanner />
      </UserLayout>
      <Footer />
   
    </div>
  );
};

export default EscanearQr;
