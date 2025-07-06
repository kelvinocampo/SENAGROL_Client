import RecoverPassword from "@components/Inicio/RecoverPassword";
import { RecoverPasswordProvider } from "@/contexts/User/UserManagement";

const EnviarCorreo = () => {
  return (
    <div className=" min-h-screen flex items-start justify-start">
      <RecoverPasswordProvider>
        <RecoverPassword />
      </RecoverPasswordProvider>
    </div>
  );
};

export default EnviarCorreo;
