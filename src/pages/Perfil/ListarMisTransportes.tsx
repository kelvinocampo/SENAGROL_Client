import Header from '@components/Header';
import TransportesContenido from '@components/perfil/ListarMisTransportes';
import Footer from "@components/footer";
import UserProfileCard from '@/components/perfil/UserProfileCard';

const MisTransportes = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E1FFD9] to-[#F0F0F0] flex flex-col">
      <Header />

      <main className="flex-grow w-full px-4 py-6 md:py-10">
        <div className="flex flex-col md:flex-row gap-6 max-w-screen-xl mx-auto w-full">
          {/* Tarjeta de perfil */}
          <aside className="w-full md:w-1/4">
            <UserProfileCard />
          </aside>

          {/* Contenido principal */}
          <section className="w-full md:w-3/4 overflow-hidden">
            <div className="w-full">
              <TransportesContenido />
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MisTransportes;
