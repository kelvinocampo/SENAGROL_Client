import React, { useEffect, useRef, useState } from "react";
import jsQR from "jsqr";
import { receiveBuyCode } from "@/services/Perfil/EscanearQr&codigo";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  compraId?: number;
};

const QrScanner: React.FC<Props> = ({ isOpen, onClose, compraId }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [qrData, setQrData] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [scanned, setScanned] = useState(false);



  if (!isOpen) return null;

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.setAttribute("playsinline", "true");
          videoRef.current.play();
        }

        requestAnimationFrame(scan);
      } catch (err) {
        console.error("Error al acceder a la cámara", err);
        setMessage("No se pudo acceder a la cámara.");
      }
    };

    const scan = () => {
      if (scanned) return;

      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (video && video.readyState === video.HAVE_ENOUGH_DATA && canvas) {
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.height = video.videoHeight;
        canvas.width = video.videoWidth;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code) {
          const codigo = code.data;
          setQrData(codigo);
          setScanned(true);
          handleSendToBackend(codigo);
        } else {
          requestAnimationFrame(scan);
        }
      } else {
        requestAnimationFrame(scan);
      }
    };

    const handleSendToBackend = async (codigo: string) => {
      try {
        const res = await receiveBuyCode(codigo, compraId);
        setMessage(`Compra actualizada correctamente: ${res.message || "OK"}`);

        setTimeout(() => {
          onClose(); // cerrar modal después de éxito
        }, 2000);
      } catch (err: any) {
        setMessage(`Error al actualizar: ${err.message}`);
        setScanned(false); // permitir reintento
        requestAnimationFrame(scan);
      }
    };

    startCamera();

    return () => {
      const video = videoRef.current;
      if (video && video.srcObject) {
        const tracks = (video.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, [compraId]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className="bg-white rounded-xl p-6 shadow-xl w-full max-w-md text-center"
      >
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Código QR</h1>

        <div className="rounded-lg overflow-hidden border border-gray-300">
          <video ref={videoRef} className="w-full h-auto" autoPlay muted />
        </div>
        <canvas ref={canvasRef} className="hidden" />

        <div className="mt-4">
          <AnimatePresence mode="wait">
            qrData ? (
            <motion.p
              key="code"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-green-600 font-semibold"
            >
              Código: {qrData}
            </motion.p>
            )
          </AnimatePresence>

          {message && (
            <p className="mt-2 text-sm text-[#6B7280] font-medium">{message}</p>
          )}
          <div className="flex justify-end space-x-2">
            <button
              onClick={onClose}
              className="mt-4 bg-[#D9D9D9] text-black px-4 py-2 rounded-xl hover:bg-gray-700"
            >
              Cerrar
            </button>
            <button
              onClick={onClose}
              className="mt-4 bg-[#48BD28] text-white px-3 py-2 rounded-xl hover:bg-green-700"
            >
              confirmar
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default QrScanner;
