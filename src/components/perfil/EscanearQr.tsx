import React, { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { receiveBuyCode } from "@/services/EscanearQr";

const EscanearQR: React.FC = () => {
  const [message, setMessage] = useState<string | null>(null);
  const [scanned, setScanned] = useState(false);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    if (scanned) return;

    const scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false 
    );

    scanner.render(
      async (decodedText) => {
        scanner.clear();
        setScanned(true);
        await handleScan(decodedText);
      },
      (error) => {
        console.warn("No se detectó QR:", error);
      }
    );

    scannerRef.current = scanner;

    return () => {
      scanner.clear().catch(console.error);
    };
  }, [scanned]);

  const handleScan = async (codigo: string) => {
    try {
      const token = localStorage.getItem("token");
      const id_user = parseInt(localStorage.getItem("id_user") || "0");

      if (!token || !id_user) {
        setMessage("⚠️ No se encontró usuario o token.");
        return;
      }

      const res = await receiveBuyCode(codigo, id_user, token);

      if (res.success) {
        setMessage("✅ Estado actualizado correctamente.");
      } else {
        setMessage("❌ " + (res.message || res.error));
      }
    } catch (err: any) {
      setMessage("❌ " + err.message);
    }
  };

  const volverAEscanear = () => {
    setScanned(false);
    setMessage(null);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <h2 className="text-2xl font-bold mb-4">Escanea el código QR</h2>

      {!scanned && <div id="reader" className="mb-4" />}

      {scanned && (
        <button
          onClick={volverAEscanear}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Escanear otro código
        </button>
      )}

      {message && <p className="mt-4 text-lg text-center">{message}</p>}
    </div>
  );
};

export default EscanearQR;
