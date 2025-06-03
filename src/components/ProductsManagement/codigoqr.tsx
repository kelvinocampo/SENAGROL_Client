import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCodigoCompra } from "@/services/QrServices";
import { QRCodeCanvas } from "qrcode.react";
import Header from "../Header";
import Footer from "@components/footer";
import imagen from "../../assets/sin_foto.jpg";
import { motion } from "framer-motion";

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

      <motion.main
        className="flex-grow flex flex-col items-center justify-start px-4 py-12 bg-gradient-to-br from-gray-100 to-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
      >
        <motion.div
          className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full text-center"
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <motion.img
            src={imagen}
            alt="Foto de perfil"
            className="w-32 h-32 rounded-full object-cover mx-auto mb-4 shadow-md"
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 200 }}
          />
          <h2 className="text-2xl font-bold text-gray-800 mb-1">Carlos Rodriguez</h2>
          <p className="text-sm text-gray-500">Transportador</p>
          <p className="text-sm text-gray-600 mt-1">CarlosR8... | 3189762543</p>

          <motion.div
            className="mt-10"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            {error ? (
              <motion.div
                className="text-red-500 mt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {error}
              </motion.div>
            ) : !codigo ? (
              <motion.div
                className="text-gray-600 mt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                Cargando...
              </motion.div>
            ) : (
              <>
                <h2 className="text-lg font-semibold mb-4 mt-6 text-gray-700">Código QR:</h2>
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 100, damping: 15 }}
                  className="inline-block"
                >
                  <QRCodeCanvas value={codigo} size={200} />
                </motion.div>
              </>
            )}
          </motion.div>
        </motion.div>
      </motion.main>

      <Footer />
    </div>
  );
};

export default QrView;
