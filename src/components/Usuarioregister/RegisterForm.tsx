import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Logo from "@assets/senagrol.jpeg";
import Image1 from "@assets/Fotos de Cafe - Descarga fotos gratis de gran calidad _ Freepik.jpg";
import Image2 from "@assets/Travel.jpg";
import Image3 from "@assets/🇨🇴.jpg";
import { InicioService } from "@services/inicioServices";
import { Input } from "@components/Input";

const images = [Image1, Image2, Image3]; // 👈 Slider de imágenes

export function RegisterForm() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [strength, setStrength] = useState(0);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [currentImage, setCurrentImage] = useState(0); // 👈 Slider
  const navigate = useNavigate();

  // Slider de imágenes - cambia cada 4 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

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

  const validateForm = () => {
    const newErrors = {
      name: "",
      username: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    };

    if (!name.trim()) newErrors.name = "El nombre completo es obligatorio.";
    if (!username.trim()) newErrors.username = "El nombre de usuario es obligatorio.";
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) newErrors.email = "Correo electrónico no válido.";
    if (!phone.trim()) newErrors.phone = "El teléfono es obligatorio.";
    if (password.length < 8) newErrors.password = "La contraseña debe tener al menos 8 caracteres.";
    if (password !== confirmPassword) newErrors.confirmPassword = "Las contraseñas no coinciden.";

    setErrors(newErrors);
    return Object.values(newErrors).every((msg) => msg === "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await InicioService.register(name, username, email, password, phone, confirmPassword);
      setMessage("Registro exitoso.");
    } catch (error: any) {
      setMessage(error.message || "Error desconocido al registrarse.");
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-[#48BD28]">
      <div className="flex w-full h-full bg-white shadow-lg overflow-hidden">
        {/* Form Section */}
        <div className="relative w-full md:w-1/2 p-10 pt-16  flex items-center justify-center">
          <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-white border-4 border-[#48BD28] rounded-full p-1">
            <img src={Logo} alt="Avatar" className="w-20 h-20 rounded-full object-cover" />
          </div>

          <div className="w-full max-w-[450px]">
            <div className="flex justify-between mb-6 border-b border-gray-600 pb-2">
              <span
                onClick={() => navigate("/login")}
                className="text-gray-400 cursor-pointer hover:text-black"
              >
                Login
              </span>
              <span className="text-black font-semibold border-b-2 border-[#48BD28] pb-1">
                Registro
              </span>
            </div>

            <form className="flex flex-col gap-4 " onSubmit={handleSubmit}>
              <div>
                <Input
                  label="Nombre de usuario"
                  type="text"
                  name="username"
                  placeholder="Ingresa tu nombre de usuario"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                {errors.username && <p className="text-sm text-red-600">{errors.username}</p>}
              </div>

              <div>
                <Input
                  label="Correo electrónico"
                  type="email"
                  name="email"
                  placeholder="Ingresa tu correo"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
              </div>

              <div>
                <Input
                  label="Nombre completo"
                  type="text"
                  name="name"
                  placeholder="Ingresa tu nombre completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
              </div>

              <div>
                <Input
                  label="Teléfono"
                  type="tel"
                  name="phone"
                  placeholder="Ingresa tu número de teléfono"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                {errors.phone && <p className="text-sm text-red-600">{errors.phone}</p>}
              </div>

              <div className="relative">
                <Input
                  label="Contraseña"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Ingresa tu contraseña"
                  value={password}
                  onChange={handlePasswordChange}
                />
                <span
                  className="absolute right-3 top-[38px] cursor-pointer text-gray-400"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </span>

                <div className="w-full bg-gray-200 rounded h-2 mt-1">
                  <div
                    className={`h-2 rounded ${strength < 50 ? "bg-red-400" : "bg-green-500"}`}
                    style={{ width: `${strength}%` }}
                  />
                </div>
                <p className="text-xs text-green-600 mt-1">
                  La contraseña debe tener al menos 8 caracteres, una mayúscula y un carácter especial.
                </p>
                {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
              </div>

              <div className="relative">
                <Input
                  label="Confirmar contraseña"
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirma tu contraseña"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <span
                  className="absolute right-3 top-[38px] cursor-pointer text-gray-400"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </span>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-600">{errors.confirmPassword}</p>
                )}
              </div>

              {message && (
                <p
                  className={`text-sm font-medium text-center ${
                    message.includes("exitoso") ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {message}
                </p>
              )}

              <button
                type="submit"
                className="w-full bg-[#48BD28] text-white py-2 rounded-lg hover:bg-green-700 transition"
              >
                Registrarse
              </button>

              <p className="text-sm text-center mt-2 text-black">
                ¿Ya tienes una cuenta?{" "}
                <span
                  onClick={() => navigate("/login")}
                  className="text-green-600 hover:underline cursor-pointer font-medium"
                >
                  Inicia sesión
                </span>
              </p>
            </form>
          </div>
        </div>

        {/* Image Slider Section */}
        <div className="hidden md:block md:w-1/2 h-full">
          <img
            src={images[currentImage]}
            alt="Decoración registro"
            className="w-full h-full object-cover transition-all duration-1000"
          />
        </div>
      </div>
    </div>
  );
}
