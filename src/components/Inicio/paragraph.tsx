import { Link } from "react-router-dom";

export const Paragraph = () => (
  <>
    <p className="text-center text-sm text-[BFBFBD]">
      <Link to="/recuperar" className="text-[#48BD28] hover:underline">
        ¿Olvidaste tu contraseña?
      </Link>
    </p>

    <button
      type="button"
      className="w-full border py-2 rounded-lg flex justify-center items-center gap-2"
    >
      Iniciar sesión con reconocimiento facial
    </button>

    <p className="text-center text-sm text-black">
      ¿No tienes una cuenta?{" "}
      <Link to="/Register" className="text-[#48BD28] hover:underline">
        Regístrate
      </Link>
    </p>
  </>
);
