import React from 'react';

interface TableHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const TableHeader = ({ children, className = '' }: TableHeaderProps) => (
  <th className={`p-2 font-semibold text-left bg-white ${className}`}>{children}</th>
);