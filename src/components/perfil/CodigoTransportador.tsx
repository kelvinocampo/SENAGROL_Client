import React, { useState } from "react";
import { receiveBuyCode } from "@/services/Perfil/EscanearQr&codigo"; // Ajusta la ruta si es necesario

const ManualCodeForm: React.FC = () => {
  const [codigo, setCodigo] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [status, setStatus] = useState<"success" | "error" | "idle">("idle");
  const [focused, setFocused] = useState(false);

  const token = localStorage.getItem("token") || "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await receiveBuyCode(codigo, token);
      setMessage(res.message || "Compra actualizada correctamente.");
      setStatus("success");
    } catch (err: any) {
      setMessage(err.message || "Ocurrió un error.");
      setStatus("error");
    }
  };

  const inputClass = focused
    ? "border-[#48BD28] focus:ring-[#48BD28]"
    : status === "success"
    ? "border-[#48BD28] focus:ring-[#48BD28]"
    : status === "error"
    ? "border-red-500 focus:ring-red-500"
    : "border-gray-300 focus:ring-gray-300";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Ingresar Código de Compra</h1>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-6 rounded shadow"
      >
        <input
          type="text"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`w-full p-2 border rounded mb-4 focus:outline-none focus:ring-2 transition ${inputClass}`}
          placeholder="Ingresa el código de compra"
          required
        />
        <button
          type="submit"
          className="w-full bg-[#48BD28]  text-white font-semibold py-2 rounded transition"
        >
          Confirmar Código
        </button>
        {message && (
          <p
            className={`mt-4 text-sm font-medium ${
              status === "success" ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default ManualCodeForm;
