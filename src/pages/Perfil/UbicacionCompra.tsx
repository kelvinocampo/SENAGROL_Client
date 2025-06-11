import { useParams } from "react-router-dom";
import MapaUbicacion from "@/components/perfil/UbicacionTransportador";
import Header from "@/components/Header";
import Footer from "@/components/footer";
import UserProfileCard from "@/components/perfil/UserProfileCard";
import { Link } from "react-router-dom";

const UbicacionCompra = () => {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return <p className="text-center text-red-500 mt-6">⚠️ Compra no especificada</p>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow p-4 bg-white">
        <div className="px-4 pt-6 self-start">
          <Link
            to="/mistransportes"
            className="inline-flex items-center text-green-700 hover:text-green-900 font-medium"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5 mr-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
            Volver a Mis Transportes
          </Link>
        </div>

        <h1 className="text-2xl font-bold mb-6 text-center">
          Ubicación de la Compra #{id}
        </h1>

        {/* Diseño en dos columnas */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Columna izquierda - Tarjeta de perfil */}
          <div className="w-full lg:w-1/3">
            <UserProfileCard />
          </div>

          {/* Columna derecha - Mapa */}
          <div className="w-full lg:w-2/3">
            <MapaUbicacion id_compra={parseInt(id)} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default UbicacionCompra;
