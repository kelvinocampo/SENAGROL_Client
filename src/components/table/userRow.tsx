import { User } from '@/types/User';
import { FaCheck, FaTimes, FaTrash, FaUserSlash } from 'react-icons/fa';

interface Props {
  user: User;
  onDelete: (id: string) => void;
  onToggleActive: (id: string) => void;
  onAssignAdmin: (id: string) => void;
}

const UserRow = ({ user, onDelete, onToggleActive, onAssignAdmin }: Props) => {
  return (
    <tr className="border-b">
      <td className="p-2">{user.name}</td>
      <td className="p-2">
        <span className="bg-gray-100 rounded-full px-2 py-1">{user.role}</span>
      </td>
      <td className="p-2 text-center">
        {user.hasTransportForm ? <FaCheck className="text-green-600" /> : <FaTimes className="text-red-600" />}
      </td>
      <td className="p-2 text-center">
        {user.sellerRequest ? <FaCheck className="text-green-600" /> : <FaTimes className="text-red-600" />}
      </td>
      <td className="p-2 text-center">
        <button onClick={() => onToggleActive(user.id)} className="btn">Activar</button>
      </td>
      <td className="p-2 text-center">
        <button onClick={() => onAssignAdmin(user.id)} className="btn">Designar</button>
      </td>
      <td className="p-2 text-center">
        <button onClick={() => onDelete(user.id)} className="text-red-600"><FaTrash /></button>
      </td>
      <td className="p-2 text-center">
        <FaUserSlash className="text-gray-600" />
      </td>
    </tr>
  );
};

export default UserRow;
