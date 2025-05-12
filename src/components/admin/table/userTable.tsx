import { FaCheck, FaTimes, FaTrash, FaUserSlash } from 'react-icons/fa';

interface User {
  id: number;
  name: string;
  role: string;
  hasTransportForm: boolean;
  hasSellerRequest: boolean;
}

interface UserTableProps {
  filter?: string;
}

const users: User[] = [
  { id: 1, name: "Elena H", role: "Admin", hasTransportForm: true, hasSellerRequest: true },
  { id: 2, name: "Samuel", role: "Comprador", hasTransportForm: false, hasSellerRequest: true },
  { id: 3, name: "Elena H", role: "Admin", hasTransportForm: true, hasSellerRequest: false },
  { id: 4, name: "Elena H", role: "Admin", hasTransportForm: false, hasSellerRequest: true }
];

export const UserTable = ({ filter = '' }: UserTableProps) => {
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="overflow-x-auto bg-white p-4">
      <table className="min-w-full table-auto rounded-xl border-2 border-[#F5F0E5]">
        <thead className="border-2 border-[#F5F0E5]">
          <tr>
            <th className="p-2 text-left text-[#F5F0E5]">Nombre</th>
            <th className="p-2 text-left">Rol</th>
            <th className="p-2 text-center">Formulario Transportador</th>
            <th className="p-2 text-center">Petición Vendedor</th>
            <th className="p-2 text-center">Activar Rol</th>
            <th className="p-2 text-center">Designar Admin</th>
            <th className="p-2 text-center">Eliminar</th>
            <th className="p-2 text-center">Desactivar</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map(user => (
            <tr key={user.id} className="text-center hover:bg-gray-50 border-2 border-[#F5F0E5]">
              <td className="p-2 text-left">{user.name}</td>
              <td className="p-2 text-left">
                <span className="bg-gray-200 px-2 py-1 rounded-full">{user.role}</span>
              </td>
              <td className="p-2">
                {user.hasTransportForm
                  ? <FaCheck className="mx-auto" />
                  : <FaTimes className="mx-auto" />}
              </td>
              <td className="p-2">
                {user.hasSellerRequest
                  ? <FaCheck className="mx-auto" />
                  : <FaTimes className="mx-auto" />}
              </td>
              <td className="p-2">
                <button className="bg-gray-100 px-3 py-1 rounded shadow hover:bg-gray-200">Activar</button>
              </td>
              <td className="p-2">
                <button className="bg-gray-100 px-3 py-1 rounded shadow hover:bg-gray-200">Designar</button>
              </td>
              <td className="p-2">
                <button className="hover:text-red-800"><FaTrash /></button>
              </td>
              <td className="p-2">
                <button className="hover:text-gray-800"><FaUserSlash /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
