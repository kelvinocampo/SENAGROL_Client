import Header from "@/components/Header";
import Footer from "@components/footer";
import QRCodeGenerator from "@/components/perfil/QrComprador";

const QRCompras = () => {
  return (
    <>
      <Header />

        <main className="min-h-[calc(100vh-64px-40px)]"> {/* ajusta según altura header/footer */}
          <QRCodeGenerator />
        </main>

      <Footer />
    </>
  );
};

export default QRCompras;
