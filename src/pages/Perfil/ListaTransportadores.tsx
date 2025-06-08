import { useParams } from 'react-router-dom';
import Transportadores from '@components/perfil/ListaTransportadores';


const Transporte = () => {
  const { id_compra } = useParams<{ id_compra: string }>();

  if (!id_compra) {
    return (
      <div className="min-h-screen bg-white">
          <p className="text-red-500">Error: No se especificó la compra a asignar.</p>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
        <Transportadores id_compra={Number(id_compra)} />

    </div>
  );
};

export default Transporte;
