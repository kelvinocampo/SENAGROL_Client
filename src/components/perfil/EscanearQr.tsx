import React, { useEffect, useRef, useState } from "react";
import jsQR from "jsqr";
import { receiveBuyCode } from "@/services/Perfil/EscanearQr&codigo";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  compraId?: number;
};

const QrScanner: React.FC<Props> = ({ compraId }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [qrData, setQrData] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const token = localStorage.getItem("token") || "";

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
      }
    };

    const scan = () => {
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
        const res = await receiveBuyCode(codigo, token, compraId);
        setMessage(`Compra actualizada correctamente: ${res.message || "OK"}`);
      } catch (err: any) {
        setMessage(`Error al actualizar: ${err.message}`);
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
  }, [token, compraId]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br p-6"
    >
      <motion.h1
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="text-3xl font-bold text-gray-800 mb-6"
      >
        Escáner QR
      </motion.h1>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="rounded-xl shadow-lg overflow-hidden w-full max-w-md border border-gray-300"
      >
        <video ref={videoRef} className="w-full h-auto" autoPlay muted />
      </motion.div>

      <canvas ref={canvasRef} className="hidden" />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-6 p-4 bg-white rounded-xl shadow w-full max-w-md text-center"
      >
        <AnimatePresence mode="wait">
          {qrData ? (
            <motion.p
              key="code"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              className="text-green-600 font-semibold text-lg"
            >
              Código: {qrData}
            </motion.p>
          ) : (
            <motion.p
              key="scanning"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              className="text-gray-500 text-base"
            >
              Escaneando...
            </motion.p>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {message && (
            <motion.p
              key="message"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: 0.2 }}
              className="mt-2 text-sm text-black font-medium"
            >
              {message}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default QrScanner;
