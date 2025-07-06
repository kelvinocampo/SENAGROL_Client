import Header from "@/components/Header";
import Footer from "@/components/footer";
import { motion } from "framer-motion";
import Farmer1 from "@/assets/farmer1.png";
import Farmer2 from "@/assets/farmer2.png";
import Farmer3 from "@/assets/farmer3.png";
import Farmer4 from "@/assets/farmer4.png";
import Farmer5 from "@/assets/farmer5.png";

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

      <main className="max-w-full mx-auto px-4 md:px-8 py-10 mt-12 mb-20 font-[Fredoka] text-base sm:text-lg md:text-xl">
        {/* Imagen que solo aparece en portátil hacia arriba */}
      

        {/* Sección Quiénes Somos */}
        <motion.section
          custom={0}
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="bg-white shadow-xl rounded-xl p-10 sm:-6 md:p-10 w-full h-100    relative overflow-hidden mb-16"
        >
           <img
            src={Farmer1}
            alt="Agricultor 1"
            className="hidden md:block absolute z-10 w-[240px] right-40  bottom-5"
          />
          <img
            src={Farmer2}
            alt="Agricultor 2"
            className="hidden md:block absolute z-10 w-[240px] right-10 bottom-5"
          />

          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-5xl font-bold text-[#48BD28] mb-8 text-left border-b-4 border-[#48BD28] pb-2 w-fit mx-4 md:mx-20"
          >
            ¿Quiénes somos?
          </motion.h1>

          <div className="flex flex-col items-left mx-4 md:mx-20 gap-6 relative z-10">
            <p className="leading-relaxed text-[#0D141C] text-justify max-w-4xl text-base sm:text-lg md:text-xl">
              <strong>SENAGROL</strong> es una plataforma creada para resolver los retos que enfrentan los agricultores para llegar directamente a los consumidores finales y asegurar la rentabilidad de sus cultivos. A pesar de los avances tecnológicos y la disponibilidad de herramientas en línea, los agricultores siguen enfrentando problemas como el acceso limitado a los mercados, la falta de visibilidad y la descoordinación entre producción y demanda.
            </p>
          </div>
        </motion.section>

        {/* Misión */}
        <motion.section
          custom={1}
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="p-4 sm:p-6 md:p-10 w-full h-auto overflow-hidden"
        >
          <div className="flex flex-col md:flex-row gap-6 md:gap-8">
            <img src={Farmer3} alt="Misión" className="w-32 md:w-48" />
            <div>
              <h2 className="text-3xl sm:text-4xl font-semibold text-[#48BD28] mb-6 border-b-4 border-[#48BD28] pb-1 w-fit">
                Nuestra Misión
              </h2>
              <p className="text-justify text-[#0D141C] leading-relaxed">
                Ofrecer un entorno óptimo donde agricultores, consumidores y transportadores puedan interactuar y comercializar productos agrícolas de manera sencilla y eficiente, contribuyendo al bienestar de la sociedad.
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
          className="p-4 sm:p-6 md:p-10 w-full h-auto overflow-hidden"
        >
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center">
            <div className="text-right">
              <h2 className="text-3xl sm:text-4xl font-semibold text-[#48BD28] mb-6 border-b-4 border-[#48BD28] pb-1 w-fit ml-auto">
                Nuestra Visión
              </h2>
              <p className="text-justify text-[#0D141C] leading-relaxed">
                Ser la plataforma líder en Colombia que facilite la comercialización directa de productos agrícolas, promoviendo la sostenibilidad económica de los campesinos y mejorando el acceso a productos frescos y de calidad para los consumidores.
              </p>
            </div>
            <img src={Farmer4} alt="Visión" className="w-32 md:w-48" />
          </div>
        </motion.section>

        {/* Valores */}
        <motion.section
          custom={3}
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="p-4 sm:p-6 md:p-10 w-full h-auto overflow-hidden"
        >
          <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start">
            <img src={Farmer5} alt="Valores" className="w-32 md:w-48" />
            <div>
              <h2 className="text-3xl sm:text-4xl font-semibold text-[#48BD28] mb-6 border-b-4 border-[#48BD28] pb-1 w-fit">
                Nuestros Valores
              </h2>
              <ul className="list-disc list-inside text-[#0D141C] space-y-2">
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
