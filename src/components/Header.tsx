import { useState, useRef, useEffect } from "react";
import { getUserRole } from "@/services/Perfil/authService";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import senagrol from "@assets/senagrol.png";

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
  const [isMobilePerfilOpen, setMobilePerfilOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();

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

  // Dropdown desktop handlers
  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setDropdownOpen(false);
    }, 250);
  };

  // Logout modal handlers
  const handleLogout = () => setShowLogoutConfirm(true);
  const confirmLogout = () => {
    localStorage.clear();
    setUser({ isLoggedIn: false, role: null });
    setShowLogoutConfirm(false);
    navigate("/");
  };
  const cancelLogout = () => setShowLogoutConfirm(false);
  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
    setMobilePerfilOpen(false); 
  };

  const toggleMobilePerfil = () => setMobilePerfilOpen((prev) => !prev);

  const linkClass =
    "bg-[#48BD28] text-white px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ease-in-out hover:bg-[#379E1B] hover:scale-105";

  // Links comunes
  const commonLinks = {
    chatIA: <Link to="/IA" className={linkClass}>Asistente IA</Link>,
    chats: <Link to="/chats" className={linkClass}>Chats</Link>,
    login: <Link to="/login" className={linkClass}>Ingresar</Link>,
    perfilButton: (
      <button
        onClick={toggleMobilePerfil}
        aria-haspopup="true"
        aria-expanded={isMobilePerfilOpen}
        className={`${linkClass} flex items-center justify-between`}
      >
        Perfil
        <motion.span
          initial={{ rotate: 0 }}
          animate={{ rotate: isMobilePerfilOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="ml-2"
        >
          ▼
        </motion.span>
      </button>
    ),
    administrador: <Link to="/admin" className={linkClass}>Administrador</Link>,
    inicio: <Link to="/" className={linkClass}>Inicio</Link>,
  };

  const logoutButton = (
    <button
      onClick={handleLogout}
      className="bg-[#E53935] text-white px-4 py-2 rounded-full text-sm font-semibold transition-transform duration-300 ease-in-out hover:scale-105 hover:rotate-1 shadow-md"
      aria-label="Cerrar sesión"
    >
      🔓 Cerrar sesión
    </button>
  );

  // Links para el menú Desktop (normal)
  const renderLinks = () => {
    if (!user.isLoggedIn || user.role === null) {
      return [commonLinks.chatIA, commonLinks.login, commonLinks.inicio];
    }
    switch (user.role) {
      case "vendedor":
        return [
          commonLinks.perfilButton,
          commonLinks.chats,
          commonLinks.chatIA,
          commonLinks.inicio,
          logoutButton,
        ];
      case "comprador":
        return [
          commonLinks.perfilButton,
          commonLinks.chats,
          commonLinks.chatIA,
          commonLinks.inicio,
          logoutButton,
        ];
      case "transportador":
        return [
          commonLinks.chats,
          commonLinks.chatIA,
          commonLinks.perfilButton,
          commonLinks.inicio,
          logoutButton,
        ];
      case "administrador":
        return [
          commonLinks.inicio,
          commonLinks.perfilButton,
          commonLinks.chatIA,
          commonLinks.chats,
          commonLinks.administrador,
          logoutButton,
        ];
      default:
        return [commonLinks.login, commonLinks.inicio];
    }
  };
  const renderPerfilDropdown = (isMobile = false) => (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
 className={`${isMobile ? "pl-4 mt-2" : "absolute right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-50 text-sm font-medium text-gray-700"}`}

      role="menu"
      aria-label="Menú de perfil"
    >
      {user.role === "comprador" && (
        <Link
          to="/miscompras"
          className={`${isMobile ? "block px-4 py-2" : "block px-4 py-2 hover:bg-[#E4FBDD] transition-colors rounded-t-lg"}`}
          role="menuitem"
          onClick={() => isMobile && setMobileMenuOpen(false)}
        >
          🛒 Mis compras
        </Link>
      )}
        {user.role === "vendedor" && (
        <Link
          to="/MisProductos"
          className={`${isMobile ? "block px-4 py-2" : "block px-4 py-2 hover:bg-[#E4FBDD] transition-colors rounded-t-lg"}`}
          role="menuitem"
          onClick={() => isMobile && setMobileMenuOpen(false)}
        >
           Mis Productos
        </Link>
      )}
      {user.role === "transportador" && (
        <Link
          to="/mistransportes"
          className={`${isMobile ? "block px-4 py-2" : "block px-4 py-2 hover:bg-[#E4FBDD] transition-colors"}`}
          role="menuitem"
          onClick={() => isMobile && setMobileMenuOpen(false)}
        >
          📦 Mis transportes
        </Link>
      )}
      <Link
        to="/perfil"
        className={`${isMobile ? "block px-4 py-2" : "block px-4 py-2 hover:bg-[#E4FBDD] transition-colors rounded-b-lg"}`}
        role="menuitem"
        onClick={() => isMobile && setMobileMenuOpen(false)}
      >
        Perfil
      </Link>
    </motion.div>
  );

  return (
    <>
      <header className="font-[Fredoka] bg-white shadow-md mx-auto my-6 w-full px-4 sm:px-6 py-4 rounded-lg max-w-7xl">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img src={senagrol} alt="Senagrol Logo" className="h-10 w-auto sm:h-12" />
            <span className="text-lg sm:text-xl font-bold text-[#379E1B] hidden xs:inline">Senagrol</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex flex-wrap justify-end items-center gap-3 text-sm font-semibold text-gray-800">
            {renderLinks().map((link, index) => (
              <div
                key={index}
                onMouseEnter={link === commonLinks.perfilButton ? handleMouseEnter : undefined}
                onMouseLeave={link === commonLinks.perfilButton ? handleMouseLeave : undefined}
                className="relative"
              >
                {link}
                {/* Perfil dropdown desktop */}
                {link === commonLinks.perfilButton && (
                  <AnimatePresence>{isDropdownOpen && renderPerfilDropdown(false)}</AnimatePresence>
                )}
              </div>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              aria-label="Toggle navigation menu"
              className="p-2 rounded-md border border-gray-300 hover:bg-[#48BD28] hover:text-white transition-colors"
            >
              {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="flex flex-col gap-4 mt-4 text-sm font-semibold md:hidden bg-white rounded-lg shadow-lg w-full p-4"
            >
              {renderLinks().map((link, idx) => {
                // PerfilButton debe ser un botón que despliega submenu
                if (link === commonLinks.perfilButton) {
                  return (
                    <div key={idx} className="border-b border-gray-200 last:border-none pb-3 text-left">
                      {commonLinks.perfilButton}
                      <AnimatePresence>
                        {isMobilePerfilOpen && renderPerfilDropdown(true)}
                      </AnimatePresence>
                    </div>
                  );
                }
                return (
                  <div
                    key={idx}
                    className="border-b border-gray-200 last:border-none pb-3 text-left"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link}
                  </div>
                );
              })}
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      {/* Modal confirmación cierre sesión */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40 backdrop-blur-sm">
          <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl max-w-sm w-[90%] text-center">
            <h1 className="text-xl sm:text-2xl font-bold text-[#1B1B1B] mb-4">Cerrar sesión</h1>
            <p className="text-gray-700 mb-6 sm:mb-8">¿Seguro que deseas cerrar la sesión?</p>
            <div className="flex justify-center gap-4 sm:gap-6 flex-wrap">
              <button
                onClick={cancelLogout}
                className="bg-gray-200 text-gray-700 py-2 px-4 sm:px-6 rounded-full font-semibold hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmLogout}
                className="bg-[#4CAF50] text-white py-2 px-4 sm:px-6 rounded-full font-semibold hover:bg-green-600 transition-colors"
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
