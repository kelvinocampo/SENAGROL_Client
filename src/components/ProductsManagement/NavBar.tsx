import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // Function to handle navigation
  const handleNavigation = (path: string) => {
    navigate(path)
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile menu toggle button */}
      <div className="flex items-center fixed top-4 right-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-700 hover:text-gray-900 focus:outline-none"
          aria-label="Toggle menu"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile sidebar navigation */}
      <nav
        className={`fixed top-0 p-4 pt-16 bg-white h-screen flex flex-col gap-4 shadow-lg transition-all duration-300 z-40 ${isOpen ? "left-0" : "-left-full"
          }`}
        style={{ width: '250px' }}
      >
        <button
          onClick={() => handleNavigation('/MisProductos')}
          className="w-full p-2 rounded-xl bg-[#48BD28] hover:bg-green-600 cursor-pointer text-white font-medium"
        >
          Mis Productos
        </button>
        <button
          onClick={() => handleNavigation('/MisProductos/Crear')}
          className="w-full p-2 rounded-xl bg-[#48BD28] hover:bg-green-600 cursor-pointer text-white font-medium"
        >
          Crear Producto
        </button>
      </nav>
    </>
  );
}