import { ReactNode } from 'react';

interface MenuSectionProps {
  title: string;
  children: ReactNode;
}

export const MenuSection = ({ title, children }: MenuSectionProps) => (
  <div>
    <h3 className="text-white font-semibold mb-2">{title}</h3>
    <ul className="space-y-1">{children}</ul>
  </div>
);
