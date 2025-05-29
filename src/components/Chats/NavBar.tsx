import { NavLink, useLocation } from "react-router-dom";

export const NavBarChats = () => {
    const location = useLocation();
    const isActive = (path: string) => location.pathname === path ? "inset-shadow-sm" : "shadow-sm";
    
    return (
        <nav className="bg-white shadow-sm rounded-lg flex gap-4 justify-center w-full p-4">
            <NavLink className={`text-sm rounded-lg p-2 hover:bg-gray-100 cursor-pointer ${isActive("/Chats")}`} to={"/Chats"}>Chats</NavLink>
            <NavLink className={`text-sm rounded-lg p-2 hover:bg-gray-100 cursor-pointer ${isActive("/Chats/Usuarios")}`} to={"/Chats/Usuarios"}>Usuarios</NavLink>
        </nav>
    )
}
