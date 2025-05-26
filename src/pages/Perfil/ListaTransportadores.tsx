import { useParams } from 'react-router-dom';
import UserLayout from '@components/perfil/PerfilIzquierdo';
import Transportadores from '@components/perfil/ListaTransportadores';
import Header from '@components/Header';

const Transporte = () => {
  const { id_compra } = useParams<{ id_compra: string }>();

  if (!id_compra) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <UserLayout>
          <h3 className="text-xl font-bold mb-4">Listar Transportadores</h3>
          <p className="text-red-500">Error: No se especificó la compra a asignar.</p>
        </UserLayout>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <UserLayout>
        <h3 className="text-xl font-bold mb-4">Listar Transportadores</h3>
        <Transportadores id_compra={Number(id_compra)} />
      </UserLayout>
    </div>
  );
};

export default Transporte;
