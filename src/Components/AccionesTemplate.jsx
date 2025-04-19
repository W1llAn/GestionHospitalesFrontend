import PropTypes from "prop-types";
import { Button } from "primereact/button"; // Usamos íconos con p-button

const accionesTemplate = ({ rowData, onClick }) => {
  return (
    <div className="flex gap-2">
      <Button
        icon="pi pi-pencil"
        className="p-button-rounded p-button-text p-button-sm"
        onClick={() => onClick(rowData)}
        tooltip="Editar"
      />
      <Button
        icon="pi pi-trash"
        className="p-button-rounded p-button-danger p-button-text p-button-sm"
        onClick={() => console.log("Eliminar")}
        tooltip="Eliminar"
      />
    </div>
  );
};
accionesTemplate.propTypes = {
  rowData: PropTypes.object.isRequired,
  onClick: PropTypes.func,
};
export default accionesTemplate;
