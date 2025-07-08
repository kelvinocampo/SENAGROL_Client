import ListarMiscompras from "@components/perfil/ListarMiscompras";
import FallingLeaves from "@/components/FallingLeaf";

const MyPurchasesPage = () => {
  return (
    <>
     <div className="fixed inset-0 pointer-events-none z-0">
        <FallingLeaves quantity={20} />
      </div>
    <div className="min-h-screen ">
      <ListarMiscompras />
    </div>
    </>
    
  );
};

export default MyPurchasesPage;
