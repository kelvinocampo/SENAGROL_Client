import { motion } from "framer-motion";
import {
  FaInstagram,
  FaFacebook,
  FaWhatsapp,
} from "react-icons/fa";
import senagrolLogo from "@assets/senagrol.png";

const socialIcons = [
  { icon: FaInstagram, link: "#", delay: 0 },
  { icon: FaFacebook, link: "#", delay: 0.15 },
  { icon: FaWhatsapp, link: "#", delay: 0.3 },
];

const Footer = () => {
  return (
    <motion.footer
      className="bg-white border-t-[1px] border-[#c7f6c3] font-[Fredoka] text-[#205116] relative bottom-0 overflow-hidden"
      initial={{ y: 80, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true }}
    >
      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
        {/* Contacto y Social en una misma columna */}
        <div className="flex flex-col md:flex-row gap-16 md:gap-24">
          {/* Servicio de contacto */}
          <div>
            <h4 className="uppercase text-xs font-bold tracking-wider mb-3">
              Servicio de contacto
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/QuienesSomos" className="hover:underline">
                  ¿Quiénes somos?
                </a>
              </li>
              <li>
                <a href="/PoliticasPrivacidad" className="hover:underline">
                  Términos y condiciones
                </a>
              </li>
              <li>
                <a href="/IA" className="hover:underline">
                  Asistente IA
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="uppercase text-xs font-bold tracking-wider mb-3">
              Social
            </h4>
            <motion.div
              className="flex items-center gap-6 text-2xl text-[#205116]"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.15 },
                },
              }}
            >
              {socialIcons.map(({ icon: Icon, link, delay }, idx) => (
                <motion.a
                  key={idx}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  variants={{
                    hidden: { scale: 0, rotate: -90, opacity: 0 },
                    visible: {
                      scale: 1,
                      rotate: 0,
                      opacity: 1,
                      transition: {
                        type: "spring",
                        stiffness: 280,
                        damping: 18,
                        delay,
                      },
                    },
                  }}
                  whileHover={{
                    scale: 1.25,
                    rotate: [0, 10, -10, 10, 0],
                    transition: { duration: 0.6 },
                  }}
                  whileTap={{ scale: 0.9 }}
                  className="hover:text-[#48BD28] transition-colors"
                >
                  <Icon />
                </motion.a>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Logo */}
        <motion.div
          className="flex flex-col items-center md:items-end"
          initial={{ x: 80, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          viewport={{ once: true }}
        >
          <img
            src={senagrolLogo}
            alt="Logo Senagrol"
            className="w-28 md:w-32"
          />
          <span className="mt-1 text-[#48BD28] font-semibold">SENAGROL</span>
        </motion.div>
      </div>

      {/* Línea y Copyright */}
      <hr className="border-t border-[#c7f6c3]" />
      <p className="text-center text-xs py-4 text-[#205116]">
        Copyright © Senagrol
      </p>
    </motion.footer>
  );
};

export default Footer;
