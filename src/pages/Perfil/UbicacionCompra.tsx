// src/pages/UbicacionCompra.tsx
import { useParams } from "react-router-dom";
import MapaUbicacion from "@/components/perfil/UbicacionTransportador";

const UbicacionCompra = () => {
  const { id } = useParams<{ id: string }>();

  if (!id) return <p>Compra no especificada</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Ubicación de la Compra #{id}</h1>
      <MapaUbicacion id_compra={parseInt(id)} />
    </div>
  );
};

export default UbicacionCompra;