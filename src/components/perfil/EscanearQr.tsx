import React, { useEffect, useRef, useState } from "react";
import jsQR from "jsqr";
import { receiveBuyCode } from "@/services/Perfil/EscanearQr&codigo";

const QrScanner: React.FC = () => {
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
        const res = await receiveBuyCode(codigo, token);
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
  }, [token]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Escáner QR</h1>

      <video
        ref={videoRef}
        className="rounded-lg shadow-md w-full max-w-md"
        autoPlay
        muted
      />

      <canvas ref={canvasRef} className="hidden" />

      <div className="mt-4 p-4 bg-white rounded shadow-md w-full max-w-md text-center">
        {qrData ? (
          <p className="text-green-600 font-medium">Código: {qrData}</p>
        ) : (
          <p className="text-gray-500">Escaneando...</p>
        )}
        {message && (
          <p className="mt-2 text-sm text-black font-medium">{message}</p>
        )}
      </div>
    </div>
  );
};

export default QrScanner;
