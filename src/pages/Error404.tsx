const Error404 = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-gray-800">
      <h1 className="text-8xl font-extrabold text-red-600 mb-4">404</h1>
      <p className="text-2xl md:text-3xl font-semibold mb-2">
        Página no encontrada o acceso no autorizado.
      </p>
      <p className="text-lg text-gray-600">
        Por favor, verifica la URL o contacta al administrador del sistema.
      </p>
    </div>
  );
};

export default Error404;
