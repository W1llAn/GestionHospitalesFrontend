import PanelAdministracion from "./Components/PanelAdministracion";

import { PrimeReactProvider } from "primereact/api";
function App() {
  return (
    <>
      <PrimeReactProvider>
        <PanelAdministracion />
      </PrimeReactProvider>
    </>
  );
}

export default App;
