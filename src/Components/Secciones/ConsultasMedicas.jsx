import React, { useEffect, useRef, useState } from "react";
import {
  IconoCiudad,
  IconoCrear,
  IconoDireccion,
  IconoNombreHospital,
} from "../../assets/IconosComponentes";
import Boton from "../Boton";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import accionesTemplate from "../AccionesTemplate";
import { Column } from "primereact/column";
import ModalFormulario from "../ModalFormulario";
import { Dropdown } from "primereact/dropdown";
import { DataTable } from "primereact/datatable";
import api from "../../api/config";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";

function ConsultasMedicas({ idMedico, idCentroMedico }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [data, setData] = useState([]);
  const [detalleVisible, setDetalleVisible] = useState(false);
  const [consultaSeleccionada, setConsultaSeleccionada] = useState(null);
  const [nuevaConsulta, setNuevaConsulta] = useState({
    fecha: new Date(),
    hora: new Date(),
    motivo: "",
    diagnostico: "",
    tratamiento: "",
    cedula: "",
  });
  const toast = useRef(null);

  const fetchConsultasMedicas = async () => {
    try {
      const response = await api.get("CentroMedico/Consultas");

      // Depuración: Imprimir idMedico, su tipo, y estructura de las consultas
      console.log("idMedico:", idMedico, "Tipo:", typeof idMedico);
      console.log("Consultas recibidas:", response.data.consultas);
      response.data.consultas.forEach((consulta) => {
        console.log(`Consulta ID ${consulta.idConsultaMedica}:`, {
          empleado: consulta.empleado,
          idMedicoField: consulta.idMedico,
        });
      });

      const consultas = response.data.consultas
        .filter((consulta) => {
          const medicoId =
            consulta.empleado?.id ||
            consulta.empleado?.empleadoId ||
            consulta.idMedico;
          const matches = String(medicoId) === String(idMedico);
          console.log(
            `Consulta ID ${
              consulta.idConsultaMedica
            }: medicoId=${medicoId} (tipo: ${typeof medicoId}), idMedico=${idMedico} (tipo: ${typeof idMedico}), matches=${matches}`
          );
          return matches;
        })
        .map((consulta, index) => ({
          key: `${index}`,
          data: {
            idConsultaMedica: consulta.idConsultaMedica,
            fecha: consulta.fecha,
            cedulaPaciente: consulta.paciente.cedula,
            direccionPaciente: consulta.paciente.direccion,
            telefonoPaciente: consulta.paciente.telefono,
            nombrePaciente: consulta.paciente.nombre,
            centroMedico: consulta.centroMedico.nombre,
            hora: consulta.hora,
            empleado: {
              nombre: consulta.empleado.nombre,
              especialidad: {
                especialidad_: consulta.empleado.especialidad.especialidad_,
              },
            },
            motivo: consulta.motivo,
            diagnostico: consulta.diagnostico,
            tratamiento: consulta.tratamiento,
          },
        }));

      // Depuración: Imprimir consultas filtradas
      console.log("Consultas filtradas:", consultas);

      // Ordenar las consultas por fecha (más reciente primero)
      const consultasOrdenadas = consultas.sort((a, b) => {
        const fechaA = new Date(`${a.data.fecha}T${a.data.hora}`);
        const fechaB = new Date(`${b.data.fecha}T${b.data.hora}`);
        return fechaB - fechaA;
      });

      setData(consultasOrdenadas);
    } catch (error) {
      console.error("Error al cargar consultas médicas:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudieron cargar las consultas médicas.",
        life: 3000,
      });
    }
  };

  useEffect(() => {
    if (idMedico) {
      fetchConsultasMedicas();
    }
  }, [idMedico]);
  // Guardar nueva consulta médica
  const handleGuardarConsultaMedica = async () => {
    if (
      !nuevaConsulta.fecha ||
      !nuevaConsulta.hora ||
      !nuevaConsulta.motivo ||
      !nuevaConsulta.cedula
    ) {
      toast.current.show({
        severity: "warn",
        summary: "Campos incompletos",
        detail: "Por favor completa todos los campos obligatorios.",
        life: 3000,
      });
      return;
    }

    if (!idMedico || !idCentroMedico) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo obtener la información del médico o centro médico.",
        life: 3000,
      });
      return;
    }

    if (isEditing) {
      // Actualizar consulta médica existente
      try {
        const formattedFecha = nuevaConsulta.fecha.toISOString().split("T")[0];
        const formattedHora = nuevaConsulta.hora.toTimeString().slice(0, 5);

        await api.put(
          `CentroMedico/Consultas/${consultaSeleccionada.idConsultaMedica}`,
          {
            idConsultaMedica: consultaSeleccionada.idConsultaMedica,
            idMedico: idMedico,
            fecha: formattedFecha,
            hora: formattedHora,
            motivo: nuevaConsulta.motivo,
            diagnostico: nuevaConsulta.diagnostico || "",
            tratamiento: nuevaConsulta.tratamiento || "",
            cedula: nuevaConsulta.cedula,
            idCentroMedico: idCentroMedico,
          }
        );

        const updatedData = data.map((item) =>
          item.data.idConsultaMedica === consultaSeleccionada.idConsultaMedica
            ? {
                ...item,
                data: {
                  ...item.data,
                  ...nuevaConsulta,
                  fecha: nuevaConsulta.fecha.toISOString().split("T")[0], // convertir a string
                  hora: nuevaConsulta.hora.toTimeString().slice(0, 5),
                },
              }
            : item
        );
        setData(updatedData);

        toast.current.show({
          severity: "success",
          summary: "Éxito",
          detail: "Consulta médica actualizada exitosamente.",
          life: 3000,
        });
      } catch (error) {
        console.error("Error al actualizar consulta médica:", error);
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "No se pudo actualizar la consulta médica.",
          life: 3000,
        });
      }
      setIsEditing(false);
      setModalVisible(false);
      return;
    } else {
      try {
        const formattedFecha = nuevaConsulta.fecha.toISOString().split("T")[0];
        const formattedHora = nuevaConsulta.hora.toTimeString().slice(0, 5);

        const response = await api.post("CentroMedico/Consultas", {
          fecha: formattedFecha,
          hora: formattedHora,
          motivo: nuevaConsulta.motivo,
          diagnostico: nuevaConsulta.diagnostico || "",
          tratamiento: nuevaConsulta.tratamiento || "",
          idMedico: idMedico,
          cedula: nuevaConsulta.cedula,
          idCentroMedico: idCentroMedico,
        });

        const nueva = {
          key: `${data.length}`,
          data: {
            idConsultaMedica: response.data.idConsultaMedica,
            fecha: response.data.fecha,
            cedulaPaciente: response.data.paciente.cedula,
            direccionPaciente: response.data.paciente.direccion,
            telefonoPaciente: response.data.paciente.telefono,
            nombrePaciente: response.data.paciente.nombre,
            centroMedico: response.data.centroMedico.nombre,
            empleado: response.data.empleado,
            hora: response.data.hora,
            motivo: response.data.motivo,
            diagnostico: response.data.diagnostico,
            tratamiento: response.data.tratamiento,
          },
        };
        setData([nueva, ...data]);

        toast.current.show({
          severity: "success",
          summary: "Éxito",
          detail: "Consulta médica registrada exitosamente.",
          life: 3000,
        });

        setNuevaConsulta({
          fecha: new Date(),
          hora: new Date(),
          motivo: "",
          diagnostico: "",
          tratamiento: "",
          cedula: "",
        });
        setModalVisible(false);
      } catch (error) {
        // Obtener el mensaje de error de la respuesta
        const errorMessage =
          error.response?.data?.mensaje ||
          error.message ||
          "No se pudo registrar la consulta médica";
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: errorMessage,
          life: 3000,
        });
      }
    }
  };
  const handleEdit = (rowData) => {
    setConsultaSeleccionada(rowData.data);
    setIsEditing(true);
    setModalVisible(true);
    setNuevaConsulta({
      fecha: new Date(rowData.data.fecha),
      hora: new Date(`1970-01-01T${rowData.data.hora}`),
      motivo: rowData.data.motivo,
      diagnostico: rowData.data.diagnostico,
      tratamiento: rowData.data.tratamiento,
      cedula: rowData.data.cedulaPaciente,
    });
  };
  const handleDelete = (rowData) => {
    confirmDialog({
      message: `¿Estás seguro de que deseas eliminar esta consulta médica?`,
      header: "Confirmar Eliminación",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Sí, eliminar",
      rejectLabel: "Cancelar",
      accept: async () => {
        const formattedFecha = new Date(rowData.data.fecha)
          .toISOString()
          .split("T")[0];
        const formattedHora = new Date(`1970-01-01T${rowData.data.hora}`)
          .toTimeString()
          .slice(0, 5);

        try {
          await api.delete(
            `/CentroMedico/Consultas/${rowData.data.idConsultaMedica}`,
            {
              data: {
                idConsultaMedica: rowData.data.idConsultaMedica,
                fecha: formattedFecha,
                hora: formattedHora,
                motivo: rowData.data.motivo,
                diagnostico: rowData.data.diagnostico || "",
                tratamiento: rowData.data.tratamiento || "",
                idMedico: idMedico,
                cedula: rowData.data.cedulaPaciente,
                idCentroMedico: idCentroMedico,
              },
            }
          );
          const updateData = data.filter(
            (item) =>
              item.data.idConsultaMedica !== rowData.data.idConsultaMedica
          );
          setData(updateData);
          toast.current.show({
            severity: "success",
            summary: "Consulta médica eliminada",
            detail: "La consulta médica ha sido eliminada exitosamente.",
            life: 3000,
          });
        } catch (error) {
          console.error("Error al eliminar", error);
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail: "No se pudo eliminar la consulta médica.",
            life: 3000,
          });
        }
      },
    });
  };
  const handleCancel = () => {
    setModalVisible(false);
    setIsEditing(false);
    setNuevaConsulta({
      fecha: new Date(),
      hora: new Date(),
      motivo: "",
      diagnostico: "",
      tratamiento: "",
      cedula: "",
    });
  };
  const handleVerDetalles = (rowData) => {
    setConsultaSeleccionada(rowData.data);
    setDetalleVisible(true);
  };
  // Cerrar modal de detalles
  const handleCerrarDetalles = () => {
    setDetalleVisible(false);
    setConsultaSeleccionada(null);
  };
  return (
    <section className="py-14 px-8">
      <Toast ref={toast} />
      <ConfirmDialog />
      <div className="flex flex-row justify-between">
        <h1 className="text-3xl font-bold">Consultas Médicas</h1>
        <Boton
          text={"Registrar Consulta Médica"}
          icon={IconoCrear}
          onClick={() => setModalVisible(true)}
        />
      </div>

      <div className="flex justify-content-end my-8"></div>
      <div className="card">
        <IconField iconPosition="left">
          <InputIcon className="pi pi-search" />
          <InputText
            type="search"
            onInput={(e) => setGlobalFilter(e.target.value)}
            placeholder="Cedula o Nombre paciente"
          />
        </IconField>
        <DataTable
          value={data}
          rows={5}
          paginator={true}
          tableStyle={{ minWidth: "50rem" }}
          globalFilter={globalFilter}
          rowsPerPageOptions={[5, 10, 20]}
          currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} registros"
          paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
          emptyMessage="No se encontraron consultas médicas."
        >
          <Column
            field="data.fecha"
            header={
              <span className="flex items-center gap-2">
                <IconoNombreHospital className="text-lg" />
                Fecha
              </span>
            }
            sortable
          />
          <Column
            field="data.cedulaPaciente"
            header={
              <span className="flex items-center gap-2">
                <IconoCiudad className="text-lg" />
                Cédula Paciente
              </span>
            }
            sortable
          />
          <Column
            field="data.nombrePaciente"
            header={
              <span className="flex items-center gap-2">
                <IconoCiudad className="text-lg" />
                Nombre Paciente
              </span>
            }
            sortable
          />
          <Column
            field="data.direccionPaciente"
            header={
              <span className="flex items-center gap-2">
                <IconoDireccion className="text-lg" />
                Dirección Paciente
              </span>
            }
            sortable
          />
          <Column
            field="data.telefonoPaciente"
            header={
              <span className="flex items-center gap-2">
                <IconoDireccion className="text-lg" />
                Teléfono Paciente
              </span>
            }
            sortable
          />
          <Column
            body={(rowData) => (
              <div className="flex gap-2">
                {accionesTemplate({
                  rowData,
                  onEdit: handleEdit,
                  onDelete: handleDelete,
                })}
                <Button
                  icon="pi pi-eye"
                  className="p-button-rounded p-button-info p-button-text p-button-sm "
                  onClick={() => handleVerDetalles(rowData)}
                  tooltip="Ver detalles"
                  tooltipOptions={{ position: "top" }}
                />
              </div>
            )}
            header=""
            style={{ width: "10rem" }}
          />
        </DataTable>
      </div>

      <ModalFormulario
        visible={modalVisible}
        onHide={handleCancel}
        titulo={
          isEditing ? "Editar Consulta Médica" : "Registrar Consulta Médica"
        }
        footer={
          <div className="flex justify-end gap-2">
            <Boton
              text="Cancelar"
              onClick={handleCancel}
              className="bg-red-600 hover:bg-red-700"
            />
            <Boton
              text={isEditing ? "Actualizar" : "Guardar"}
              onClick={handleGuardarConsultaMedica}
            />
          </div>
        }
      >
        <div className="grid gap-4 mt-4">
          <div className="p-field">
            <label htmlFor="fecha" className="block font-semibold">
              Fecha *
            </label>
            <Calendar
              id="fecha"
              value={nuevaConsulta.fecha}
              minDate={new Date(new Date().setDate(new Date().getDate() - 1))}
              maxDate={new Date()}
              onChange={(e) =>
                setNuevaConsulta({ ...nuevaConsulta, fecha: e.value })
              }
              dateFormat="yy-mm-dd"
              showIcon
              required
              className="w-full"
            />
          </div>
          <div className="p-field">
            <label htmlFor="hora" className="block font-semibold">
              Hora *
            </label>
            <Calendar
              id="hora"
              value={nuevaConsulta.hora}
              onChange={(e) =>
                setNuevaConsulta({ ...nuevaConsulta, hora: e.value })
              }
              timeOnly
              hourFormat="24"
              maxDate={new Date()}
              showIcon
              required
              className="w-full"
              icon="pi pi-clock"
            />
          </div>
          <div className="p-field">
            <label htmlFor="motivo" className="block font-semibold">
              Motivo *
            </label>
            <InputText
              id="motivo"
              value={nuevaConsulta.motivo}
              onChange={(e) =>
                setNuevaConsulta({ ...nuevaConsulta, motivo: e.target.value })
              }
              required
              className="w-full"
            />
          </div>
          <div className="p-field">
            <label htmlFor="diagnostico" className="block font-semibold">
              Diagnóstico
            </label>
            <InputText
              id="diagnostico"
              value={nuevaConsulta.diagnostico}
              onChange={(e) =>
                setNuevaConsulta({
                  ...nuevaConsulta,
                  diagnostico: e.target.value,
                })
              }
              className="w-full"
            />
          </div>
          <div className="p-field">
            <label htmlFor="tratamiento" className="block font-semibold">
              Tratamiento
            </label>
            <InputText
              id="tratamiento"
              value={nuevaConsulta.tratamiento}
              onChange={(e) =>
                setNuevaConsulta({
                  ...nuevaConsulta,
                  tratamiento: e.target.value,
                })
              }
              className="w-full"
            />
          </div>
          <div className="p-field">
            <label htmlFor="cedula" className="block font-semibold">
              Cédula Paciente *
            </label>
            <InputText
              id="cedula"
              value={nuevaConsulta.cedula}
              onChange={(e) =>
                setNuevaConsulta({ ...nuevaConsulta, cedula: e.target.value })
              }
              required
              className="w-full"
            />
          </div>
        </div>
      </ModalFormulario>

      {/* Modal de detalles */}
      <Dialog
        header="Detalles de la Consulta Médica"
        visible={detalleVisible}
        style={{ width: "700px" }}
        onHide={handleCerrarDetalles}
      >
        {consultaSeleccionada && (
          <div className="grid gap-6 mt-4">
            {/* Sección de información básica */}
            <div className="border-b pb-4">
              <h3 className="text-2xl font-bold mb-4 text-text-blue">
                Información General
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Fecha y Hora</p>
                  <p className="font-medium">
                    {consultaSeleccionada.fecha}{" "}
                    {consultaSeleccionada.hora &&
                      `- ${consultaSeleccionada.hora}`}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Centro Médico</p>
                  <p className="font-medium">
                    {consultaSeleccionada?.centroMedico || "No especificado"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Paciente</p>
                  <p className="font-medium">
                    {consultaSeleccionada.nombrePaciente || "No especificado"}
                  </p>
                </div>
              </div>
            </div>

            {/* Sección médica */}
            <div className="border-b pb-4">
              <h3 className="text-2xl font-bold mb-3 text-text-blue">
                Datos Médicos
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Médico</p>
                  <p className="font-medium">
                    {consultaSeleccionada.empleado?.nombre || "No especificado"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Especialidad</p>
                  <p className="font-medium">
                    {consultaSeleccionada.empleado?.especialidad
                      ?.especialidad_ || "No especificado"}
                  </p>
                </div>
              </div>
            </div>

            {/* Sección de motivo y diagnóstico */}
            <div className="border-b pb-4">
              <div className="mb-4">
                <p className="text-sm text-gray-500">Motivo de la Consulta</p>
                <p className="font-medium whitespace-pre-line">
                  {consultaSeleccionada.motivo || "No especificado"}
                </p>
              </div>
              <div className="mb-4">
                <p className="text-sm text-gray-500">Diagnóstico</p>
                <p className="font-medium whitespace-pre-line">
                  {consultaSeleccionada.diagnostico || "No especificado"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Tratamiento</p>
                <p className="font-medium whitespace-pre-line">
                  {consultaSeleccionada.tratamiento || "No especificado"}
                </p>
              </div>
            </div>

            {/* Sección de datos del paciente */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Datos del Paciente</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Cédula</p>
                  <p className="font-medium">
                    {consultaSeleccionada.cedulaPaciente}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Teléfono</p>
                  <p className="font-medium">
                    {consultaSeleccionada.telefonoPaciente}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Dirección</p>
                  <p className="font-medium">
                    {consultaSeleccionada.direccionPaciente}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Dialog>
    </section>
  );
}

export default ConsultasMedicas;
