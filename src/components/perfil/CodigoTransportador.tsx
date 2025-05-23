/* // src/components/TransportCodeForm.tsx
import React, { useState } from "react";
import { receiveBuyCode } from "@services/EscanearQr"; 

const TransportCodeForm: React.FC = () => {
  const [code, setCode] = useState<string>("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    const trimmed = code.trim();
    if (!trimmed) {
      setMessage("⚠️ Por favor ingresa un código válido.");
      return;
    }

    const token = localStorage.getItem("token") || "";
    const id_user = parseInt(localStorage.getItem("id_user") || "0", 10);
    if (!token || !id_user) {
      setMessage("⚠️ No se encontró nad.");
      return;
    }

    setLoading(true);
    try {
      const res = await receiveBuyCode(codigo, token);
      if (res.success) {
        setMessage(res.message || "✅ Operación exitosa.");
      } else {
        setMessage("❌ " + (res.message || res.error || "Error desconocido."));
      }
    } catch (err: any) {
      setMessage("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Ingresar Código de Transporte</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Código único"
          value={code}
          onChange={e => setCode(e.target.value)}
          className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#48BD28] "
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-[#48BD28]  text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? "Procesando..." : "Enviar Código"}
        </button>
      </form>
      {message && <p className="mt-4 text-center text-lg">{message}</p>}
    </div>
  );
};

export default TransportCodeForm;
 */