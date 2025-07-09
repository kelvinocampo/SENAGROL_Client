import Header from "@/components/Header";
import Footer from "@/components/footer";
import { motion } from "framer-motion";
import Farmer1 from "@/assets/politicasPrivacidad/farmer1.png"; 
import Farmer2 from "@/assets/politicasPrivacidad/farmer2.png";
import Farmer3 from "@/assets/politicasPrivacidad/farmer3.png";
import Farmer4 from "@/assets/politicasPrivacidad/farmer4.png";

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

     <main className="w-[92%] max-w-7xl mx-auto py-10 mt-12 mb-20 font-[Fredoka] text-base sm:text-lg md:text-xl">

        <section className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="bg-white shadow-xl rounded-xl px-4 sm:px-6 md:px-10 py-10 w-full relative overflow-hidden"
          >
            <h1 className="text-3xl sm:text-5xl font-bold text-[#48BD28] mb-6 pb-2">
              <span className="border-b-4 border-[#48BD28]">Política</span>s de Privacidad
            </h1>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              <p className="leading-relaxed text-[#0D141C] text-center sm:text-left max-w-4xl">
                En <strong>SENAGROL</strong> valoramos la privacidad de nuestros usuarios y nos comprometemos a proteger sus datos personales. Esta política detalla cómo recopilamos, usamos y almacenamos la información para garantizar un servicio seguro y confiable.
              </p>
              <img
                src={Farmer1}
                alt="Agricultor 1"
                className="w-28 sm:w-40 md:w-48 mx-auto sm:mx-0"
              />
            </div>
          </motion.div>
        </section>

        {/* Sección 1 */}
        <motion.section
          custom={1}
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="mt-16 max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-6"
        >
          <img
            src={Farmer2}
            alt="Uso datos"
            className="w-28 sm:w-40 md:w-48 mx-auto md:mx-0"
          />
          <div className="text-center md:text-left w-full">
            <h2 className="text-2xl sm:text-3xl font-semibold text-[#48BD28] mb-4 border-b-4 border-[#48BD28] pb-1 w-fit mx-auto md:mx-0">
              <span className="border-b-4 border-[#48BD28]">Uso de los Dat</span>os personales
            </h2>
            <p className="leading-relaxed text-[#0D141C] text-justify max-w-4xl mx-auto md:mx-0">
              Los datos recolectados se utilizan para facilitar la interacción entre agricultores, consumidores y transportadores, optimizar la comercialización de productos agrícolas y mejorar la experiencia de usuario en la plataforma.
            </p>
          </div>
        </motion.section>

        {/* Sección 2 */}
        <motion.section
          custom={2}
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="mt-12 max-w-6xl mx-auto flex flex-col md:flex-row-reverse items-center gap-6"
        >
          <img
            src={Farmer3}
            alt="Seguridad"
            className="w-28 sm:w-40 md:w-48 mx-auto md:mx-0"
          />
          <div className="text-center md:text-right w-full">
            <h2 className="text-2xl sm:text-3xl font-semibold text-[#48BD28] mb-4 border-b-4 border-[#48BD28] pb-1 w-fit mx-auto md:ml-auto">
              Almacenamie<span className="border-b-4 border-[#48BD28]">nto y Seguridad</span>
            </h2>
            <p className="leading-relaxed text-[#0D141C] text-justify max-w-4xl mx-auto md:ml-auto">
              Implementamos medidas técnicas y organizativas para proteger los datos personales contra accesos no autorizados, pérdida, alteración o divulgación indebida, garantizando la confidencialidad y seguridad de la información.
            </p>
          </div>
        </motion.section>

        {/* Sección 3 */}
        <motion.section
          custom={3}
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="mt-12 max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-6 mb-16"
        >
          <img
            src={Farmer4}
            alt="Derechos"
            className="w-28 sm:w-40 md:w-48 mx-auto md:mx-0"
          />
          <div className="text-center md:text-left w-full">
            <h2 className="text-2xl sm:text-3xl font-semibold text-[#48BD28] mb-4 border-b-4 border-[#48BD28] pb-1 w-fit mx-auto md:mx-0">
              <span className="border-b-4 border-[#48BD28]">Derechos de lo</span>s Usuarios
            </h2>
            <p className="leading-relaxed text-[#0D141C] text-justify max-w-4xl mx-auto md:mx-0">
              Los usuarios pueden ejercer sus derechos de acceso, rectificación, cancelación y oposición sobre sus datos personales en cualquier momento, en conformidad con la legislación vigente.
            </p>
          </div>
        </motion.section>
      </main>

      <Footer />
    </>
  );
}
