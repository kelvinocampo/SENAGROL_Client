import { useState } from "react";
import Logo from "@assets/senagrol.jpeg";
import { login } from "@services/inicioServices";
import { Input } from "@components/Input";
import { Paragraph } from "@components/Inicio/Paragraph";
import { Eye, EyeOff } from "lucide-react";

export const LoginForm = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await login(identifier, password);

      localStorage.setItem("token", data.token);

      alert("Login exitoso. Token: " + data.token);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-1 justify-center bg-white">
      <div className="w-full p-8 flex flex-col gap-8">
        <img
          src={Logo}
          alt="Logo Senagrol"
          className="w-17 h-17 rounded-full border-l-2 border-r-4 border-white object-cover"
        />

        <h2 className="text-2xl font-bold mb-6 text-black">
          Inicia sesión en tu cuenta
        </h2>

        <form className="p-4 max-w-[600px] flex flex-col gap-8" onSubmit={handleSubmit}>
          <Input
            label="Usuario o correo electrónico"
            type="text"
            name="identifier"
            placeholder="Ingresa tu usuario o correo"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
          />

          <div className="relative">
            <Input
              label="Contraseña"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              className="absolute right-3 top-[38px] cursor-pointer text-[BFBFBD]"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
          </div>

          {error && (
            <p className="text-[#F10E0E] text-sm font-medium">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-[#48BD28] text-white py-2 rounded-lg"
            disabled={loading}
          >
            {loading ? "Iniciando sesión" : "Iniciar sesión"}
          </button>

          <Paragraph />
        </form>
      </div>
    </div>
  );
};