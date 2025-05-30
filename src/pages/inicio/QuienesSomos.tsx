import Header from "../../components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

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
      <main className="max-w-4xl mx-auto px-6 sm:px-8 py-12 bg-white rounded-xl shadow-2xl mt-12 mb-24">
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-extrabold text-[#48BD28] mb-10 text-center"
        >
          Quiénes Somos
        </motion.h1>

        <motion.section
          custom={0}
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="mb-10"
        >
          <p className="text-lg leading-relaxed text-gray-700">
            <strong>SENAGROL</strong> es una plataforma creada para resolver los retos que enfrentan los agricultores para llegar directamente a los consumidores finales y asegurar la rentabilidad de sus cultivos. A pesar de los avances tecnológicos y la disponibilidad de herramientas en línea, los agricultores siguen enfrentando problemas como el acceso limitado a los mercados, la falta de visibilidad y la descoordinación entre producción y demanda.
          </p>
        </motion.section>

        <motion.section
          custom={1}
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="mb-10"
        >
          <h2 className="text-2xl font-semibold mb-3 text-[#48BD28] border-b-2 border-green-300 pb-1">
            Nuestra Misión
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            Ofrecer un entorno óptimo donde agricultores, consumidores y transportadores puedan interactuar y comercializar productos agrícolas de manera sencilla y eficiente, contribuyendo al bienestar de la sociedad.
          </p>
        </motion.section>

        <motion.section
          custom={2}
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="mb-10"
        >
          <h2 className="text-2xl font-semibold mb-3 text-[#48BD28] border-b-2 border-green-300 pb-1">
            Nuestra Visión
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            Ser la plataforma líder en Colombia que facilite la comercialización directa de productos agrícolas, promoviendo la sostenibilidad económica de los campesinos y mejorando el acceso a productos frescos y de calidad para los consumidores.
          </p>
        </motion.section>

        <motion.section
          custom={3}
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
        >
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
        </motion.section>
      </main>
      <Footer></Footer>
    </>
  );
}
