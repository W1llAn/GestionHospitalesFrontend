import { useEffect, useState } from "react";
import {
  IconoCerrarSesion,
  IconoEmpleados,
  IconoHospital,
  IconoPerfil,
} from "../assets/IconosComponentes";

import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import ConsultasMedicas from "./Secciones/ConsultasMedicas";

const navItems = [
  {
    key: "consultasMedicas",
    label: "Consultas Medicas",
    icon: <IconoHospital />,
  },
  { key: "pacientes", label: "Pacientes", icon: <IconoEmpleados /> },
];

const PanelConsultasMedicas = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("consultasMedicas");
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log("Decoded JWT:", decoded);
        if (decoded.TipoEmpleado !== "Medico") {
          navigate("/login");
          return;
        }
        setUserData({
          username: decoded.unique_name || "Usuario desconocido",
          email: decoded.email || "Sin email registrado",
          especialidad: decoded.Especialidad || "Sin especialidad",
        });
      } catch (error) {
        console.error("Error decod Debe ser: codificando el token:", error);
        localStorage.removeItem("jwtToken");
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const baseLinkClasses =
    "flex items-center px-6 py-3 mb-4 text-text-primary transition-colors duration-300 transform rounded-md cursor-pointer hover:bg-hover-gray";

  const renderSection = () => {
    //AQUI VA CADA UNO DE LOS COMPONENTES QUE SE VAN A RENDERIZAR EN CADA UNA DE LAS SECCIONES
    switch (activeSection) {
      case "consultasMedicas":
        return <ConsultasMedicas />;
      case "pacientes":
        return <div>Pacientes</div>;
      default:
        return <h1>Sección: {activeSection}</h1>;
    }
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <aside className="flex flex-col w-70 h-screen px-4 py-8 overflow-y-auto bg-bg-primary shadow-lg">
        <a href="#" className="flex items-center">
          <img
            className="w-auto h-6 sm:h-7"
            src="Icons/LogoHospital.svg"
            alt="Logo"
          />
          <span
            className="mx-3 font-extrabold text-xl text-transparent bg-clip-text "
            style={{
              backgroundImage:
                "linear-gradient(to left, rgba(49, 69, 185, 0.60), #0067D2)",
            }}
          >
            Centro Hospitalario
          </span>
        </a>

        <div className="flex flex-col justify-between gap-12 mt-6">
          <nav>
            {navItems.map(({ key, label, icon }) => (
              <div
                key={key}
                onClick={() => setActiveSection(key)}
                className={`${baseLinkClasses} ${
                  activeSection === key ? "bg-hover-gray text-gray-700" : ""
                }`}
              >
                <span className="mx-2">{icon}</span>
                <span className="mx-4 font-semibold ">{label}</span>
              </div>
            ))}
            <div className="border-t border-gray-300 mt-16 " />
          </nav>

          <div>
            <h4 className="text-text-primary font-semibold text-base mb-2">
              Perfil
            </h4>

            <div className="flex items-center gap-3 mb-4 mx-6 ">
              <IconoPerfil />
              <div className="max-w-3/4">
                <p className="text-text-primary font-semibold text-sm truncate">
                  {userData ? userData.username : ""}
                </p>
                <span className="text-text-secondary font-light text-sm truncate block">
                  {userData ? userData.email : ""}
                </span>
                <span className="text-text-secondary font-light text-sm truncate block">
                  {userData ? userData.especialidad : ""}
                </span>
              </div>
            </div>
          </div>
          <div
            onClick={() => {
              localStorage.removeItem("jwtToken");
              navigate("/login");
            }}
            className={`${baseLinkClasses}  items-center justify-center`}
          >
            <IconoCerrarSesion />

            <span className="mx-4 font-medium">Cerrar Sesión</span>
          </div>
        </div>
      </aside>

      {/* Contenido */}
      <main className="flex-1 max-h-screen overflow-y-auto p-6">
        {renderSection()}
      </main>
    </div>
  );
};

export default PanelConsultasMedicas;
