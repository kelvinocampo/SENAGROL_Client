import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

export const NavBarChats = () => {
    const location = useLocation();

    const links = [
        { path: "/Chats", label: "Chats" },
        { path: "/Chats/Usuarios", label: "Usuarios" }
    ];

    return (
        
        <aside className="w-60 min-h-screen bg-white shadow-xl rounded-r-2xl p-6 flex flex-col gap-4 font-medium fixed top-0     left-0 z-50">
            <h2 className="text-xl font-bold text-green-600 mb-6 px-2">Menú</h2>
            {links.map(({ path, label }) => {
                const isCurrent = location.pathname === path;

                return (
                    <motion.div
                        key={path}
                        className="relative"
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <NavLink
                            to={path}
                            className={`block px-4 py-3 rounded-lg transition-all duration-300 ${
                                isCurrent
                                    ? "text-white bg-green-600 shadow-md"
                                    : "text-gray-700 hover:bg-gray-100"
                            }`}
                        >
                            {label}
                        </NavLink>

                        {isCurrent && (
                            <motion.div
                                layoutId="underline"
                                className="absolute left-0 top-0 h-full w-1 bg-green-600 rounded-r-md"
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            />
                        )}
                    </motion.div>
                );
            })}
        </aside>
    );
};
