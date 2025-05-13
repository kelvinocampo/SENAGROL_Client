import { useEffect, useState } from "react";
import { MessageSquare } from "lucide-react";
import { obtenerTransportadores } from "@services/perfiltransportadorServices"; // Ajusta la ruta si es necesario


type Transportador = {
  nombre_usuario: string;
  nombre: string;
  correo: string;
};

export default function Transportadores() {
  const [transportadores, setTransportadores] = useState<Transportador[]>([]);
  const [filtrados, setFiltrados] = useState<Transportador[]>([]);
  const [search, setSearch] = useState("");

 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await obtenerTransportadores();
        setTransportadores(data);
        setFiltrados(data);
      } catch (error) {
        console.error("Error al cargar transportadores en el componente:", error);
      }
    };

    fetchData();
  }, []);


  useEffect(() => {
    const resultado = transportadores.filter((t) =>
      `${t.nombre_usuario} ${t.nombre} ${t.correo}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
    setFiltrados(resultado);
  }, [search, transportadores]);

  return (
    <div className="flex min-h-screen bg-white text-black">
      <div className="flex-1 p-4 sm:p-8">
      
        <div className="mb-4 flex items-center gap-3">
          <input
            type="text"
            placeholder="Buscar transportador..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-[#E4FBDD] px-3 py-2 rounded-full text-sm w-full sm:w-64 focus:outline-none"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border-[#E4FBDD] rounded-xl text-xs sm:text-sm">
            <thead>
              <tr className="text-left bg-[#E4FBDD] text-black">
                <th className="p-2 sm:p-4">Usuario</th>
                <th className="p-2 sm:p-4">Nombre Completo</th>
                <th className="p-2 sm:p-4">Correo</th>
                <th className="p-2 sm:p-4">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map((t, i) => (
                <tr key={i} className="border-t">
                  <td className="p-2 sm:p-4">{t.nombre_usuario}</td>
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

          
              {filtrados.length === 0 && (
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
