import Header from "../../components/Header";

export default function PoliticasPrivacidad() {
  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-lg mt-10 mb-20">
        <h1 className="text-4xl font-extrabold text-[#48BD28] mb-8 text-center">
          Políticas de Privacidad
        </h1>

        <section className="mb-8 space-y-4 text-gray-700 text-lg leading-relaxed">
          <p>
            En SENAGROL valoramos la privacidad de nuestros usuarios y nos comprometemos a proteger sus datos personales. Esta política detalla cómo recopilamos, usamos y almacenamos la información para garantizar un servicio seguro y confiable.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-3 text-[#48BD28] border-b-2 border-green-300 pb-1">
            Uso de los Datos Personales
          </h2>
          <p>
            Los datos recolectados se utilizan para facilitar la interacción entre agricultores, consumidores y transportadores, optimizar la comercialización de productos agrícolas y mejorar la experiencia de usuario en la plataforma.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-3 text-[#48BD28] border-b-2 border-green-300 pb-1">
            Almacenamiento y Seguridad
          </h2>
          <p>
            Implementamos medidas técnicas y organizativas para proteger los datos personales contra accesos no autorizados, pérdida, alteración o divulgación indebida, garantizando la confidencialidad y seguridad de la información.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-[#48BD28] border-b-2 border-green-300 pb-1">
            Derechos de los Usuarios
          </h2>
          <p>
            Los usuarios pueden ejercer sus derechos de acceso, rectificación, cancelación y oposición sobre sus datos personales en cualquier momento, en conformidad con la legislación vigente.
          </p>
        </section>
      </main>
    </>
  );
}
