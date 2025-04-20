import React from "react";
import { Dialog } from "primereact/dialog";

const ModalFormulario = ({ visible, onHide, titulo, children, footer }) => {
  return (
    <Dialog
      header={titulo}
      visible={visible}
      style={{ width: "40vw" }}
      onHide={onHide}
      modal
      className="p-fluid"
    >
      {children}
      {footer && <div className="pt-4">{footer}</div>}
    </Dialog>
  );
};

export default ModalFormulario;
