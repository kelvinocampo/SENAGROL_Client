import { useEffect, useState } from "react";
import { MessageSquare, X } from "lucide-react";
import { obtenerTransportadores } from "@/services/Perfil/perfiltransportadorServices";
import { asignarTransportador } from "@/services/Perfil/Asignartransportador";

type Transportador = {
  id_usuario: number;
  nombre_usuario: string;
  nombre: string;
  correo: string;
  fotos_vehiculo: string;
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
      `${t.nombre_usuario} ${t.nombre} ${t.correo}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
    setFiltrados(resultado);
  }, [search, transportadores]);

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
      await asignarTransportador(
        Number(id_compra),
        Number(selected.id_usuario),
        parsedPrecio
      );

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
                filtrados.map((t, i) => {
                  console.log(`Transportador: ${t.nombre_usuario} - Fotos vehiculo raw:`, t.fotos_vehiculo);
                  const fotos = t.fotos_vehiculo
                    ? t.fotos_vehiculo.split(",").map((f) => f.trim())
                    : [];
                  console.log(`Transportador: ${t.nombre_usuario} - Fotos vehiculo array:`, fotos);

                  return (
                    <tr key={i} className="border-t">
                      <td className="p-2 sm:p-4">
                        {fotos.length > 0 ? (
                          <Slider fotos={fotos} nombre={t.nombre} />
                        ) : (
                          <span className="text-gray-400">Sin imagen</span>
                        )}
                      </td>
                      <td className="p-2 sm:p-4">{t.nombre_usuario}</td>
                      <td className="p-2 sm:p-4">{t.nombre}</td>
                      <td className="p-2 sm:p-4">{t.correo}</td>
                      <td className="p-2 sm:p-4 flex items-center gap-2 sm:gap-4 mt-12">
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
                  );
                })
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
                    <div className="flex flex-col items-center gap-2">
                      <p className="mb-2 text-center">
                        ¿Deseas continuar con la asignación?
                      </p>
                      <button
                        onClick={handlePrimeraConfirmacion}
                        className="bg-[#48BD28] text-white px-6 py-2 rounded"
                      >
                        Continuar
                      </button>
                      <button
                        onClick={cerrarModal}
                        className="text-sm text-gray-500 hover:underline"
                      >
                        Cancelar
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <h2 className="text-lg font-semibold mb-4">Confirmación final</h2>
                  <p className="mb-4 text-center">
                    ¿Estás <strong>seguro</strong> de asignar a{" "}
                    <strong>{selected.nombre}</strong> por un precio de{" "}
                    <strong>${precio}</strong>?
                  </p>
                  <button
                    onClick={handleAsignacionFinal}
                    className="bg-[#48BD28] text-white px-6 py-2 rounded"
                  >
                    Sí, asignar
                  </button>
                  <button
                    onClick={() => setConfirmacionFinal(false)}
                    className="text-sm text-gray-500 hover:underline"
                  >
                    Volver atrás
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Componente Slider para mostrar fotos con controles y manejo de error
function Slider({ fotos, nombre }: { fotos: string[]; nombre: string }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    console.log(`Slider para ${nombre} - foto actual:`, fotos[index]);
  }, [index, fotos, nombre]);

  const siguiente = () => setIndex((prev) => (prev + 1) % fotos.length);
  const anterior = () => setIndex((prev) => (prev - 1 + fotos.length) % fotos.length);

  return (
    <div className="relative w-32 h-32 overflow-hidden rounded shadow bg-white">
      <img
        src={fotos[index]}
        alt={`Foto ${index + 1} del carro de ${nombre}`}
        className="w-full h-full object-contain"
        onError={(e) => {
          console.warn(`❌ Error cargando imagen: ${fotos[index]} para ${nombre}`);
          (e.currentTarget as HTMLImageElement) // imagen fallback opcional
        }}
      />

      {fotos.length > 1 && (
        <>
          <button
            onClick={anterior}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-30 text-white px-2 rounded-l"
          >
            ‹
          </button>
          <button
            onClick={siguiente}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-30 text-white px-2 rounded-r"
          >
            ›
          </button>
        </>
      )}
    </div>
  );
}
