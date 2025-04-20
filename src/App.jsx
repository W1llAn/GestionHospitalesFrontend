import Login from "./Components/Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PrimeReactProvider } from "primereact/api";
import PanelAdministracion from "./Components/PanelAdministracion";
import ProtectedRoute from "./Components/ProtectedRoute";
function App() {
  return (
    <>
      <PrimeReactProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />}></Route>
            <Route element={<ProtectedRoute />}>
              <Route
                path="/administracion"
                element={<PanelAdministracion />}
              ></Route>
            </Route>

            <Route path="/" element={<Login />}></Route>
          </Routes>
        </BrowserRouter>
      </PrimeReactProvider>
    </>
  );
}

export default App;
