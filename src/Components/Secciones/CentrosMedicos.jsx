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
import api from "../../api/config";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Dropdown } from "primereact/dropdown";
function CentrosMedicos() {
  const toast = useRef(null);
  const [globalFilter, setGlobalFilter] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [centroSeleccionado, setCentroSeleccionado] = useState(null);
  const [nuevoCentro, setNuevoCentro] = useState({
    nombre: "",
    ciudad: "",
    direccion: "",
  });
  const ciudadOptions = [
    { label: "Cuenca", value: "Cuenca" },
    { label: "Guayaquil", value: "Guayaquil" },
  ];
  const [data, setData] = useState([]);

  // Cargar centros médicos al montar el componente
  useEffect(() => {
    const fetchCentrosMedicos = async () => {
      try {
        const response = await api.get("/Administracion/CentrosMedicos");

        const centros = response.data.centros
          .sort((a, b) => b.id - a.id) // Ordenar por id descendente
          .map((centro, index) => ({
            key: `${index}`,
            data: {
              id: centro.id,
              nombre: centro.nombre,
              ciudad: centro.ciudad,
              direccion: centro.direccion,
            },
            children: [],
          }));
        setData(centros);
      } catch (error) {
        console.error("Error al cargar centros médicos", error);

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
  // Manejar la apertura del modal para edición
  const handleEdit = (rowData) => {
    setIsEditing(true);
    setCentroSeleccionado(rowData);
    setNuevoCentro({
      nombre: rowData.data.nombre,
      ciudad: rowData.data.ciudad,
      direccion: rowData.data.direccion,
    });
    setModalVisible(true);
  };
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
      if (isEditing) {
        // Editar centro médico
        const response = await api.put(
          `/Administracion/CentrosMedicos/${centroSeleccionado.data.id}`,
          {
            id: centroSeleccionado.data.id,
            nombre: nuevoCentro.nombre,
            ciudad: nuevoCentro.ciudad,
            direccion: nuevoCentro.direccion,
          }
        );

        // Actualizar la lista de centros
        const updatedData = data.map((item) =>
          item.data.id === centroSeleccionado.data.id
            ? {
                ...item,
                data: {
                  id: centroSeleccionado.data.id,
                  nombre: nuevoCentro.nombre,
                  ciudad: nuevoCentro.ciudad,
                  direccion: nuevoCentro.direccion,
                },
              }
            : item
        );
        setData(updatedData);

        toast.current.show({
          severity: "success",
          summary: "Centro actualizado",
          detail: "El centro médico ha sido actualizado exitosamente.",
          life: 3000,
        });
      } else {
        const response = await api.post("/Administracion/CentrosMedicos", {
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
        setData([nuevo, ...data]);

        toast.current.show({
          severity: "success",
          summary: "Centro registrado",
          detail: "El centro médico ha sido guardado exitosamente.",
          life: 3000,
        });
      }
      setNuevoCentro({
        nombre: "",
        ciudad: "",
        direccion: "",
      });
      setIsEditing(false);
      setCentroSeleccionado(null);
      setModalVisible(false);
    } catch (error) {
      console.log(error);

      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: isEditing
          ? "No se pudo actualizar el centro médico."
          : "No se pudo registrar el centro médico.",
        life: 3000,
      });
    }
  };

  const handleDelete = (rowData) => {
    confirmDialog({
      message: `¿Estás seguro de que deseas eliminar el centro médico "${rowData.data.nombre}"?`,
      header: "Confirmar Eliminación",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Sí, eliminar",
      rejectLabel: "Cancelar",
      accept: async () => {
        try {
          await api.delete(`/Administracion/CentrosMedicos/${rowData.data.id}`);
          const updateData = data.filter(
            (item) => item.data.id !== rowData.data.id
          );
          setData(updateData);
          toast.current.show({
            severity: "success",
            summary: "Centro eliminado",
            detail: "El centro médico ha sido eliminado exitosamente.",
            life: 3000,
          });
        } catch (error) {
          console.error("Error al eliminar", error);
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail: "No se pudo eliminar el centro médico.",
            life: 3000,
          });
        }
      },
    });
  };

  const handleCancel = () => {
    setNuevoCentro({
      nombre: "",
      ciudad: "",
      direccion: "",
    });
    setIsEditing(false);
    setCentroSeleccionado(null);
    setModalVisible(false);
  };

  return (
    <section className="py-14 px-8">
      <Toast ref={toast} />
      <ConfirmDialog />
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
              onClick={handleGuardarCentro}
            />
          </div>
        }
      >
        <div className="grid gap-8 mt-8">
          <span className="p-float-label">
            <InputText
              id="nombreCentro"
              name="nombreCentro"
              value={nuevoCentro.nombre}
              onChange={(e) =>
                setNuevoCentro({ ...nuevoCentro, nombre: e.target.value })
              }
            />
            <label htmlFor="nombreCentro">Nombre</label>
          </span>
          <span className="p-float-label">
            <Dropdown
              id="ciudadCentro"
              name="ciudadCentro"
              value={nuevoCentro.ciudad}
              options={ciudadOptions}
              onChange={(e) =>
                setNuevoCentro({ ...nuevoCentro, ciudad: e.value })
              }
              placeholder="Selecciona una ciudad"
            />
            <label htmlFor="ciudadCentro">Ciudad</label>
          </span>
          <span className="p-float-label">
            <InputText
              id="direccionCentro"
              name="direccionCentro"
              value={nuevoCentro.direccion}
              onChange={(e) =>
                setNuevoCentro({ ...nuevoCentro, direccion: e.target.value })
              }
            />
            <label htmlFor="direccionCentro">Dirección</label>
          </span>
        </div>
      </ModalFormulario>
    </section>
  );
}

export default CentrosMedicos;
