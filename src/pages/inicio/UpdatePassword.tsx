import UpdatePassword from "@components/Inicio/UpdatePassword";
import { RecoverPasswordProvider } from "@/contexts/User/UserManagement";

const ActulizarContraseña = () => {
  return (
    <div className=" min-h-screen flex items-start justify-start">
      <RecoverPasswordProvider>
        <UpdatePassword />
      </RecoverPasswordProvider>
    </div>
  );
};

export default ActulizarContraseña;
