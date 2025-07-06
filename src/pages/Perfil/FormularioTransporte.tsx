import FormularioTransportador from "@components/perfil/FormularioTransportador";
import FallingLeaves from "@components/FallingLeaf";

const FormularioTransporte = () => {
  return (
    <>
    <div className="fixed inset-0 pointer-events-none z-0">
        <FallingLeaves quantity={20} />
      </div>
       <div className="min-h-screen relative  font-[Fredoka] text-[#111]">
       
      <FormularioTransportador />
    </div>
    </>
   
  );
};

export default FormularioTransporte;
