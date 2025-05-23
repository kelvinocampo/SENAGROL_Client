import { FaFacebook, FaInstagram, FaGoogle } from "react-icons/fa";
import perfilImg from "../assets/sin_foto.jpg";
import camionImg from "../assets/carro.jpg";
import imagen from "../assets/Imagen.jpeg";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header"; 
import Footer from "../components/Footer";

function FormularioTransportador() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white font-[Fredoka] text-[#111]">
      {}
      <Header />

      {/* Main Content */}
      <main className="flex pt-32 px-10 gap-10">
        {/* Perfil Lateral */}
        <aside className="w-1/3 flex flex-col items-center border-r border-gray-200 pr-6">
          <img
            src={perfilImg}
            alt="Perfil"
            className="rounded-full w-28 h-28 object-cover mb-4"
          />
          <h2 className="text-lg font-medium">jaime roberto</h2>
          <p className="text-[#48BD28]">@jaime_12</p>

          <div className="text-sm space-y-4 w-full mt-6">
            <div>
              <p className="text-[#48BD28] font-medium">Correo</p>
              <p>roberto@gmail.com</p>
            </div>
            <div>
              <p className="text-[#48BD28] font-medium">Teléfono</p>
              <p>3115678421</p>
            </div>
            <div>
              <p className="text-[#48BD28] font-medium">Rol</p>
              <p>Comprador</p>
            </div>
          </div>
        </aside>
        
        {/* Formulario */}
        <section className="w-2/3">
          <h1 className="text-2xl font-bold mb-6">Formulario Transportador</h1>
          <form className="space-y-4">
            {[
              "Licencia de conducción",
              "SOAT vigente",
              "Tarjeta de propiedad del vehículo",
              "Registro de antecedentes",
              "Tipo de vehículo",
              "Peso del vehículo",
            ].map((label, i) => (
              <div key={i}>
                <label className="block font-medium mb-1">{label}</label>
                <input
                  type="text"
                  placeholder={`Ingrese ${label.toLowerCase()}`}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            ))}

            <div className="mt-6 flex gap-4">
              <img
                src={camionImg}
                alt="Camión"
                className="h-70 object-cover rounded shadow"
              />
              <img
                src={imagen}
                alt="Foto adicional"
                className="h-50 object-cover rounded shadow"
              />
            </div>

            <div className="flex gap-4 mt-4">
              <button
                type="submit"
                className="bg-[#48BD28] text px-6 py-2 rounded-full hover:bg-green-700 transition"
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
          </form>
        </section>
        </main>

        <Footer />
        </div>
        );
        }

export default FormularioTransportador;

              



