import React, { useState } from "react";
import Boton from "../Boton";
import { IconoCrear } from "../../assets/IconosComponentes";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { TreeTable } from "primereact/treetable";
import { Column } from "primereact/column";
import accionesTemplate from "../AccionesTemplate";
function CentrosMedicos() {
  const [globalFilter, setGlobalFilter] = useState("");
  console.log(globalFilter);
  const [data, setData] = useState([
    {
      key: "0",
      data: {
        nombre: "Centro Salud Norte",
        ciudad: "Córdoba",
        direccion: "Av. Siempreviva 123",
        cantidadEmpleados: 25,
      },
      children: [],
    },
    {
      key: "1",
      data: {
        nombre: "Hospital Central",
        ciudad: "Mendoza",
        direccion: "Calle Falsa 456",
        cantidadEmpleados: 40,
      },
      children: [],
    },
  ]);

  return (
    <section className="py-16 px-8">
      <div className="flex flex-row justify-between">
        <h1 className="text-3xl font-bold">Centros Médicos</h1>
        <Boton text={"Registrar Centro Médico"} icon={IconoCrear} />
      </div>
      <div className="my-8">
        <div className="flex justify-content-end">
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
            tableStyle={{ minWidth: "50rem" }}
            globalFilter={globalFilter}
          >
            <Column field="nombre" header="Nombre"></Column>
            <Column field="ciudad" header="Ciudad"></Column>
            <Column field="direccion" header="Direccion"></Column>
            <Column
              field="cantidadEmpleados"
              header="Cantidad Empleados"
            ></Column>
            <Column
              body={accionesTemplate}
              header="Acciones"
              style={{ width: "10rem" }}
            />
          </TreeTable>
        </div>
      </div>
    </section>
  );
}

export default CentrosMedicos;
