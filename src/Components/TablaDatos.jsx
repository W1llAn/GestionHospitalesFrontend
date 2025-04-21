import { useEffect, useRef, useState } from "react";
import jQuery from "jquery";
const $ = jQuery;
import "datatables.net";
import "datatables.net-dt/css/dataTables.dataTables.min.css";
import { Toast } from "primereact/toast";
import FormularioEmpleado from "./FormularioEmpleado";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";

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
      //columns: columnas,
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
              <button class="edit-btn text-blue-500 hover:text-blue-700">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z"></path>
                </svg>
              </button>
              <button class="delete-btn text-red-500 hover:text-red-700">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4m-4 0a1 1 0 00-1 1v1h6V3a1 1 0 00-1-1h-4z"></path>
                </svg>
              </button>
            </div>
          `,
          className: "text-center",
        },
      ],
      opciones, // Usa el spread operator para las opciones
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
          : rowData["especialidad"] != null
          ? "la especialidad"
          : null;
      const nombre =
        rowData["nombre"] != null
          ? rowData["nombre"]
          : rowData["especialidad"] != null
          ? rowData["especialidad"]
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
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
