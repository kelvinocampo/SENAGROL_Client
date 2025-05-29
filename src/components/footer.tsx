import { FaFacebook, FaInstagram, FaGoogle } from "react-icons/fa";
import { motion } from "framer-motion";

const socialIcons = [
  { icon: <FaFacebook />, link: "#", delay: 0 },
  { icon: <FaInstagram />, link: "#", delay: 0.2 },
  { icon: <FaGoogle />, link: "#", delay: 0.4 },
];

const Footer = () => {
  return (
    <motion.footer
      className="mt-20 px-10 py-10 border-t bg-[#f4fcf1] font-[Fredoka] text-[#205116] overflow-hidden"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, ease: "easeOut" }}
    >
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Izquierda */}
        <motion.p
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          className="text-lg font-medium"
        >
     <a href="/QuienesSomos">Quienes Somos</a>
        </motion.p>

        {/* Íconos de redes */}
        <motion.div
          className="flex gap-8 text-2xl text-[#48BD28]"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.15,
              },
            },
          }}
        >
          {socialIcons.map((item, index) => (
            <motion.a
              key={index}
              href={item.link}
              variants={{
                hidden: { scale: 0, rotate: -90, opacity: 0 },
                visible: {
                  scale: 1,
                  rotate: 0,
                  opacity: 1,
                  transition: {
                    type: "spring",
                    stiffness: 300,
                    damping: 20,
                    delay: item.delay,
                  },
                },
              }}
              whileHover={{
                scale: 1.3,
                rotate: [0, 10, -10, 10, 0],
                transition: { duration: 0.6 },
              }}
              whileTap={{ scale: 0.9 }}
            >
              {item.icon}
            </motion.a>
          ))}
        </motion.div>

        {/* Derecha */}
        <motion.p
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
          className="text-lg font-medium"
        >
      <a href="/PoliticasPrivacidad">Politicas de Privacidad</a>
        </motion.p>
        {/* Izquierda */}
        <motion.p
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          className="text-lg font-medium"
        >
     <a href="/QuienesSomos">Quienes Somos</a>
        </motion.p>

        {/* Íconos de redes */}
        <motion.div
          className="flex gap-8 text-2xl text-[#48BD28]"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.15,
              },
            },
          }}
        >
          {socialIcons.map((item, index) => (
            <motion.a
              key={index}
              href={item.link}
              variants={{
                hidden: { scale: 0, rotate: -90, opacity: 0 },
                visible: {
                  scale: 1,
                  rotate: 0,
                  opacity: 1,
                  transition: {
                    type: "spring",
                    stiffness: 300,
                    damping: 20,
                    delay: item.delay,
                  },
                },
              }}
              whileHover={{
                scale: 1.3,
                rotate: [0, 10, -10, 10, 0],
                transition: { duration: 0.6 },
              }}
              whileTap={{ scale: 0.9 }}
            >
              {item.icon}
            </motion.a>
          ))}
        </motion.div>

        {/* Derecha */}
        <motion.p
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
          className="text-lg font-medium"
        >
      <a href="/PoliticasPrivacidad">Politicas de Privacidad</a>
        </motion.p>
        </div>
        <p>Políticas de privacidad</p>
      </footer>
      <p className="text-xs text-center text-[#48BD28] mt-4">© 2025 Senagrol</p>
    </div>
  );
};

export default Footer;
