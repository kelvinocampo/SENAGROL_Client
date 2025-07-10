import { useState, useRef, useEffect, useContext } from "react";
import { getUserRole } from "@/services/Perfil/authService";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import senagrol from "@assets/senagrol.png";
import misproductos from "@assets/icons/misproductos.png";
import { RxExit } from "react-icons/rx";
import { PiUserLight } from "react-icons/pi";
import { GrArchive } from "react-icons/gr";
import { RiShoppingCartLine } from "react-icons/ri";
import { useMobileMenu } from "@/contexts/MobileMenuContext";
import { IAContext } from "@/contexts/IA";

type SingleRole = "vendedor" | "comprador" | "transportador" | "administrador";

type User = {
  isLoggedIn: boolean;
  roles: SingleRole[];
};

const Header = () => {
  const [user, setUser] = useState<User>({ isLoggedIn: false, roles: [] });
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isMobilePerfilOpen, setMobilePerfilOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();

  const { openMenu, toggleMenu, closeMenu } = useMobileMenu();
  const isMobileMenuOpen = openMenu === "header";

  const ia = useContext(IAContext);
  if (!ia) throw new Error("IAContext no disponible");
  const { clearHistory } = ia;

  useEffect(() => {
    (async () => {
      try {
        const rolesString = await getUserRole();
        if (typeof rolesString === "string" && rolesString.trim()) {
          const rolesArray = rolesString
            .split(/\s+/)
            .filter(Boolean) as SingleRole[];
          setUser({ isLoggedIn: true, roles: rolesArray });
        } else {
          setUser({ isLoggedIn: false, roles: [] });
        }
      } catch (err) {
        setUser({ isLoggedIn: false, roles: [] });
      }
    })();
  }, []);

  const hasRole = (r: SingleRole) =>
    Array.isArray(user.roles) && user.roles.includes(r);

  const linkClass =
    "bg-[#48BD28] text-white px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ease-in-out hover:bg-[#379E1B] hover:scale-105";

  const common = {
    chatIA: <Link to="/IA" className={linkClass}>Asistente IA</Link>,
    chats: <Link to="/chats" className={linkClass}>Chats</Link>,
    login: <Link to="/login" className={linkClass}>Ingresar</Link>,
    admin: <Link to="/admin" className={linkClass}>Administrador</Link>,
    inicio: <Link to="/" className={linkClass}>Inicio</Link>,
    perfilBtn: (
      <button
        onClick={() => setMobilePerfilOpen((p) => !p)}
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

  const renderLinks = () => {
    if (!user.isLoggedIn || user.roles.length === 0) {
      return [common.inicio, common.chatIA, common.login];
    }

    const initialLinks = [common.inicio, common.chatIA, common.chats];
    if (hasRole("administrador")) initialLinks.push(common.admin);

    const seen = new Set<string>();
    const filtered = initialLinks.filter((l) => {
      const id =
        (l as any)?.props?.to ?? (l as any)?.props?.children?.toString();
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
    });

    filtered.push(common.perfilBtn);
    return filtered;
  };

  const PerfilDropdown = ({ mobile = false }: { mobile?: boolean }) => (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={
        mobile
          ? "pl-4 mt-2"
          : "absolute right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-50 text-sm font-medium text-gray-700 w-52"
      }
    >
      {hasRole("comprador") && (
        <Link to="/miscompras" onClick={closeMenu} className="flex items-center gap-3 px-4 py-2 hover:bg-[#E4FBDD] rounded-t-lg">
          <RiShoppingCartLine className="h-5 w-5 text-black" />
          <span className="font-semibold">Mis Compras</span>
        </Link>
      )}
      {hasRole("vendedor") && (
        <Link to="/MisProductos" onClick={closeMenu} className="flex items-center gap-3 px-4 py-2 hover:bg-[#E4FBDD]">
          <img src={misproductos} alt="Mis productos" className="h-5 w-5" />
          <span className="font-semibold">Mis Productos</span>
        </Link>
      )}
      {hasRole("transportador") && (
        <Link to="/mistransportes" onClick={closeMenu} className="flex items-center gap-3 px-4 py-2 hover:bg-[#E4FBDD]">
          <GrArchive className="h-5 w-5 text-black" />
          <span className="font-semibold">Mis Transportes</span>
        </Link>
      )}
      <Link to="/perfil" onClick={closeMenu} className="flex items-center gap-3 px-4 py-2 hover:bg-[#E4FBDD]">
        <PiUserLight className="h-5 w-5 text-[#379E1B]" />
        <span className="font-semibold">Perfil</span>
      </Link>
      <button
        onClick={() => setShowLogoutConfirm(true)}
        className="flex items-center gap-3 w-full text-left px-4 py-2 hover:bg-red-100 rounded-b-lg"
      >
        <RxExit className="h-5 w-5 text-red-600" />
        <span className="font-semibold text-red-600">Cerrar Sesión</span>
      </button>
    </motion.div>
  );

  const handleMouseEnter = () => {
    timeoutRef.current && clearTimeout(timeoutRef.current);
    setDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setDropdownOpen(false), 250);
  };

  return (
    <>
      <header className="font-[Fredoka] relative bg-white shadow-md mx-auto my-6 w-full px-4 sm:px-6 py-1 rounded-lg max-w-7xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/">
              <img src={senagrol} alt="Logo Senagrol" className="w-15 md:w-20 cursor-pointer" />
            </a>
            <span className="text-lg sm:text-xl font-bold text-[#379E1B] hidden xs:inline">
              Senagrol
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-3">
            {renderLinks().map((el, i) => (
              <div
                key={i}
                onMouseEnter={el === common.perfilBtn ? handleMouseEnter : undefined}
                onMouseLeave={el === common.perfilBtn ? handleMouseLeave : undefined}
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
          <div className="md:hidden">
            <button
              onClick={() => {
                toggleMenu("header");
                setMobilePerfilOpen(false);
              }}
              className="p-2 rounded-md border border-gray-300 hover:bg-[#48BD28] hover:text-white transition-colors"
              aria-label="Abrir menú"
            >
              {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>

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
                    onClick={closeMenu}
                  >
                    {el}
                  </div>
                )
              )}
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

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
                  clearHistory();
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
