import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Logo from "../../assets/senagrol.jpeg";

export default function RegisterForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [strength, setStrength] = useState(0);
  const [message, setMessage] = useState("");

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pwd = e.target.value;
    setPassword(pwd);

    let calculatedStrength = 0;
    if (pwd.length >= 8) calculatedStrength += 30;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) calculatedStrength += 30;
    if (/\d/.test(pwd)) calculatedStrength += 20;
    if (/[A-Z]/.test(pwd)) calculatedStrength += 20;

    setStrength(Math.min(calculatedStrength, 100));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password === confirmPassword && password.length >= 8) {
      setMessage("Registro exitoso.");
    } else {
      setMessage("Error al registrarse. Verifica los campos.");
    }
  };

  return (
    <div className="min-h-screen bg-white p-8 font-fredoka">
      <img
        src={Logo}
        alt="Logo Senagrol"
        className="w-17 h-17 rounded-full border-l-2 border-r-4 border-white object-cover"
      />
      
      <h2 className="text-2xl font-medium mb-6">Crear una cuenta</h2>

      <form className="space-y-4 max-w-xl" onSubmit={handleSubmit}>
        {[
          { label: "Nombre Usuario", type: "text", placeholder: "Ingresa Nombre" },
          { label: "Email", type: "email", placeholder: "Ingresa Email" },
          { label: "Nombre Completo", type: "text", placeholder: "Ingresa Nombre Completo" },
          { label: "Número Telefónico", type: "tel", placeholder: "Ingresa Número Telefónico" },
        ].map((field, idx) => (
          <div key={idx}>
            <label className="block text-sm font-medium mb-1">{field.label}</label>
            <input
              type={field.type}
              placeholder={field.placeholder}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        ))}

        <div>
          <label className="block text-sm font-medium mb-1">Contraseña</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Ingresa Contraseña"
              value={password}
              onChange={handlePasswordChange}
              className="w-full border border-gray-300 rounded px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <span
              className="absolute right-3 top-2.5 cursor-pointer text-black"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
          </div>
          <div className="text-sm mt-1">Cargando: <span>{strength}</span></div>
          <div className="w-full bg-gray-200 rounded h-2 mt-1">
            <div
              className={`h-2 rounded ${strength < 50 ? "bg-red-400" : "bg-green-500"}`}
              style={{ width: `${strength}%` }}
            />
          </div>
          <p className="text-xs text-green-600 mt-1">
            Tu contraseña debe tener al menos 8 caracteres y 1 carácter especial.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Confirmar Contraseña</label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Re-ingresa Contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <span
              className="absolute right-3 top-2.5 cursor-pointer text-black"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
          </div>
        </div>

        {message && (
          <p
            className={`text-sm font-medium text-center ${
              message.includes("exitoso") ? "text-green-600" : "text-red-600"
            }`}>
            {message}
          </p>
        )}

        <button
          type="submit"
          className="w-full bg-[#48BD28] text-black font-fredoka py-2 rounded hover:bg-green-600 transition">
          Registrar
        </button>

        <p className="text-sm text-center mt-2">
          ¿Ya tienes una cuenta?{" "}
          <a href="#" className="text-green-600 hover:underline font-medium">
            Inicia sesión
          </a>
        </p>
      </form>
    </div>
  );
}
