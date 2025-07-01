import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Buscador from "../Inicio/Search";
import { obtenerTransportadores } from "@/services/Perfil/perfiltransportadorServices";
import { asignarTransportador } from "@/services/Perfil/Asignartransportador";

import Header from "@/components/Header";
import UserProfileCard from "@components/perfil/UserProfileCard";
import Footer from "@/components/footer";
import { useNavigate } from "react-router-dom";

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

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: custom * 0.1, duration: 0.5 },
  }),
};

export default function Transportadores({ id_compra }: Props) {
  const [transportadores, setTransportadores] = useState<Transportador[]>([]);
  const [filtrados, setFiltrados] = useState<Transportador[]>([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Transportador | null>(null);
  const [precio, setPrecio] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [confirmacionFinal, setConfirmacionFinal] = useState(false);
  const [error, setError] = useState("");
  const [modalExitoVisible, setModalExitoVisible] = useState(false); // 👈 Nuevo modal de éxito
const navigate = useNavigate();
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
    setModalExitoVisible(true); // Muestra el modal visual

    // Espera 2 segundos antes de redirigir
    setTimeout(() => {
       navigate("/perfil");
    }, 2000);
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
      <main className="flex flex-col lg:flex-row items-start pt-10 px-10 py-10 gap-10 h-full bg-gradient-to-b from-[#E1FFD9] to-[#F0F0F0] text-black">
        <UserProfileCard />

        <motion.section
          className="flex-1 max-w-full"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          custom={1}
        >
          <h2 className="text-3xl font-bold mb-4 text-[#0D141C] text-left">
            Transportadores
          </h2>

          <div className="mb-4 text-left max-w-full">
            <Buscador
              busqueda={search}
              setBusqueda={setSearch}
              setPaginaActual={() => {}}
              placeholderText="Buscar transportador..."
            />
          </div>

          <div className="rounded-xl border border-[#48BD28] shadow-sm overflow-hidden">
            <div className="overflow-y-auto max-h-[400px]">
              <table className="min-w-full text-sm table-fixed">
                <thead className="sticky top-0 z-10 bg-white text-black">
                  <tr>
                    <th className="text-left w-[130px] pl-4 py-3">Vehículo</th>
                    <th className="text-left w-[160px] pl-4">Usuario</th>
                    <th className="text-left w-[200px] pl-4">Nombre Completo</th>
                    <th className="text-left w-[240px] pl-4">Correo</th>
                    <th className="text-center w-[180px] px-4 text-[#303030]">Acciones</th>
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
                          className={`border-t border-[#48BD28] ${
                            i % 2 === 0 ? "bg-white" : "bg-[#E4FBDD]"
                          } hover:bg-[#caf5bd] transition`}
                        >
                          <td className="w-[130px] px-4 py-1">
                            {fotos.length > 0 ? (
                              <Slider fotos={fotos} nombre={t.nombre} />
                            ) : (
                              <span className="text-gray-400">Sin imagen</span>
                            )}
                          </td>
                          <td className="w-[160px] px-4 py-1">{t.nombre_usuario}</td>
                          <td className="w-[200px] px-4 py-1">{t.nombre}</td>
                          <td className="w-[240px] px-4 py-1">{t.correo}</td>
                          <td className="w-[180px] px-4 py-1">
                            <div className="flex justify-center items-center gap-2">
                              <button className="bg-[#1D9BF0] text-white px-3 py-1.5 rounded hover:bg-[#1877F2] transition">
                                Chat
                              </button>
                              <button
                                onClick={() => handleAsignarClick(t)}
                                className="bg-[#48BD28] text-white px-3 py-1.5 rounded hover:bg-[#379E1B] transition"
                              >
                                Asignar
                              </button>
                            </div>
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
          </div>

          {/* Modal de asignación */}
          <AnimatePresence>
            {mostrarModal && selected && (
              <motion.div
                className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl flex-1 relative"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                >
                  <button
                    onClick={cerrarModal}
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  {!confirmacionFinal ? (
                    <>
                      <h2 className="text-lg font-semibold mb-3 text-left">
                        Asignar Transportador
                      </h2>
                      <p className="text-sm mb-1 text-gray-700 text-left">
                        Ingresa el precio del transporte:
                      </p>
                      <input
                        type="number"
                        min="1"
                        value={precio}
                        onChange={(e) => setPrecio(e.target.value)}
                        placeholder="$0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mb-2 text-left"
                      />
                      {error && (
                        <p className="text-red-500 text-xs mb-2 text-center">{error}</p>
                      )}
                      <p className="text-sm text-left mt-2 mb-4">
                        ¿Deseas continuar con la asignación?
                      </p>
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={cerrarModal}
                          className="bg-[#E2E2E2] text-black text-sm px-4 py-1.5 rounded-md hover:bg-[#d4d4d4] shadow"
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={handlePrimeraConfirmacion}
                          className="bg-[#48BD28] text-white text-sm px-4 py-1.5 rounded-md hover:bg-[#379E1B] shadow"
                        >
                          Continuar
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col gap-3">
                      <h2 className="text-lg font-bold text-left">Confirmación</h2>
                      <p className="text-sm">
                        Transportador: <b>{selected.nombre_usuario}</b>
                      </p>
                      <p className="text-sm">
                        Precio: <b>${precio}</b>
                      </p>
                      <div className="flex gap-3 justify-end mt-3">
                        <button
                          onClick={handleAsignacionFinal}
                          className="bg-[#48BD28] text-white px-4 py-1.5 text-sm rounded-md hover:bg-[#379E1B]"
                        >
                          Confirmar
                        </button>
                        <button
                          onClick={() => setConfirmacionFinal(false)}
                          className="text-sm text-gray-500 hover:underline"
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

          {/* ✅ Modal de Éxito */}
          <AnimatePresence>
            {modalExitoVisible && (
              <motion.div
                className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="bg-white rounded-2xl p-6 w-full max-w-xs text-center shadow-xl"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                >
                  <h2 className="text-lg font-bold mb-2">Transportador asignado</h2>
                  <p className="text-sm mb-4">¡Transportador asignado con éxito!</p>
                  <button
                    onClick={() => setModalExitoVisible(false)}
                    className="bg-[#48BD28] text-white text-sm px-5 py-2 rounded hover:bg-[#379E1B] transition"
                  >
                    Aceptar
                  </button>
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

// Slider de fotos del carro
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
