import React, { useState } from "react";
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
import { TreeTable } from "primereact/treetable";
import accionesTemplate from "../AccionesTemplate";
import { Column } from "primereact/column";

function ConsultasMedicas() {
  const [modalVisible, setModalVisible] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [data, setData] = useState([]);

  const handleEdit = (rowData) => {};
  const handleDelete = (rowData) => {};
  return (
    <section className="py-14 px-8">
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
        <TreeTable
          value={data}
          rows={5}
          paginator={true}
          tableStyle={{ minWidth: "50rem" }}
          globalFilter={globalFilter}
          rowsPerPageOptions={[5, 10, 20]} // Opciones para cambiar cantidad
          currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} registros"
          paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
        >
          <Column
            field="fecha"
            header={
              <span className="flex items-center gap-2">
                <IconoNombreHospital className="text-lg" />
                Fecha
              </span>
            }
          ></Column>
          <Column
            field="cedulaPaciente"
            header={
              <span className="flex items-center gap-2">
                <IconoCiudad className="text-lg" />
                Cedula Paciente
              </span>
            }
          ></Column>
          <Column
            field="direccionPaciente"
            header={
              <span className="flex items-center gap-2">
                <IconoDireccion className="text-lg" />
                Paciente
              </span>
            }
          ></Column>
          <Column
            field="telefonoPaciente"
            header={
              <span className="flex items-center gap-2">
                <IconoDireccion className="text-lg" />
                Teléfono Paciente
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
    </section>
  );
}

export default ConsultasMedicas;
