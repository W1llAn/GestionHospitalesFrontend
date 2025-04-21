import { useState, useEffect, useRef } from "react";
import api from "../api/config";
import { validarCedulaEcuatoriana } from "./Validaciones/validaciones";
import { validarEmail } from "./Validaciones/validaciones";
import { validarTelefono } from "./Validaciones/validaciones";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import Boton from "./Boton";

const FormularioEmpleado = ({
  onEmpleadoAgregado,
  empleadoParaEditar = null,
}) => {
  const toast = useRef();
  // Estado que almacena los datos del formulario
  const [formData, setFormData] = useState({
    centroMedicoID: "",
    tipoEmpleadoID: "",
    nombre: "",
    cedula: "",
    especialidadID: "",
    telefono: "",
    email: "",
    salario: "",
  });

  //SE LLENA EL FORMDATA SI RECIBE DATOS
  useEffect(() => {
    if (empleadoParaEditar) {
      setFormData({
        centroMedicoID: empleadoParaEditar.centroMedico.id || "",
        tipoEmpleadoID: empleadoParaEditar.tipoEmpleado.id || "",
        nombre: empleadoParaEditar.nombre || "",
        cedula: empleadoParaEditar.cedula || "",
        especialidadID: empleadoParaEditar.especialidad.id || "",
        telefono: empleadoParaEditar.telefono || "",
        email: empleadoParaEditar.email || "",
        salario: empleadoParaEditar.salario || "",
      });
    }
  }, [empleadoParaEditar]);

  // Estados que almacenan las listas para los combobox
  const [centrosMedicos, setCentroMedicos] = useState([]);
  const [tipoEmpleado, setTipoEmpleado] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);

  // Llama a estas funciones una vez al cargar el componente
  useEffect(() => {
    fetchCentrosMedicos();
    fetchEspecialidades();
    fetchTipoEmpleado();
  }, []);

  // Consulta API para obtener centros médicos
  const fetchCentrosMedicos = async () => {
    try {
      const response = await api.get("/Administracion/CentrosMedicos");
      setCentroMedicos(response.data.centros);
    } catch (error) {
      console.log("Error al consultar los centros médicos", error);
    }
  };

  // Consulta API para obtener especialidades
  const fetchEspecialidades = async () => {
    try {
      const response = await api.get("/Administracion/Especialidades");
      setEspecialidades(response.data.especialidades);
    } catch (error) {
      console.log("Error al consultar las especialidades", error);
    }
  };

  // Consulta API para obtener tipos de empleados
  const fetchTipoEmpleado = async () => {
    try {
      const response = await api.get("/Administracion/TiposEmpleados");
      setTipoEmpleado(response.data.tipos);
    } catch (error) {
      console.log("Error al consultar los tipos de empleados", error);
    }
  };

  // Actualiza el estado del formulario al cambiar los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const esEdicion = !!empleadoParaEditar;
  // Envía el formulario a la API
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validaciones
    if (!validarCedulaEcuatoriana(formData.cedula)) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "La cédula ingresada no es válida.",
        life: 3000,
      });
      return;
    }

    if (!validarTelefono(formData.telefono)) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "El telefono ingresado es incorrecto. ",
        life: 3000,
      });
      return;
    }

    if (!validarEmail(formData.email)) {
      toast.current.show({
        severity: "warn",
        summary: "Advertencia",
        detail: "El email debe tener el formato correcto",
        life: 3000,
      });
      return;
    }

    try {
      const empleadoData = {
        id: esEdicion ? empleadoParaEditar.id : 0,
        centroMedicoID: parseInt(formData.centroMedicoID),
        tipoEmpleadoID: parseInt(formData.tipoEmpleadoID),
        nombre: formData.nombre,
        cedula: formData.cedula,
        especialidadID: parseInt(formData.especialidadID),
        telefono: formData.telefono,
        email: formData.email,
        salario: parseFloat(formData.salario),
      };
      console.log(empleadoData);

      if (esEdicion) {
        await api.put(
          `/Administracion/Empleados/${empleadoParaEditar.id}`,
          empleadoData
        );
      } else {
        await api.post("/Administracion/Empleados", empleadoData);
      }
      onEmpleadoAgregado(true); // Llama a la función padre para actualizar la lista
    } catch (error) {
      console.error("Error al agregar empleado:", error);
    }
  };

  return (
    <div className="overflow-y-auto">
      <Toast ref={toast}></Toast>
      <h2 className="text-xl font-bold mb-4 text-gray-800">
        {empleadoParaEditar ? "Editar Empleado" : "Agregar Empleado"}
      </h2>
      <form className="space-y-8" onSubmit={handleSubmit}>
        {/* Campos de texto normales */}
        <span className="p-float-label mt-6">
          <InputText
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
          <label htmlFor="nombre">Nombre</label>
        </span>
        <span className="p-float-label">
          <InputText
            type="text"
            name="cedula"
            value={formData.cedula}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
          <label htmlFor="cedula">Cédula</label>
        </span>

        <span className="p-float-label">
          <InputText
            type="text"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
          <label htmlFor="telefono">Teléfono</label>
        </span>

        <span className="p-float-label">
          <InputText
            type="text"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
          <label htmlFor="email">Email</label>
        </span>

        <span className="p-float-label">
          <InputText
            type="number"
            name="salario"
            value={formData.salario}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
          <label htmlFor="salario">Salario</label>
        </span>

        {/* COMBOBOX para seleccionar centro médico */}
        <span className="p-float-label">
          <Dropdown
            name="centroMedicoID"
            value={formData.centroMedicoID}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            options={centrosMedicos.map((centro) => ({
              label: centro.nombre,
              value: centro.id,
            }))}
            placeholder="Seleccione un centro"
          />
          <label htmlFor="centroMedicoID">Centro Médico</label>
        </span>

        {/* COMBOBOX para seleccionar tipo de empleado */}
        <span className="p-float-label">
          <Dropdown
            name="tipoEmpleadoID"
            value={formData.tipoEmpleadoID}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            options={tipoEmpleado.map((tipo) => ({
              label: tipo.tipo,
              value: tipo.id,
            }))}
            placeholder="Seleccione un tipo"
          />
          <label htmlFor="tipoEmpleadoID">Tipo de Empleado</label>
        </span>

        {/* COMBOBOX para seleccionar especialidad */}
        <span className="p-float-label">
          <Dropdown
            name="especialidadID"
            value={formData.especialidadID}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            options={especialidades.map((esp) => ({
              label: esp.especialidad_,
              value: esp.id,
            }))}
            placeholder="Seleccione una especialidad"
          />
          <label htmlFor="especialidadID">Especialidad</label>
        </span>

        {/* Botones para cancelar o guardar */}
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={() => onEmpleadoAgregado(false)}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md text-sm hover:bg-gray-400 cursor-pointer">
            Cancelar
          </button>
          <Boton text={"Guardar"} type="submit" className="cursor-pointer" />
        </div>
      </form>
    </div>
  );
};

export default FormularioEmpleado;
