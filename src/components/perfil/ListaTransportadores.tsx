import { useEffect, useState } from "react";
import { MessageSquare } from "lucide-react";
import { obtenerTransportadores } from "@services/perfiltransportadorServices"; // Ajusta la ruta según tu estructura


type Transportador = {
  usuario: string;
  nombre: string;
  correo: string;
};
export default function Transportadores() {
  const [transportadores, setTransportadores] = useState<Transportador[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await obtenerTransportadores();
        setTransportadores(data);
      } catch (error) {
        console.error("Error al cargar transportadores en el componente:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex min-h-screen bg-white text-black">
      <div className="flex-1 p-4 sm:p-8">
        <div className="overflow-x-auto">
          <table className="min-w-full   border-[#E4FBDD]rounded-xl text-xs sm:text-sm">
            <thead>
              <tr className="text-left bg-[#E4FBDD] text-black">
                <th className="p-2 sm:p-4">Usuario</th>
                <th className="p-2 sm:p-4">Nombre Completo</th>
                <th className="p-2 sm:p-4">Correo</th>
                <th className="p-2 sm:p-4">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {transportadores.map((t, i) => ( 
                <tr key={i} className="border-t">
                  <td className="p-2 sm:p-4">{t.usuario}</td>
                  <td className="p-2 sm:p-4">{t.nombre}</td>
                  <td className="p-2 sm:p-4">{t.correo}</td>
                  <td className="p-2 sm:p-4 flex items-center gap-2 sm:gap-4">
                    <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
                    <button className="bg-[#48BD28] text-white px-3 py-1 rounded-full text-xs sm:text-sm">
                      Asignar
                    </button>
                  </td>
                </tr>
              ))}
              {transportadores.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-[#F10E0E]">
                    No hay transportadores disponibles.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
