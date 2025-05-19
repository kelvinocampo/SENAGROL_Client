// src/components/perfil/ToggleQRorCode.tsx
import { QrCode } from "lucide-react";
import { useNavigate } from "react-router-dom";

type Props = {
  id_compra: number;
};

const ToggleQRorCode = ({ id_compra }: Props) => {
  const navigate = useNavigate();

  const handleRedirect = (tipo: "qr" | "codigo") => {
    navigate(`/${tipo}comprador/${id_compra}`);
  };

  return (
    <div className="flex space-x-2 justify-center">
      <button
        onClick={() => handleRedirect("qr")}
        className="text-xs px-2 py-1 bg-[#E4FBDD] not-first:rounded flex items-center"
        title="Ver QR"
      >
        <QrCode size={14} className="mr-1" />
        
      </button>
      <button
        onClick={() => handleRedirect("codigo")}
        className="text-xs px-2 py-1 bg-[#E4FBDD] rounded flex items-center"
        title="Ver código"
      >
        
        Código
      </button>
    </div>
  );
};

export default ToggleQRorCode;
