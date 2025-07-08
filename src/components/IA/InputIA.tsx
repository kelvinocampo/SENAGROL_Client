import { FaMicrophone } from "react-icons/fa";
import { IAContext } from "@/contexts/IA";
import { useContext, useState, useRef } from "react";
import { IAService } from "@services/IAServices";
import { IoMdSend } from "react-icons/io";

const SpeechRecognition: any =
  (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

export const InputIA = () => {
  const { message, setMessage, history, setHistory }: any = useContext(IAContext);
  const [isRecording, setIsRecording] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setMessage(newValue);

    if (newValue.trim() && history.length === 1 && history[0].type === "ia" && history[0].message.includes("SenagrolIA")) {
      setHistory([]);
    }
  };

  const handleRecording = () => {
    if (!SpeechRecognition) {
      setStatusMessage("Tu navegador no soporta reconocimiento de voz.");
      return;
    }

    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      setStatusMessage(null);
    } else {
      const recognition = new SpeechRecognition();
      recognition.lang = "es-ES";
      recognition.interimResults = true;
      recognition.continuous = false;

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join("");

        setMessage(transcript.trim());
        setStatusMessage(null);
      };

      recognition.onerror = (event: any) => {
        console.error("Error de reconocimiento:", event.error);
        setStatusMessage("Ocurrió un error durante el reconocimiento de voz.");
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.start();
      recognitionRef.current = recognition;
      setIsRecording(true);
      setStatusMessage(null);
    }
  };

  const handleSendMessage = async (e: any) => {
    e.preventDefault();
    if (!message.trim()) {
      setStatusMessage("Por favor, escribe un mensaje antes de enviarlo.");
      return;
    }

    try {
      setStatusMessage("Procesando tu mensaje...");
      const response = await IAService.getResponse(message);

      setHistory([
        ...history,
        { type: "user", message },
        { type: "ia", message: response },
      ]);

      setMessage("");
      setStatusMessage(null);
    } catch (error) {
      console.error("Error en la comunicación con la IA:", error);
      setStatusMessage("Ocurrió un error al procesar tu mensaje.");
    }
  };

  return (
    <div className="w-full flex flex-col gap-3">
      {statusMessage && (
        <p className="text-green-600 text-sm font-semibold text-center">
          {statusMessage}
        </p>
      )}

      <form
        onSubmit={handleSendMessage}
        className="flex items-center w-full bg-white rounded-full p-2 gap-2 shadow-md border border-[#48BD28]"
      >
        <input
          type="text"
          className="flex-1 bg-transparent text-sm text-black placeholder-gray-500 outline-none px-4 py-2 rounded-full focus:ring-2 focus:ring-[#6dd850]"
          placeholder="Pregunta al Asistente de Senagrol..."
          value={message}
          onChange={handleInputChange}
        />

        <button
          type="submit"
          className="transition-colors text-[#379E1B] font-semibold px-4 py-2"
        >
          <IoMdSend />
        </button>

        <FaMicrophone
          className={`text-xl cursor-pointer transition-all duration-200 ${
            isRecording ? "text-red-600 animate-pulse" : "text-[#379E1B] hover:scale-110"
          }`}
          title="Grabar mensaje"
          onClick={handleRecording}
        />
      </form>
    </div>
  );
};
