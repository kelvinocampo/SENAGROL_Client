import Header from "@components/Header";
import Footer from "@components/footer";
import { IAProvider } from "@/contexts/IA";
import { InputIA } from "@/components/IA/InputIA";
import { HistoryIA } from "@/components/IA/HistoryIA";
import FallingLeaves from "@/components/FallingLeaf";

export const IA = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#e9ffef] to-[#c7f6c3] font-[Fredoka] relative">
      <div className="fixed inset-0 pointer-events-none z-0">
        <FallingLeaves quantity={20} />
      </div>

      <Header />

      <IAProvider>
        {/* Contenedor principal con grow */}
        <main className="flex flex-col flex-grow w-full max-w-8xl mx-auto px-4 sm:px-8 pt-6">
          <h2 className="text-2xl text-[#2e7c19] font-bold mb-4">Asistente</h2>

          {/* Chat history que se expande */}
          <div className="flex flex-col relative gap-4 flex-grow overflow-y-auto mb-6">
            <HistoryIA />
          </div>

          <div className="mt-auto relative my-10">
            <InputIA />
          </div>
        </main>
      </IAProvider>

      <Footer />
    </div>
  );
};
