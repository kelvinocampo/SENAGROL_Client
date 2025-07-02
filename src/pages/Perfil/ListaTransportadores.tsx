import { useParams } from 'react-router-dom';
import Transportadores from '@components/perfil/ListaTransportadores';


const Transporte = () => {
  const { id_compra } = useParams<{ id_compra: string }>();

  if (!id_compra) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#E1FFD9] to-[#F0F0F0] ">
          <p className="text-red-500">Error: No se especificó la compra a asignar.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E1FFD9] to-[#F0F0F0] ">
        <Transportadores id_compra={Number(id_compra)} />

    </div>
  );
};

export default Transporte;
