import { FaCheck, FaTimes } from 'react-icons/fa';

interface BooleanIconProps {
  value: boolean;
}

export const BooleanIcon = ({ value }: BooleanIconProps) => (
  value ? <FaCheck className="mx-auto" /> : <FaTimes className="mx-auto" />
);
