import { useState } from "react";
import api from "../api/config";

const FormularioEmpleado = ({ onEmpleadoAgregado }) => {
  const [formData, setFormData] = useState({
    centro_medicoID: "",
    tipo_empleadoID: "",
    nombre: "",
    cedula: "",
    especialidadID: "",
    telefono: "",
    email: "",
    salario: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const empleadoData = {
        id: 0,
        centro_medicoID: parseInt(formData.centro_medicoID),
        tipo_empleadoID: parseInt(formData.tipo_empleadoID),
        nombre: formData.nombre,
        cedula: formData.cedula,
        especialidadID: parseInt(formData.especialidadID),
        telefono: formData.telefono,
        email: formData.email,
        salario: parseFloat(formData.salario),
      };

      await api.post("/Empleados", empleadoData);
      onEmpleadoAgregado(); // Callback to refresh the employee list and close the modal
    } catch (error) {
      console.error("Error al agregar empleado:", error);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-gray-800">Agregar Empleado</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Centro Médico ID
          </label>
          <input
            type="number"
            name="centro_medicoID"
            value={formData.centro_medicoID}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Tipo Empleado ID
          </label>
          <input
            type="number"
            name="tipo_empleadoID"
            value={formData.tipo_empleadoID}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nombre
          </label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Cédula
          </label>
          <input
            type="text"
            name="cedula"
            value={formData.cedula}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Especialidad ID
          </label>
          <input
            type="number"
            name="especialidadID"
            value={formData.especialidadID}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Teléfono
          </label>
          <input
            type="text"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Salario
          </label>
          <input
            type="number"
            name="salario"
            value={formData.salario}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => onEmpleadoAgregado()}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormularioEmpleado;
