export default function CompraRealizada() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-2">Compra realizada!</h1>
      <p className="mb-4">Esperando asignación de transportador</p>
      <button
        className="bg-green-500 text-white px-4 py-2 rounded-full"
        onClick={() => (window.location.href = "/perfil")}
      >
        Ir a mi perfil
      </button>
    </div>
  );
}
