import { useEffect, useState } from "react";
import {
  IconoCerrarSesion,
  IconoEmpleados,
  IconoHospital,
  IconoPerfil,
  IconoReportes,
  IconoUsuarios,
} from "../assets/IconosComponentes";

import InterfazEmpleados from "./InterfazEmpleados";

import CentrosMedicos from "./Secciones/CentrosMedicos";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const navItems = [
  { key: "empleados", label: "Empleados", icon: <IconoEmpleados /> },
  { key: "centroMedico", label: "Centros Médicos", icon: <IconoHospital /> },
  { key: "reportes", label: "Reportes", icon: <IconoReportes /> },
  {
    key: "gestionUsuarios",
    label: "Gestión de usuarios",
    icon: <IconoUsuarios />,
  },
];

const PanelAdministracion = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("empleados");
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log("Decoded JWT:", decoded);

        setUserData({
          username: decoded.unique_name || "Usuario desconocido",
          email: decoded.email || "Sin email registrado",
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
      case "empleados":
        return <InterfazEmpleados />;
      case "centroMedico":
        return <CentrosMedicos />;
      case "reportes":
        return <h1>Componente Reportes</h1>;
      case "gestionUsuarios":
        return <h1>Gestión de Usuarios</h1>;
      default:
        return <h1>Sección: {activeSection}</h1>;
    }
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <aside className="flex flex-col w-80 h-screen px-4 py-8 overflow-y-auto bg-bg-primary shadow-lg">
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

            <div className="flex items-center gap-3 mb-4 mx-6 hover:">
              <IconoPerfil />
              <div>
                <p className="text-text-primary font-semibold text-sm">
                  {userData ? userData.username : ""}
                </p>
                <span className="text-text-secondary font-light text-sm">
                  {userData ? userData.email : ""}
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

export default PanelAdministracion;
