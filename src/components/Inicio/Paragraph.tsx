export const Paragraph = () => (
  <>
    <p className="text-center text-sm text-[BFBFBD]">
      <a href="/EnviarCorreo" className="text-[#48BD28] hover:underline">
        ¿Olvidaste tu contraseña?
      </a>
    </p>

    <button
      type="button"
      className="w-full border py-2 rounded-lg flex justify-center items-center gap-2"
    >
      Iniciar sesión con reconocimiento facial
    </button>

    <p className="text-center text-sm text-black">
      ¿No tienes una cuenta?{" "}
      <a href="/register" className="text-[#48BD28] hover:underline">
        Regístrate
      </a>
    </p>
  </>
);