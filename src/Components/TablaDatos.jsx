import { useEffect, useRef, useState } from "react";
import jQuery from "jquery";
const $ = jQuery;
import "datatables.net";
import "datatables.net-dt/css/dataTables.dataTables.min.css";
import { Toast } from "primereact/toast";
import FormularioEmpleado from "./FormularioEmpleado";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import {
  FaIdCard,
  FaUser,
  FaEnvelope,
  FaHospital,
  FaBriefcase,
  FaPhone,
  FaStethoscope,
  FaDollarSign,
} from "react-icons/fa";

const TablaDatos = ({
  columnas,
  datos,
  opciones,
  tipo = {},
  datoEditado,
  datoEliminado,
  getFormData,
}) => {
  const toast = useRef();
  const tablaRef = useRef(null);
  const [formData, setFormData] = useState({}); // Estado para el formulario
  const [modalEditar, setmodalEditar] = useState(false);

  //METODO PARA DISPARAR LA FUNCION DE OCULTAR EL FORM
  const handleEmpleadoAgregado = async (guardar) => {
    setmodalEditar(false); // Cierra el modal
    if (guardar) {
      toast.current.show({
        //Muestra el mensaje de exito
        severity: "success",
        summary: "Empleado Creado",
        detail: "El empleado ha sido editado con éxito.",
        life: 3000,
      });
    }
    if (datoEditado) {
      datoEditado(); // Llamamos a la función para notificar a InterfazEmpleados
    }
  };

  //METODO PARA DISPARAR METODO PADRE DE EELIMINAR UN REGISTRO
  const eliminarRegistro = (id, nombre, tipo) => {
    if (datoEliminado) {
      confirmDialog({
        message: `¿Estás seguro de que deseas eliminar ${tipo} "${nombre}"?`,
        header: "Confirmar Eliminación",
        icon: "pi pi-exclamation-triangle",
        acceptLabel: "Sí, eliminar",
        rejectLabel: "Cancelar",
        accept: async () => {
          datoEliminado(id);
        },
      });
    }
  };

  const cargarFormulario = (rowData) => {
    setFormData(rowData); // Actualiza el estado con los datos de la fila
  };

  useEffect(() => {
    // Inicializar DataTable
    const tabla = $(tablaRef.current).DataTable({
      data: datos,
      responsive: true,
      destroy: true,
      columns: [
        ...columnas,
        {
          title: "",
          data: null,
          orderable: false,
          render: () => `
            <div class="flex space-x-2">
              <button class="edit-btn text-primary hover:text-blue-900 cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                </svg>
              </button>
              <button class="delete-btn text-red-500 hover:text-red-700 cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
              </button>
            </div>
          `,
          className: "text-center",
        },
      ],
      ...opciones, // Usa el spread operator para las opciones
    });

    // Agregar evento de clic para los botones de edición
    $(tablaRef.current).on("click", ".edit-btn", function () {
      const rowData = tabla.row($(this).closest("tr")).data(); // Obtener los datos de la fila
      cargarFormulario(rowData); // Pasar los datos al formulario

      if (getFormData) {
        getFormData(rowData);
      } else {
        setmodalEditar(true);
      }
    });
    $(tablaRef.current).on("click", ".delete-btn", function () {
      const rowData = tabla.row($(this).closest("tr")).data(); // Obtener los datos de la fila
      const id = rowData["id"];
      const tipo =
        rowData["nombre"] != null
          ? "el empleado"
          : rowData["especialidad_"] != null
          ? "la especialidad"
          : null;
      const nombre =
        rowData["nombre"] != null
          ? rowData["nombre"]
          : rowData["especialidad_"] != null
          ? rowData["especialidad_"]
          : null;
      eliminarRegistro(id, nombre, tipo);
    });

    // Limpiar DataTable al desmontar el componente
    return () => {
      tabla.destroy();
      $(tablaRef.current).off("click", ".edit-btn"); // Remover el evento
      $(tablaRef.current).off("click", ".delete-btn");
    };
  }, [datos, columnas, opciones]);

  return (
    <>
      <Toast ref={toast}></Toast>
      <div className="overflow-x-auto">
        <table
          ref={tablaRef}
          className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columnas.map((col) => (
                <th
                  key={col.title}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ">
                  {col.title}
                </th>
              ))}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200"></tbody>
        </table>
      </div>

      {modalEditar && tipo == "empleados" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-[35%] p-6 relative max-h-[82%]  overflow-y-auto">
            <button
              onClick={() => setmodalEditar(false)}
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
            <FormularioEmpleado
              key={formData?.id ?? "nuevo"}
              onEmpleadoAgregado={handleEmpleadoAgregado}
              empleadoParaEditar={formData}
            />
          </div>
        </div>
      )}

      {/*AQUI VA EL COMPONENTE DE FORMULARIO PARA USUARIOS*/}
      {modalEditar && tipo == "usuarios" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-[35%] p-6 relative max-h-[82%]  overflow-y-auto">
            <button
              onClick={() => setmodalEditar(false)}
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
          </div>
        </div>
      )}
    </>
  );
};

export default TablaDatos;
