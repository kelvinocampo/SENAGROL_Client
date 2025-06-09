import Header from "@components/Header";
import Footer from "@components/footer";
import ManualCodeForm from "@components/perfil/CodigoTransportador";

const CodigoManual = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <ManualCodeForm />

      <Footer />
    </div>
  );
};

export default CodigoManual;
