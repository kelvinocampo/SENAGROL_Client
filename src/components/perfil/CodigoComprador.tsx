import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { QRService } from "@/services/QrcompradorServices";

const CodigoComprador = () => {
  const { id_compra } = useParams();
  const [codigo, setCodigo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchCodigo = async () => {
      try {
        if (!id_compra) throw new Error("ID de compra no definido");
        if (!token) throw new Error("No autenticado");

        const result = await QRService.generateCode(Number(id_compra), token);
        setCodigo(result);
      } catch (err) {
        setError("No se pudo obtener el código.");
      }
    };

    fetchCodigo();
  }, [id_compra, token]);

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4 bg-white">
      <h2 className="text-lg font-bold">Código de la Compra #{id_compra}</h2>
      {error && <p className="text-red-500">{error}</p>}
      {codigo ? (
        <div className="p-4 bg-gray-100 rounded text-xl font-mono">{codigo}</div>
      ) : (
        !error && <p>Cargando código...</p>
      )}
    </div>
  );
};

export default CodigoComprador;
