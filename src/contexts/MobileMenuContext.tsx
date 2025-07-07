// MobileMenuContext.tsx
import { createContext, useContext, useState } from "react";

type MenuType = "none" | "header" | "navbar";

interface MobileMenuContextType {
  openMenu: MenuType;
  toggleMenu: (menu: MenuType) => void;
  closeMenu: () => void;
}

const MobileMenuContext = createContext<MobileMenuContextType | undefined>(undefined);

export const MobileMenuProvider = ({ children }: { children: React.ReactNode }) => {
  const [openMenu, setOpenMenu] = useState<MenuType>("none");

  const toggleMenu = (menu: MenuType) => {
    setOpenMenu((prev) => (prev === menu ? "none" : menu));
  };

  const closeMenu = () => setOpenMenu("none");

  return (
    <MobileMenuContext.Provider value={{ openMenu, toggleMenu, closeMenu }}>
      {children}
    </MobileMenuContext.Provider>
  );
};

export const useMobileMenu = () => {
  const context = useContext(MobileMenuContext);
  if (!context) {
    throw new Error("useMobileMenu must be used within a MobileMenuProvider");
  }
  return context;
};
