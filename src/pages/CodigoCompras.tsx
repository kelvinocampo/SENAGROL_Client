import Header from "@/components/Header";
import Footer from "@/components/footer";
import UserLayout from '@components/perfil/PerfilIzquierdo';
import CodigoComprador from "@/components/perfil/CodigoComprador";

const Layout1 = () => {
  return (
    <>
      <Header />
      <UserLayout>
        <main className="min-h-[calc(100vh-64px-40px)]"> {/* ajusta según altura header/footer */}
          <CodigoComprador />
        </main>
      </UserLayout>
      <Footer />
    </>
  );
};

export default Layout1;
