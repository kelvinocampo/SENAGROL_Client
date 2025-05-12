import Header from '@components/Header';
import UserLayout from '@components/perfil/PerfilIzquierdo';
import ListarMiscompras from '@components/perfil/ListarMiscompras';


const MyPurchasesPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <UserLayout>
        <h3 className="text-xl font-bold mb-4">Listar mis compras</h3>
        <ListarMiscompras />
      </UserLayout>
   
    </div>
  );
};

export default MyPurchasesPage;
