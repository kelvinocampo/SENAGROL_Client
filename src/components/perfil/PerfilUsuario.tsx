import { useEffect, useState } from 'react';
import perfil from '@assets/sin_foto.jpg';
import { obtenerPerfilUsuario } from '@services/PerfilusuarioServices';

interface Usuario {
  nombre: string;
  nombre_usuario: string;
  correo: string;
  telefono: string;
  roles: string;
}

const UserProfile = () => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  useEffect(() => {
    const fetchPerfil = async () => {
      const token = localStorage.getItem('token');
     

      if (!token) return;

      try {
        const data = await obtenerPerfilUsuario(token);
       

      
        if (data && data[0]) {
          const usuarioConRol = {
            ...data[0],
            roles: data.roles,
          };
          setUsuario(usuarioConRol);
        }
      } catch (error) {
        console.error("Error al obtener perfil:", error);
      }
    };

    fetchPerfil();
  }, []);

  if (!usuario) return <p>Cargando perfil...</p>;

  return (
    <aside className="w-full sm:w-64 p-6 border-r border-gray-200 flex flex-col items-center">
      <img
        src={perfil}
        alt="Perfil"
        className="w-32 h-32 rounded-full"
      />
      <h2 className="text-lg font-semibold mt-4 text-center sm:text-left">{usuario.nombre}</h2>
      <p className="text-[#48BD28] mb-6 text-center sm:text-left">{usuario.nombre_usuario}</p>
      <div className="text-sm w-full">
        <p className="text-[#48BD28] font-semibold">Correo</p>
        <p className="mb-4">{usuario.correo}</p>
        <p className="text-[#48BD28] font-semibold">Teléfono</p>
        <p className="mb-4">{usuario.telefono}</p>
        <p className="text-[#48BD28] font-semibold">Rol</p>
        <p>{usuario.roles}</p>
      </div>
    </aside>
  );
};

export default UserProfile;
