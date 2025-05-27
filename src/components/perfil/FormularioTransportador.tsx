import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { requestTransporter } from "@/services/Perfil/FormTransportadorService";

function FormularioTransportador() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    license: "",
    soat: "",
    vehicleCard: "",
    vehicleType: "",
    vehicleWeight: "",
  });

  const [imagenes, setImagenes] = useState<File[]>([]);
  const [mensaje, setMensaje] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImagenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImagenes(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje("Enviando...");

    try {
      const token = localStorage.getItem("token") || "";

      await requestTransporter(formData, imagenes, token);

      setMensaje("Formulario enviado correctamente.");
      setFormData({
        license: "",
        soat: "",
        vehicleCard: "",
        vehicleType: "",
        vehicleWeight: "",
      });
      setImagenes([]);
    } catch (error: any) {
      setMensaje("Error al enviar el formulario: " + error.message);
    }
  };


  return (
    <div className="min-h-screen bg-white font-[Fredoka] text-[#111]">
      <main className="flex pt-32 px-10 gap-10">
        <section className="w-2/3">
          <h1 className="text-2xl font-bold mb-6">Formulario Transportador</h1>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {[
              { label: "Licencia de conducción", name: "license" },
              { label: "SOAT vigente", name: "soat" },
              { label: "Tarjeta de propiedad del vehículo", name: "vehicleCard" },
              { label: "Tipo de vehículo", name: "vehicleType" },
              { label: "Peso del vehículo", name: "vehicleWeight" },
            ].map(({ label, name }) => (
              <div key={name}>
                <label className="block font-medium mb-1">{label}</label>
                <input
                  name={name}
                  type={name === "vehicleWeight" ? "number" : "text"}
                  placeholder={`Ingrese ${label.toLowerCase()}`}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={(formData as any)[name]}
                  onChange={handleChange}
                />
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
                Enviar
              </button>
              <button
                type="button"
                onClick={() => navigate("/")}
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
