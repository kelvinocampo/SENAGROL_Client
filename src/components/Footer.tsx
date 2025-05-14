import { FaFacebook, FaInstagram, FaGoogle } from "react-icons/fa";

const Footer = () => {
  return (
    <div>
      <footer className="mt-20 text-sm text-[#48BD28] px-10 py-6 border-t flex justify-between font-[Fredoka]">
        <p>Quiénes somos</p>
        <div className="flex gap-6 text-xl">
          <a href="#"><FaFacebook /></a>
          <a href="#"><FaInstagram /></a>
          <a href="#"><FaGoogle /></a>
        </div>
        <p>Políticas de privacidad</p>
      </footer>
      <p className="text-xs text-center text-[#48BD28] mt-4">© 2025 Senagrol</p>
    </div>
  );
};

export default Footer;
