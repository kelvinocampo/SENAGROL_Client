import Header from "@/components/Header";
import Footer from "@/components/footer";
import { motion } from "framer-motion";
import Farmer1 from "@/assets/farmer1.png";
import Farmer2 from "@/assets/farmer2.png";
import Farmer3 from "@/assets/farmer3.png";
import Farmer4 from "@/assets/farmer4.png";

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
      <main className="max-w-6xl mx-auto px-4 md:px-8 py-10 mt-12 mb-20">
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-5xl font-extrabold text-[#48BD28] mb-10 text-center"
        >
          ¿Quiénes somos?
        </motion.h1>

        <motion.section
          custom={0}
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="bg-white shadow-md rounded-xl p-6 md:p-10 mb-12"
        >
          <div className="flex flex-col md:flex-row items-center gap-6">
            <img
              src={Farmer1}
              alt="Agricultor"
              className="w-32 sm:w-40 md:w-48 object-contain"
            />
            <p className="text-lg leading-relaxed text-gray-700 text-justify">
              <strong>SENAGROL</strong> es una plataforma creada para resolver los retos
              que enfrentan los agricultores para llegar directamente a los consumidores
              finales y asegurar la rentabilidad de sus cultivos. A pesar de los avances
              tecnológicos y la disponibilidad de herramientas en línea, los agricultores
              siguen enfrentando problemas como el acceso limitado a los mercados, la falta
              de visibilidad y la descoordinación entre producción y demanda.
            </p>
          </div>
        </motion.section>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Misión */}
          <motion.section
            custom={1}
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="bg-green-50 p-6 md:p-8 rounded-xl shadow"
          >
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <img src={Farmer2} alt="Misión" className="w-28 sm:w-32 md:w-36" />
              <div>
                <h2 className="text-2xl font-semibold mb-3 text-[#48BD28]">
                  Nuestra Misión
                </h2>
                <p className="text-gray-700 text-justify text-base leading-relaxed">
                  Ofrecer un entorno óptimo donde agricultores, consumidores y
                  transportadores puedan interactuar y comercializar productos agrícolas
                  de manera sencilla y eficiente, contribuyendo al bienestar de la sociedad.
                </p>
              </div>
            </div>
          </motion.section>

          {/* Visión */}
          <motion.section
            custom={2}
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="bg-green-50 p-6 md:p-8 rounded-xl shadow"
          >
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <img src={Farmer3} alt="Visión" className="w-28 sm:w-32 md:w-36" />
              <div>
                <h2 className="text-2xl font-semibold mb-3 text-[#48BD28]">
                  Nuestra Visión
                </h2>
                <p className="text-gray-700 text-justify text-base leading-relaxed">
                  Ser la plataforma líder en Colombia que facilite la comercialización
                  directa de productos agrícolas, promoviendo la sostenibilidad económica
                  de los campesinos y mejorando el acceso a productos frescos y de calidad
                  para los consumidores.
                </p>
              </div>
            </div>
          </motion.section>
        </div>

        {/* Valores */}
        <motion.section
          custom={3}
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="bg-green-50 mt-12 p-6 md:p-10 rounded-xl shadow"
        >
          <div className="flex flex-col sm:flex-row items-start gap-8">
            <img src={Farmer4} alt="Valores" className="w-32 sm:w-40 md:w-48" />
            <div>
              <h2 className="text-2xl font-semibold mb-4 text-[#48BD28]">
                Nuestros Valores
              </h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2 text-lg">
                <li>Compromiso con el desarrollo rural</li>
                <li>Transparencia y equidad</li>
                <li>Innovación tecnológica</li>
                <li>Sostenibilidad</li>
                <li>Apoyo a la comunidad agrícola</li>
              </ul>
            </div>
          </div>
        </motion.section>
      </main>
      <Footer />
    </>
  );
}
