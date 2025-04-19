import PropTypes from "prop-types";
import { Button } from "primereact/button"; // Usamos íconos con p-button

const accionesTemplate = ({ rowData, onEdit, onDelete }) => {
  return (
    <div className="flex gap-2">
      <Button
        icon="pi pi-pencil"
        className="p-button-rounded p-button-text p-button-sm"
        onClick={() => onEdit(rowData)}
        tooltip="Editar"
      />
      <Button
        icon="pi pi-trash"
        className="p-button-rounded p-button-danger p-button-text p-button-sm"
        onClick={() => onDelete(rowData)}
        tooltip="Eliminar"
      />
    </div>
  );
};
accionesTemplate.propTypes = {
  rowData: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};
export default accionesTemplate;
