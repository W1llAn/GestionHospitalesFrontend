import React, { useEffect, useRef, useState } from "react";
import Boton from "../Boton";
import { FloatLabel } from "primereact/floatlabel";
import { Password } from "primereact/password";
import {
  IconoCiudad,
  IconoCrear,
  IconoDireccion,
  IconoEmpleadosTabla,
  IconoNombreHospital,
} from "../../assets/IconosComponentes";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { TreeTable } from "primereact/treetable";
import { Column } from "primereact/column";
import accionesTemplate from "../AccionesTemplate";
import ModalFormulario from "../ModalFormulario";
import api from "../../api/config";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Dropdown } from "primereact/dropdown";

function GestionUsuarios() {
//contraseña 
const [globalFilter, setGlobalFilter] = useState("");
const toast=useRef();
const [isEditing, setIsEditing] = useState(false);
const [modalVisible, setModalVisible] = useState(false);
const [data, setData] = useState([]);
const [nuevoUsuario, setNuevoUsuario] = useState({
    usuario: "",
    nombreEmpleado: "",
    contrasenia: "",
    empleadoId:""
});
const[empleados,setEmpleados]=useState([]);
const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);

const [editNuevoUsuario, setEditNuevoUsuario] = useState({
  cedula: "",
  nombreEmpleado: "",
  empleadoId:"",
  usuarioId:"",
  usuario:"",
  contrasenia: "",
  prevContrasenia: "",
});

// Cargar usuarios al montar el componente
useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await api.get("/Administracion/Usuarios");
        const usuarios = response.data.usuarios
          .sort((a, b) => b.id - a.id) // Ordenar por id descendente
          .map((usuario, index) => ({
            key: `${index}`,
            data: {
                usuarioId:usuario.id||'',
                empleadoId:usuario.empleado?.id ||'',
                cedula: usuario.empleado?.cedula || '',
                nombreUsuario: usuario.nombreUsuario,
                empleado: usuario.empleado?.nombre || '',
                correo: usuario.empleado?.email || '',
                centroMedico: usuario.empleado?.centroMedico?.nombre || '',
                telefono: usuario.empleado?.telefono || '',
                contrasenia:usuario.contrasenia||'',
              },
            children: [],
          }));
        setData(usuarios);
      } catch (error) {
        console.error("Error al cargar los usuarios", error);

        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "No se pudieron cargar los usuarios.",
          life: 3000,
        });
      }
    };
    fetchUsuarios();
}, []);
  
  const handleDelete = (rowData) => {
    confirmDialog({
      message: `¿Estás seguro de que deseas eliminar este usuario "${rowData.data.nombreUsuario}"?`,
      header: "Confirmar Eliminación",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Sí, eliminar",
      rejectLabel: "Cancelar",
      accept: async () => {
        try {
          await api.delete(`/Administracion/Usuarios/${rowData.data.usuarioId}`);
          const updateData = data.filter(
            (item) => item.data.usuarioId !== rowData.data.usuarioId
          );
          setData(updateData);
          toast.current.show({
            severity: "success",
            summary: "Usuario eliminado",
            detail: "El usuario ha sido eliminado exitosamente.",
            life: 3000,
          });
        } catch (error) {
          console.error("Error al eliminar", error);
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail: "No se pudo eliminar al usuario.",
            life: 3000,
          });
        }
      },
    });
  };

// Manejar la apertura del modal para edición
const handleEdit = (rowData) => {
    setIsEditing(true);
    setUsuarioSeleccionado(rowData);
    setEditNuevoUsuario({
      cedula: rowData.data.cedula,
      nombreEmpleado: rowData.data.empleado || "",
      empleadoId:rowData.data.empleadoId,
      usuarioId:rowData.data.usuarioId,
      usuario: rowData.data.nombreUsuario,
      contrasenia: "", // Vacío por seguridad, 
      prevContrasenia:rowData.data.contrasenia,
    });
    setModalVisible(true);    
  };

  //guardar usuario 
  const handleGuardarUsuario = async () => {
      if (!isEditing) {
        if (!nuevoUsuario.usuario || !nuevoUsuario.contrasenia) {
          toast.current.show({
            severity: "warn",
            summary: "Campos incompletos",
            detail: "Por favor llena al menos usuario y contraseña.",
            life: 3000,
          });
          return;
        }
      }    
    try {
      if (isEditing) {
        const contraseniaLimpia = editNuevoUsuario.contrasenia.trim();
       // console.log(contraseniaLimpia,"contra nueva");        
      // Si la contraseña se modificó, incluirla
      if (contraseniaLimpia !== "") {
      // Enviar la solicitud de actualización
      const response = await api.put(
        `/Administracion/Usuarios/${editNuevoUsuario.usuarioId}`,
          {
          id: editNuevoUsuario.usuarioId,
          nombreUsuario: editNuevoUsuario.usuario,
          empleadoId: editNuevoUsuario.empleadoId,
          contrasenia:contraseniaLimpia,
          }
        );
        editNuevoUsuario.prevContrasenia=contraseniaLimpia;
      } else {
      // Enviar la solicitud de actualización
     //console.log(editNuevoUsuario.prevContrasenia,"contra antigua")
      
      const response = await api.put(
        `/Administracion/Usuarios/${editNuevoUsuario.usuarioId}`,
        {
        id: editNuevoUsuario.usuarioId,
        nombreUsuario: editNuevoUsuario.usuario,
        empleadoId: editNuevoUsuario.empleadoId,
        contrasenia:editNuevoUsuario.prevContrasenia,
        }
      );
      }
      // Actualizar los datos localmente
      const updatedData = data.map((item) =>
        item.data.usuarioId === editNuevoUsuario.usuarioId
          ? {
              ...item,
              data: {
                ...item.data,
                contrasenia:editNuevoUsuario.prevContrasenia,
                nombreUsuario: editNuevoUsuario.usuario,
              },
            }
          : item
      );
      setData(updatedData);

      // Mostrar el mensaje de éxito
      toast.current.show({
        severity: "success",
        summary: "Usuario actualizado",
        detail: "El usuario ha sido actualizado exitosamente.",
        life: 3000,
      });

      // Resetear el formulario
      setEditNuevoUsuario({
        cedula: "",
        nombreEmpleado: "",
        empleadoId: "",
        usuarioId: "",
        usuario: "",
        contrasenia: "",
        prevContrasenia: "",
      });
      setIsEditing(false);
      setModalVisible(false);
      } else {
        // Create new user
        await api.post("/Administracion/Usuarios", {
          nombreUsuario: nuevoUsuario.usuario,
          contrasenia: nuevoUsuario.contrasenia,
          empleadoId: nuevoUsuario.empleadoId,
        });
  
        // Refetch the user list
        const response = await api.get("/Administracion/Usuarios");
        const usuarios = response.data.usuarios
          .sort((a, b) => b.id - a.id)
          .map((usuario, index) => ({
            key: `${index}`,
            data: {
              usuarioId:usuario.id||'',
              empleadoId: usuario.empleado?.id || '',
              cedula: usuario.empleado?.cedula || '',
              nombreUsuario: usuario.nombreUsuario,
              empleado: usuario.empleado?.nombre || '',
              correo: usuario.empleado?.email || '',
              centroMedico: usuario.empleado?.centroMedico?.nombre || '',
              telefono: usuario.empleado?.telefono || '',
              contrasenia:usuario.contrasenia||'',
            },
            children: [],
          }));
        setData(usuarios);

       

        toast.current.show({
          severity: "success",
          summary: "Usuario registrado",
          detail: "El usuario ha sido registrado exitosamente.",
          life: 3000,
        });
      }
      setNuevoUsuario({
        usuario: "",
        nombreEmpleado: "",
        contrasenia: "",
        empleadoId: "",
      });
      setIsEditing(false);
      setModalVisible(false);
    } catch (error) {
      console.log(error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: isEditing
          ? "No se pudo actualizar el usuario."
          : "No se pudo registrar el usuario.",
        life: 3000,
      });
    }
  };
  
const handleCancel = () => {
    setNuevoUsuario({
    usuario: "",
    contrasenia: "",
    id: "",
    });
    setEditNuevoUsuario({
      cedula: "",
      nombreEmpleado: "",
      empleadoId: "",
      usuarioId: "",
      usuario: "",
      contrasenia: "", 
    });
    setIsEditing(false);
    setModalVisible(false);
};
//*Manejar empleados modal 
useEffect(() => {
    const fetchEmpleados = async () => {
    try {
        const response = await api.get("/Administracion/Empleados"); // Asegúrate de que esta ruta sea la correcta
        setEmpleados(response.data.empleados);
    } catch (error) {
        console.error("Error al cargar los empleados:", error);
        toast.current?.show({
        severity: "error",
        summary: "Error",
          detail: "No se pudieron cargar los empleados.",
          life: 3000,
        });
      }
    };
    fetchEmpleados();
}, []);

    return (
        <section className="py-14 px-8">
        <Toast ref={toast} />
        <ConfirmDialog />
        <div className="flex flex-row justify-between">
            <h1 className="text-3xl font-bold">Gestión Usuarios</h1>
            <Boton
              text={"Registrar Usuario"}
              icon={IconoCrear}
              onClick={() => setModalVisible(true)}
            />
          </div>
    
          <div className="flex justify-content-end my-8">
            <IconField iconPosition="left">
              <InputIcon className="pi pi-search" />
              <InputText
                type="search"
                onInput={(e) => setGlobalFilter(e.target.value)}
                placeholder="Nombre del Usuario"
              />
            </IconField>
          </div>

          <div className="card">
            <TreeTable
              value={data}
              rows={5}
              paginator={true}
              tableStyle={{ minWidth: "60rem" }}
              globalFilter={globalFilter}
              rowsPerPageOptions={[5, 10, 20]} // Opciones para cambiar cantidad
              currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} registros"
              paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
            >
              <Column
                field="cedula"
                header={
                  <span className="flex items-center gap-2">
                    <IconoNombreHospital className="text-lg" />
                    Cédula
                  </span>
                }
              ></Column>
            <Column
                field="nombreUsuario"
                header={
                  <span className="flex items-center gap-2">
                    <IconoNombreHospital className="text-lg" />
                    Nombre Usuario
                  </span>
                }
              ></Column>
            <Column
                field="empleado"
                header={
                  <span className="flex items-center gap-2">
                    <IconoNombreHospital className="text-lg" />
                    Empleado
                  </span>
                }
              ></Column>
            <Column
                field="correo"
                header={
                  <span className="flex items-center gap-2">
                    <IconoNombreHospital className="text-lg" />
                    Correo Electrónico
                  </span>
                }
              ></Column>
            <Column
                field="centroMedico"
                header={
                  <span className="flex items-center gap-2">
                    <IconoNombreHospital className="text-lg" />
                    Centro Médico
                  </span>
                }
              ></Column>
            <Column
                field="telefono"
                header={
                  <span className="flex items-center gap-2">
                    <IconoNombreHospital className="text-lg" />
                    Telefono
                  </span>
                }
              ></Column>
              <Column
            body={(rowData) =>
              accionesTemplate({
                rowData,
                onEdit: handleEdit,
                onDelete: handleDelete,
              })
                }
                header=""
                style={{ width: "10rem" }}
              />
            </TreeTable>
          </div>
    
        {/* Modal */} 
        <ModalFormulario
            visible={modalVisible}
            onHide={handleCancel}
            titulo={isEditing ? "Editar Usuario" : "Registrar Usuario"}
            footer={
              <div className="flex justify-end gap-2">
                <Boton
                  text="Cancelar"
                  onClick={handleCancel}
                  className="bg-red-600 hover:bg-red-700"
                />
                <Boton
                text={isEditing ? "Actualizar" : "Guardar"}
                onClick={handleGuardarUsuario}
                />
              </div>
            }
          >
            <div className="grid gap-8 mt-8">
              {/* Campo Empleado (Cédula) */}
              {!isEditing ? (
                <span className="p-float-label">
                  <Dropdown
                    id="empleadoU"
                    name="empleadoU"
                    options={empleados
                      .filter(
                        (empleado) =>
                          !data.some(
                            (usuario) => usuario.data.empleadoId === empleado.id
                          )
                      )
                      .map((empleado) => ({
                        label: empleado.cedula,
                        value: empleado.id,
                      }))}
                    value={nuevoUsuario.empleadoId}
                    onChange={(e) => {
                      const empleadoSeleccionado = empleados.find(
                        (emp) => emp.id === e.value
                      );
                      setNuevoUsuario({
                        ...nuevoUsuario,
                        empleadoId: e.value,
                        nombreEmpleado: empleadoSeleccionado?.nombre || "",
                      });
                    }}
                    placeholder="Selecciona un empleado"
                    className="w-full"
                  />
                  <label htmlFor="empleadoU">Empleado (Cédula)</label>
                </span>
              ) : (
                 /* Campo cedula del Empleado */
                <span className="p-float-label">
                  <InputText
                    id="empleadoCedula"
                    value={editNuevoUsuario.cedula}
                    disabled
                    className="w-full"
                  />
                  <label htmlFor="empleadoCedula">Empleado (Cédula)</label>
                </span>
              )}
              {/* Campo Nombre del Empleado */}
              <span className="p-float-label">
                <InputText
                  id="empleadoNombre"
                  name="empleadoNombre"
                  value={isEditing ? editNuevoUsuario.nombreEmpleado : nuevoUsuario.nombreEmpleado}
                  disabled={true}
                />
                <label htmlFor="empleadoNombre">Nombre del Empleado</label>
              </span>

              {/* Campo Usuario */}
              <span className="p-float-label">
              <InputText
                id="usuario"
                name="usuario"
                value={isEditing ? editNuevoUsuario.usuario : nuevoUsuario.usuario}
                onChange={(e) => {
                  const value = e.target.value;
                  if (isEditing) {
                    setEditNuevoUsuario({ ...editNuevoUsuario, usuario: value });
                  } else {
                    setNuevoUsuario({ ...nuevoUsuario, usuario: value });
                  }
                }}
              />
                <label htmlFor="usuario">Usuario</label>
              </span>

              {/* Campo Contraseña */}
              <div className="card flex justify-content-center w-full">
                <FloatLabel className="w-full">
                <Password
                  className="w-full"
                  inputId="contrasenia"
                  value={isEditing ? editNuevoUsuario.contrasenia : nuevoUsuario.contrasenia}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (isEditing) {
                      setEditNuevoUsuario({ ...editNuevoUsuario, contrasenia: value });
                    } else {
                      setNuevoUsuario({ ...nuevoUsuario, contrasenia: value });
                    }
                  }}
                  feedback={false}
                  toggleMask={true}
                  inputClassName="w-full"
                />
                  <label htmlFor="contrasenia">
                    {isEditing ? "Contraseña nueva" : "Contraseña"}
                  </label>
                </FloatLabel>
              </div>
            </div>
          </ModalFormulario>

        </section>
      );
}

export default GestionUsuarios