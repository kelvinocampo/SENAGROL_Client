import { ReactNode } from 'react';

interface MenuItemProps {
  icon: ReactNode;
  label: string;
}

export const MenuItem = ({ icon, label }: MenuItemProps) => (
  <li className="flex items-center gap-2 py-2 hover:bg-[#379e1b] rounded px-2 cursor-pointer">
    {icon} {label}
  </li>
);
