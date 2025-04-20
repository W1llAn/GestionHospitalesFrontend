import { useEffect, useState } from "react";
import TablaDatos from "./TablaDatos";
import api from "../api/config";

const InterfazEmpleados = () => {
  //
  const [especialidades, setEspecialidades] = useState([]);

  const columnas = [
    {
      title: "especialidad",
      data: "especialidad",
      className: "font-medium text-gray-900",
    },
  ];
  const fetchEspecialidades = async () => {
    try {
      const response = await api.get("/Especialidades");
      setEspecialidades(response.data);
    } catch (error) {
      console.log("Error al obtener las especialidades", error);
    }
  };

  useEffect(() => {
    fetchEspecialidades();
  });

  const opcionesTabla = {
    paging: true,
    pageLength: 10,
    responsive: true,
    language: {
      url: "/Spanish.json", // Español
    },
  };
  return (
    <>
      <div className="flex justify-between items-center mb-6 px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800">Especialidades</h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md border border-blue-700 hover:bg-blue-700 transition-colors shadow-sm text-sm font-medium">
          Agregar Especialidad
        </button>
      </div>
      <div>
        <TablaDatos
          columnas={columnas}
          datos={especialidades}
          opciones={opcionesTabla}
        />
      </div>
    </>
  );
};
export default InterfazEmpleados;
