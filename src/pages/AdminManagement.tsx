import { useState } from 'react';
import { UserTable } from '@/components/admin/table/userTable'; 

export const AdminManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="p-4 w-full">
      <h1 className="text-2xl font-bold mb-4">Usuarios</h1>
      <input
        type="text"
        placeholder="🔎 Buscar"
        className="w-full mb-4 p-2 rounded border border-gray-300 bg-[#F5F0E5]"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <UserTable filter={searchTerm} />
    </div>
  );
};
