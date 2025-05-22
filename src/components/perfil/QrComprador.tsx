import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import QRCode from "react-qr-code";
import { getCodigoCompra } from "@/services/QrcompradorServices";

const QRCodeGenerator = () => {
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
  
        <div
          style={{display: "flex", flexDirection: "column",justifyContent: "center",alignItems: "center",
            height: "80vh",marginTop: "2rem", gap: "1rem",    
          }}
        >
        
          <QRCode value={codigo} size={256} />
       
        </div>
      );
      

};

export default QRCodeGenerator;
