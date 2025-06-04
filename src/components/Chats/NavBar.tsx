import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

export const NavBarChats = () => {
    const location = useLocation();

    const links = [
        { path: "/Chats", label: "Chats" },
        { path: "/Chats/Usuarios", label: "Usuarios" }
    ];

    return (
        <nav className="relative bg-white shadow-md rounded-xl flex gap-6 justify-center w-full p-3 font-medium">
            {links.map(({ path, label }) => {
                const isCurrent = location.pathname === path;

                return (
                    <motion.div
                        key={path}
                        className="relative"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <NavLink
                            to={path}
                            className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                                isCurrent ? "text-white bg-green-600 shadow-lg" : "text-gray-700 hover:bg-gray-100"
                            }`}
                        >
                            {label}
                        </NavLink>

                        {isCurrent && (
                            <motion.div
                                layoutId="underline"
                                className="absolute bottom-0 left-0 right-0 h-[3px] bg-green-600 rounded-b-lg"
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            />
                        )}
                    </motion.div>
                );
            })}
        </nav>
    );
};
