/* -------------------------------------------------
   Header.tsx  – compatible con getUserRole() que
   devuelve `data.roles?.toLowerCase()` (ej:
   "vendedor comprador")
   Soporta uno o varios roles separados por espacio
-------------------------------------------------- */

import { useState, useRef, useEffect } from "react";
import { getUserRole } from "@/services/Perfil/authService";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import senagrol from "@assets/senagrol.png";

/* ---------- Tipos ---------- */
type SingleRole = "vendedor" | "comprador" | "transportador" | "administrador";
type User = {
  isLoggedIn: boolean;
  roles: SingleRole[];
};

const Header = () => {
  const [user, setUser] = useState<User>({ isLoggedIn: false, roles: [] });
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isMobilePerfilOpen, setMobilePerfilOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();

  /* ---------- Obtener roles ---------- */
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        /* getUserRole() devuelve algo como "vendedor comprador" */
        const rolesString = await getUserRole(); // string | undefined

        const rolesArray: SingleRole[] = rolesString
          ? (rolesString.split(/\s+/) as SingleRole[])
          : [];

        setUser({ isLoggedIn: true, roles: rolesArray });
      } catch (err) {
        console.error("No se pudo obtener el rol:", err);
        setUser({ isLoggedIn: false, roles: [] });
      }
    };
    fetchRoles();
  }, []);
console.log("Roles del usuario:", user.roles);

  /* ---------- Utilidades ---------- */
  const hasRole = (r: SingleRole) => user.roles.includes(r);

  const linkClass =
    "bg-[#48BD28] text-white px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ease-in-out hover:bg-[#379E1B] hover:scale-105";

  /* ---------- Links base ---------- */
  const common = {
    chatIA: <Link to="/IA" className={linkClass}>Asistente IA</Link>,
    chats: <Link to="/chats" className={linkClass}>Chats</Link>,
    login: <Link to="/login" className={linkClass}>Ingresar</Link>,
    admin: <Link to="/admin" className={linkClass}>Administrador</Link>,
    inicio: <Link to="/" className={linkClass}>Inicio</Link>,
    perfilBtn: (
      <button
        onClick={() => setMobilePerfilOpen((p) => !p)}
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
  };

  const logoutBtn = (
    <button
      onClick={() => setShowLogoutConfirm(true)}
      className="bg-[#E53935] text-white px-4 py-2 rounded-full text-sm font-semibold transition-transform duration-300 ease-in-out hover:scale-105 hover:rotate-1 shadow-md"
    >
      🔓 Cerrar sesión
    </button>
  );

  /* ---------- Construir links visibles ---------- */
  const renderLinks = () => {
    if (!user.isLoggedIn || user.roles.length === 0) {
      return [common.chatIA, common.login, common.inicio];
    }

    const links = [
      common.perfilBtn,
      common.chats,
      common.chatIA,
      common.inicio,
    ];

    if (hasRole("administrador")) links.push(common.admin);
    links.push(logoutBtn);

    /* Quitar duplicados por destino */
    const seen = new Set<string>();
    return links.filter((l) => {
      const id =
        (l as any)?.props?.to ?? (l as any)?.props?.children?.toString();
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
    });
  };

  /* ---------- Dropdown Perfil ---------- */
  const PerfilDropdown = ({ mobile = false }: { mobile?: boolean }) => (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={
        mobile
          ? "pl-4 mt-2"
          : "absolute right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-50 text-sm font-medium text-gray-700"
      }
      role="menu"
      aria-label="Menú de perfil"
    >
      {hasRole("comprador") && (
        <Link
          to="/miscompras"
          onClick={() => mobile && setMobileMenuOpen(false)}
          className={`block px-4 py-2 hover:bg-[#E4FBDD] ${
            mobile ? "" : "rounded-t-lg"
          }`}
          role="menuitem"
        >
          🛒 Mis compras
        </Link>
      )}
      {hasRole("vendedor") && (
        <Link
          to="/MisProductos"
          onClick={() => mobile && setMobileMenuOpen(false)}
          className={`block px-4 py-2 hover:bg-[#E4FBDD] ${
            mobile ? "" : !hasRole("comprador") ? "rounded-t-lg" : ""
          }`}
          role="menuitem"
        >
          Mis Productos
        </Link>
      )}
      {hasRole("transportador") && (
        <Link
          to="/mistransportes"
          onClick={() => mobile && setMobileMenuOpen(false)}
          className="block px-4 py-2 hover:bg-[#E4FBDD]"
          role="menuitem"
        >
          📦 Mis transportes
        </Link>
      )}
      <Link
        to="/perfil"
        onClick={() => mobile && setMobileMenuOpen(false)}
        className={`block px-4 py-2 hover:bg-[#E4FBDD] ${
          mobile ? "" : "rounded-b-lg"
        }`}
        role="menuitem"
      >
        Perfil
      </Link>
    </motion.div>
  );

  /* ---------- Handlers varios ---------- */
  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setDropdownOpen(true);
  };
  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setDropdownOpen(false), 250);
  };

  /* ---------- JSX ---------- */
  return (
    <>
      <header className="font-[Fredoka] bg-white shadow-md mx-auto my-6 w-full px-4 sm:px-6 py-4 rounded-lg max-w-7xl">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img src={senagrol} alt="Senagrol Logo" className="h-10 w-auto sm:h-12" />
            <span className="text-lg sm:text-xl font-bold text-[#379E1B] hidden xs:inline">
              Senagrol
            </span>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-3 text-sm font-semibold text-gray-800">
            {renderLinks().map((el, i) => (
              <div
                key={i}
                onMouseEnter={
                  el === common.perfilBtn ? handleMouseEnter : undefined
                }
                onMouseLeave={
                  el === common.perfilBtn ? handleMouseLeave : undefined
                }
                className="relative"
              >
                {el}
                {el === common.perfilBtn && (
                  <AnimatePresence>
                    {isDropdownOpen && <PerfilDropdown />}
                  </AnimatePresence>
                )}
              </div>
            ))}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => {
                setMobileMenuOpen((p) => !p);
                setMobilePerfilOpen(false);
              }}
              className="p-2 rounded-md border border-gray-300 hover:bg-[#48BD28] hover:text-white transition-colors"
              aria-label="Abrir menú"
            >
              {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="flex flex-col gap-4 mt-4 text-sm font-semibold md:hidden bg-white rounded-lg shadow-lg w-full p-4"
            >
              {renderLinks().map((el, i) =>
                el === common.perfilBtn ? (
                  <div key={i} className="border-b border-gray-200 pb-3 text-left">
                    {common.perfilBtn}
                    <AnimatePresence>
                      {isMobilePerfilOpen && <PerfilDropdown mobile />}
                    </AnimatePresence>
                  </div>
                ) : (
                  <div
                    key={i}
                    className="border-b border-gray-200 pb-3 text-left"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {el}
                  </div>
                )
              )}
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      {/* Modal cerrar sesión */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40 backdrop-blur-sm">
          <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl max-w-sm w-[90%] text-center">
            <h1 className="text-xl sm:text-2xl font-bold mb-4">Cerrar sesión</h1>
            <p className="mb-6 sm:mb-8">¿Seguro que deseas cerrar la sesión?</p>
            <div className="flex justify-center gap-4 sm:gap-6 flex-wrap">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="bg-gray-200 text-gray-700 py-2 px-4 sm:px-6 rounded-full font-semibold hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  localStorage.clear();
                  setUser({ isLoggedIn: false, roles: [] });
                  setShowLogoutConfirm(false);
                  navigate("/");
                }}
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
