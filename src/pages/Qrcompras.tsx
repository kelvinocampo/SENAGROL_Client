// src/components/GenerateQRCode.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import QRCode from "react-qr-code";

interface GenerateQRCodeProps {
  token: string;
  id_compra: number;
}

const GenerateQRCode = ({ token, id_compra }: GenerateQRCodeProps) => {
  const [code, setCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCode = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/code/${id_compra}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          setCode(response.data.code);
        } else {
          setError("No se pudo obtener el código.");
        }
      } catch (err) {
        console.error(err);
        setError("Ocurrió un error al obtener el código.");
      }
    };

    fetchCode();
  }, [id_compra, token]);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Código QR de la Compra</h2>

      {error && <p className="text-red-600">{error}</p>}

      {code ? (
        <div className="flex flex-col items-center gap-4">
          <QRCode value={code} size={200} />
          <p className="text-gray-600 font-mono">Código: {code}</p>
        </div>
      ) : (
        !error && <p className="text-gray-500">Cargando código QR...</p>
      )}
    </div>
  );
};

export default GenerateQRCode;
