import { useEffect, useState } from "react";
import { MessageSquare, X } from "lucide-react";
import { obtenerTransportadores } from "@/services/Perfil/perfiltransportadorServices";
import { asignarTransportador } from "@/services/Perfil/Asignartransportador";

type Transportador = {
  id_usuario: number;
  nombre_usuario: string;
  nombre: string;
  correo: string;
  imagen_carro: string; 
};

interface Props {
  id_compra: number;
}

export default function Transportadores({ id_compra }: Props) {
  const [transportadores, setTransportadores] = useState<Transportador[]>([]);
  const [filtrados, setFiltrados] = useState<Transportador[]>([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Transportador | null>(null);
  const [precio, setPrecio] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [confirmacionFinal, setConfirmacionFinal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await obtenerTransportadores();
        console.log("📦 Transportadores cargados:", data);
        setTransportadores(data);
        setFiltrados(data);
      } catch (error) {
        console.error("❌ Error al cargar transportadores:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const resultado = transportadores.filter((t) =>
      `${t.nombre_usuario} ${t.nombre} ${t.correo}`.toLowerCase().includes(search.toLowerCase())
    );
    setFiltrados(resultado);
  }, [search, transportadores, id_compra]);

  const handleAsignarClick = (transportador: Transportador) => {
    setSelected(transportador);
    setPrecio("");
    setConfirmacionFinal(false);
    setMostrarModal(true);
  };

  const handlePrimeraConfirmacion = () => {
    if (!precio || isNaN(Number(precio)) || Number(precio) <= 0) {
      console.warn("⚠️ Precio inválido:", precio);
      return;
    }
    setConfirmacionFinal(true);
  };

  const handleAsignacionFinal = async () => {
    if (!selected || !precio) return;

    try {
      const parsedPrecio = parseFloat(precio);
      const resultado = await asignarTransportador(
        Number(id_compra),
        Number(selected.id_usuario),
        parsedPrecio
      );

      console.log("✅ Respuesta del backend:", resultado);
      alert("✅ Transportador asignado con éxito");
      cerrarModal();
    } catch (error) {
      console.error("❌ Error al asignar transportador:", error);
      alert("❌ Error al asignar transportador");
    }
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setSelected(null);
    setPrecio("");
    setConfirmacionFinal(false);
  };

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
                <th className="p-2 sm:p-4">Foto del carro</th>
                <th className="p-2 sm:p-4">Usuario</th>
                <th className="p-2 sm:p-4">Nombre Completo</th>
                <th className="p-2 sm:p-4">Correo</th>
                <th className="p-2 sm:p-4">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.length > 0 ? (
                filtrados.map((t, i) => (
                  <tr key={i} className="border-t">
                    <td className="p-2 sm:p-4">
                      <img
                        src={t.imagen_carro}
                        alt={`Carro de ${t.nombre}`}
                        className="w-16 h-16 object-cover rounded border"
                      />
                    </td>
                    <td className="p-2 sm:p-4">{t.nombre_usuario}</td>
                    <td className="p-2 sm:p-4">{t.nombre}</td>
                    <td className="p-2 sm:p-4">{t.correo}</td>
                    <td className="p-2 sm:p-4 flex items-center gap-2 sm:gap-4">
                      <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
                      <button
                        onClick={() => handleAsignarClick(t)}
                        className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 text-xs"
                        title="Asignar transportador"
                      >
                        Asignar
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-[#F10E0E]">
                    No hay transportadores disponibles.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {mostrarModal && selected && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md relative shadow-lg">
              <button
                className="absolute top-3 right-3 text-gray-600 hover:text-black"
                onClick={cerrarModal}
              >
                <X className="w-5 h-5" />
              </button>

              {!confirmacionFinal ? (
                <>
                  <h2 className="text-lg font-semibold mb-4">Asignar Transportador</h2>
                  <p className="mb-2">Pon un precio para el transporte</p>

                  <input
                    type="number"
                    placeholder="Precio del transporte"
                    value={precio}
                    onChange={(e) => setPrecio(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded mb-4"
                  />

                  {precio && (
                    <>
                      <p className="mb-2">
                        ¿Deseas continuar con la asignación?
                      </p>
                      <button
                        onClick={handlePrimeraConfirmacion}
                        className="bg-[#48BD28] text-white px-4 py-2 rounded w-full"
                      >
                        Continuar
                      </button>
                      <button
                        onClick={cerrarModal}
                        className="mt-2 text-sm text-gray-500 hover:underline w-full"
                      >
                        Cancelar
                      </button>
                    </>
                  )}
                </>
              ) : (
                <>
                  <h2 className="text-lg font-semibold mb-4">Confirmación final</h2>
                  <p className="mb-4">
                    ¿Estás <strong>seguro</strong> de asignar a{" "}
                    <strong>{selected.nombre}</strong> por un precio de{" "}
                    <strong>${precio}</strong>?
                  </p>
                  <button
                    onClick={handleAsignacionFinal}
                    className="bg-[#48BD28] text-white px-4 py-2 rounded w-full"
                  >
                    Sí, asignar
                  </button>
                  <button
                    onClick={() => setConfirmacionFinal(false)}
                    className="mt-2 text-sm text-gray-500 hover:underline w-full"
                  >
                    Volver atrás
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
