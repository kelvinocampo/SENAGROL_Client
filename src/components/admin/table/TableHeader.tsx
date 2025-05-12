interface TableHeaderProps {
  children: React.ReactNode;
}

export const TableHeader = ({ children }: TableHeaderProps)  => (
  <th className="p-2 text-left">{children}</th>
);