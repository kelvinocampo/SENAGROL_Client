
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import imagen from "@/assets/sin_foto.jpg";   // cámbialo por el avatar real
import { getCodigoCompra } from "@/services/Perfil/Qr&codigocompradorServices";

const CodeGenerator = () => {
  /* ---------- params / estado ---------- */
  const { id_compra } = useParams();
  const [codigo, setCodigo] = useState<string | null>(null);
  const [error, setError]   = useState<string | null>(null);

  /* ---------- fetch ---------- */
  useEffect(() => {
    const fetchCodigo = async () => {
      if (!id_compra) {
        setError("ID de compra no válido.");
        return;
      }
      try {
        const token  = localStorage.getItem("token");
        const code   = await getCodigoCompra(id_compra, token);
        setCodigo(code);
      } catch (err: any) {
        setError(err.message || "Error al obtener el código.");
      }
    };
    fetchCodigo();
  }, [id_compra]);

  /* ---------- UI ---------- */
  return (
    <div className="flex flex-col min-h-screen font-[Fredoka] bg-gradient-to-br from-gray-100 to-white">
      <main className="flex-grow flex flex-col items-center justify-start pt-16 px-4 text-center">
        {/* Avatar + datos de ejemplo (opcional) */}
        <img
          src={imagen}
          alt="Foto de perfil"
          className="w-32 h-32 rounded-full object-cover mb-4 shadow-md"
        />
        <h2 className="text-2xl font-bold text-gray-800">Carlos Rodriguez</h2>
        <p className="text-sm text-gray-500">Transportador</p>
        <p className="text-sm text-gray-600 mt-1">CarlosR8… | 318 976 2543</p>

        {/* Código */}
        <section className="mt-10 bg-white shadow-xl rounded-2xl px-6 py-8 max-w-md w-full">
          {error ? (
            <p className="text-red-500">{error}</p>
          ) : !codigo ? (
            <p className="text-gray-600">Cargando…</p>
          ) : (
            <>
              <h3 className="text-lg font-semibold mb-4 text-gray-700">
                Código de la compra
              </h3>
              <p className="text-3xl font-extrabold tracking-widest text-green-700 select-all">
                {codigo}
              </p>
            </>
          )}
        </section>
      </main>
    </div>
  );
};

export default CodeGenerator;
