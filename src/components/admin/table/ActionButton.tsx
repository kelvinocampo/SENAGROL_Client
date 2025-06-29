import { ButtonHTMLAttributes, ReactNode } from "react";

interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  title?: string;
}

export const ActionButton = ({
  children,
  title,
  className = '',
  ...props
}: ActionButtonProps) => {
  return (
    <button
      title={title}
      className={`
        px-3 py-1
        rounded-full
        hover:opacity-80
        transition
        disabled:opacity-50
        disabled:cursor-not-allowed
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};
