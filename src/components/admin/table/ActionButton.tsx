// components/ActionButton.tsx
interface ActionButtonProps {
  label: string;
  onClick?: () => void;
}

export const ActionButton = ({ label, onClick }: ActionButtonProps) => (
  <button
    onClick={onClick}
    className="bg-gray-100 px-3 py-1 rounded shadow hover:bg-gray-200"
  >
    {label}
  </button>
);
