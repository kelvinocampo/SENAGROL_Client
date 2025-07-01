import Header from '@components/Header';
import TransportesContenido from '@components/perfil/ListarMisTransportes';
import Footer from "@components/footer";
import UserProfileCard from '@/components/perfil/UserProfileCard';

const MisTransportes = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E1FFD9] to-[#F0F0F0] flex flex-col">
      <Header />
      <div className="flex p-10 w-full gap-6">
          <UserProfileCard />
        <div className="w-full md:w-3/4">
          <TransportesContenido />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default MisTransportes;
