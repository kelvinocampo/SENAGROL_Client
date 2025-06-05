import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { requestTransporter } from "@/services/Perfil/FormTransportadorService";

type FormDataState = {
  license: string;
  soat: string;
  vehicleCard: string;
  vehicleType: string;
  vehicleWeight: string;
};

type FormErrors = Partial<Record<keyof FormDataState, string>>;

function FormularioTransportador() {
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

  // Reglas de validación espejo de express-validator
  const validateField = (name: keyof FormDataState, value: string): string => {
    switch (name) {
      case "license":
      case "soat":
      case "vehicleCard":
        if (!value.trim()) return "Este campo es obligatorio.";
        if (value.length < 5 || value.length > 30) return `Debe tener entre 5 y 30 caracteres.`;
        if (!/^[a-zA-Z0-9-]+$/.test(value)) return `Solo letras, números y guiones.`;
        return "";
      case "vehicleType":
        if (!value.trim()) return "Este campo es obligatorio.";
        if (value.length < 3 || value.length > 50) return `Debe tener entre 3 y 50 caracteres.`;
        if (!/^[a-zA-Z\s]+$/.test(value)) return `Solo letras y espacios.`;
        return "";
      case "vehicleWeight":
        if (!value.trim()) return "Este campo es obligatorio.";
        const num = Number(value);
        if (isNaN(num)) return "Debe ser un número.";
        if (num < 500 || num > 50000) return `Debe estar entre 500 y 50000 kg.`;
        return "";
      default:
        return "";
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Validar al vuelo
    setErrors(prev => ({ ...prev, [name]: validateField(name as keyof FormDataState, value) }));
  };

  const handleImagenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImagenes(Array.from(e.target.files));
    }
  };

  const validateAll = (): boolean => {
    const newErrors: FormErrors = {};
    (Object.keys(formData) as (keyof FormDataState)[]).forEach(key => {
      const err = validateField(key, formData[key]);
      if (err) newErrors[key] = err;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje("");
    if (!validateAll()) {
      setMensaje("Por favor, corrige los errores antes de enviar.");
      return;
    }
    if (imagenes.length < 2) {
      setMensaje("Debes subir entre 2 y 5 imágenes.");
      return;
    }

    setMensaje("Enviando petición de transportador...");
    try {
      const token = localStorage.getItem("token") || "";
      await requestTransporter(formData, imagenes, token);
      setMensaje("✅ Petición de transportador enviada correctamente.");
      // limpiar formulario
      setFormData({ license: "", soat: "", vehicleCard: "", vehicleType: "", vehicleWeight: "" });
      setImagenes([]);
      setErrors({});
    } catch (error: any) {
      setMensaje("❌ Error al enviar la petición: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-white font-[Fredoka] text-[#111]">
      <main className="flex pt-32 px-10 gap-10">
        <section className="w-2/3">
          <h1 className="text-2xl font-bold mb-6">Formulario Transportador</h1>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {(Object.keys(formData) as (keyof FormDataState)[]).map(name => (
              <div key={name}>
                <label className="block font-medium mb-1">
                  {name === 'license' ? 'Licencia de conducción'
                    : name === 'soat' ? 'SOAT vigente'
                    : name === 'vehicleCard' ? 'Tarjeta de propiedad del vehículo'
                    : name === 'vehicleType' ? 'Tipo de vehículo'
                    : 'Peso del vehículo'}
                </label>
                <input
                  name={name}
                  type={name === 'vehicleWeight' ? 'number' : 'text'}
                  value={formData[name]}
                  onChange={handleChange}
                  className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 ${
                    errors[name] ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-green-500'
                  }`}
                  placeholder={errors[name] || undefined}
                />
                {errors[name] && <p className="text-sm text-red-600 mt-1">{errors[name]}</p>}
              </div>
            ))}

            <div>
              <label className="block font-medium mb-1">Subir Imágenes (2-5)</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImagenChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-100 file:text-green-700 hover:file:bg-green-200"
              />
            </div>

            <div className="flex gap-4 mt-6">
              <button
                type="submit"
                className="bg-[#48BD28] text-white px-6 py-2 rounded-full hover:bg-green-700 transition"
              >
                Enviar petición
              </button>
              <button
                type="button"
                onClick={() => navigate("/perfil")}
                className="bg-[#F5F0E5] text-black px-6 py-2 rounded-full hover:bg-gray-300 transition"
              >
                Cancelar
              </button>
            </div>

            {mensaje && (
              <p className="mt-4 font-semibold text-center text-red-600">{mensaje}</p>
            )}
          </form>
        </section>
      </main>
    </div>
  );
}

export default FormularioTransportador;
