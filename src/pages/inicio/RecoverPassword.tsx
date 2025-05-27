import RecoverPassword from "@components/Inicio/RecoverPassword";
import { RecoverPasswordProvider } from "@/contexts/User/UserManagement";

const EnviarCorreo = () => {
  return (
    <div className="bg-white min-h-screen flex items-start justify-start">
      <RecoverPasswordProvider>
        <RecoverPassword />
      </RecoverPasswordProvider>
    </div>
  );
};

export default EnviarCorreo;
