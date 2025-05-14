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
      className={`bg-[#d6d6d6ee] px-3 py-1 rounded-full hover:opacity-80 transition ${className}`}
    >
      {children}
    </button>
  );
};
