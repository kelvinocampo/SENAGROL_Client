import UserTable from '@components/table/userTable'; 
import Sidebar from '@components/nabvar'; 

const GestionAdministrador = () => {
  return (
    <><Sidebar></Sidebar>
    <div className="p-4 w-full">
      <h1 className="text-2xl font-bold mb-4">Usuarios</h1>
       <input
        type="text"
        placeholder = "🔎 Buscar "
        className="w-full mb-4 p-2 rounded border border-gray-300 bg-[#F5F0E5]"
        ></input>
      <UserTable />
    </div></>
    
  );
};

export default GestionAdministrador;
