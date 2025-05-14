import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaFacebook, FaInstagram, FaGoogle } from "react-icons/fa";
import Header from "../../components/Header"; 
import PeticionVendedor from "../PeticionVendedor/PeticionVendedor";
import perfilImg from "../../assets/sin_foto.jpg";
import Footer from "../Footer";

type FormData = {
  username: string;
  email: string;
  name: string;
  phone: string;
  role: string;
};

function PerfilUsuarioUnico() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>(() => {
    const saved = localStorage.getItem("perfilData");
    return saved
      ? JSON.parse(saved)
      : {
          username: "@jaime_12",
          email: "roberto@gmail.com",
          name: "jaime roberto",
          phone: "3115678421",
          role: "Comprador",
        };
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => setIsEditing(false);

  const handleUpdate = () => {
    localStorage.setItem("perfilData", JSON.stringify(formData));
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-white font-[Fredoka] text-[#111]">
      {/* Header con dropdown incluido */}
      <Header />

      <main className="flex pt-32 px-10 gap-10">
        {/* Sidebar izquierdo */}
        <aside className="w-1/3 flex flex-col items-center border-r border-gray-200 pr-6">
          <img
            src={perfilImg}
            alt="Perfil"
            className="rounded-full w-28 h-28 object-cover mb-4"
          />
          <h2 className="text-lg font-medium">{formData.name}</h2>
          <p className="text-[#48BD28]">{formData.username}</p>
          <FaEdit
            className="cursor-pointer hover:text-green-700 mb-4 mt-1"
            onClick={() => setIsEditing(true)}
          />

          <div className="text-sm space-y-4 w-full">
            <div>
              <p className="text-[#48BD28] font-medium">Correo</p>
              <p>{formData.email}</p>
            </div>
            <div>
              <p className="text-[#48BD28] font-medium">Teléfono</p>
              <p>{formData.phone}</p>
            </div>
            <div>
              <p className="text-[#48BD28] font-medium">Rol</p>
              <p>{formData.role}</p>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 w-full">
            <PeticionVendedor />
            <button
              onClick={() => navigate("/formulario-transportador")}
              className="bg-[#F5F0E5] text-black py-2 rounded-full"
            >
              Formulario Transportador
            </button>
          </div>
        </aside>

        {/* Formulario de edición */}
        <section className="w-2/3">
          {isEditing && (
            <>
              <h1 className="text-2xl font-bold mb-6">Editar Información de Perfil</h1>
              <div className="space-y-5">
                <div>
                  <label className="block font-medium mb-1">Nombre de usuario</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#48BD28] focus:border-[#48BD28]"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Correo</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#48BD28] focus:border-[#48BD28]"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Nombre completo</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#48BD28] focus:border-[#48BD28]"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Teléfono</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#48BD28] focus:border-[#48BD28]"
                  />
                </div>
                <div className="flex gap-4 mt-4">
                  <button
                    className="bg-[#48BD28] text-black px-6 py-2 rounded-full hover:bg-green-700 transition"
                    onClick={handleCancel}
                  >
                    Cancelar
                  </button>
                  <button
                    className="bg-[#F5F0E5] text-black px-6 py-2 rounded-full hover:bg-[#e0dacc] transition"
                    onClick={handleUpdate}
                  >
                    Actualizar
                  </button>
                </div>
              </div>
            </>
          )}
        </section>
       

        </main>

<Footer />
</div>
);
}

export default PerfilUsuarioUnico;
