import TablaDatos from "./TablaDatos";
import { useState, useEffect } from "react";
import api from "../api/config";
const InterfazEmpleados = () => {
  const [empleados, setEmpleados] = useState([]);

  //PROBAR CON EL TOKEN
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwidW5pcXVlX25hbWUiOiJyb290IiwiVGlwb0VtcGxlYWRvIjoiQWRtaW5pc3RyYWRvciIsIkNlbnRyb01lZGljbyI6IkNlbnRyYWwiLCJhdWQiOiJ1c2VyIiwiaXNzIjoiTWljcm9zZXJ2aWNpby1BdXRlbnRpY2FjaW9uIiwiZXhwIjoxNzQ1MDIyMzY0LCJpYXQiOjE3NDUwMjIxODQsIm5iZiI6MTc0NTAyMjE4NH0.WNt4ovr1Cfpp3Hcw7K9L7XRuYxCZdfpVk7xuSJhrpj4";
  sessionStorage.setItem("jwtToken", token);

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
    fetchDatos();
  }, []);
  return (
    <>
      <div className="flex justify-between items-center mb-6 px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800">Empleados</h1>

        <div className="space-x-4">
          <button className="px-4 py-2 bg-white text-gray-700 rounded-md border border-gray-300 hover:bg-gray-50 transition-colors shadow-sm text-sm font-medium">
            Especialidades
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md border border-blue-700 hover:bg-blue-700 transition-colors shadow-sm text-sm font-medium">
            Agregar Empleado
          </button>
        </div>
      </div>
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
