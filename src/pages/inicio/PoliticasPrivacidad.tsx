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

export default function PoliticasPrivacidad() {
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
          Políticas de Privacidad
        </motion.h1>

        <motion.section
          custom={0}
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="mb-10 text-gray-700 text-lg leading-relaxed"
        >
          <p>
            En <strong>SENAGROL</strong> valoramos la privacidad de nuestros usuarios y nos comprometemos a proteger sus datos personales. Esta política detalla cómo recopilamos, usamos y almacenamos la información para garantizar un servicio seguro y confiable.
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
            Uso de los Datos Personales
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            Los datos recolectados se utilizan para facilitar la interacción entre agricultores, consumidores y transportadores, optimizar la comercialización de productos agrícolas y mejorar la experiencia de usuario en la plataforma.
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
            Almacenamiento y Seguridad
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            Implementamos medidas técnicas y organizativas para proteger los datos personales contra accesos no autorizados, pérdida, alteración o divulgación indebida, garantizando la confidencialidad y seguridad de la información.
          </p>
        </motion.section>

        <motion.section
          custom={3}
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-2xl font-semibold mb-4 text-[#48BD28] border-b-2 border-green-300 pb-1">
            Derechos de los Usuarios
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            Los usuarios pueden ejercer sus derechos de acceso, rectificación, cancelación y oposición sobre sus datos personales en cualquier momento, en conformidad con la legislación vigente.
          </p>
        </motion.section>
      </main>
        <Footer></Footer>
    </>
  );
}
