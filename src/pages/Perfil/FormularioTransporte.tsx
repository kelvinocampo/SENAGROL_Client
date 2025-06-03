import Header from '@components/Header';
import UserLayout from '@components/perfil/PerfilIzquierdo';
import Footer from "@components/footer";
import FormularioTransportador from '@components/perfil/FormularioTransportador';


const FormularioTransporte = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <UserLayout>
        <FormularioTransportador />
      </UserLayout>
      <Footer />
   
    </div>
  );
};

export default FormularioTransporte;
