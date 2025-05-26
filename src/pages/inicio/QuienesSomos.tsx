import Header from "../../components/Header";

export default function QuienesSomos() {
  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-lg mt-10 mb-20">
        <h1 className="text-4xl font-extrabold text-[#48BD28] mb-8 text-center">
          Quiénes Somos
        </h1>

        <section className="mb-8 space-y-4">
          <p className="text-lg leading-relaxed text-gray-700">
            SENAGROL es una plataforma creada para resolver los retos que enfrentan los agricultores para llegar directamente a los consumidores finales y asegurar la rentabilidad de sus cultivos. A pesar de los avances tecnológicos y la disponibilidad de herramientas en línea, los agricultores siguen enfrentando problemas como el acceso limitado a los mercados, la falta de visibilidad y la descoordinación entre producción y demanda.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-3 text-[#48BD28] border-b-2 border-green-300 pb-1">
            Nuestra Misión
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            Ofrecer un entorno óptimo donde agricultores, consumidores y transportadores puedan interactuar y comercializar productos agrícolas de manera sencilla y eficiente, contribuyendo al bienestar de la sociedad.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-3 text-[#48BD28] border-b-2 border-green-300 pb-1">
            Nuestra Visión
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            Ser la plataforma líder en Colombia que facilite la comercialización directa de productos agrícolas, promoviendo la sostenibilidad económica de los campesinos y mejorando el acceso a productos frescos y de calidad para los consumidores.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-[#48BD28] border-b-2 border-green-300 pb-1">
            Nuestros Valores
          </h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2 text-lg">
            <li>Compromiso con el desarrollo rural</li>
            <li>Transparencia y equidad</li>
            <li>Innovación tecnológica</li>
            <li>Sostenibilidad</li>
            <li>Apoyo a la comunidad agrícola</li>
          </ul>
        </section>
      </main>
    </>
  );
}
