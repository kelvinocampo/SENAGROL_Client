import Header from "@components/Header";
import Footer from "@components/footer";
import { IAProvider } from "@/contexts/IA";
import { InputIA } from "@/components/IA/InputIA";
import { HistoryIA } from "@/components/IA/HistoryIA";

export const IA = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#e9ffef] to-[#c7f6c3] font-[Fredoka]">
      <Header />

      <main className="flex-grow w-full max-w-8xl mx-auto px-4 sm:px-8 pt-6 pb-12">
        <IAProvider>
          <h2 className="text-2xl text-[#2e7c19] font-bold mb-4">Asistente</h2>

          {/* Chat history */}
          <div className="flex flex-col gap-4 mb-6">
            <HistoryIA />
          </div>

          {/* Input */}
          <div className="mt-auto">
            <InputIA />
          </div>
        </IAProvider>
      </main>

      <Footer />
    </div>
  );
};
