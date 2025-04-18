import { Button } from "primereact/button"; // Usamos íconos con p-button

const accionesTemplate = (node) => {
  return (
    <div className="flex gap-2">
      <Button
        icon="pi pi-pencil"
        className="p-button-rounded p-button-text p-button-sm"
        onClick={() => console.log("Editar", node)}
        tooltip="Editar"
      />
      <Button
        icon="pi pi-trash"
        className="p-button-rounded p-button-danger p-button-text p-button-sm"
        onClick={() => console.log("Eliminar", node)}
        tooltip="Eliminar"
      />
    </div>
  );
};

export default accionesTemplate;
