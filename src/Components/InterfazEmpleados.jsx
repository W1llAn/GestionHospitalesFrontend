import TablaDatos from "./TablaDatos";
import { useState, useEffect } from "react";
import api from "../api/config";
import InterfazEspecialidades from "./InterfazEspecialidades";
import FormularioEmpleado from "./FormularioEmpleado";
const InterfazEmpleados = () => {
  const [empleados, setEmpleados] = useState([]);
  const [modalEspecialidades, setModalEspecialidades] = useState(false);
  const [modalEmpleado, setModalEmpleado] = useState(false);

  //METODO PARA HACER LOGIN SOLO PRUEBAS
  const login = async (nombreUsuario, contrasenia) => {
    try {
      // Hacer la solicitud POST a la API
      const response = await fetch("https://localhost:7148/api/Usuarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombreUsuario: nombreUsuario,
          contrasenia: contrasenia,
        }),
      });

      // Verificar si la respuesta es exitosa
      if (!response.ok) {
        throw new Error("Error en el login: " + response.statusText);
      }

      // Obtener el token como texto (en lugar de JSON)
      const token = await response.text();

      // Guardar el token en sessionStorage
      sessionStorage.setItem("jwtToken", token);

      return token;
    } catch (error) {
      console.error("Error durante el login:", error.message);
      throw error;
    }
  };

  // SE DEFINEN LAS COLUMNAS QUE VA A USAR EL COMPONENTE
  const columnas = [
    {
      title: "Cédula",
      data: "cedula",
      className: "font-medium text-gray-900",
    },
    {
      title: "Nombre",
      data: "nombre",
      className: "text-gray-600",
    },
    {
      title: "Email",
      data: "email",
      className: "text-blue-600 hover:underline",
    },
    {
      title: "Centro Médico",
      //CON LA FUNCION ROW SE ACCEDE A LOS DENTRO DE LOS OBJETOS JSON
      data: (row) => row.centro_Medico.nombre,
      className: "text-gray-600",
    },
    {
      title: "Teléfono",
      data: "telefono",
      className: "text-gray-600",
    },
    {
      title: "Especialidad",
      data: (row) => row.especialidad.especialidad,
      className: "text-gray-600",
    },
  ];

  // OPCIONES PARA PERSONALIZAR LA TABLA DE DATOS
  const opcionesTabla = {
    paging: true,
    pageLength: 10,
    responsive: true,
    language: {
      url: "/Spanish.json", // Español
    },
  };

  //FUNCION PARA OBTENER LOS DATOS
  const fetchDatos = async () => {
    try {
      const response = await api.get("/Empleados");
      setEmpleados(response.data);
    } catch (error) {
      console.log("Error al consumir la API", error);
    }
  };

  useEffect(() => {
    login("root", "1234");
    fetchDatos();
  }, []);

  const handleEmpleadoAgregado = async () => {
    await fetchDatos(); // Refresh the employee list
    setModalEmpleado(false); // Close the modal
  };

  return (
    <>
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Empleados</h1>
        <div className="space-x-4">
          <button
            onClick={() => setModalEspecialidades(true)} // Abrir modal al hacer clic
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
            Especialidades
          </button>
          <button
            onClick={() => setModalEmpleado(true)} // Open the new employee form modal
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Agregar Empleado
          </button>
        </div>
      </div>

      {/* Modal Especialidades */}
      {modalEspecialidades && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl p-6 relative max-h-[80vh] overflow-y-auto">
            {/* Botón de cerrar */}
            <button
              onClick={() => setModalEspecialidades(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            {/* Componente InterfazEspecialidades */}
            <InterfazEspecialidades />
          </div>
        </div>
      )}

      {/* Modal Agregar Empleado */}
      {modalEmpleado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
            <button
              onClick={() => setModalEmpleado(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <FormularioEmpleado onEmpleadoAgregado={handleEmpleadoAgregado} />
          </div>
        </div>
      )}

      <div className="p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">
          Listado de Empleados
        </h1>
        <TablaDatos
          columnas={columnas}
          datos={empleados}
          opciones={opcionesTabla}
        />
      </div>
    </>
  );
};

export default InterfazEmpleados;
