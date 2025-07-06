import Header from "@/components/Header";
import Footer from "@/components/footer";
import { motion } from "framer-motion";
import Farmer1 from "@/assets/QuienesSomos/Farmer1.png";
import Farmer3 from "@/assets/QuienesSomos/Farmer3.png";
import Farmer4 from "@/assets/QuienesSomos/Farmer4.png";
import Farmer5 from "@/assets/QuienesSomos/Farmer5.png";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2 },
  }),
};

export default function QuienesSomos() {
  return (
    <>
      <Header />

      <main className="w-full px-4 sm:px-6 md:px-10 py-10 mt-12 mb-20 font-[Fredoka] text-base sm:text-lg md:text-xl">
        {/* Título principal */}
        <section className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="bg-white shadow-xl rounded-xl px-4 sm:px-6 md:px-10 py-10 w-full relative overflow-hidden"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#48BD28] mb-6 border-b-4 border-[#48BD28] pb-2 w-fit">
              ¿Quiénes somos?
            </h1>

            <div className="flex flex-col sm:flex-row sm:items-center gap-6 mt-4 justify-between">
              <p className="leading-relaxed text-[#0D141C] text-center sm:text-left max-w-4xl mx-auto sm:mx-0">
                <strong>SENAGROL</strong> es una plataforma creada para resolver los retos que enfrentan los agricultores para llegar directamente a los consumidores finales y asegurar la rentabilidad de sus cultivos. A pesar de los avances tecnológicos y la disponibilidad de herramientas en línea, los agricultores siguen enfrentando problemas como el acceso limitado a los mercados, la falta de visibilidad y la descoordinación entre producción y demanda.
              </p>
              <img
                src={Farmer1}
                alt="Agricultor 1"
                className="w-28 sm:w-32 md:w-44 mx-auto sm:mx-0"
              />
            </div>
          </motion.div>
        </section>

        {/* Misión */}
        <motion.section
          custom={1}
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="mt-16 max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-6"
        >
          <img src={Farmer3} alt="Misión" className="w-28 sm:w-32 md:w-44 mx-auto md:mx-0" />
          <div className="text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-[#48BD28] mb-4 border-b-4 border-[#48BD28] pb-1 w-fit mx-auto md:mx-0">
              Nuestra Misión
            </h2>
            <p className="text-[#0D141C] leading-relaxed text-justify max-w-4xl mx-auto">
              Ofrecer un entorno óptimo donde agricultores, consumidores y transportadores puedan interactuar y comercializar productos agrícolas de manera sencilla y eficiente, contribuyendo al bienestar de la sociedad.
            </p>
          </div>
        </motion.section>

        {/* Visión */}
        <motion.section
          custom={2}
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="mt-12 max-w-6xl mx-auto flex flex-col md:flex-row-reverse items-center gap-6"
        >
          <img src={Farmer4} alt="Visión" className="w-28 sm:w-32 md:w-44 mx-auto md:mx-0" />
          <div className="text-center md:text-right w-full">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-[#48BD28] mb-4 border-b-4 border-[#48BD28] pb-1 w-fit mx-auto md:ml-auto">
              Nuestra Visión
            </h2>
            <p className="text-[#0D141C] leading-relaxed text-justify max-w-4xl mx-auto md:ml-auto">
              Ser la plataforma líder en Colombia que facilite la comercialización directa de productos agrícolas, promoviendo la sostenibilidad económica de los campesinos y mejorando el acceso a productos frescos y de calidad para los consumidores.
            </p>
          </div>
        </motion.section>

        {/* Valores */}
        <motion.section
          custom={3}
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="mt-12 max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-6 mb-16"
        >
          <img src={Farmer5} alt="Valores" className="w-28 sm:w-32 md:w-44 mx-auto md:mx-0" />
          <div className="text-center md:text-left w-full">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-[#48BD28] mb-4 border-b-4 border-[#48BD28] pb-1 w-fit mx-auto md:mx-0">
              Nuestros Valores
            </h2>
            <ul className="list-disc list-inside text-[#0D141C] space-y-2 max-w-4xl mx-auto md:mx-0 text-left">
              <li>Compromiso con el desarrollo rural</li>
              <li>Transparencia y equidad</li>
              <li>Innovación tecnológica</li>
              <li>Sostenibilidad</li>
              <li>Apoyo a la comunidad agrícola</li>
            </ul>
          </div>
        </motion.section>
      </main>

      <Footer />
    </>
  );
}
