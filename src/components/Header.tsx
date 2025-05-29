import { useState, useRef, useEffect } from "react";
import { getUserRole } from "@/services/Perfil/authService";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type UserRole = "vendedor" | "comprador" | "transportador" | "administrador" | null;

type User = {
  isLoggedIn: boolean;
  role: UserRole;
};

const Header = () => {
  const [user, setUser] = useState<User>({ isLoggedIn: false, role: null });
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();

  // Cargar rol de usuario al montar el componente
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const role = await getUserRole();
        setUser({ isLoggedIn: true, role: role as UserRole });
      } catch (error) {
        console.error("No se pudo obtener el rol:", error);
        setUser({ isLoggedIn: false, role: null });
      }
    };
    fetchUserRole();
  }, []);

  // Control del dropdown del perfil
  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setDropdownOpen(false);
    }, 250);
  };

  // Manejo del logout
  const handleLogout = () => setShowLogoutConfirm(true);

  const confirmLogout = () => {
    localStorage.clear();
    setUser({ isLoggedIn: false, role: null });
    setShowLogoutConfirm(false);
    navigate("/inicio");
  };

  const cancelLogout = () => setShowLogoutConfirm(false);

  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);

  // Estilos comunes para los links
  const linkClass =
    "bg-[#48BD28] text-white px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ease-in-out hover:bg-[#379E1B] hover:scale-105";

  // Links comunes según roles y estado
  const commonLinks = {
    chatIA: <Link to="/IA" className={linkClass}>Chat IA</Link>,
    chats: <Link to="/chats" className={linkClass}>Chats</Link>,
    login: <Link to="/login" className={linkClass}>Ingresar</Link>,
    perfil: (
      <div
        className="relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <button className={`${linkClass} flex items-center gap-2`} aria-haspopup="true" aria-expanded={isDropdownOpen}>
          Perfil{" "}
          <motion.span
            initial={{ rotate: 0 }}
            animate={{ rotate: isDropdownOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            ▼
          </motion.span>
        </button>
        <AnimatePresence>
          {isDropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-50 text-sm font-medium text-gray-700"
              role="menu"
              aria-label="Menú de perfil"
            >
              {user.role === "comprador" && (
                <Link to="/miscompras" className="block px-4 py-2 hover:bg-[#E4FBDD] transition-colors rounded-t-lg" role="menuitem">
                  🛒 Mis compras
                </Link>
              )}
              {user.role === "transportador" && (
                <Link to="/mistransportes" className="block px-4 py-2 hover:bg-[#E4FBDD] transition-colors" role="menuitem">
                  📦 Mis transportes
                </Link>
              )}
              {/* Este enlace parecía estar mal, debe ser dinámico o fijo, aquí fijo para ejemplo */}
              <Link to="/transportadores" className="block px-4 py-2 hover:bg-[#E4FBDD] transition-colors" role="menuitem">
                🚚 Transportadores
              </Link>
              <Link to="/perfil" className="block px-4 py-2 hover:bg-[#E4FBDD] transition-colors rounded-b-lg" role="menuitem">
                Perfil
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    ),
    administrador: <Link to="/admin" className={linkClass}>Administrador</Link>,
    misProductos: <Link to="/MisProductos" className={linkClass}>Mis productos</Link>,
    inicio: <Link to="/inicio" className={linkClass}>Inicio</Link>,
  };

  // Botón de logout
  const logoutButton = (
    <button
      onClick={handleLogout}
      className="bg-[#E53935] text-white px-4 py-2 rounded-full text-sm font-semibold transition-transform duration-300 ease-in-out hover:scale-105 hover:rotate-1 shadow-md"
      aria-label="Cerrar sesión"
    >
      🔓 Cerrar sesión
    </button>
  );

  // Renderizado de links según rol
  const renderLinks = () => {
    if (!user.isLoggedIn || user.role === null) {
      return [
        commonLinks.chatIA,
        commonLinks.login,
        commonLinks.inicio,
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
          logoutButton,
        ];
      case "comprador":
        return [
          commonLinks.perfil,
          commonLinks.chats,
          commonLinks.chatIA,
          commonLinks.inicio,
          logoutButton,
        ];
      case "transportador":
        return [
          commonLinks.chats,
          commonLinks.chatIA,
          commonLinks.perfil,
          commonLinks.inicio,
          logoutButton,
        ];
      case "administrador":
        return [
          commonLinks.inicio,
          commonLinks.perfil,
          commonLinks.chatIA,
          commonLinks.chats,
          commonLinks.administrador,
          logoutButton,
        ];
      default:
        return [commonLinks.login, commonLinks.inicio];
    }
  };

  return (
    <>
      <header className="font-[Fredoka] bg-white shadow-md mx-auto my-10 w-full px-8 py-5 rounded-lg max-w-7xl relative select-none">
        {/* Contenedor principal flex vertical para que items estén alineados a la izquierda */}
        <div className="flex flex-col items-start justify-center">

          {/* Toggle menú móvil */}
          <div className="md:hidden mb-4 w-full flex justify-start">
            <button
              onClick={toggleMobileMenu}
              aria-label="Toggle navigation menu"
              className="p-2 rounded-md border border-gray-300 hover:bg-[#48BD28] hover:text-white transition-colors"
            >
              {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>

          {/* Menú escritorio */}
          <nav className="hidden md:flex flex-wrap justify-start items-center gap-6 text-sm font-semibold text-gray-800 w-full">
            {renderLinks().map((link, index) => (
              <div key={index}>{link}</div>
            ))}
          </nav>

          {/* Menú móvil desplegable */}
          {isMobileMenuOpen && (
            <nav className="flex flex-col gap-4 mt-5 text-sm font-semibold md:hidden bg-white rounded-lg shadow-lg w-full max-w-xs p-4 animate-slide-down">
              {renderLinks().map((link, idx) => (
                <div
                  key={idx}
                  className="border-b border-gray-200 last:border-none pb-2 text-center"
                >
                  {link}
                </div>
              ))}
            </nav>
          )}
        </div>
      </header>

      {/* Modal confirmación cierre sesión */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-xl shadow-2xl max-w-sm w-full text-center">
            <h1 className="text-2xl font-bold text-[#1B1B1B] mb-4">Cerrar sesión</h1>
            <p className="text-gray-700 mb-8">¿Seguro que deseas cerrar la sesión?</p>
            <div className="flex justify-center gap-6">
              <button
                onClick={cancelLogout}
                className="bg-gray-200 text-gray-700 py-2 px-6 rounded-full font-semibold hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmLogout}
                className="bg-[#4CAF50] text-white py-2 px-6 rounded-full font-semibold hover:bg-green-600 transition-colors"
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
