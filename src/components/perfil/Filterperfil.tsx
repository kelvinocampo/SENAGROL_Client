import { useState, useRef, useEffect } from 'react';
import ListarMiscompras from './ListarMiscompras';

const PerfilMenu = () => {
  const [open, setOpen] = useState(false);
  const [mostrarCompras, setMostrarCompras] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Definimos el tipo de la referencia como HTMLDivElement y HTMLButtonElement
  const menuRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  // Cerrar el menú si el usuario hace clic fuera del área
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current && !menuRef.current.contains(event.target as Node) &&
        buttonRef.current && !buttonRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
        setMostrarCompras(false); // Opcional, cierra también el contenido
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    // Limpieza del efecto
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Manejo de hover con retraso para evitar que se cierre el menú rápidamente
  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current); // Cancelar cualquier temporizador previo
    }
    setOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 200); // Retraso para cierre suave
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        ref={buttonRef}
        className="hover:text-[#48BD28] transition"
      >
        Perfil
      </button>

      {open && (
        <div
          ref={menuRef}
          className="absolute left-0 mt-2 w-56 bg-white shadow-lg rounded-md z-50 border border-gray-200"
          onMouseEnter={handleMouseEnter} 
          onMouseLeave={handleMouseLeave} 
        >
          <ul className="divide-y divide-gray-100">
            <li
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                setMostrarCompras(true);
                setOpen(false); // Cierra el menú al seleccionar
              }}
            >
              Mis compras
            </li>
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Transportadores</li>
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Mis Transportes</li>
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Envíos Fácil</li>
          </ul>
        </div>
      )}

      {/* Contenido separado del menú para mejor experiencia */}
      {mostrarCompras && (
        <div className="absolute top-full left-0 mt-4 w-full z-40 bg-white p-4 shadow-xl rounded-md">
          <h2 className="text-lg font-bold mb-2">Listado de mis compras</h2>
          <ListarMiscompras />
        </div>
      )}
    </div>
  );
};

export default PerfilMenu;
