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
import { Calendar } from 'primereact/calendar';
import { Column } from "primereact/column";
import accionesTemplate from "../AccionesTemplate";
import ModalFormulario from "../ModalFormulario";
import { addLocale } from 'primereact/api';
import api from "../../api/config";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Dropdown } from "primereact/dropdown";

function Pacientes (idCentroMedico) {
const toast=useRef();
const [data, setData] = useState([]);
const [globalFilter, setGlobalFilter] = useState("");
const [modalVisible, setModalVisible] = useState(false);
const [isEditing, setIsEditing] = useState(false);
const[pacientes,setPacientes]=useState([]);
const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null);
const [centroMedicoIdActual, setCentroMedicoIdActual] = useState(null);

const [nuevoPaciente, setNuevoPaciente] = useState({
    nombre: "",
    cedula: "",
    fechaNacimiento: "",
    telefono:"",
    direccion:"",
    centroMedicoId:"",
    idPaciente:"",
});


//setear el calendario
addLocale('es', {
    firstDayOfWeek: 1,
    dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
    dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
    dayNamesMin: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
    monthNames: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
    monthNamesShort: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
    today: 'Hoy',
    clear: 'Limpiar',
  });


  const fetchPacientes = async () => {
    try {
        const response = await api.get("/CentroMedico/Pacientes");
        const pacientesData = response.data.pacientes;

        // Suponiendo que todos pertenecen al mismo centro médico
        if (pacientesData.length > 0) {
        setCentroMedicoIdActual(pacientesData[0].centroMedico?.id || null);
        }

        const pacientes = pacientesData
        .sort((a, b) => b.idPaciente - a.idPaciente)
        .map((paciente, index) => {
            const edad = mostrarEdad(paciente.fechaNacimiento); // Aquí usas mostrarEdad

            return {
            key: `${index}`,
            data: {
                pacienteId: paciente.idPaciente || '',
                nombre: paciente.nombre || '',
                cedula: paciente.cedula || '',
                edad: edad || '',  // Aquí asignas la edad calculada en formato de texto
                telefono: paciente.telefono || '',
                direccion: paciente.direccion || '',
                centroMedicoId: paciente.centroMedico?.id || '',
                fechaNacimiento: paciente.fechaNacimiento||'', 
            },
            children: [],
            };
        });

        setData(pacientes);
    } catch (error) {
        console.error("Error al cargar los pacientes", error);
        // Aquí podrías agregar un toast de error si lo necesitas
    }
    };

// Cargar pacientes al montar el componente
useEffect(() => {
    
        fetchPacientes();
    }, []);


    

  //guardar paciente 
const handleGuardarPaciente= async () => {
if (!nuevoPaciente.nombre || !nuevoPaciente.cedula || !nuevoPaciente.fechaNacimiento || !nuevoPaciente.telefono || !nuevoPaciente.direccion) {
    toast.current.show({
    severity: "warn",
    summary: "Campos incompletos",
    detail: "Por favor llenartodos los datos del pacciente.",
    life: 3000,
    });
    return;
}
try {
    if (isEditing) {
    // Editar paciente
    const response = await api.put(
        `/CentroMedico/Pacientes/${pacienteSeleccionado.data.pacienteId}`,
        {
        idPaciente: pacienteSeleccionado.data.pacienteId,
        nombre: nuevoPaciente.nombre,
        cedula: nuevoPaciente.cedula,
        fechaNacimiento: formatearFecha(nuevoPaciente.fechaNacimiento), 
        telefono: nuevoPaciente.telefono,
        direccion: nuevoPaciente.direccion,
        idCentroMedico:idCentroMedico.idCentroMedico,
        }
    );
    // Actualizar la lista de pacientes
    const updatedData = data.map((item) =>
        item.data.pacienteId === pacienteSeleccionado.data.pacienteId
        ? {
            ...item,
            data: {
                id: pacienteSeleccionado.data.pacienteId,
                nombre: nuevoPaciente.nombre,
                cedula: nuevoPaciente.cedula,
                edad: mostrarEdad(nuevoPaciente.fechaNacimiento),
                telefono: nuevoPaciente.telefono,
                direccion: nuevoPaciente.direccion,
            },
        }
        : item
    );
    setData(updatedData);
    setNuevoPaciente({
        nombre: "",
        cedula: "",
        fechaNacimiento: "",
        telefono:"",
        direccion:"",
        centroMedicoId:"",
    });
    setPacienteSeleccionado(null);
    toast.current.show({
        severity: "success",
        summary: "Paciente actualizado",
        detail: "El paciente ha sido actualizado exitosamente.",
        life: 3000,
    });
    } else {
    const response = await api.post("/CentroMedico/Pacientes", {
        cedula: nuevoPaciente.cedula,
        nombre: nuevoPaciente.nombre,
        fechaNacimiento: formatearFecha(nuevoPaciente.fechaNacimiento), 
        direccion: nuevoPaciente.direccion,
        telefono: nuevoPaciente.telefono,
        idCentroMedico: idCentroMedico.idCentroMedico,
    });
    fetchPacientes();
    const nuevo = {
        key: `${data.length}`,
        data: {
        pacienteId: response.data.pacienteId,
        nombre: response.data.nombre,
        cedula: response.data.cedula,
        fechaNacimiento: mostrarEdad(response.data.fechaNacimiento),
        telefono: response.data.telefono,
        direccion: response.data.direccion,
        centroMedicoId: response.data.centroMedicoId,
        },
    };
    setData([nuevo, ...data]);

    setNuevoPaciente({
        nombre: "",
        cedula: "",
        fechaNacimiento: "",
        telefono:"",
        direccion:"",
        centroMedicoId:"",
    });
    setPacienteSeleccionado(null);

    toast.current.show({
        severity: "success",
        summary: "Paciente registrado",
        detail: "El paciente ha sido registrado exitosamente.",
        life: 3000,
    });
    }
    setNuevoPaciente({
        nombre: "",
        cedula: "",
        fechaNacimiento: "",
        telefono:"",
        direccion:"",
        centroMedicoId:"",
    });
    setIsEditing(false);
    setPacienteSeleccionado(null);
    setModalVisible(false);
} catch (error) {
    console.log(error);

    toast.current.show({
    severity: "error",
    summary: "Error",
    detail: isEditing
        ? "No se pudo actualizar al paciente."
        : "No se pudo registrar al paciente.",
    life: 3000,
    });
}
};

// Manejar la apertura del modal para edición
const handleEdit = (rowData) => {
    setIsEditing(true);
    // Convertir la fecha de DD/MM/YYYY a un objeto Date
    let fechaNacimiento = null;
    if (rowData.data.fechaNacimiento) {
        const [day, month, year] = rowData.data.fechaNacimiento.split('/');
        if (day && month && year) {
            fechaNacimiento = new Date(`${year}-${month}-${day}`);
            // Verificar si la fecha es válida
            if (isNaN(fechaNacimiento.getTime())) {
                fechaNacimiento = null; // Si la fecha no es válida, asignar null
            }
        }
    }
    setPacienteSeleccionado(rowData);
    setNuevoPaciente({
        idPaciente: rowData.data.pacienteId,
        nombre: rowData.data.nombre,
        cedula: rowData.data.cedula,
        fechaNacimiento: fechaNacimiento,
        telefono: rowData.data.telefono,
        direccion: rowData.data.direccion,
        centroMedico: rowData.data.centroMedicoId,
    });

    setModalVisible(true);    
};


 //Eliminar paciente 
const handleDelete = (rowData) => {
confirmDialog({
    message: `¿Estás seguro de que deseas eliminar al/la paciente  "${rowData.data.nombre}"?`,
    header: "Confirmar Eliminación",
    icon: "pi pi-exclamation-triangle",
    acceptLabel:"Sí, eliminar",
    rejectLabel :"Cancelar",
    accept: async () => {
    try {
        await api.delete(`/CentroMedico/Pacientes/${rowData.data.pacienteId}`, {
            data: {
                idPaciente: rowData.data.pacienteId,
                nombre: rowData.data.nombre,
                cedula: rowData.data.cedula,
                fechaNacimiento: rowData.data.fechaNacimiento, // Ya está en formato DD/MM/YYYY
                telefono: rowData.data.telefono,
                direccion: rowData.data.direccion,
                idCentroMedico: idCentroMedico.idCentroMedico,
            },
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const updateData = data.filter(
        (item) => item.data.pacienteId !== rowData.data.pacienteId
        );
        setData(updateData);
        toast.current.show({
        severity: "success",
        summary: "Paciente eliminado",
        detail: "El paciente ha sido eliminado exitosamente.",
        life: 3000,
        });
    } catch (error) {
        console.error("Error al eliminar", error);
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "No se pudo eliminar al paciente.",
          life: 3000,
        });
    }
    },
});
};




const handleCancel = () => {
    setNuevoPaciente({
        nombre: "",
        cedula: "",
        fechaNacimiento: "",
        telefono:"",
        direccion:"",
        centroMedico:"",
    });
    setIsEditing(false);
    setModalVisible(false);
};
//formatear fecha de naciemiento 
const calcularEdad = (fechaNacimiento) => {
    if (!fechaNacimiento) return null;

    let nacimiento;
    // Si la fecha está en formato DD/MM/YYYY (como viene de la API)
    if (typeof fechaNacimiento === 'string' && fechaNacimiento.includes('/')) {
        const [day, month, year] = fechaNacimiento.split('/');
        if (!day || !month || !year) return null;
        nacimiento = new Date(`${year}-${month}-${day}`);
    } else {
        nacimiento = new Date(fechaNacimiento);
    }

    // Verificar si la fecha es válida
    if (isNaN(nacimiento.getTime())) {
        return null;
    }

    const hoy = new Date();

    // Calcular la diferencia en años
    let edadEnAnos = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    const dia = hoy.getDate() - nacimiento.getDate();

    // Ajustar si el paciente aún no ha cumplido los años este año
    if (mes < 0 || (mes === 0 && dia < 0)) {
        edadEnAnos--;
    }

    // Si la edad es menor a 1 año, calculamos en meses o días
    if (edadEnAnos < 1) {
        const diffInMs = hoy.getTime() - nacimiento.getTime();
        const totalDias = Math.floor(diffInMs / (1000 * 3600 * 24));

        if (totalDias < 30) {
            return `${totalDias} día${totalDias !== 1 ? 's' : ''}`;
        }

        let meses = hoy.getMonth() - nacimiento.getMonth() + (hoy.getFullYear() - nacimiento.getFullYear()) * 12;
        if (hoy.getDate() < nacimiento.getDate()) {
            meses--;
        }
        return `${meses} mes${meses !== 1 ? 'es' : ''}`;
    }

    // Si ya tiene 1 año o más
    return `${edadEnAnos} año${edadEnAnos > 1 ? 's' : ''}`;
};

const mostrarEdad = (fechaNacimiento) => {
    const edad = calcularEdad(fechaNacimiento);
    if (!edad) return "Edad no disponible";
    return edad;
};

//formatear fecha de nacimiento
const formatearFecha = (fecha) => {
    if (!fecha) return null;
    const date = new Date(fecha);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // meses empiezan desde 0
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
  };
  

//*Manejar pacientes modal 
useEffect(() => {
    const fetchPaciente = async () => {
        try {
            const response = await api.get("/CentroMedico/Pacientes"); // Asegúrate de que esta ruta sea la correcta
            setPacientes(response.data.pacientes);
        } catch (error) {
            console.error("Error al cargar los pacientes:", error);
            toast.current?.show({
            severity: "error",
            summary: "Error",
            detail: "No se pudieron cargar los pacientes.",
            life: 3000,
            });
        }
    };
    fetchPaciente();
}, []);

    return (
        <section className="py-14 px-8">
        <Toast ref={toast} />
        <ConfirmDialog />
        <div className="flex flex-row justify-between">
            <h1 className="text-3xl font-bold">Gestión Pacientes</h1>
            <Boton
                text={"Registrar Paciente"}
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
                placeholder="Nombre del Paciente"
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
        field="nombre"
        header={
            <span className="flex items-center gap-2">
            <IconoNombreHospital className="text-lg" />
            Paciente
            </span>
        }
        ></Column>
        <Column
        field="edad"
        header={
            <span className="flex items-center gap-2">
            <IconoNombreHospital className="text-lg" />
            Edad
            </span>
        }
        ></Column>
        <Column
        field="telefono"
        header={
            <span className="flex items-center gap-2">
            <IconoNombreHospital className="text-lg" />
            Teléfono
            </span>
        }
        ></Column>
        <Column
        field="direccion"
        header={
            <span className="flex items-center gap-2">
            <IconoNombreHospital className="text-lg" />
            Dirección
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
    
       {/* Modal  */}
    <ModalFormulario
        visible={modalVisible}
        onHide={handleCancel}
        titulo={isEditing ? "Editar Centro Paciente" : "Registrar Centro Paciente"}
        footer={
        <div className="flex justify-end gap-2">
            <Boton
            text="Cancelar"
            onClick={handleCancel}
            className="bg-red-600 hover:bg-red-700"
        />
            <Boton
            text={isEditing ? "Actualizar" : "Guardar"}
            onClick={handleGuardarPaciente}
        />
        </div>
    }
    >
    <div className="grid gap-8 mt-8">
        <span className="p-float-label">
            <InputText
            id="cedula"
            name="cedula"
            value={nuevoPaciente.cedula}
            onChange={(e) =>
                setNuevoPaciente({ ...nuevoPaciente, cedula: e.target.value })
            }
            />
            <label htmlFor="cedula">Cédula</label>
        </span>
        <span className="p-float-label">
        <InputText
            id="nombre"
            name="nombre"
            value={nuevoPaciente.nombre}
            onChange={(e) =>
                setNuevoPaciente({ ...nuevoPaciente, nombre: e.target.value })
            }
        />
        <label htmlFor="nombrePaciente">Nombre</label>
        </span>

        <span className="p-float-label">
        <Calendar
            id="fechaNacimiento"
            name="fechaNacimiento"
            value={nuevoPaciente.fechaNacimiento}
            onChange={(e) =>
            setNuevoPaciente({ ...nuevoPaciente, fechaNacimiento: e.value })
            }
            dateFormat="dd-mm-yy"             // Formato de fecha (ajustable)
            showIcon                          // Muestra un ícono de calendario
            maxDate={new Date()}             // No permite fechas futuras
            showButtonBar                    // Botones de Hoy / Limpiar
            placeholder="dd-mm-yyyy"
            touchUI={false}                  // Mejor para escritorio (true para móvil)
            readOnlyInput={false}  
            locale="es"              
        />
        <label htmlFor="fechaNacimiento">Fecha Nacimiento</label>
        </span>

        <span className="p-float-label">
        <InputText
            id="direccion"
            name="direccion"
            value={nuevoPaciente.direccion}
            onChange={(e) =>
            setNuevoPaciente({ ...nuevoPaciente, direccion: e.target.value })
            }
        />
        <label htmlFor="direccion">Dirección</label>
        </span>
        <span className="p-float-label">
            <InputText
            id="telefono"
            name="telefono"
            value={nuevoPaciente.telefono}
            onChange={(e) =>
                setNuevoPaciente({ ...nuevoPaciente, telefono: e.target.value })
            }
            />
            <label htmlFor="telefono">Teléfono</label>
        </span>

    </div>
    </ModalFormulario>

        </section>
    );
};

export default Pacientes;