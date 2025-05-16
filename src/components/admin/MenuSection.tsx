import { ReactNode } from 'react';

interface MenuSectionProps {
  title: string;
  children: ReactNode;
}

export const MenuSection = ({ title, children }: MenuSectionProps) => (
  <div className="px-4 py-2 sm:px-6 md:px-8">
    <h3 className="text-white font-semibold text-base sm:text-lg md:text-xl mb-3">
      {title}
    </h3>
    <ul className="space-y-2 text-sm sm:text-base">{children}</ul>
  </div>
);
