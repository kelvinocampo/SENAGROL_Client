// ─── Librerías ───────────────────────────────────────────────────────────────
import { useEffect, useState } from "react";
import { MessageSquare, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Servicios ───────────────────────────────────────────────────────────────
import { obtenerTransportadores } from "@/services/Perfil/perfiltransportadorServices";
import { asignarTransportador } from "@/services/Perfil/Asignartransportador";

// ─── Componentes ─────────────────────────────────────────────────────────────
import Header from "@/components/Header";
import UserProfileCard from "@components/perfil/UserProfileCard";
import Footer from "@/components/footer";

// ─── Tipado ───────────────────────────────────────────────────────────────────
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

// ─── Animaciones ─────────────────────────────────────────────────────────────
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: custom * 0.1, duration: 0.5 },
  }),
};

// ─── Componente Principal ─────────────────────────────────────────────────────
export default function Transportadores({ id_compra }: Props) {
  const [transportadores, setTransportadores] = useState<Transportador[]>([]);
  const [filtrados, setFiltrados] = useState<Transportador[]>([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Transportador | null>(null);
  const [precio, setPrecio] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [confirmacionFinal, setConfirmacionFinal] = useState(false);
  const [error, setError] = useState("");

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
    setError("");
    setConfirmacionFinal(false);
    setMostrarModal(true);
  };

  const handlePrimeraConfirmacion = () => {
    const parsed = Number(precio);
    if (!precio || isNaN(parsed) || parsed <= 0) {
      setError("⚠️ Por favor ingresa un precio válido mayor a 0");
      return;
    }
    setError("");
    setConfirmacionFinal(true);
  };

  const handleAsignacionFinal = async () => {
    if (!selected || !precio) return;
    try {
      await asignarTransportador(
        Number(id_compra),
        selected.id_usuario,
        parseFloat(precio)
      );
      cerrarModal();
      alert("✅ Transportador asignado con éxito");
    } catch (error) {
      console.error("❌ Error al asignar transportador:", error);
      alert("❌ Error al asignar transportador");
    }
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setSelected(null);
    setPrecio("");
    setError("");
    setConfirmacionFinal(false);
  };

  return (
    <>
      <Header />
      <main className="flex flex-col lg:flex-row pt-32 px-10 gap-10 min-h-screen bg-white text-black">
        <UserProfileCard />

        <motion.section
          className="flex-1 max-w-full"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          custom={1}
        >
          <h2 className="text-3xl font-bold mb-6 text-center text-[#205116]">
            Transportadores disponibles
          </h2>

          <div className="mb-6 flex justify-center">
            <input
              type="text"
              placeholder="Buscar transportador..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-[#E4FBDD] px-4 py-2 rounded-full text-sm w-full max-w-md focus:outline-none border border-[#caf5bd]"
            />
          </div>

          <div className="overflow-x-auto rounded-xl border border-[#caf5bd] shadow-sm">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-[#E4FBDD] text-black">
                  <th className="p-4">Foto del carro</th>
                  <th className="p-4">Usuario</th>
                  <th className="p-4">Nombre Completo</th>
                  <th className="p-4">Correo</th>
                  <th className="p-4">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtrados.length > 0 ? (
                  filtrados.map((t, i) => {
                    const fotos = t.fotos_vehiculo
                      ? t.fotos_vehiculo.split(",").map((f) => f.trim())
                      : [];

                    return (
                      <tr
                        key={i}
                        className="border-t hover:bg-[#f4fcf1] transition"
                      >
                        <td className="p-4">
                          {fotos.length > 0 ? (
                            <Slider fotos={fotos} nombre={t.nombre} />
                          ) : (
                            <span className="text-gray-400">Sin imagen</span>
                          )}
                        </td>
                        <td className="p-4">{t.nombre_usuario}</td>
                        <td className="p-4">{t.nombre}</td>
                        <td className="p-4">{t.correo}</td>
                        <td className="p-4 flex items-center gap-3">
                          <MessageSquare className="w-5 h-5 text-gray-400" />
                          <button
                            onClick={() => handleAsignarClick(t)}
                            className="bg-[#48BD28] text-white px-3 py-1.5 rounded hover:bg-[#379E1B] transition"
                          >
                            Asignar
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-[#F10E0E]">
                      No hay transportadores disponibles.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Modal */}
          <AnimatePresence>
            {mostrarModal && selected && (
              <motion.div
                className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="bg-white rounded-xl p-6 w-full max-w-md relative shadow-lg"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                >
                  <button
                    className="absolute top-3 right-3 text-gray-600 hover:text-black"
                    onClick={cerrarModal}
                  >
                    <X className="w-5 h-5" />
                  </button>

                  {!confirmacionFinal ? (
                    <>
                      <h2 className="text-xl font-semibold mb-4 text-center">
                        Asignar Transportador
                      </h2>
                      <p className="mb-2 text-sm">
                        Ingresa el precio del transporte:
                      </p>
                      <input
                        type="number"
                        min="1"
                        placeholder="Precio del transporte"
                        value={precio}
                        onChange={(e) => setPrecio(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded mb-2"
                      />
                      {error && (
                        <p className="text-red-500 text-sm mb-2">{error}</p>
                      )}

                      <div className="flex flex-col items-center gap-3">
                        <p className="text-center text-sm">
                          ¿Deseas continuar con la asignación?
                        </p>
                        <button
                          onClick={handlePrimeraConfirmacion}
                          className="bg-[#48BD28] text-white px-6 py-2 rounded hover:bg-[#379E1B]"
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
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-4">
                      <h2 className="text-lg font-semibold">Confirmación final</h2>
                      <p>
                        Transportador: <b>{selected.nombre_usuario}</b>
                      </p>
                      <p>
                        Precio: <b>${precio}</b>
                      </p>
                      <div className="flex gap-4 mt-4">
                        <button
                          onClick={handleAsignacionFinal}
                          className="bg-[#48BD28] text-white px-6 py-2 rounded hover:bg-[#379E1B]"
                        >
                          Confirmar
                        </button>
                        <button
                          onClick={() => setConfirmacionFinal(false)}
                          className="text-gray-500 hover:underline"
                        >
                          Volver
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>
      </main>
      <Footer />
    </>
  );
}

// ─── Slider para mostrar fotos del vehículo ───────────────────────────────────
function Slider({ fotos, nombre }: { fotos: string[]; nombre: string }) {
  const [index, setIndex] = useState(0);

  const siguiente = () => setIndex((prev) => (prev + 1) % fotos.length);
  const anterior = () => setIndex((prev) => (prev - 1 + fotos.length) % fotos.length);

  return (
    <div className="relative w-28 h-28 rounded overflow-hidden shadow-md bg-white">
      <img
        src={fotos[index]}
        alt={`Foto ${index + 1} del carro de ${nombre}`}
        className="w-full h-full object-cover"
        onError={(e) => (e.currentTarget.src = "/img/default-car.png")}
      />
      {fotos.length > 1 && (
        <>
          <button
            onClick={anterior}
            className="absolute left-1 top-1/2 transform -translate-y-1/2 text-white text-xs bg-black bg-opacity-50 px-1 rounded"
          >
            ‹
          </button>
          <button
            onClick={siguiente}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 text-white text-xs bg-black bg-opacity-50 px-1 rounded"
          >
            ›
          </button>
        </>
      )}
    </div>
  );
}
