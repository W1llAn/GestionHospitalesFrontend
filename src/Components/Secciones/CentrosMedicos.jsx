import React, { useState } from "react";
import Boton from "../Boton";
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
function CentrosMedicos() {
  const [globalFilter, setGlobalFilter] = useState("");
  const [data, setData] = useState([
    {
      key: "0",
      data: {
        nombre: "Centro Salud Norte",
        ciudad: "Guayaquil",
        direccion: "Av. Siempreviva 123",
        cantidadEmpleados: 25,
      },
      children: [],
    },
    {
      key: "1",
      data: {
        nombre: "Hospital Central",
        ciudad: "Cuenca",
        direccion: "Calle Falsa 456",
        cantidadEmpleados: 40,
      },
      children: [],
    },
    {
      key: "2",
      data: {
        nombre: "Clínica del Sur",
        ciudad: "Quito",
        direccion: "Av. del Parque 789",
        cantidadEmpleados: 30,
      },
      children: [],
    },
    {
      key: "3",
      data: {
        nombre: "Centro Médico Andes",
        ciudad: "Loja",
        direccion: "Calle Larga 101",
        cantidadEmpleados: 15,
      },
      children: [],
    },
    {
      key: "4",
      data: {
        nombre: "Hospital del Valle",
        ciudad: "Ambato",
        direccion: "Av. de las Palmeras 55",
        cantidadEmpleados: 20,
      },
      children: [],
    },
    {
      key: "5",
      data: {
        nombre: "Centro Integral Salud",
        ciudad: "Riobamba",
        direccion: "Calle Saludable 222",
        cantidadEmpleados: 10,
      },
      children: [],
    },
  ]);

  return (
    <section className="py-14 px-8">
      <div className="flex flex-row justify-between">
        <h1 className="text-3xl font-bold">Centros Médicos</h1>
        <Boton text={"Registrar Centro Médico"} icon={IconoCrear} />
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
            field="nombre"
            header={
              <span className="flex items-center gap-2">
                <IconoNombreHospital className="text-lg" />
                Nombre
              </span>
            }
          ></Column>
          <Column
            field="ciudad"
            header={
              <span className="flex items-center gap-2">
                <IconoCiudad className="text-lg" />
                Ciudad
              </span>
            }
          ></Column>
          <Column
            field="direccion"
            header={
              <span className="flex items-center gap-2">
                <IconoDireccion className="text-lg" />
                Dirección
              </span>
            }
          ></Column>
          <Column
            field="cantidadEmpleados"
            header={
              <span className="flex items-center gap-2">
                <IconoEmpleadosTabla className="text-lg" />
                Cantidad Empleados
              </span>
            }
          ></Column>
          <Column
            body={accionesTemplate}
            header=""
            style={{ width: "10rem" }}
          />
        </TreeTable>
      </div>
    </section>
  );
}

export default CentrosMedicos;
