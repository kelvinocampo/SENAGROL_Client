import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCodigoCompra } from "@/services/QrServices";
import { QRCodeCanvas } from "qrcode.react";
import Header from "../Header";
import Footer from "@components/Footer";
import imagen from "../../assets/sin_foto.jpg";

const QrView = () => {
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
        setError(err.message || "Error al obtener el código.");
      }
    };

    fetchCodigo();
  }, [id_compra]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow flex flex-col items-center justify-start mt-12 px-4 bg-gray-50 text-center">
        {/* Perfil del usuario */}
        <img
          src={imagen}
          alt="Foto de perfil"
          className="w-32 h-32 rounded-full object-cover mb-4"
        />
        <h2 className="text-xl font-semibold">Carlos Rodriguez</h2>
        <p className="text-500">Transportador</p>
        <p className="text-sm text-600 mt-1">CarlosR8... | 3189762543</p>

        {/* Código QR */}
        <div className="mt-10">
          {error ? (
            <div className="text-red-500 mt-6">{error}</div>
          ) : !codigo ? (
            <div className="text-gray-600 mt-6">Cargando...</div>
          ) : (
            <>
              <h2 className="text-lg font-semibold mb-4 mt-6">Código QR:</h2>
              <QRCodeCanvas value={codigo} size={200} />
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default QrView;
