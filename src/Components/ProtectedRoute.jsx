import React from "react";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {
  const token = localStorage.getItem("jwtToken");

  // Si hay token, renderizar las rutas hijas (Outlet); si no, redirigir a /login
  return token ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace state={{ from: window.location.pathname }} />
  );
}

export default ProtectedRoute;
