import { useEffect, useRef, useState } from "react";
import TablaDatos from "../TablaDatos";
import api from "../../api/config";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import Boton from "../Boton";
import { IconoCrear } from "../../assets/IconosComponentes";

const InterfazEmpleados = () => {
  const toast = useRef();
  const [especialidades, setEspecialidades] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [nuevaEspecialidad, setNuevaEspecialidad] = useState("");
  const [isEdit, setEdit] = useState(false);
  const [formData, setFormData] = useState();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const columnas = [
    {
      title: "especialidad",
      data: "especialidad_",
      className: "font-medium text-gray-900",
    },
  ];

  const mostrarEditarEspecialidad = (formData) => {
    const especialidadForm = formData["especialidad_"];
    setEdit(true);
    setNuevaEspecialidad(especialidadForm);
    console.log(especialidadForm);
    setMostrarFormulario(true);
    setFormData(formData);
  };

  //EDITAR EL NOMBRE DE LA ESSPECIALIDAD
  const editarEspecialidad = async (formData) => {
    try {
      console.log(formData);

      const response = await api.put(
        `/Administracion/Especialidades/${formData["id"]}`,
        formData
      );
      if (response.status == 200) {
        toast.current.show({
          //Muestra el mensaje de exito
          severity: "success",
          summary: "Especialidad Creada",
          detail: "La especialidad se ha editado con éxito.",
          life: 3000,
        });
      } else {
        console.log(response.statusText);
        toast.current.show({
          //Muestra el mensaje de exito
          severity: "Error",
          summary: "Error",
          detail: "No se puede editar la especialidad.",
          life: 3000,
        });
      }
    } catch (error) {
      console.log("Error al editar la especialidad", error);
    }
  };

  //CREAR UNA NUEVA ESPECIALIDAD
  const crearEspecialidad = async () => {
    try {
      const response = await api.post("/Administracion/Especialidades", {
        especialidad: nuevaEspecialidad,
      });
      console.log(response.status);

      if (response.status == 200) {
        toast.current.show({
          //Muestra el mensaje de exito
          severity: "success",
          summary: "Especialidad Creada",
          detail: "La especialidad se ha creado con éxito.",
          life: 3000,
        });
      } else {
        toast.current.show({
          //Muestra el mensaje de exito
          severity: "Error",
          summary: "Error",
          detail: "No se puede crear la especialidad.",
          life: 3000,
        });
      }
    } catch (error) {
      console.log("Error al crear la especialidad", error);
    }
  };

  //OBTENER LAS ESPECIALIDADES
  const fetchEspecialidades = async () => {
    try {
      const response = await api.get("/Administracion/Especialidades");
      setEspecialidades(response.data.especialidades);
    } catch (error) {
      console.log("Error al obtener las especialidades", error);
    }
  };

  //ELIMINAR UNA ESPECIALIDAD
  const eliminarEspecialidad = async (id) => {
    try {
      const response = await api.delete(`/Administracion/Especialidades/${id}`);
      if (response.status == 200) {
        toast.current.show({
          //Muestra el mensaje de exito
          severity: "success",
          summary: "Especialidad Creada",
          detail: "La especialidad se ha editado con éxito.",
          life: 3000,
        });
        setRefreshTrigger((prev) => prev + 1);
      } else {
        toast.current.show({
          //Muestra el mensaje de exito
          severity: "Error",
          summary: "Error",
          detail: "No se puede editar la especialidad.",
          life: 3000,
        });
      }
    } catch (error) {
      console.log("Error al eliminar la especialidad", error);
    }
  };

  useEffect(() => {
    fetchEspecialidades();
  }, [refreshTrigger]);

  const guardarEspecialidad = async () => {
    try {
      if (!isEdit) {
        await crearEspecialidad();
      } else {
        formData["especialidad_"] = nuevaEspecialidad;
        await editarEspecialidad(formData);
      }
      setNuevaEspecialidad("");
      setMostrarFormulario(false);
      setRefreshTrigger((prev) => prev + 1); // Incrementa para disparar useEffect
    } catch (error) {
      console.log("Error al guardar especialidad", error);
    }
  };

  // OPCIONES PARA PERSONALIZAR LA TABLA DE DATOS
  const opcionesTabla = {
    paging: true,
    pageLength: 5, // Default to 5 rows per page
    lengthMenu: [5, 10, 25, 50], // Options for rows per page
    pagingType: "full_numbers", // Show full pagination controls (First, Previous, Next, Last)
    responsive: true,
    language: {
      search: "Buscar:", // Rename search to "Buscar"
      searchPlaceholder: "Buscar empleados...", // Optional placeholder
      lengthMenu: "Mostrar _MENU_ entradas",
      info: "Mostrando _START_ a _END_ de _TOTAL_ entradas",
      infoEmpty: "Mostrando 0 a 0 de 0 entradas",
      infoFiltered: "(filtrado de _MAX_ entradas totales)",
      paginate: {
        first: "Primero",
        previous: "Anterior",
        next: "Siguiente",
        last: "Último",
      },
      zeroRecords: "No se encontraron registros coincidentes",
      emptyTable: "No hay datos disponibles en la tabla",
    },
  };

  return (
    <>
      <Toast ref={toast}></Toast>
      <div className="flex justify-between items-center mb-6 px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800">Especialidades</h1>
        <Boton
          text={"Agregar Especialidad"}
          onClick={() => {
            setMostrarFormulario(true);
            setEdit(false);
          }}
          icon={IconoCrear}
          className="cursor-pointer"
        />
      </div>

      {/* Formulario oculto */}
      {mostrarFormulario && (
        <div className="bg-white border p-4 rounded-lg shadow-md mb-6 mx-2 pt-8">
          <span className="p-float-label mb-4">
            <InputText
              type="text"
              name="especialidad_"
              value={nuevaEspecialidad}
              required
              onChange={(e) => setNuevaEspecialidad(e.target.value)}
              className="border rounded-md w-full px-3 py-2 mb-4 text-sm"
            />
            <label htmlFor="especialidad_">Nombre de la especialidad</label>
          </span>
          <div className="flex gap-2">
            <Boton
              text={"Guardar"}
              onClick={guardarEspecialidad}
              className="cursor-pointer"
            />

            <button
              onClick={() => {
                setNuevaEspecialidad("");
                setMostrarFormulario(false);
              }}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md text-sm hover:bg-gray-400 cursor-pointer">
              Cancelar
            </button>
          </div>
        </div>
      )}

      <div>
        <TablaDatos
          columnas={columnas}
          datos={especialidades}
          opciones={opcionesTabla}
          getFormData={mostrarEditarEspecialidad}
          datoEliminado={eliminarEspecialidad}
        />
      </div>
    </>
  );
};

export default InterfazEmpleados;
