import perfil from '@assets/sin_foto.jpg';

const UserProfile = () => {
  return (
    <aside className="w-full sm:w-64 p-6 border-r border-gray-200 flex flex-col items-center">
      <img
        src={perfil}
        alt="Perfil"
        className="w-32 h-32 rounded-full"
      />
      <h2 className="text-lg font-semibold mt-4 text-center sm:text-left">Jaime Roberto</h2>
      <p className="text-[#48BD28] mb-6 text-center sm:text-left">jaime_12</p>
      <div className="text-sm w-full">
        <p className="text-[#48BD28] font-semibold">Correo</p>
        <p className="mb-4">roberto@gmail.com</p>
        <p className="text-[#48BD28] font-semibold">Teléfono</p>
        <p className="mb-4">3115678421</p>
        <p className="text-[#48BD28] font-semibold">Rol</p>
        <p>Comprador</p>
      </div>
    </aside>
  );
};

export default UserProfile;
