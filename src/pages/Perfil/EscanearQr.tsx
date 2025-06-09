import Header from '@components/Header';
import Footer from "@components/footer";
import QrScanner from '@components/perfil/EscanearQr';
import { Link } from "react-router-dom";

const EscanearQr = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      
      <div className="flex-1 px-4 sm:px-10 lg:px-24 py-6">
        <div className="mb-6">
          <Link
            to="/mistransportes"
            className="inline-flex items-center text-green-700 hover:text-green-900 text-lg font-medium"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6 mr-3"
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

        <div className="flex justify-center items-center">
          <div className="w-full max-w-2xl bg-gray-50 p-6 rounded-lg shadow-lg">
            <QrScanner />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default EscanearQr;
