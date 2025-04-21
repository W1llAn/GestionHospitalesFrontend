import TablaDatos from "../TablaDatos";
import { useState, useEffect, useRef } from "react";
import api from "../../api/config";
import InterfazEspecialidades from "./InterfazEspecialidades";
import FormularioEmpleado from "../FormularioEmpleado";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";

const InterfazEmpleados = () => {
  const toast = useRef();
  const [empleados, setEmpleados] = useState([]);
  const [modalEspecialidades, setModalEspecialidades] = useState(false);
  const [modalEmpleado, setModalEmpleado] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0); // Estado para disparar useEffect

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
      data: (row) => row.centroMedico.nombre,
      className: "text-gray-600",
    },
    {
      title: "Cargo",
      data: (row) => row.tipoEmpleado.tipo,
      className: "text-gray-600",
    },

    {
      title: "Telefono",
      data: "telefono",
      className: "text-gray-600",
    },
    {
      title: "Especialidad",
      data: (row) => row.especialidad.especialidad_,
      className: "text-gray-600",
    },
    {
      title: "Salario",
      data: "salario",
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
      const response = await api.get("/Administracion/Empleados");
      setEmpleados(response.data.empleados);
    } catch (error) {
      console.log("Error al consumir la API", error);
    }
  };

  const eliminarEmpleado = async (id) => {
    try {
      const response = await api.delete(`/Administracion/Empleados/${id}`);

      if (response.status == 200) {
        toast.current.show({
          //Muestra el mensaje de exito
          severity: "success",
          summary: "Empleado Creado",
          detail: "El empleado ha sido eliminado con éxito.",
          life: 3000,
        });
        onEmpleadoEditado();
      } else {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "No se puede eliminar el empleado ",
          life: 3000,
        });
      }
      console.log(response.statusText);
    } catch (error) {
      console.log("Error al eliminar", error);
    }
  };

  useEffect(() => {
    fetchDatos();
  }, []);

  useEffect(() => {
    if (refreshTrigger > 0) {
      fetchDatos(); // Solo se ejecuta cuando refreshTrigger cambia (para actualizaciones posteriores)
    }
  }, [refreshTrigger]);

  const handleEmpleadoAgregado = async (guardar) => {
    await fetchDatos(); // Refresca los datos de la tabla
    setModalEmpleado(false); // Cierra el modal
    if (guardar) {
      toast.current.show({
        //Muestra el mensaje de exito
        severity: "success",
        summary: "Empleado Creado",
        detail: "El empleado ha sido creado con éxito.",
        life: 3000,
      });
    }
  };

  // Función para manejar la edición desde TablaDatos
  const onEmpleadoEditado = () => {
    setRefreshTrigger((prev) => prev + 1); // Incrementa para disparar useEffect
  };

  return (
    <>
      <ConfirmDialog />
      <Toast ref={toast}></Toast>
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-6  px-8 ">
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
          <div className="bg-white rounded-lg shadow-lg w-full max-w-[35%] p-6 relative max-h-[82%]  overflow-y-auto">
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
          //COLUMNAS QUE VA A TENER LA TABLA
          columnas={columnas}
          //DATOS QUE SE VAN A MOSTRAR
          datos={empleados}
          //OPCIONES PERSONALOZABLES
          opciones={opcionesTabla}
          //TIPO DE TABLA PARA EL MODAL DE EDITAR
          tipo={"empleados"}
          //DISPARADOR PARA REFRESCAR EL COMPONENTE PADRE
          datoEditado={onEmpleadoEditado}
          //METODO PARA ELIMINAR UN REGISTRO
          datoEliminado={eliminarEmpleado}
        />
      </div>
    </>
  );
};

export default InterfazEmpleados;
