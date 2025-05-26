import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCodigoCompra } from "@/services/Qr&codigocompradorServices";

const CodeGenerator = () => {
  const { id_compra } = useParams();
  const [codigo, setCodigo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCodigo = async () => {
      if (!id_compra) {
        setError("ID de compra no válido.");
        return;
      }

      try {
        const token = localStorage.getItem("token");
        const code = await getCodigoCompra(id_compra, token);
        setCodigo(code);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchCodigo();
  }, [id_compra]);

  if (error) return <div>{error}</div>;
  if (!codigo) return <div>Cargando...</div>;

  return (
    <div style={{ textAlign: "center", marginTop: "2rem" }}>

      <p>Código: {codigo}</p>
    </div>
  );
};

export default CodeGenerator;
