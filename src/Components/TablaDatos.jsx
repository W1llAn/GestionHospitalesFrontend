import { useEffect, useRef } from "react";
import jQuery from "jquery";
const $ = jQuery;
import "datatables.net";
import "datatables.net-dt/css/dataTables.dataTables.min.css";

const TablaDatos = ({ columnas, datos, opciones = {} }) => {
  const tablaRef = useRef(null);

  useEffect(() => {
    // Inicializar DataTable
    const tabla = $(tablaRef.current).DataTable({
      data: datos,
      columns: columnas,
      responsive: true,
      destroy: true,
      opciones, // Usa el spread operator para las opciones
    });

    return () => tabla.destroy();
  }, [datos, columnas, opciones]);

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table ref={tablaRef} className="min-w-full divide-y divide-gray-200">
        {/* Cabeceras opcionales */}
        <thead>
          <tr>
            {columnas.map((col) => (
              <th key={col.title}>{col.title}</th>
            ))}
          </tr>
        </thead>
      </table>
    </div>
  );
};

export default TablaDatos;
