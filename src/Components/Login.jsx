import React, { useRef, useState } from "react";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { Password } from "primereact/password";
import "../styles/Login.css";
import Boton from "./Boton";
import { useNavigate } from "react-router-dom";
import api from "../api/config";
import { Toast } from "primereact/toast";
import { jwtDecode } from "jwt-decode";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const toast = useRef(null);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      toast.current.show({
        severity: "warn",
        summary: "Campos incompletos",
        detail: "Por favor ingrese usuario y contraseña.",
        life: 3000,
      });
      return;
    }
    try {
      const response = await api.post("/Login", {
        nombreUsuario: username,
        contrasenia: password,
      });
      const token = response.data.token_;

      localStorage.setItem("jwtToken", token); // Guardar el token en sessionStorage

      toast.current.show({
        severity: "success",
        summary: "Inicio de sesión exitoso",
        detail: "Bienvenido al sistema.",
        life: 3000,
      });

      // Redirigir a la ruta correspondiente según el tipo de usuario
      const decodedToken = jwtDecode(token);
      const tipoEmpleado = decodedToken.TipoEmpleado;
      if (tipoEmpleado === "Administrador") {
        setTimeout(() => {
          navigate("/administracion");
        }, 3000);
      } else if (tipoEmpleado === "Medico") {
        setTimeout(() => {
          navigate("/hospital");
        }, 3000);
      } else {
        navigate("/login"); // Redirigir a login si el tipo de empleado no es válido
      }
    } catch (error) {
      console.error("Error en el login:", error);
      const errorMessage =
        error.response?.data?.mensaje ||
        "Credenciales inválidas o error en el servidor.";
      toast.current.show({
        severity: "error",
        summary: "Error de login",
        detail: errorMessage,
        life: 3000,
      });
    }
  };
  return (
    <>
      <div className="flex h-screen">
        <div className="hidden lg:flex items-center justify-center flex-1 bg-bg-primary text-black">
          <div className="w-full h-full relative">
            <img
              className="object-cover h-full"
              src="./Images/FondoLogin.png"
              alt="Imagen principal de login"
            />
          </div>
        </div>

        <div className="w-full bg-gray-100 lg:w-1/2 flex items-center justify-center">
          <div className="max-w-xl w-full p-6">
            <Toast ref={toast} />
            <h1 className="text-4xl font-semibold mb-3 text-black text-center">
              Iniciar Sesión
            </h1>
            <p className="text-base mb-12 text-center">
              Ingrese su usuario y contraseña
            </p>

            <form onSubmit={handleSubmit} className="space-y-10">
              <div className="card flex justify-content-center w-full">
                <FloatLabel className="w-full">
                  <InputText
                    className="w-full"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoFocus
                  />
                  <label htmlFor="username">Nombre de usuario</label>
                </FloatLabel>
              </div>
              <div className="card flex justify-content-center w-full">
                <FloatLabel className="w-full">
                  <Password
                    className="w-full"
                    inputId="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    feedback={false}
                    toggleMask={true}
                    inputClassName="w-full"
                  />
                  <label htmlFor="password">Contraseña</label>
                </FloatLabel>
              </div>

              <div className="flex justify-center w-full">
                <Boton
                  text={"Iniciar Sesion"}
                  className="w-2/3"
                  type="submit"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
