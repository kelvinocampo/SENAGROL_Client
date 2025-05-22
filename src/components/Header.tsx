import { useState, useRef, useEffect } from "react";
import senagrol from "@assets/senagrol.jpeg";
import { getUserRole } from "@/services/authService"; 
import { useNavigate } from "react-router-dom";

type User = {
  isLoggedIn: boolean;
  role: "vendedor" | "comprador" | "transportador" | "administrador" | null;
};

const Header = () => {
  const [user, setUser] = useState<User>({ isLoggedIn: false, role: null });
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate(); 

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser({ isLoggedIn: false, role: null });
    navigate("/login"); // o la ruta que uses para login
  };
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const role = await getUserRole();
        setUser({ isLoggedIn: true, role: role as User["role"] });
        console.log("Rol obtenido desde el backend:", role);
      } catch (error) {
        console.error("No se pudo obtener el rol:", error);
        setUser({ isLoggedIn: false, role: null });
      }
    };

    fetchUserRole();
  }, []);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setDropdownOpen(false);
    }, 200);
  };

  const commonLinks = {
    productos: <a href="#" className="hover:text-[#48BD28] transition">Productos</a>,
    chatIA: <a href="#" className="hover:text-[#48BD28] transition">Chat IA</a>,
    chats: <a href="#" className="hover:text-[#48BD28] transition">Chats</a>,
    perfil: (
      <div
        className="relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <button className="hover:text-[#48BD28] transition">Perfil</button>
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-md shadow-lg z-50 text-sm">
            {user.role === "comprador" && (
              <a href="#" className="block px-3 py-2 hover:bg-[#E4FBDD]">🛒 Mis compras</a>
            )}
            {user.role === "transportador" && (
              <a href="#" className="block px-3 py-2 hover:bg-[#E4FBDD]">📦 Mis transportes</a>
            )}
            <a href="#" className="block px-3 py-2 hover:bg-[#E4FBDD]">🚚 Transportadores</a>
            <a href="#" className="block px-3 py-2 hover:bg-[#E4FBDD]">👁️ Escaneo facial</a>
          </div>
        )}
      </div>
    ),
    administrador: <a href="#" className="hover:text-[#48BD28] transition">Administrador</a>,
    misProductos: <a href="#" className="hover:text-[#48BD28] transition">Mis productos</a>,
    inicio: (
      <button className="bg-[#48BD28] text-white px-3 py-1.5 rounded-full text-sm transition mt-4 md:mt-0">
        Inicio
      </button>
    ),
  };

const renderLinks = () => {
  const logoutButton = (
    <button
      onClick={handleLogout}
      className="bg-red-500 text-white px-3 py-1.5 rounded-full text-sm transition mt-4 md:mt-0 hover:bg-red-600"
    >
      Cerrar sesión
    </button>
  );

  if (!user.isLoggedIn || user.role === null) {
    return [commonLinks.productos, commonLinks.chatIA, commonLinks.inicio];
  }

  switch (user.role) {
    case "vendedor":
      return [
        commonLinks.misProductos,
        commonLinks.perfil,
        commonLinks.chats,
        commonLinks.chatIA,
        commonLinks.inicio,
        logoutButton, // 👈 Aquí
      ];
    case "comprador":
      return [
        commonLinks.perfil,
        commonLinks.chats,
        commonLinks.chatIA,
        commonLinks.inicio,
        logoutButton, // 👈 Aquí
      ];
    case "transportador":
      return [
        commonLinks.chats,
        commonLinks.chatIA,
        commonLinks.perfil,
        commonLinks.inicio,
        logoutButton, // 👈 Aquí
      ];
    case "administrador":
      return [
        commonLinks.inicio,
        commonLinks.productos,
        commonLinks.perfil,
        commonLinks.chatIA,
        commonLinks.chats,
        commonLinks.administrador,
        logoutButton, // 👈 Aquí
      ];
    default:
      return [commonLinks.inicio];
  }
};


  return (
    <header className="bg-white shadow-sm hover:shadow-md px-6 py-3 relative z-50 rounded-lg">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <img src={senagrol} alt="Logo" className="w-10 h-10 rounded-full" />
          <input
            type="text"
            placeholder="Buscar"
            className="bg-[#E4FBDD] px-3 py-1.5 rounded-full text-sm w-full md:w-64 focus:outline-none"
          />
        </div>

        <nav className="flex flex-wrap justify-center md:justify-end items-center gap-4 text-sm font-medium w-full md:w-auto relative">
          {renderLinks()}
        </nav>
      </div>
    </header>
  );
};

export default Header;
