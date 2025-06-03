import Header from "@/components/Header";
import Footer from "@components/footer";
import UserLayout from '@components/perfil/PerfilIzquierdo';
import QRCodeGenerator from "@/components/perfil/QrComprador";

const QRCompras = () => {
  return (
    <>
      <Header />
      <UserLayout>
        <main className="min-h-[calc(100vh-64px-40px)]"> {/* ajusta según altura header/footer */}
          <QRCodeGenerator />
        </main>
      </UserLayout>
      <Footer />
    </>
  );
};

export default QRCompras;
