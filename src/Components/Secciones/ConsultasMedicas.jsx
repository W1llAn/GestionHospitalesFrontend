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

function ConsultasMedicas() {
  const [modalVisible, setModalVisible] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [data, setData] = useState([]);
  const [detalleVisible, setDetalleVisible] = useState(false);
  const [consultaSeleccionada, setConsultaSeleccionada] = useState(null);
  const toast = useRef(null);

  // Cargar consultas médicas desde el microservicio
  useEffect(() => {
    const fetchConsultasMedicas = async () => {
      try {
        const response = await api.get("CentroMedico/Consultas");
        console.log("Consultas médicas:", response.data.consultas);
        console.log(
          "Consultas médicas:",
          response.data.consultas[0].centroMedico.nombre
        );

        const consultas = response.data.consultas.map((consulta, index) => ({
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
        setData(consultas);
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
    fetchConsultasMedicas();
  }, []);
  const handleGuardarConsultaMedica = () => {};
  const handleEdit = (rowData) => {};
  const handleDelete = (rowData) => {};
  const handleCancel = () => {};
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
      <div className="flex flex-row justify-between">
        <h1 className="text-3xl font-bold">Consultas Médicas</h1>
        <Boton
          text={"Registrar Consulta Médica"}
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
            placeholder="Nombre del Centro Médico"
          />
        </IconField>
      </div>
      <div className="card">
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
        titulo={isEditing ? "Editar Centro Médico" : "Registrar Centro Médico"}
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
        <div className="grid gap-8 mt-8">
          <span className="p-float-label">
            <InputText
              id="nombreCentro"
              name="nombreCentro"
              value={""}
              onChange={""}
            />
            <label htmlFor="nombreCentro">Nombre</label>
          </span>
          <span className="p-float-label">
            <Dropdown
              id="ciudadCentro"
              name="ciudadCentro"
              value={""}
              options={""}
              onChange={""}
              placeholder="Selecciona una ciudad"
            />
            <label htmlFor="ciudadCentro">Ciudad</label>
          </span>
          <span className="p-float-label">
            <InputText
              id="direccionCentro"
              name="direccionCentro"
              value={""}
              onChange={""}
            />
            <label htmlFor="direccionCentro">Dirección</label>
          </span>
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
