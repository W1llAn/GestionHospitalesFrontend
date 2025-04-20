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
      //columns: columnas,
      responsive: true,
      destroy: true,
      columns: [
        ...columnas,
        {
          title: "",
          data: null,
          orderable: false,
          render: () => `
            <div class="flex space-x-2">
              <button class="edit-btn text-blue-500 hover:text-blue-700">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z"></path>
                </svg>
              </button>
              <button class="delete-btn text-red-500 hover:text-red-700">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4m-4 0a1 1 0 00-1 1v1h6V3a1 1 0 00-1-1h-4z"></path>
                </svg>
              </button>
            </div>
          `,
          className: "text-center",
        },
      ],
      opciones, // Usa el spread operator para las opciones
    });

    return () => tabla.destroy();
  }, [datos, columnas, opciones]);

  return (
    <div className="overflow-x-auto">
      <table
        ref={tablaRef}
        className="min-w-full bg-white border border-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columnas.map((col) => (
              <th
                key={col.title}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {col.title}
              </th>
            ))}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200"></tbody>
      </table>
    </div>
  );
};

export default TablaDatos;
