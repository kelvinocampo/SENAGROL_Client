import Header from '@components/Header';
import Footer from "@components/footer";
import QrScanner from '@components/perfil/EscanearQr';


const EscanearQr = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
    
        <QrScanner />

      <Footer />
   
    </div>
  );
};

export default EscanearQr;
