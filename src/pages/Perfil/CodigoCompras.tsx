import Header from "@components/Header";
import Footer from "@components/footer";
import CodeGenerator from "@components/perfil/CodigoComprador";
import { BackToHome } from "@components/admin/common/BackToHome";

const CodigoCompras = () => {
  return (
    <>
      <Header />
        <main className="min-h-[calc(100vh-64px-40px)]"> {/* ajusta según altura header/footer */}
          <BackToHome/>
          <CodeGenerator />
        </main>

      <Footer />
    </>
  );
};

export default CodigoCompras;
