interface ActionButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  title?: string;
}

export const ActionButton = ({ children, onClick, className = '', title }: ActionButtonProps) => {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`bg-[#FDF6EC] px-3 py-1 rounded-full hover:opacity-80 transition ${className}`}
    >
      {children}
    </button>
  );
};
