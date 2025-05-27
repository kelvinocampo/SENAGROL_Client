import { FaMicrophone } from "react-icons/fa";
import { IAContext } from "@/contexts/IA";
import { useContext, useState, useRef } from "react";
import { IAService } from "@services/IAServices";

// Compatibilidad con navegadores
const SpeechRecognition: any =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

export const InputIA = () => {
    const { message, setMessage, history, setHistory }: any = useContext(IAContext);
    const [isRecording, setIsRecording] = useState(false);
    const [statusMessage, setStatusMessage] = useState<string | null>(null);
    const recognitionRef = useRef<any>(null);

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
            // Limpiar mensajes de estado previos
            setStatusMessage(null);

            // Mostrar mensaje de carga (opcional)
            setStatusMessage("Procesando tu mensaje...");

            const response = await IAService.getResponse(message);

            // Actualizar el historial con la respuesta
            setHistory([...history,
            { type: "user", message },
            { type: "ia", message: response }
            ]);

            setMessage("");
            setStatusMessage(null);

        } catch (error) {
            console.error("Error en la comunicación con la IA:", error);

            let errorMessage = "Ocurrió un error al procesar tu mensaje";
            setStatusMessage(errorMessage);
        }
    };

    return (
        <div className="w-full flex flex-col gap-2">
            {/* Mensaje de error o estado - Fuera del contenedor verde */}
            {statusMessage && (
                <p className="text-red-600 text-sm font-medium text-center">
                    {statusMessage}
                </p>
            )}

            {/* Caja de input + botones */}
            <form onSubmit={(e: any) => { handleSendMessage(e) }} className="flex sm:flex-row flex-col rounded-xl justify-between bg-[#E4FBDD] w-full">
                <input
                    type="text"
                    className="py-2 px-3 outline-0 sm:w-[80%] w-full rounded-xl"
                    placeholder="Escribe tu mensaje aquí..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />

                <div className="flex items-center justify-center gap-2 p-2">
                    <button
                        className="bg-[#48BD28] rounded-xl px-4 py-2 text-white cursor-pointer font-bold"
                    >
                        Enviar mensaje
                    </button>
                    <FaMicrophone
                        className={`text-2xl cursor-pointer hover:scale-110 transition-all duration-200 mx-2 ${isRecording ? "text-red-500" : ""
                            }`}
                        title="Grabar mensaje"
                        onClick={handleRecording}
                    />
                </div>
            </form>
        </div>
    );
};
