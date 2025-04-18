import React, { useEffect, useRef, useState } from "react";
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
import ModalFormulario from "../ModalFormulario";
import axios from "axios";
import { Toast } from "primereact/toast";
function CentrosMedicos() {
  const toast = useRef(null);
  const [globalFilter, setGlobalFilter] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [nuevoCentro, setNuevoCentro] = useState({
    nombre: "",
    ciudad: "",
    direccion: "",
  });
  const [data, setData] = useState([]);

  // Token de autenticación (reemplaza con el token real obtenido del backend)
  const TOKEN =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwidW5pcXVlX25hbWUiOiJyb290IiwiVGlwb0VtcGxlYWRvIjoiQWRtaW5pc3RyYWRvciIsIkNlbnRyb01lZGljbyI6IkNlbnRyYWwiLCJhdWQiOiJ1c2VyIiwiaXNzIjoiTWljcm9zZXJ2aWNpby1BdXRlbnRpY2FjaW9uIiwiZXhwIjoxNzQ1MDIwNTQyLCJpYXQiOjE3NDUwMTg3NDIsIm5iZiI6MTc0NTAxODc0Mn0.PFQPp9XHhLiCAJOIWT7x9G1HZ0swI3d2mpe0okyaF_M";

  // Configuración de axios con el token
  const api = axios.create({
    baseURL: "https://localhost:7256/api/Centro_Medico",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  });

  // Cargar centros médicos al montar el componente
  useEffect(() => {
    const fetchCentrosMedicos = async () => {
      try {
        const response = await api.get("");
        // Transformar los datos de la API al formato esperado por TreeTable
        const centros = response.data.map((centro, index) => ({
          key: `${index}`,
          data: {
            id: centro.id,
            nombre: centro.nombre,
            ciudad: centro.ciudad,
            direccion: centro.direccion,
          },
        }));
        setData(centros);
      } catch (error) {
        console.log(error);

        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "No se pudieron cargar los centros médicos.",
          life: 3000,
        });
      }
    };
    fetchCentrosMedicos();
  }, []);

  const handleGuardarCentro = async () => {
    if (!nuevoCentro.nombre || !nuevoCentro.ciudad) {
      toast.current.show({
        severity: "warn",
        summary: "Campos incompletos",
        detail: "Por favor llena al menos nombre y ciudad.",
        life: 3000,
      });
      return;
    }
    try {
      const response = await api.post("", {
        nombre: nuevoCentro.nombre,
        ciudad: nuevoCentro.ciudad,
        direccion: nuevoCentro.direccion,
      });
      const nuevo = {
        key: `${data.length}`,
        data: {
          id: response.data.id,
          nombre: response.data.nombre,
          ciudad: response.data.ciudad,
          direccion: response.data.direccion,
        },
      };
      setData([...data, nuevo]);
      toast.current.show({
        severity: "success",
        summary: "Centro registrado",
        detail: "El centro médico ha sido guardado exitosamente.",
        life: 3000,
      });
      setNuevoCentro({
        nombre: "",
        ciudad: "",
        direccion: "",
      });
      setModalVisible(false);
    } catch (error) {
      console.log(error);

      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo registrar el centro médico.",
        life: 3000,
      });
    }
  };

  return (
    <section className="py-14 px-8">
      <Toast ref={toast} />
      <div className="flex flex-row justify-between">
        <h1 className="text-3xl font-bold">Centros Médicos</h1>
        <Boton
          text={"Registrar Centro Médico"}
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

      {/* Modal Reutilizable */}
      <ModalFormulario
        visible={modalVisible}
        onHide={() => setModalVisible(false)}
        titulo="Registrar Centro Médico"
        footer={
          <div className="flex justify-end gap-2">
            <Boton
              text="Cancelar"
              onClick={() => setModalVisible(false)}
              className="bg-red-600 hover:bg-red-700"
            />
            <Boton text="Guardar" onClick={handleGuardarCentro} />
          </div>
        }
      >
        <div className="grid gap-8 mt-8">
          <span className="p-float-label">
            <InputText
              id="nombre"
              value={nuevoCentro.nombre}
              onChange={(e) =>
                setNuevoCentro({ ...nuevoCentro, nombre: e.target.value })
              }
            />
            <label htmlFor="nombre">Nombre</label>
          </span>
          <span className="p-float-label">
            <InputText
              id="ciudad"
              value={nuevoCentro.ciudad}
              onChange={(e) =>
                setNuevoCentro({ ...nuevoCentro, ciudad: e.target.value })
              }
            />
            <label htmlFor="ciudad">Ciudad</label>
          </span>
          <span className="p-float-label">
            <InputText
              id="direccion"
              value={nuevoCentro.direccion}
              onChange={(e) =>
                setNuevoCentro({ ...nuevoCentro, direccion: e.target.value })
              }
            />
            <label htmlFor="direccion">Dirección</label>
          </span>
        </div>
      </ModalFormulario>
    </section>
  );
}

export default CentrosMedicos;
