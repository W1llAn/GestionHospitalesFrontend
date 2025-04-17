import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { Password } from "primereact/password";
import "../styles/Login.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

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
            <h1 className="text-4xl font-semibold mb-3 text-black text-center">
              Iniciar Sesión
            </h1>
            <p className="text-base mb-12 text-center">
              Ingrese su usuario y contraseña
            </p>

            <form onSubmit={console.log("Login")} className="space-y-10">
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

              <div></div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
