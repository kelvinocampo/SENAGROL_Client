import { FaFacebook, FaInstagram, FaGoogle } from "react-icons/fa";

const Footer = () => {
  return (
    <div className="w-full bg-white">
      <footer className="w-full text-sm text-[#48BD28] px-4 md:px-10 py-6 border-t flex flex-col md:flex-row justify-between items-center gap-4 font-[Fredoka]">
        <p>Quiénes somos</p>
        <div className="flex gap-6 text-xl">
          <a href="#"><FaFacebook /></a>
          <a href="#"><FaInstagram /></a>
          <a href="#"><FaGoogle /></a>
        </div>
        <p>Políticas de privacidad</p>
      </footer>
      <p className="text-xs text-center text-[#48BD28] mt-2 mb-4">© 2025 Senagrol</p>
    </div>
  );
};

export default Footer;
