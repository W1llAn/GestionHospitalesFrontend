import React from "react";
import Boton from "../Boton";
import { IconoCrear } from "../../assets/IconosComponentes";
function CentrosMedicos() {
  return (
    <section className="py-16 px-8">
      <div className="flex flex-row justify-between">
        <h1 className="text-3xl font-bold">Centros Médicos</h1>
        <Boton text={"Registrar Centro Médico"} icon={IconoCrear} />
      </div>
    </section>
  );
}

export default CentrosMedicos;
