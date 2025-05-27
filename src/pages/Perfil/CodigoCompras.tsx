import Header from "@components/Header";
import Footer from "@components/Footer";
import UserLayout from '@components/perfil/PerfilIzquierdo';
import CodeGenerator from "@components/perfil/CodigoComprador";

const CodigoCompras = () => {
  return (
    <>
      <Header />
      <UserLayout>
        <main className="min-h-[calc(100vh-64px-40px)]"> {/* ajusta según altura header/footer */}
          <CodeGenerator />
        </main>
      </UserLayout>
      <Footer />
    </>
  );
};

export default CodigoCompras;
