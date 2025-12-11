// ─── Librerías ───────────────────────────────────────────────────────────────
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

// ─── Componentes ─────────────────────────────────────────────────────────────
import Header from "@/components/Header";
import Footer from "@/components/footer";
import UserProfileCard from "@components/perfil/UserProfileCard";
import { Input } from "@/components/Input";

// ─── Servicios ───────────────────────────────────────────────────────────────
import { requestTransporter } from "@/services/Perfil/FormTransportadorService";

// ─── Animación ───────────────────────────────────────────────────────────────
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: custom * 0.2, ease: "easeOut", duration: 0.6 },
  }),
};

// ─── Tipado ─────────────────────────────────────────────────────────────────
type FormDataState = {
  license: string;
  soat: string;
  vehicleCard: string;
  vehicleType: string;
  vehicleWeight: string;
};

type FormErrors = Partial<Record<keyof FormDataState, string>>;

// ─── Componente Principal ───────────────────────────────────────────────────
export default function FormularioTransportador() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormDataState>({
    license: "",
    soat: "",
    vehicleCard: "",
    vehicleType: "",
    vehicleWeight: "",
  });

  const [imagenes, setImagenes] = useState<File[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [mensaje, setMensaje] = useState<string>("");
  const [yaEnviado, setYaEnviado] = useState<boolean>(() => {
    return localStorage.getItem("transportadorEnviado") === "true";
  });

  const validateField = (name: keyof FormDataState, value: string): string => {
    switch (name) {
      case "license":
      case "soat":
      case "vehicleCard":
        if (!value.trim()) return "Este campo es obligatorio.";
        if (value.length < 5 || value.length > 30) return "Debe tener entre 5 y 30 caracteres.";
        if (!/^[a-zA-Z0-9-]+$/.test(value)) return "Solo letras, números y guiones.";
        return "";
      case "vehicleType":
        if (!value.trim()) return "Este campo es obligatorio.";
        if (value.length < 3 || value.length > 50) return "Debe tener entre 3 y 50 caracteres.";
        if (!/^[a-zA-Z\s]+$/.test(value)) return "Solo letras y espacios.";
        return "";
      case "vehicleWeight":
        if (!value.trim()) return "Este campo es obligatorio.";
        const num = Number(value);
        if (isNaN(num)) return "Debe ser un número.";
        if (num < 500 || num > 50000) return "Debe estar entre 500 y 50000 kg.";
        return "";
      default:
        return "";
    }
  };

  const validateAll = (): boolean => {
    const newErrors: FormErrors = {};
    (Object.keys(formData) as (keyof FormDataState)[]).forEach((key) => {
      const err = validateField(key, formData[key]);
      if (err) newErrors[key] = err;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name as keyof FormDataState, value),
    }));
  };

  const handleImagenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setImagenes(Array.from(e.target.files));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje("");

    if (yaEnviado) {
      setMensaje("⚠️ Ya has enviado tu solicitud de transportador. No puedes enviarla nuevamente.");
      return;
    }

    if (!validateAll()) {
      setMensaje("Por favor, corrige los errores antes de enviar.");
      return;
    }

    if (imagenes.length < 2 || imagenes.length > 5) {
      setMensaje("Debes subir entre 2 y 5 imágenes.");
      return;
    }

    setMensaje("Enviando petición de transportador...");
    try {

      await requestTransporter(formData, imagenes);
      setMensaje("✅ Petición de transportador enviada correctamente.");
      setFormData({
        license: "",
        soat: "",
        vehicleCard: "",
        vehicleType: "",
        vehicleWeight: "",
      });
      setImagenes([]);
      setErrors({});
      setYaEnviado(true);
      localStorage.setItem("transportadorEnviado", "true");
    } catch (error: any) {
      setMensaje("❌ Error al enviar la petición: " + error.message);
    }
  };

  const getLabel = (name: keyof FormDataState) => {
    switch (name) {
      case "license":
        return "Licencia de conducción";
      case "soat":
        return "SOAT vigente";
      case "vehicleCard":
        return "Tarjeta de propiedad de vehículo";
      case "vehicleType":
        return "Tipo de vehículo";
      case "vehicleWeight":
        return "Peso del vehículo (kg)";
      default:
        return name;
    }
  };

  return (
    <div className="min-h-screen font-[Fredoka] text-[#111]">
      <Header />
      <main className="w-[92%] max-w-7xl mx-auto flex flex-col  lg:flex-row pt-10 py-10 gap-10 ">
        <UserProfileCard />

        <motion.section
          className="lg:w-2/3 w-full"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <form className="p-5 rounded-2xl space-y-6" onSubmit={handleSubmit}>
            <h2 className="text-3xl font-bolder mb-4 text-[#0D141C]">
              Transportador
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(Object.keys(formData) as (keyof FormDataState)[]).map(
                (name, idx) => (
                  <motion.div
                    variants={fadeInUp}
                    custom={idx}
                    key={name}
                    className="relative"
                  >
                    <Input
                      name={name}
                      type={name === "vehicleWeight" ? "number" : "text"}
                      label={getLabel(name)}
                      value={formData[name]}
                      onChange={handleChange}
                      error={errors[name]}
                    />
                  </motion.div>
                )
              )}
            </div>

            <motion.div variants={fadeInUp} custom={6}>
              <label className="block font-medium text-[#2E7D32] mb-1">
                Imágenes del vehículo (2-5 imágenes)
              </label>

              <div
                className="p-10 text-center w-full mt-1 rounded-xl bg-white border-none shadow-md focus:outline-none focus:border-[#48BD28]"
              >
                <label
                  htmlFor="imagenes"
                  className="inline-block px-15 bg-[#48BD28] hover:bg-[#379E1B] text-white font-medium py-2 rounded-xl cursor-pointer transition"
                >
                  Elegir archivos
                </label>
                <input
                  id="imagenes"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImagenChange}
                  className="hidden"
                />
                <p className="text-sm mt-2 text-gray-700">
                  {imagenes.length > 0
                    ? `${imagenes.length} archivo${imagenes.length > 1 ? "s" : ""} seleccionado${imagenes.length > 1 ? "s" : ""}`
                    : "Sin archivos seleccionados"}
                </p>
              </div>
            </motion.div>

            <div className="pt-6 text-right flex gap-4 justify-end">
              <button
                type="button"
                onClick={() => navigate("/perfil")}
                className="bg-[#D9D9D9] text-black py-2 px-6 rounded-xl hover:bg-gray-300 transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={yaEnviado}
                className={`py-2 px-6 rounded-xl shadow-md transition ${yaEnviado
                  ? "bg-gray-400 cursor-not-allowed text-white"
                  : "bg-[#5ABA41] hover:bg-[#379e1b] text-white"
                  }`}
              >
                {yaEnviado ? "Ya enviado" : "Enviar petición"}
              </button>
            </div>

            {mensaje && (
              <p className="mt-4 font-semibold text-center text-red-600">
                {mensaje}
              </p>
            )}
          </form>
        </motion.section>
      </main>
      <Footer />
    </div>
  );
}
