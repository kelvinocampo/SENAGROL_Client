import { useState, useRef, useEffect } from "react";
import senagrol from "@assets/senagrol.jpeg";
import { getUserRole } from "@/services/Perfil/authService";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react"; // Puedes usar íconos de Lucide o FontAwesome

type User = {
  isLoggedIn: boolean;
  role: "vendedor" | "comprador" | "transportador" | "administrador" | "vendedor transportador" | null;
};

const Header = () => {
  const [user, setUser] = useState<User>({ isLoggedIn: false, role: null });
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const role = await getUserRole();
        setUser({ isLoggedIn: true, role: role as User["role"] });
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

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    localStorage.clear();
    setUser({ isLoggedIn: false, role: null });
    setShowLogoutConfirm(false);
    navigate("/inicio");
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  const commonLinks = {
    chatIA: <a href="/IA" className="hover:text-[#48BD28] transition">Chat IA</a>,
    chats: <a href="/Chats" className="hover:text-[#48BD28] transition">Chats</a>,
    login: <Link to="/login" className="hover:text-[#48BD28] transition">Ingresar</Link>,
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
              <a href="/miscompras" className="block px-3 py-2 hover:bg-[#E4FBDD]">🛒 Mis compras</a>
            )}
            {user.role === "transportador" && (
              <a href="/mistransportes" className="block px-3 py-2 hover:bg-[#E4FBDD]">📦 Mis transportes</a>
            )}
            <a href="/transporte/:id_compra" className="block px-3 py-2 hover:bg-[#E4FBDD]">🚚 Transportadores</a>
            <a href="/perfil" className="block px-3 py-2 hover:bg-[#E4FBDD]">Perfil</a>
          </div>
        )}
      </div>
    ),
    administrador: <Link to="/admin" className="hover:text-[#48BD28] transition">Administrador</Link>,
    misProductos: <a href="/MisProductos/" className="hover:text-[#48BD28] transition">Mis productos</a>,
    inicio: (
      <Link to="/inicio" className="bg-[#48BD28] text-white px-3 py-1.5 rounded-full text-sm transition mt-4 md:mt-0">
        Inicio
      </Link>
    ),
  };

  const renderLinks = () => {
    const logoutButton = (
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-3 py-1.5 rounded-full text-sm transition hover:bg-red-600"
      >
        Cerrar sesión
      </button>
    );

    if (!user.isLoggedIn || user.role === null) {
      return [
        commonLinks.chatIA,
        commonLinks.login,
        commonLinks.inicio
      ];
    }

    switch (user.role) {
      case "vendedor":
        return [
          commonLinks.misProductos,
          commonLinks.perfil,
          commonLinks.chats,
          commonLinks.chatIA,
          commonLinks.inicio,
          logoutButton
        ];
      case "comprador":
        return [
          commonLinks.perfil,
          commonLinks.chats,
          commonLinks.chatIA,
          commonLinks.inicio,
          logoutButton
        ];
      case "transportador":
        return [
          commonLinks.chats,
          commonLinks.chatIA,
          commonLinks.perfil,
          commonLinks.inicio,
          logoutButton
        ];
      case "administrador":
        return [
          commonLinks.inicio,
          commonLinks.perfil,
          commonLinks.chatIA,
          commonLinks.chats,
          commonLinks.administrador,
          logoutButton
        ];
      default:
        return [commonLinks.login, commonLinks.inicio];
    }
  };

  return (
    <>
      <header className=" font-[Fredoka] bg-white shadow-sm hover:shadow-md px-6 py-4 rounded-lg z-10 relative">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src={senagrol} alt="Logo" className="w-10 h-10 rounded-full" />
          </div>

          <div className="md:hidden">
            <button onClick={toggleMobileMenu}>
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          <nav className="hidden md:flex items-center gap-4 text-sm font-medium">
            {renderLinks()}
          </nav>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <nav className="flex flex-col gap-3 mt-4 text-sm font-medium md:hidden animate-slide-down">
            {renderLinks().map((link, idx) => (
              <div key={idx} className="border-b pb-2 ">{link}</div>
            ))}
          </nav>
        )}
      </header>

      {/* Modal confirmación cierre de sesión */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
          <div className="bg-white p-6 rounded-lg shadow-md text-center max-w-sm w-full">
            <h1 className="text-lg font-bold text-[#1B1B1B] mb-2">Cerrar sesión</h1>
            <p className="text-sm text-[#1B1B1B] mb-6">¿Seguro que deseas cerrar la sesión?</p>

            <div className="flex flex-col gap-2">
              <button
                onClick={cancelLogout}
                className="bg-[#FAF6F2] text-[#4B4B4B] py-2 rounded-full text-sm font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={confirmLogout}
                className="bg-[#4CAF50] text-white py-2 rounded-full text-sm font-medium"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;