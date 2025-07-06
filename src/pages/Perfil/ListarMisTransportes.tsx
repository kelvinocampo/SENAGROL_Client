import { useState, useEffect } from 'react';
import Header from '@components/Header';
import TransportesContenido from '@components/perfil/ListarMisTransportes';
import Footer from "@components/footer";
import UserProfileCard from '@/components/perfil/UserProfileCard';

const MisTransportes = () => {
  const [loading, setLoading] = useState(true);

  // Simulamos carga para aplicar animación de loading
  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 800); // Ajusta el tiempo si deseas
    return () => clearTimeout(timeout);
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50">
        <div className="w-20 h-20 border-8 border-green-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-6 text-xl font-semibold text-gray-700">Cargando transportes...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E1FFD9] to-[#F0F0F0] flex flex-col">
      <Header />
      <main className="flex-grow w-full px-4 py-6 md:py-10">
        <div className="flex flex-col md:flex-row gap-6 max-w-screen-xl mx-auto w-full">
          <aside className="w-full md:w-1/4">
            <UserProfileCard />
          </aside>

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
